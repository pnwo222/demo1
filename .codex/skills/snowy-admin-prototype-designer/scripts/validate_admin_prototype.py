import hashlib
import json
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")


KIT_VERSION = "snowy-prototype-kit-v1"
SECTIONS = {
    "coreCss": ("SNOWY_ADMIN_CORE_CSS_START", "SNOWY_ADMIN_CORE_CSS_END", "snowy-core.css"),
    "annotationCss": ("SNOWY_ANNOTATION_CSS_START", "SNOWY_ANNOTATION_CSS_END", "annotation.css"),
    "components": ("SNOWY_COMPONENTS_SOURCE_START", "SNOWY_COMPONENTS_SOURCE_END", "snowy-components.js"),
    "annotation": ("SNOWY_ANNOTATION_COMPONENT_START", "SNOWY_ANNOTATION_COMPONENT_END", "annotation-runtime.js"),
    "app": ("SNOWY_DEMO_APP_START", "SNOWY_DEMO_APP_END", "demo-app.js"),
}
SCHEMA_SECTIONS = (
    "queryFields", "columns", "detailFields", "createFields", "editFields",
    "toolbarActions", "rowActions",
)
REQUIRED_TEXT = (
    "snowy-component-manifest", "snowy-prototype-schema", "snowy-annotation-state",
    "ant-design-vue", "Vue", "createSnowyComponents", "createSnowyAnnotationComponent",
    "snowy-sider", "snowy-header", "snowy-tabs-row", "snowy-query-card", "snowy-table-card",
    "a-form", "a-form-item", "a-row", "a-col", "a-table", "a-drawer", "a-modal",
    "a-upload", "a-upload-dragger", "localStorage", "saveAsHtml",
)
FORBIDDEN_PATTERNS = (
    (r"\bpageSpecs\b", "legacy pageSpecs engine"),
    (r"active\.query", "universal query renderer"),
    (r"active\.details", "universal detail renderer"),
    (r"\bformFields\b", "universal form renderer"),
    (r"visibleFields\.value\.map", "universal table-column renderer"),
    (r"\ballowedActions\b", "universal operation renderer"),
    (r"\bannotationDrawerOpen\b", "custom annotation reimplementation"),
    (r"function\s+renderPins", "custom annotation reimplementation"),
    (r"node-comment-hover|node-comment-selected", "legacy annotation selection style"),
    (r"<input\s+[^>]*type\s*=\s*['\"]file['\"]", "raw file input used instead of upload component"),
    (r"class\s*=\s*['\"][^'\"]*\bquery-grid\b", "custom query grid"),
    (r"class\s*=\s*['\"][^'\"]*\bdrawer-grid\b", "custom drawer grid"),
    (r"class\s*=\s*['\"][^'\"]*\bcontent-card\b", "custom content card"),
)


def normalize(value: str) -> str:
    return value.replace("\r\n", "\n").replace("\r", "\n").strip()


