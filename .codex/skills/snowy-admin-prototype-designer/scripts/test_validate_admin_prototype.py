import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_ROOT = SCRIPT_DIR.parent
TEMPLATE_ROOT = SKILL_ROOT / "assets" / "prototype-demo-framework"
VALIDATOR = SCRIPT_DIR / "validate_admin_prototype.py"


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def update_manifest_hash(root: Path, relative_path: str) -> None:
    manifest_path = root / "component-manifest.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    if relative_path == manifest["entry"]:
        manifest["entrySha256"] = sha256(root / relative_path)
    elif relative_path.startswith("components/"):
        file_name = relative_path.removeprefix("components/")
        item = next(entry for entry in manifest["components"] if entry["file"] == file_name)
        item["sha256"] = sha256(root / relative_path)
    else:
        item = next(entry for entry in manifest["app"] if entry["file"] == relative_path)
        item["sha256"] = sha256(root / relative_path)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


class PrototypeValidatorRegressionTests(unittest.TestCase):
    def run_validator(self, root: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(VALIDATOR), "--template", str(root / "index.html")],
            text=True,
            encoding="utf-8",
            capture_output=True,
            check=False,
        )

    def copy_template(self, target: Path) -> None:
        shutil.copytree(TEMPLATE_ROOT, target, dirs_exist_ok=True)

    def test_rejects_self_signed_protected_component_change(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "prototype"
            self.copy_template(root)
            component = root / "components" / "banner-query-form.js"
            component.write_text(component.read_text(encoding="utf-8") + "\n// changed\n", encoding="utf-8")
            update_manifest_hash(root, "components/banner-query-form.js")

            result = self.run_validator(root)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("canonical Demo hash mismatch", result.stdout)

    def test_rejects_core_components_that_are_imported_but_unreachable(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "prototype"
            self.copy_template(root)
            main = root / "app" / "main.js"
            source = main.read_text(encoding="utf-8")
            source = source.replace("<snowy-shell></snowy-shell>", "<div class=\"snowy-shell-placeholder\"></div>")
            main.write_text(source, encoding="utf-8")
            update_manifest_hash(root, "app/main.js")

            result = self.run_validator(root)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("required component is not reachable", result.stdout)

    def test_rejects_field_slicing_renderer(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "prototype"
            self.copy_template(root)
            main = root / "app" / "main.js"
            main.write_text(
                main.read_text(encoding="utf-8") + "\nconst hiddenFields = activeBusinessPage.queryFields.slice(0, 6);\n",
                encoding="utf-8",
            )
            update_manifest_hash(root, "app/main.js")

            result = self.run_validator(root)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("field slicing is forbidden", result.stdout)

    def test_rejects_missing_page_contract(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory) / "prototype"
            self.copy_template(root)
            contract = root / "prototype-contract.json"
            if contract.exists():
                contract.unlink()

            result = self.run_validator(root)

            self.assertNotEqual(result.returncode, 0)
            self.assertIn("prototype-contract.json is missing", result.stdout)


if __name__ == "__main__":
    unittest.main()
