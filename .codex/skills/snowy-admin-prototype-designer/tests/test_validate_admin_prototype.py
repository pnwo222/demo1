import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


SKILL_DIR = Path(__file__).resolve().parents[1]
VALIDATOR = SKILL_DIR / "scripts" / "validate_admin_prototype.py"
DEMO_ROOT = SKILL_DIR / "assets" / "prototype-demo-framework"
DEMO = DEMO_ROOT / "index.html"


class RuntimeComponentValidatorTests(unittest.TestCase):
    def run_validator(self, path: Path):
        return subprocess.run(
            [sys.executable, str(VALIDATOR), "--template", str(path)],
            capture_output=True,
            encoding="utf-8",
            check=False,
        )

    def fixture(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        root = Path(directory.name) / "prototype"
        shutil.copytree(DEMO_ROOT, root)
        return root

    def test_runtime_component_demo_passes(self):
        result = self.run_validator(DEMO)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_missing_component_reference_fails(self):
        root = self.fixture()
        path = root / "index.html"
        path.write_text(
            path.read_text(encoding="utf-8").replace(
                '<script src="components/annotation-toolbar.js"></script>', ""
            ),
            encoding="utf-8",
        )
        result = self.run_validator(path)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("entry does not reference runtime component: components/annotation-toolbar.js", result.stdout)

    def test_component_hash_change_fails(self):
        root = self.fixture()
        component = root / "components" / "annotation-toolbar.js"
        component.write_text(
            component.read_text(encoding="utf-8").replace("标注模式", "修改后的标注模式", 1),
            encoding="utf-8",
        )
        result = self.run_validator(root / "index.html")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("runtime component hash mismatch: components/annotation-toolbar.js", result.stdout)

    def test_simplified_renderer_fails(self):
        root = self.fixture()
        path = root / "index.html"
        path.write_text(
            path.read_text(encoding="utf-8").replace(
                "</body>", '<script>const pageSpecs={};</script></body>'
            ),
            encoding="utf-8",
        )
        result = self.run_validator(path)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("simplified/custom renderer is forbidden: pageSpecs", result.stdout)

    def test_inline_full_implementation_fails(self):
        root = self.fixture()
        path = root / "index.html"
        path.write_text(
            path.read_text(encoding="utf-8").replace(
                "</head>", "<style>" + (".inline{color:red}" * 600) + "</style></head>"
            ),
            encoding="utf-8",
        )
        result = self.run_validator(path)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("entry contains an inline implementation instead of component references", result.stdout)


if __name__ == "__main__":
    unittest.main()
