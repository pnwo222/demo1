#!/usr/bin/env python3
from pathlib import Path
import hashlib
import json
import sys

REQUIRED_FILES = [
    "index.html",
    "prototype-data.js",
    "prototype-contract.json",
    "app/main.js",
    "components/mobile-shell.js",
    "shared/annotation-core.js",
    "shared/annotation-theme.css",
    "styles/app.css",
]
ANNOTATION_TOKENS = [
    "localStorage",
    "h5-prototype-page-change",
    "data-annotation-key",
    "Escape",
    "preventDefault",
    "stopImmediatePropagation",
    "hiddenAutoIds",
    "__H5_ANNOTATION_STATE__",
    "annotation-cursor-mode",
    "annotation-toolbar",
    "node-comment-popover",
    "annotation-detail-modal",
    "requirement-drawer",
    "annotation-edit-action",
]
LEGACY_ANNOTATION_TOKENS = [
    "h5-annotation-toolbar",
    "h5-annotation-outline",
    "h5-annotation-pin",
    "h5-comment-composer",
    "h5-annotation-dialog",
]


def main() -> int:
    if len(sys.argv) != 2:
        print("用法: validate_h5_prototype.py <原型目录>")
        return 2
    root = Path(sys.argv[1])
    errors = []
    for name in REQUIRED_FILES:
        if not (root / name).is_file():
            errors.append(f"缺少文件：{name}")
    if errors:
        return report(errors)

    index = (root / "index.html").read_text(encoding="utf-8")
    runtime_path = root / "shared/annotation-core.js"
    theme_path = root / "shared/annotation-theme.css"
    runtime = runtime_path.read_text(encoding="utf-8")
    theme = theme_path.read_text(encoding="utf-8")
    contract = json.loads((root / "prototype-contract.json").read_text(encoding="utf-8"))
    all_text = "\n".join(path.read_text(encoding="utf-8") for path in root.rglob("*") if path.is_file() and path.suffix in {".html", ".js", ".css"})

    if "<meta name=\"viewport\"" not in index:
        errors.append("index.html 缺少移动端 viewport")
    if "shared/annotation-core.js" not in index:
        errors.append("index.html 未引入共享标注核心")
    if "shared/annotation-theme.css" not in index:
        errors.append("index.html 未引入统一标注主题")
    for token in ANNOTATION_TOKENS:
        if token not in runtime and token not in theme and token != "data-annotation-key":
            errors.append(f"标注运行时缺少能力标记：{token}")
    for token in LEGACY_ANNOTATION_TOKENS:
        if token in all_text:
            errors.append(f"发现旧的 H5 平行标注实现：{token}")
    canonical_root = Path(__file__).resolve().parent.parent / "assets" / "h5-prototype-framework" / "shared"
    for name in ("annotation-core.js", "annotation-theme.css"):
        canonical = canonical_root / name
        candidate = root / "shared" / name
        if canonical.resolve() != candidate.resolve() and file_hash(canonical) != file_hash(candidate):
            errors.append(f"共享标注文件被修改：shared/{name}")
    if "data-annotation-key" not in all_text:
        errors.append("页面未提供稳定标注节点")
    pages = contract.get("pages", [])
    if not pages:
        errors.append("prototype-contract.json 未声明页面")
    for page in pages:
        page_id = page.get("id")
        if not page_id or not page.get("referenceFiles"):
            errors.append(f"页面 {page_id or '<unknown>'} 缺少参考源码")
        if not page.get("requiredKeys"):
            errors.append(f"页面 {page_id or '<unknown>'} 缺少 requiredKeys")
        for key in page.get("requiredKeys", []):
            if f'data-annotation-key="{key}"' not in all_text:
                errors.append(f"页面 {page_id} 契约节点不存在：{key}")
    return report(errors)


def file_hash(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def report(errors) -> int:
    if errors:
        print("H5 原型静态校验失败:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("H5 原型静态校验通过")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
