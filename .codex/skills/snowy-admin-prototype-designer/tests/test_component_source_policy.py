import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[4]


class ComponentSourcePolicyTests(unittest.TestCase):
    def test_component_extension_policy_lists_all_three_sources(self):
        files = (
            ROOT / "AGENTS.md",
            ROOT / "PROJECT_WORKFLOW.md",
            ROOT / ".codex/workflows/admin-prototype-design-workflow.md",
            ROOT / ".codex/skills/snowy-admin-prototype-designer/SKILL.md",
            ROOT / ".codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/components/README.md",
            ROOT / ".codex/skills/snowy-admin-prototype-designer/references/prototype-acceptance-checklist.md",
        )
        for path in files:
            text = path.read_text(encoding="utf-8")
            with self.subTest(path=path):
                self.assertIn("Snowy", text)
                self.assertIn("Demo", text)
                self.assertIn("Ant Design Vue", text)


if __name__ == "__main__":
    unittest.main()
