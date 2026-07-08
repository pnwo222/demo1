import re
import sys
from pathlib import Path


REQUIRED_MARKERS = [
    "prototypeMeta",
    "ant-design-vue",
    "Vue",
    ".snowy-sider",
    ".snowy-header",
    ".tabs-row",
    "query-card",
    "toolbar",
    "a-table",
    "a-drawer",
    "a-modal",
]

FORBIDDEN_VISIBLE_HINTS = [
    "s-table",
    "xn-",
    "hasPerm",
    "toolConfig",
    "缓存刷新",
    "触发",
    "接口/mock",
    "开发实现",
    "prototype-demo-framework",
    "流程说明",
]

GENERIC_FORM_HINTS = [
    "标题/名称",
    "状态",
    "排序",
    "备注",
]


def main() -> int:
    args = [arg for arg in sys.argv[1:] if arg != "--template"]
    template_mode = "--template" in sys.argv[1:]

    if len(args) != 1:
        print("Usage: validate_admin_prototype.py [--template] <admin-prototype.html>")
        return 2

    path = Path(args[0])
    if not path.exists():
        print(f"FAIL file not found: {path}")
        return 2

    text = path.read_text(encoding="utf-8")
    failed = False

    for marker in REQUIRED_MARKERS:
        if marker not in text:
            print(f"FAIL missing marker: {marker}")
            failed = True

    for hint in FORBIDDEN_VISIBLE_HINTS:
        if hint in text:
            print(f"WARN forbidden/developer-facing hint found: {hint}")

    if not template_mode and "需求到原型页面蓝图" not in text and "蓝图条目" not in text:
        print("WARN no explicit blueprint or blueprint trace found")

    if not template_mode and "原型需求覆盖矩阵" not in text and "覆盖矩阵" not in text:
        print("FAIL missing coverage matrix")
        failed = True

    generic_count = sum(1 for hint in GENERIC_FORM_HINTS if hint in text)
    if generic_count >= 3:
        print("WARN generic form hints found; verify pages do not share a universal drawer")

    if re.search(r"currentConfig|configs\s*=", text):
        print("WARN generic config pattern found; verify each page has requirement-specific fields")

    if "已上传" in text or "未上传" in text:
        print("WARN upload/image field may be represented by text instead of thumbnail")

    if failed:
        return 1

    mode = "template" if template_mode else "prototype"
    print(f"PASS basic Snowy admin {mode} checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
