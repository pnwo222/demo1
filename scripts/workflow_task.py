#!/usr/bin/env python3
"""Manage per-task workflow records and Integration Owner summaries."""

from __future__ import annotations

import argparse
import datetime as dt
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TASK_ROOT = ROOT / "docs" / "workflow" / "tasks"
REQUIREMENT_ROOT = ROOT / "docs" / "workflow" / "requirements"
STATUS_PATH = ROOT / "docs" / "workflow" / "status.md"
SUMMARY_START = "<!-- TASK_SUMMARY_START -->"
SUMMARY_END = "<!-- TASK_SUMMARY_END -->"
FIELD_PATTERN = re.compile(r"^\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|\s*$")
VALID_STATUSES = {
    "todo",
    "claimed",
    "in_progress",
    "blocked",
    "ready_for_integration",
    "in_review",
    "done",
    "integrated",
}


def now_text() -> str:
    timezone = dt.timezone(dt.timedelta(hours=8))
    return dt.datetime.now(timezone).strftime("%Y-%m-%d %H:%M +08:00")


def task_path(requirement_id: str, task_id: str) -> Path:
    return TASK_ROOT / requirement_id / f"{task_id}.md"


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8", newline="\n")


def parse_fields(content: str) -> dict[str, str]:
    fields: dict[str, str] = {}
    for line in content.splitlines():
        match = FIELD_PATTERN.match(line)
        if not match:
            continue
        key, value = (part.strip() for part in match.groups())
        if key not in {"项", "---"}:
            fields[key] = value
    return fields


def replace_field(content: str, field: str, value: str) -> str:
    pattern = re.compile(
        rf"^(\|\s*{re.escape(field)}\s*\|\s*)(.*?)(\s*\|\s*)$",
        re.MULTILINE,
    )
    updated, count = pattern.subn(rf"\g<1>{value}\g<3>", content, count=1)
    if count != 1:
        raise ValueError(f"状态文件缺少字段：{field}")
    return updated


def load_task(requirement_id: str, task_id: str) -> tuple[Path, str, dict[str, str]]:
    path = task_path(requirement_id, task_id)
    if not path.is_file():
        raise FileNotFoundError(f"任务文件不存在：{path.relative_to(ROOT)}")
    content = read_text(path)
    fields = parse_fields(content)
    if fields.get("需求ID") != requirement_id or fields.get("任务ID") != task_id:
        raise ValueError("任务文件中的需求ID或任务ID与路径不一致")
    return path, content, fields


def find_requirement_file(requirement_id: str) -> Path:
    candidates: list[Path] = []
    for path in REQUIREMENT_ROOT.glob("*.md"):
        if path.name == "TEMPLATE.md":
            continue
        fields = parse_fields(read_text(path))
        if fields.get("需求ID") == requirement_id:
            candidates.append(path)
    if len(candidates) != 1:
        raise ValueError(
            f"需求ID {requirement_id} 应匹配一个需求状态文件，实际匹配 {len(candidates)} 个"
        )
    return candidates[0]


def task_rows(requirement_id: str) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    directory = TASK_ROOT / requirement_id
    if not directory.is_dir():
        return rows
    for path in sorted(directory.glob("*.md")):
        if path.name == "TEMPLATE.md":
            continue
        fields = parse_fields(read_text(path))
        if fields.get("需求ID") == requirement_id:
            fields["_path"] = path.relative_to(ROOT).as_posix()
            rows.append(fields)
    return rows


def render_summary(requirement_id: str, rows: list[dict[str, str]]) -> str:
    lines = [
        SUMMARY_START,
        "## 开发任务汇总",
        "",
        "本区块由 Integration Owner 通过 `scripts/workflow_task.py` 自动维护，其他开发者不得手工修改。",
        "",
        "| 任务ID | 任务标题 | 负责人 | 状态 | 任务分支 | 依赖 | 最新提交 | 状态文件 |",
        "| --- | --- | --- | --- | --- | --- | --- | --- |",
    ]
    for row in rows:
        values = [
            row.get("任务ID", "-"),
            row.get("任务标题", "-"),
            row.get("负责人", "-"),
            row.get("状态", "-"),
            row.get("任务分支", "-"),
            row.get("依赖任务", "-"),
            row.get("最新提交", "-"),
            f"`{row.get('_path', '-')}`",
        ]
        lines.append("| " + " | ".join(value.replace("|", "\\|") for value in values) + " |")
    if not rows:
        lines.append("| - | - | - | - | - | - | - | - |")
    lines.extend([SUMMARY_END, ""])
    return "\n".join(lines)


def update_requirement_summary(requirement_id: str) -> tuple[Path, list[dict[str, str]]]:
    requirement_path = find_requirement_file(requirement_id)
    content = read_text(requirement_path)
    rows = task_rows(requirement_id)
    summary = render_summary(requirement_id, rows)
    if SUMMARY_START in content and SUMMARY_END in content:
        pattern = re.compile(
            rf"{re.escape(SUMMARY_START)}.*?{re.escape(SUMMARY_END)}\n?",
            re.DOTALL,
        )
        content = pattern.sub(summary, content, count=1)
    else:
        marker = "## 阶段变更记录"
        if marker in content:
            content = content.replace(marker, f"{summary}\n{marker}", 1)
        else:
            content = content.rstrip() + "\n\n" + summary
    write_text(requirement_path, content)
    return requirement_path, rows


