import hashlib
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


REQUIRED_RUNTIME_MARKERS = (
    "snowy-admin-prototype-v2",
    "prototypeMeta",
    "annotation-toolbar",
    "annotation-tool-button",
    "snowy-annotation-state",
    "baseAnnotationGroups",
    "pageRequirements",
    "saveAsAnnotatedHtml",
    "node-comment-popover",
    "requirementDrawerOpen",
    "annotationEditorOpen",
    "app-shell",
    "snowy-sider",
    "snowy-header",
    "tabs-row",
    "query-card",
    "table-card",
    "preset-grid",
    "组件预设",
    "a-form",
    "a-table",
    "a-drawer",
    "a-modal",
    "a-upload",
    "a-upload-dragger",
    "localStorage",
)

FORBIDDEN_SIMPLIFIED_MARKERS = (
    "snowy-prototype-kit-v1",
    "snowy-prototype-schema",
    "createSnowyComponents",
    "createSnowyAnnotationComponent",
    "pageSpecs",
    "active.query",
    "active.details",
    "visibleFields.value.map",
)

REQUIRED_REACHABLE_COMPONENTS = (
    "snowy-annotation-toolbar",
    "snowy-shell",
    "snowy-banner-query-form",
    "snowy-banner-data-table",
    "snowy-node-comment-composer",
    "snowy-requirement-drawer",
    "snowy-annotation-editor-modal",
)

PROTECTED_COMPONENT_EXCEPTIONS = {"registry.js"}

FORBIDDEN_RENDERER_PATTERNS = (
    (re.compile(r"\b(?:queryFields|tableFields|detailFields|formFields)\.slice\s*\("), "field slicing is forbidden"),
    (
        re.compile(r"\bactiveBusinessPage\b[\s\S]{0,12000}\bbusinessColumns\b|\bbusinessColumns\b[\s\S]{0,12000}\bactiveBusinessPage\b"),
        "parallel universal business page renderer is forbidden",
    ),
)


def sha256_bytes(value: bytes) -> str:
    return hashlib.sha256(value).hexdigest()


def parse_args(raw_args: list[str]):
    template_mode = False
    must_contain = []
    paths = []
    index = 0
    while index < len(raw_args):
        value = raw_args[index]
        if value == "--template":
            template_mode = True
            index += 1
        elif value == "--must-contain":
            if index + 1 >= len(raw_args):
                raise ValueError("--must-contain requires a comma-separated value")
            must_contain.extend(item.strip() for item in raw_args[index + 1].split(",") if item.strip())
            index += 2
        else:
            paths.append(value)
            index += 1
    if len(paths) != 1:
        raise ValueError(
            "Usage: validate_admin_prototype.py [--template] "
            "[--must-contain 字段1,字段2] <prototype-directory/index.html>"
        )
    return Path(paths[0]), template_mode, must_contain


def runtime_entries(manifest: dict) -> list[dict]:
    entries = [{"file": manifest.get("entry", "index.html"), "sha256": manifest.get("entrySha256")}]
    if manifest.get("contract"):
        entries.append({"file": manifest["contract"], "sha256": manifest.get("contractSha256")})
    entries.extend(manifest.get("styles", []))
    entries.extend(manifest.get("app", []))
    entries.extend(
        {**component, "file": f"components/{component['file']}"}
        for component in manifest.get("components", [])
    )
    return entries


