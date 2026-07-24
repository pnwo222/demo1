#!/usr/bin/env python3
from hashlib import sha256
from pathlib import Path
import argparse
import json
import sys


SKILL_ROOT = Path(__file__).resolve().parent.parent
BUNDLE_ROOT = SKILL_ROOT / "assets" / "reference-business-scenes"
SCENE_ROOT = BUNDLE_ROOT / "views"
MANIFEST_PATH = BUNDLE_ROOT / "manifest.json"


def collect_files() -> list[dict[str, object]]:
    result = []
    for path in sorted(item for item in BUNDLE_ROOT.rglob("*") if item.is_file() and item != MANIFEST_PATH):
        content = path.read_bytes()
        result.append(
            {
                "path": path.relative_to(BUNDLE_ROOT).as_posix(),
                "bytes": len(content),
                "sha256": sha256(content).hexdigest(),
            }
        )
    return result


def write_manifest() -> int:
    files = collect_files()
    payload = {
        "schemaVersion": 1,
        "purpose": "Snowy H5 去重业务场景与可复用框架模式只读资源",
        "sourceAtSnapshot": "project/h5 的代表页面、组件和组合式方法源码",
        "selectionRule": "每类页面模式只保留代表场景及必要复用代码，不归档业务图片",
        "files": files,
    }
    MANIFEST_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"已写入场景清单：{len(files)} 个文件")
    return 0


def validate_manifest() -> int:
    if not MANIFEST_PATH.is_file():
        print("场景快照校验失败：缺少 manifest.json")
        return 1
    expected = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    actual = collect_files()
    if expected.get("files") != actual:
        expected_map = {item["path"]: item for item in expected.get("files", [])}
        actual_map = {item["path"]: item for item in actual}
        errors = []
        for path in sorted(expected_map.keys() - actual_map.keys()):
            errors.append(f"缺少：{path}")
        for path in sorted(actual_map.keys() - expected_map.keys()):
            errors.append(f"未登记：{path}")
        for path in sorted(expected_map.keys() & actual_map.keys()):
            if expected_map[path] != actual_map[path]:
                errors.append(f"内容变化：{path}")
        print("场景快照校验失败：")
        for error in errors:
            print(f"- {error}")
        return 1
    print(f"场景快照校验通过：{len(actual)} 个文件")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="生成或校验 H5 真实业务场景快照清单")
    parser.add_argument("--write", action="store_true", help="按当前快照重建 manifest")
    args = parser.parse_args()
    if not SCENE_ROOT.is_dir():
        print(f"场景快照目录不存在：{SCENE_ROOT}")
        return 1
    return write_manifest() if args.write else validate_manifest()


if __name__ == "__main__":
    sys.exit(main())
