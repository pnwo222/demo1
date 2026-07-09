import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


REQUIRED_SECTION_HINTS = [
    "原始需求摘录",
    "同步字段",
    "展示字段",
    "筛选字段",
    "状态字段",
    "敏感字段",
]

VAGUE_PATTERNS = [
    r"等状态",
    r"等信息",
    r"相关状态",
    r"相关信息",
    r"多条件筛选",
    r"基础信息",
    r"卡状态",
]


def section_blocks(markdown: str) -> list[str]:
    parts = re.split(r"\n(?=#{2,6}\s+)", markdown)
    return [part.strip() for part in parts if part.strip()]


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate_requirement_detail.py <requirement.md>")
        return 2

    path = Path(sys.argv[1])
    if not path.exists():
        print(f"FAIL file not found: {path}")
        return 2

    text = path.read_text(encoding="utf-8")
    failed = False

    for hint in REQUIRED_SECTION_HINTS:
        if hint not in text:
            print(f"FAIL missing required atomic requirement section/text: {hint}")
            failed = True

    for pattern in VAGUE_PATTERNS:
        for match in re.finditer(pattern, text):
            start = max(0, match.start() - 80)
            end = min(len(text), match.end() + 80)
            context = text[start:end].replace("\n", " ")
            print(f"WARN vague summary phrase found: {match.group(0)} | {context}")

    for block in section_blocks(text):
        if re.search(r"学生管理|教职工管理|历史学生管理|用户管理|内容管理|记录管理|设备.*管理", block):
            title = block.splitlines()[0].strip("# ").strip()
            if "原始需求摘录" not in block:
                print(f"WARN feature block lacks 原始需求摘录: {title}")
            if re.search(r"支持按照|按照.+筛选|主要包括|包括", block) and not re.search(r"筛选字段|展示字段|同步字段", block):
                print(f"FAIL explicit field-list wording not converted to atomic fields: {title}")
                failed = True

    if failed:
        return 1

    print("PASS requirement detail checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
