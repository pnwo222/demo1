import argparse
import re
import sys
from pathlib import Path


REQUIRED_MARKERS = [
    "原始需求摘录",
    "原子需求清单",
    "同步字段",
    "展示字段",
    "筛选字段",
    "详情字段",
    "状态字段",
    "敏感字段",
    "字段明细",
    "操作和点击交互",
    "权限差异",
    "覆盖矩阵",
]

VAGUE_PHRASES = [
    "等状态",
    "多条件筛选",
    "相关字段",
    "已列出",
    "字段按需求拆分",
    "与学生管理一致",
    "与上一页一致",
    "通用表单",
    "通用字段",
    "万能",
    "业务主字段",
    "标题/名称",
]

SOURCE_MARKERS = [
    "需求明确",
    "框架惯例",
    "待确认",
    "不适用",
]

RISKY_ACTIONS = [
    "新增",
    "编辑",
    "删除",
    "批量删除",
    "导入",
    "导出",
    "审核",
    "授权",
]


def count_occurrences(text: str, marker: str) -> int:
    return len(re.findall(re.escape(marker), text))


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")

    parser = argparse.ArgumentParser(
        description="Validate Snowy admin prototype page blueprint markdown."
    )
    parser.add_argument("blueprint", help="Path to admin page blueprint markdown")
    parser.add_argument(
        "--must-contain",
        default="",
        help="Comma-separated requirement terms that must appear in the blueprint",
    )
    args = parser.parse_args()

    path = Path(args.blueprint)
    if not path.exists():
        print(f"FAIL file not found: {path}")
        return 2

    text = path.read_text(encoding="utf-8")
    failed = False

    for marker in REQUIRED_MARKERS:
        if marker not in text:
            print(f"FAIL missing required blueprint marker: {marker}")
            failed = True

    for term in [item.strip() for item in args.must_contain.split(",") if item.strip()]:
        if term not in text:
            print(f"FAIL missing required requirement term: {term}")
            failed = True

    for phrase in VAGUE_PHRASES:
        if phrase in text:
            print(f"WARN vague or generic phrase found: {phrase}")

    for line in text.splitlines():
        if "|" not in line or "禁止" in line or "不得" in line:
            continue
        if re.search(r"\b[A-Z]{2,5}-[A-Z]-?\d{3}\s*[~～]\s*\d{3}\b", line):
            print("FAIL coverage matrix uses a requirement id range; split into page-level rows")
            failed = True
            break
        if re.search(r"\b[A-Z]{2,5}-[A-Z]-?\d{3}\s*[~～]\s*[A-Z]{2,5}-[A-Z]-?\d{3}\b", line):
            print("FAIL coverage matrix uses a requirement id range; split into page-level rows")
            failed = True
            break

    page_heading_count = len(re.findall(r"^###\s+\S+", text, flags=re.MULTILINE))
    excerpt_count = count_occurrences(text, "原始需求摘录")
    atomic_count = count_occurrences(text, "原子需求清单")
    if page_heading_count > 0 and excerpt_count < page_heading_count:
        print("FAIL some page sections do not contain 原始需求摘录")
        failed = True
    if page_heading_count > 0 and atomic_count < page_heading_count:
        print("FAIL some page sections do not contain 原子需求清单")
        failed = True

    source_hits = sum(count_occurrences(text, marker) for marker in SOURCE_MARKERS)
    if source_hits < max(6, page_heading_count * 3):
        print("FAIL too few source markers; fields/actions must be tagged 需求明确/框架惯例/待确认/不适用")
        failed = True

    if "只读查询" in text:
        for action in RISKY_ACTIONS:
            if action in text and f"{action} | 需求明确" not in text and f"{action}|需求明确" not in text and f"{action} | 待确认" not in text and f"{action}|待确认" not in text:
                print(f"WARN read-only blueprint contains risky action without clear source tag: {action}")

    if "已覆盖" in text and "蓝图条目" not in text:
        print("FAIL coverage claims exist but no 蓝图条目 trace column found")
        failed = True

    if failed:
        return 1

    print("PASS Snowy admin blueprint checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