def validate_page_contract(root: Path, manifest: dict) -> list[str]:
    errors = []
    relative_path = manifest.get("contract", "prototype-contract.json")
    contract_path = root / relative_path
    if not contract_path.exists():
        return ["prototype-contract.json is missing"]
    try:
        contract = json.loads(contract_path.read_text(encoding="utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        return [f"prototype-contract.json is invalid: {error}"]
    if contract.get("version") != "snowy-prototype-page-contract-v1":
        errors.append("prototype page contract version is invalid")
    pages = contract.get("pages")
    if not isinstance(pages, list) or not pages:
        return [*errors, "prototype page contract has no pages"]
    page_ids = [str(page.get("id", "")).strip() for page in pages]
    if any(not page_id for page_id in page_ids) or len(page_ids) != len(set(page_ids)):
        errors.append("prototype page contract page ids must be non-empty and unique")
    for page in pages:
        page_id = page.get("id", "<unknown>")
        if not page.get("rootSelector"):
            errors.append(f"prototype page contract rootSelector is missing: {page_id}")
        if len(pages) > 1 and not page.get("activateSelector"):
            errors.append(f"prototype page contract activateSelector is required for multi-page output: {page_id}")
        for section_name in ("query", "table"):
            section = page.get(section_name)
            if not isinstance(section, dict) or not section.get("rootSelector"):
                errors.append(f"prototype page contract {section_name} is incomplete: {page_id}")
        query_fields = page.get("query", {}).get("fields", [])
        query_labels = [field.get("label") for field in query_fields if isinstance(field, dict)]
        if len(query_labels) != len(query_fields) or any(not label for label in query_labels):
            errors.append(f"prototype page contract query fields are invalid: {page_id}")
        if len(query_labels) != len(set(query_labels)):
            errors.append(f"prototype page contract query fields contain duplicates: {page_id}")
        table_fields = page.get("table", {}).get("fields", [])
        if not table_fields or len(table_fields) != len(set(table_fields)):
            errors.append(f"prototype page contract table fields are empty or duplicated: {page_id}")
        annotation_ids = []
        for annotation in page.get("annotations", []):
            annotation_ids.append(annotation.get("id"))
            if not annotation.get("id") or not annotation.get("targetSelector") or not annotation.get("markerSelector"):
                errors.append(f"prototype annotation binding is incomplete: {page_id}")
        if len(annotation_ids) != len(set(annotation_ids)):
            errors.append(f"prototype annotation ids contain duplicates: {page_id}")
        layout = page.get("layout", {})
        for key in ("queryPadding", "tablePadding", "cardBorderRadius", "queryTableGap"):
            if key not in layout:
                errors.append(f"prototype page layout contract is missing {key}: {page_id}")
    return errors


def canonical_manifest() -> tuple[Path, dict]:
    root = Path(__file__).resolve().parent.parent / "assets" / "prototype-demo-framework"
    manifest = json.loads((root / "component-manifest.json").read_text(encoding="utf-8"))
    return root, manifest


def validate_canonical_hashes(root: Path, manifest: dict) -> list[str]:
    errors = []
    canonical_root, canonical = canonical_manifest()
    protected = [*canonical.get("styles", [])]
    protected.extend(
        {**item, "file": f"components/{item['file']}"}
        for item in canonical.get("components", [])
        if item["file"] not in PROTECTED_COMPONENT_EXCEPTIONS
    )
    for item in protected:
        relative_path = item["file"]
        target = root / relative_path
        canonical_file = canonical_root / relative_path
        if not target.exists():
            errors.append(f"protected canonical Demo component is missing: {relative_path}")
            continue
        if sha256_bytes(target.read_bytes()) != sha256_bytes(canonical_file.read_bytes()):
            errors.append(f"canonical Demo hash mismatch: {relative_path}")
    return errors


def component_reachability(root: Path, manifest: dict) -> set[str]:
    registry = root / "components" / "registry.js"
    if not registry.exists():
        return set()
    registry_text = registry.read_text(encoding="utf-8")
    tag_to_name = dict(re.findall(
        r"app\.component\(\s*['\"]([^'\"]+)['\"]\s*,\s*components\.([A-Za-z0-9_]+)\s*\)",
        registry_text,
    ))
    name_to_source = {}
    for item in manifest.get("components", []):
        if item.get("name") == "registry":
            continue
        path = root / "components" / item["file"]
        if path.exists():
            name_to_source[item["name"]] = path.read_text(encoding="utf-8")

    main_path = root / "app" / "main.js"
    if not main_path.exists():
        return set()
    tag_pattern = re.compile(r"<\s*(snowy-[a-z0-9-]+)\b", re.IGNORECASE)
    queue = list(dict.fromkeys(tag_pattern.findall(main_path.read_text(encoding="utf-8"))))
    reachable = set()
    while queue:
        tag = queue.pop(0).lower()
        if tag in reachable:
            continue
        reachable.add(tag)
        component_name = tag_to_name.get(tag)
        source = name_to_source.get(component_name, "")
        for child in tag_pattern.findall(source):
            if child.lower() not in reachable:
                queue.append(child.lower())
    return reachable


def validate_component_contract(root: Path, entry_path: Path, template_mode: bool):
    errors = []
    manifest_path = root / "component-manifest.json"
    if not manifest_path.exists():
        return ["component-manifest.json is missing"], ""
    try:
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as error:
        return [f"component-manifest.json is invalid: {error}"], ""
    if manifest.get("version") != "snowy-runtime-components-v1":
        errors.append("runtime component manifest version is invalid")
    errors.extend(validate_page_contract(root, manifest))
    errors.extend(validate_canonical_hashes(root, manifest))

    combined = []
    entry_text = ""
    for item in runtime_entries(manifest):
        relative_path = item["file"]
        path = root / relative_path
        if not path.exists():
            errors.append(f"runtime component file is missing: {relative_path}")
            continue
        raw = path.read_bytes()
        if item.get("sha256") and sha256_bytes(raw) != item["sha256"]:
            errors.append(f"runtime component hash mismatch: {relative_path}")
        try:
            text = raw.decode("utf-8")
        except UnicodeDecodeError as error:
            errors.append(f"runtime component is not UTF-8: {relative_path}: {error}")
            continue
        combined.append(text)
        if path.resolve() == entry_path.resolve():
            entry_text = text

    for style in manifest.get("styles", []):
        if entry_text.find(style["file"]) < 0:
            errors.append(f"entry does not reference runtime component: {style['file']}")
    app_files = [item["file"] for item in manifest.get("app", [])]
    component_files = [f"components/{item['file']}" for item in manifest.get("components", [])]
    referenced_files = app_files[:1] + component_files + app_files[1:]
    previous_index = -1
    for relative_path in referenced_files:
        reference_index = entry_text.find(relative_path)
        if reference_index < 0:
            errors.append(f"entry does not reference runtime component: {relative_path}")
        elif reference_index <= previous_index:
            errors.append(f"runtime component load order is invalid: {relative_path}")
        else:
            previous_index = reference_index

    if len(entry_text.encode("utf-8")) >= 8_000 or re.search(r"<style[\s>]", entry_text, re.IGNORECASE):
        errors.append("entry contains an inline implementation instead of component references")
    if re.search(r'type=["\']module["\']', entry_text, re.IGNORECASE) or re.search(r"\bfetch\s*\(", entry_text):
        errors.append("entry is not compatible with direct file opening")

    reachable = component_reachability(root, manifest)
    for component in REQUIRED_REACHABLE_COMPONENTS:
        if component not in reachable:
            errors.append(f"required component is not reachable from app/main.js: {component}")

    if template_mode:
        golden_path = root / manifest.get("goldenFile", "")
        if not golden_path.exists():
            errors.append("original golden Demo is missing")
        elif sha256_bytes(golden_path.read_bytes()) != manifest.get("goldenSha256"):
            errors.append("original golden Demo hash mismatch")
    return errors, "\n".join(combined)


def main() -> int:
    try:
        path, template_mode, must_contain = parse_args(sys.argv[1:])
    except ValueError as error:
        print(f"FAIL {error}")
        return 2
    if not path.exists():
        print(f"FAIL file not found: {path}")
        return 2
    try:
        path.read_text(encoding="utf-8")
    except UnicodeDecodeError as error:
        print(f"FAIL file is not UTF-8: {error}")
        return 1

    root = path.parent
    errors, combined = validate_component_contract(root, path, template_mode)
    for marker in REQUIRED_RUNTIME_MARKERS:
        if marker not in combined:
            errors.append(f"missing runtime Demo marker: {marker}")
    for marker in FORBIDDEN_SIMPLIFIED_MARKERS:
        if marker in combined:
            errors.append(f"simplified/custom renderer is forbidden: {marker}")
    for pattern, message in FORBIDDEN_RENDERER_PATTERNS:
        if pattern.search(combined):
            errors.append(message)
    for required in must_contain:
        if required not in combined:
            errors.append(f"missing required demand field/text: {required}")

    if not template_mode:
        if "需求到原型页面蓝图" not in combined and "蓝图条目" not in combined:
            errors.append("generated prototype has no blueprint trace")
        if "原型需求覆盖矩阵" not in combined and "覆盖矩阵" not in combined:
            errors.append("generated prototype has no coverage matrix")
        if re.search(r'<input\s+[^>]*type=["\']file["\']', combined, flags=re.IGNORECASE):
            errors.append("raw file input is forbidden; reuse the preset a-upload components")

    if errors:
        for error in dict.fromkeys(errors):
            print(f"FAIL {error}")
        return 1
    mode = "template" if template_mode else "prototype"
    print(f"PASS Snowy runtime component contract ({mode})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
