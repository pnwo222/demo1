import json
import re
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SKILL_DIR = Path(__file__).resolve().parents[1]
VALIDATOR = SKILL_DIR / "scripts" / "validate_admin_prototype.py"
DEMO = SKILL_DIR / "assets" / "prototype-demo-framework" / "index.html"


class AdminPrototypeValidatorTests(unittest.TestCase):
    def run_validator(self, path: Path) -> subprocess.CompletedProcess[str]:
        return subprocess.run(
            [sys.executable, str(VALIDATOR), "--template", str(path)],
            capture_output=True,
            encoding="utf-8",
            check=False,
        )

    def write_mutation(self, transform) -> Path:
        source = DEMO.read_text(encoding="utf-8")
        temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(temp_dir.cleanup)
        target = Path(temp_dir.name) / "prototype.html"
        target.write_text(transform(source), encoding="utf-8")
        return target

    @staticmethod
    def mutate_schema(text: str, mutate) -> str:
        pattern = r'(<script id="snowy-prototype-schema" type="application/json">)([\s\S]*?)(</script>)'
        match = re.search(pattern, text)
        schema = json.loads(match.group(2))
        mutate(schema)
        replacement = match.group(1) + json.dumps(schema, ensure_ascii=False) + match.group(3)
        return text[: match.start()] + replacement + text[match.end() :]

    def test_canonical_demo_passes(self):
        result = self.run_validator(DEMO)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_missing_component_source_section_fails(self):
        target = self.write_mutation(
            lambda text: text.replace("SNOWY_COMPONENTS_SOURCE_START", "REMOVED_COMPONENTS_START")
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing protected component section: components", result.stdout)

    def test_changed_annotation_source_fails(self):
        target = self.write_mutation(
            lambda text: text.replace("name:'SnowyAnnotationLayer'", "name:'ChangedAnnotationLayer'", 1)
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("protected component section changed: annotation", result.stdout)

    def test_changed_core_css_fails(self):
        target = self.write_mutation(
            lambda text: text.replace("--snowy-brand:#1677ff", "--snowy-brand:#ff0000", 1)
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("protected component section changed: coreCss", result.stdout)

    def test_component_hash_tamper_fails(self):
        target = self.write_mutation(
            lambda text: text.replace('"coreCss":"', '"coreCss":"tampered', 1)
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("component source hash mismatch: coreCss", result.stdout)

    def test_schema_item_without_component_fails(self):
        target = self.write_mutation(
            lambda text: self.mutate_schema(text, lambda schema: schema["pages"][0]["queryFields"][0].pop("component"))
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("queryFields[0].component is required", result.stdout)

    def test_schema_unknown_component_fails(self):
        target = self.write_mutation(
            lambda text: self.mutate_schema(text, lambda schema: schema["pages"][0]["columns"][0].update(component="CustomTableCell"))
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("unknown component CustomTableCell", result.stdout)

    def test_annotation_must_target_concrete_node(self):
        target = self.write_mutation(
            lambda text: self.mutate_schema(text, lambda schema: schema["pages"][0]["annotations"][0].update(nodeKey=f'{schema["pages"][0]["id"]}:query-card'))
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("must target a concrete business node", result.stdout)

    def test_universal_form_renderer_fails(self):
        target = self.write_mutation(
            lambda text: text.replace("</body>", '<template><a-form-item v-for="field in formFields" /></template></body>')
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("universal form renderer", result.stdout)

    def test_raw_file_input_fails(self):
        target = self.write_mutation(lambda text: text.replace("</body>", '<input type="file" /></body>'))
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("raw file input used instead of upload component", result.stdout)

    def test_universal_table_renderer_fails(self):
        target = self.write_mutation(
            lambda text: text.replace("</body>", "<script>visibleFields.value.map(field=>field)</script></body>")
        )
        result = self.run_validator(target)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("universal table-column renderer", result.stdout)


if __name__ == "__main__":
    unittest.main()