def update_global_index(requirement_id: str, requirement_path: Path, rows: list[dict[str, str]]) -> None:
    content = read_text(STATUS_PATH)
    all_integrated = bool(rows) and all(row.get("状态") == "integrated" for row in rows)
    phase = "需求集成分支验证" if all_integrated else "代码开发"
    status = "需确认" if all_integrated else "已开始"
    lines = content.splitlines()
    changed = False
    for index, line in enumerate(lines):
        if not line.startswith("|"):
            continue
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        if cells and cells[0] == requirement_id and len(cells) >= 6:
            cells[3] = f"`{requirement_path.relative_to(ROOT).as_posix()}`"
            cells[4] = phase
            cells[5] = status
            lines[index] = "| " + " | ".join(cells) + " |"
            changed = True
            break
    if not changed:
        raise ValueError(f"docs/workflow/status.md 的需求索引中未找到 {requirement_id}")
    write_text(STATUS_PATH, "\n".join(lines) + "\n")


def command_claim(args: argparse.Namespace) -> None:
    path = task_path(args.requirement, args.task)
    if path.exists():
        raise FileExistsError(f"任务已存在，禁止重复领取：{path.relative_to(ROOT)}")
    content = f"""# 开发任务状态：{args.title}

本文件由任务负责人维护。共享汇总状态和产物导航仅由 Integration Owner 更新。

## 元信息

| 项 | 内容 |
| --- | --- |
| 需求ID | {args.requirement} |
| 任务ID | {args.task} |
| 任务标题 | {args.title} |
| 负责人 | {args.owner} |
| 状态 | claimed |
| 需求集成分支 | {args.integration_branch} |
| 任务分支 | {args.task_branch} |
| 依赖任务 | {args.dependencies} |
| 允许修改范围 | {args.files_allowed} |
| 风险等级 | {args.risk} |
| 最新提交 | - |
| 本地检查 | - |
| 产物 | - |
| 缓存更新 | 无需更新 |
| 更新时间 | {now_text()} |

## 实施记录

```text
范围:
关键实现:
接口/数据库变更:
兼容性:
```

## 验证记录

```text
检查命令:
检查结果:
未执行项:
残余风险:
```

## Review 记录

```text
Review 状态:
Reviewer:
问题:
结论:
```
"""
    write_text(path, content)
    print(f"已领取任务：{path.relative_to(ROOT)}")
    print("请立即提交并推送任务登记；推送失败时先同步并确认任务未被他人领取。")


def command_set_status(args: argparse.Namespace) -> None:
    if args.status not in VALID_STATUSES:
        raise ValueError(f"无效状态：{args.status}")
    path, content, _ = load_task(args.requirement, args.task)
    content = replace_field(content, "状态", args.status)
    if args.commit:
        content = replace_field(content, "最新提交", args.commit)
    if args.checks:
        content = replace_field(content, "本地检查", args.checks)
    content = replace_field(content, "更新时间", now_text())
    write_text(path, content)
    print(f"已更新任务状态：{args.task} -> {args.status}")


def command_integrate(args: argparse.Namespace) -> None:
    path, content, fields = load_task(args.requirement, args.task)
    if fields.get("状态") not in {"ready_for_integration", "in_review", "integrated"}:
        raise ValueError(
            "任务状态必须为 ready_for_integration 或 in_review，才能登记为 integrated"
        )
    content = replace_field(content, "状态", "integrated")
    content = replace_field(content, "最新提交", args.commit)
    content = replace_field(content, "更新时间", now_text())
    write_text(path, content)
    requirement_path, rows = update_requirement_summary(args.requirement)
    update_global_index(args.requirement, requirement_path, rows)
    print(f"已登记集成：{args.task} @ {args.commit}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="管理需求开发任务与 Owner 汇总状态")
    subparsers = parser.add_subparsers(dest="command", required=True)

    claim = subparsers.add_parser("claim", help="领取一个尚不存在的任务")
    claim.add_argument("--requirement", required=True)
    claim.add_argument("--task", required=True)
    claim.add_argument("--title", required=True)
    claim.add_argument("--owner", required=True)
    claim.add_argument("--integration-branch", required=True)
    claim.add_argument("--task-branch", required=True)
    claim.add_argument("--dependencies", default="-")
    claim.add_argument("--files-allowed", required=True)
    claim.add_argument("--risk", default="P2", choices=["P0", "P1", "P2"])
    claim.set_defaults(func=command_claim)

    status = subparsers.add_parser("set-status", help="由任务负责人更新自己的任务状态")
    status.add_argument("--requirement", required=True)
    status.add_argument("--task", required=True)
    status.add_argument("--status", required=True)
    status.add_argument("--commit")
    status.add_argument("--checks")
    status.set_defaults(func=command_set_status)

    integrate = subparsers.add_parser("integrate", help="由 Integration Owner 登记合并结果")
    integrate.add_argument("--requirement", required=True)
    integrate.add_argument("--task", required=True)
    integrate.add_argument("--commit", required=True)
    integrate.set_defaults(func=command_integrate)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    try:
        args.func(args)
    except (FileExistsError, FileNotFoundError, ValueError) as error:
        print(f"失败：{error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
