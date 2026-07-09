import argparse
import re
import sys
from pathlib import Path


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


REQUIRED_GLOBAL_SECTIONS = [
    "## 来源",
    "## 解析范围",
    "## 不纳入本次软件开发范围",
    "## 可参考素材",
    "## 需求分组",
    "## 严格原子需求明细",
]

REQUIRED_FEATURE_MARKERS = [
    "原始需求摘录",
    "原子需求清单",
    "来源",
    "章节层级",
    "父级功能/菜单",
    "菜单推断",
    "同步字段",
    "展示字段",
    "筛选字段",
    "状态字段",
    "敏感字段",
    "操作能力",
    "接口/对接",
    "验收标准",
    "风险/待确认",
]

FAIL_VAGUE_PATTERNS = [
    r"各状态筛选",
    r"等状态",
    r"等信息",
    r"相关状态",
    r"相关信息",
    r"多条件筛选",
    r"列表查看",
]

WARN_VAGUE_PATTERNS = [
    r"基础信息",
    r"卡状态",
]

FEATURE_ID_RE = re.compile(r"\b(?:H5|ADM-S|ADM-P|API|PAM)-\d{3}\b")


def split_atomic_feature_blocks(text: str) -> dict[str, str]:
    marker = "## 严格原子需求明细"
    if marker not in text:
        return {}
    atomic_text = text.split(marker, 1)[1]
    next_top = re.search(r"\n## (?!#)", atomic_text)
    if next_top:
        atomic_text = atomic_text[: next_top.start()]

    parts = re.split(r"\n(?=###\s+)", atomic_text)
    blocks: dict[str, str] = {}
    for part in parts:
        part = part.strip()
        if not part.startswith("###"):
            continue
        first_line = part.splitlines()[0]
        match = FEATURE_ID_RE.search(first_line)
        if match:
            blocks[match.group(0)] = part
    return blocks


def feature_ids_from_summary_tables(text: str) -> list[str]:
    ids = []
    for match in FEATURE_ID_RE.finditer(text):
        feature_id = match.group(0)
        if feature_id not in ids:
            ids.append(feature_id)
    return ids


def print_context(prefix: str, pattern: str, text: str) -> None:
    for match in re.finditer(pattern, text):
        start = max(0, match.start() - 80)
        end = min(len(text), match.end() + 80)
        context = text[start:end].replace("\n", " ")
        print(f"{prefix}: {match.group(0)} | {context}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate tender requirement markdown detail quality.")
    parser.add_argument("requirement", help="Path to docs/requirements/*.md")
    parser.add_argument(
        "--must-contain",
        default="",
        help="Comma-separated requirement terms that must appear in the markdown",
    )
    args = parser.parse_args()

    path = Path(args.requirement)
    if not path.exists():
        print(f"FAIL file not found: {path}")
        return 2

    text = path.read_text(encoding="utf-8")
    failed = False

    for section in REQUIRED_GLOBAL_SECTIONS:
        if section not in text:
            print(f"FAIL missing required section: {section}")
            failed = True

    for term in [item.strip() for item in args.must_contain.split(",") if item.strip()]:
        if term not in text:
            print(f"FAIL missing required requirement term: {term}")
            failed = True

    for pattern in FAIL_VAGUE_PATTERNS:
        if re.search(pattern, text):
            print_context("FAIL vague summary phrase found", pattern, text)
            failed = True

    for pattern in WARN_VAGUE_PATTERNS:
        if re.search(pattern, text):
            print_context("WARN vague phrase needs review", pattern, text)

    feature_ids = feature_ids_from_summary_tables(text)
    atomic_blocks = split_atomic_feature_blocks(text)

    if feature_ids and not atomic_blocks:
        print("FAIL feature ids exist but no per-feature atomic detail blocks were found under ## 严格原子需求明细")
        failed = True

    missing_blocks = [feature_id for feature_id in feature_ids if feature_id not in atomic_blocks]
    if missing_blocks:
        sample = "、".join(missing_blocks[:20])
        suffix = " ..." if len(missing_blocks) > 20 else ""
        print(f"FAIL feature ids missing atomic detail blocks: {sample}{suffix}")
        failed = True

    for feature_id, block in atomic_blocks.items():
        for marker in REQUIRED_FEATURE_MARKERS:
            if marker not in block:
                print(f"FAIL {feature_id} missing marker in atomic detail block: {marker}")
                failed = True

        if re.search(r"包括|主要包括|按照|支持按照|展示|同步", block):
            if not re.search(r"\|\s*(同步字段|展示字段|筛选字段|详情字段|状态字段|敏感字段)\s*\|", block):
                print(f"FAIL {feature_id} has field-list wording but no atomic field rows")
                failed = True

        if "只读" in block or "同步" in block:
            for action in ["新增", "编辑", "删除", "导入", "导出", "审核", "授权"]:
                if action in block and f"{action} | 需求明确" not in block and f"{action}|需求明确" not in block and f"{action} | 待确认" not in block and f"{action}|待确认" not in block and f"{action} | 不适用" not in block and f"{action}|不适用" not in block:
                    print(f"WARN {feature_id} synchronized/read-only block contains action without source tag: {action}")

    if "docs/tenders/assets/" not in text:
        print("FAIL missing extracted reference asset paths")
        failed = True

    if "H5 框架待补充" not in text and re.search(r"H5|移动端|APP 端|手机端", text):
        print("WARN mobile/H5 content exists but H5 framework status is not recorded")

    if failed:
        return 1

    print("PASS requirement detail checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