def sha256(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def extract_section(text: str, start_marker: str, end_marker: str) -> str | None:
    match = re.search(
        rf"^[^\n]*{re.escape(start_marker)}[^\n]*\n([\s\S]*?)^[^\n]*{re.escape(end_marker)}[^\n]*$",
        text,
        flags=re.MULTILINE,
    )
    if not match:
        return None
    return normalize(match.group(1))


def extract_json_script(text: str, element_id: str):
    match = re.search(
        rf'<script\s+id=["\']{re.escape(element_id)}["\'][^>]*>([\s\S]*?)</script>',
        text,
        flags=re.IGNORECASE,
    )
    if not match:
        raise ValueError(f"missing JSON script: {element_id}")
    return json.loads(match.group(1))


def validate_schema(schema: dict, component_names: set[str], template_mode: bool) -> list[str]:
    errors = []
    if schema.get("version") != 1:
        errors.append("schema.version must be 1")
    pages = schema.get("pages")
    if not isinstance(pages, list) or not pages:
        return errors + ["schema.pages must contain at least one page"]
    page_ids = set()
    for page_index, page in enumerate(pages):
        if not isinstance(page, dict):
            errors.append(f"pages[{page_index}] must be an object")
            continue
        page_id = page.get("id") or f"pages[{page_index}]"
        if page_id in page_ids:
            errors.append(f"duplicate page id {page_id}")
        page_ids.add(page_id)
        for key in ("id", "title", "route", "permission", "pageType", "requirement"):
            if not page.get(key):
                errors.append(f"{page_id}.{key} is required")
        if not isinstance(page.get("menuPath"), list) or not page["menuPath"]:
            errors.append(f"{page_id}.menuPath must be a non-empty array")
        for section in SCHEMA_SECTIONS:
            items = page.get(section)
            if not isinstance(items, list):
                errors.append(f"{page_id}.{section} must be an array")
                continue
            identities = set()
            for index, item in enumerate(items):
                location = f"{page_id}.{section}[{index}]"
                if not isinstance(item, dict):
                    errors.append(f"{location} must be an object")
                    continue
                identity = item.get("key") or item.get("dataIndex")
                if not identity:
                    errors.append(f"{location}.key is required")
                elif identity in identities:
                    errors.append(f"{page_id}.{section} duplicate key {identity}")
                else:
                    identities.add(identity)
                component = item.get("component")
                if not component:
                    errors.append(f"{location}.component is required")
                elif component not in component_names:
                    errors.append(f"{location} unknown component {component}")
        if not isinstance(page.get("rows"), list):
            errors.append(f"{page_id}.rows must be an array")
        annotations = page.get("annotations")
        if not isinstance(annotations, list):
            errors.append(f"{page_id}.annotations must be an array")
        else:
            annotation_ids = set()
            for index, annotation in enumerate(annotations):
                location = f"{page_id}.annotations[{index}]"
                if not isinstance(annotation, dict):
                    errors.append(f"{location} must be an object")
                    continue
                for key in ("id", "index", "title", "summary", "nodeKey"):
                    if annotation.get(key) in (None, ""):
                        errors.append(f"{location}.{key} is required")
                if annotation.get("id") in annotation_ids:
                    errors.append(f"{page_id}.annotations duplicate id {annotation.get('id')}")
                annotation_ids.add(annotation.get("id"))
                node_key = str(annotation.get("nodeKey", ""))
                if node_key and not node_key.startswith(f"{page.get('id')}:"):
                    errors.append(f"{location}.nodeKey must belong to page {page.get('id')}")
                if node_key.endswith(":query-card") or node_key == page.get("id"):
                    errors.append(f"{location}.nodeKey must target a concrete business node")
    if not template_mode:
        if not schema.get("blueprintTrace"):
            errors.append("schema.blueprintTrace is required for generated prototypes")
        if not schema.get("coverageMatrix"):
            errors.append("schema.coverageMatrix is required for generated prototypes")
    return errors


def parse_args(raw_args: list[str]):
    must_contain = []
    template_mode = False
    paths = []
    index = 0
    while index < len(raw_args):
        arg = raw_args[index]
        if arg == "--template":
            template_mode = True
            index += 1
        elif arg == "--must-contain":
            if index + 1 >= len(raw_args):
                raise ValueError("--must-contain requires a comma-separated value")
            must_contain.extend(part.strip() for part in raw_args[index + 1].split(",") if part.strip())
            index += 2
        else:
            paths.append(arg)
            index += 1
    if len(paths) != 1:
        raise ValueError("Usage: validate_admin_prototype.py [--template] [--must-contain 字段1,字段2] <admin-prototype.html>")
    return Path(paths[0]), template_mode, must_contain


def main() -> int:
    try:
        path, template_mode, must_contain = parse_args(sys.argv[1:])
    except ValueError as error:
        print(f"FAIL {error}")
        return 2
    if not path.exists():
        print(f"FAIL file not found: {path}")
        return 2

    text = path.read_text(encoding="utf-8")
    source_root = Path(__file__).resolve().parent.parent / "assets" / "prototype-demo-framework" / "src"
    errors = []
    extracted = {}
    canonical_sources = []
    for source_key, (start_marker, end_marker, source_name) in SECTIONS.items():
        actual = extract_section(text, start_marker, end_marker)
        source_path = source_root / source_name
        expected = normalize(source_path.read_text(encoding="utf-8"))
        canonical_sources.append(expected)
        if actual is None:
            errors.append(f"missing protected component section: {source_key}")
            continue
        extracted[source_key] = actual
        if actual != expected:
            errors.append(f"protected component section changed: {source_key}")

    try:
        manifest = extract_json_script(text, "snowy-component-manifest")
        schema = extract_json_script(text, "snowy-prototype-schema")
    except (ValueError, json.JSONDecodeError) as error:
        errors.append(str(error))
        manifest, schema = {}, {}

    if manifest.get("version") != KIT_VERSION:
        errors.append(f"component kit version must be {KIT_VERSION}")
    components = manifest.get("components")
    if not isinstance(components, list) or not components:
        errors.append("component manifest must contain registered components")
        component_names = set()
    else:
        component_names = {item.get("name") for item in components if isinstance(item, dict) and item.get("name")}
    hashes = manifest.get("sourceHashes", {})
    for source_key, actual in extracted.items():
        if hashes.get(source_key) != sha256(actual):
            errors.append(f"component source hash mismatch: {source_key}")

    errors.extend(validate_schema(schema, component_names, template_mode))
    for marker in REQUIRED_TEXT:
        if marker not in text:
            errors.append(f"missing marker: {marker}")
    canonical_text = "\n".join(canonical_sources)
    for pattern, label in FORBIDDEN_PATTERNS:
        actual_count = len(re.findall(pattern, text, flags=re.IGNORECASE))
        expected_count = len(re.findall(pattern, canonical_text, flags=re.IGNORECASE))
        if actual_count > expected_count:
            errors.append(f"non-component-kit implementation found: {label}")
    for required in must_contain:
        if required not in text:
            errors.append(f"missing required demand field/text: {required}")

    if errors:
        for error in errors:
            print(f"FAIL {error}")
        return 1
    mode = "template" if template_mode else "prototype"
    print(f"PASS Snowy admin component-kit {mode} checks")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
