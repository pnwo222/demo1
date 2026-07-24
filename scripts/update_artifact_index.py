#!/usr/bin/env python3
from collections import defaultdict
from html import escape, unescape
from pathlib import Path
from urllib.parse import quote
import argparse
import re


ROOT = Path(__file__).resolve().parent.parent
DOCS_ROOT = ROOT / "docs"
OUTPUT_PATH = ROOT / "PROJECT_ARTIFACTS.html"

ARTIFACT_SUFFIXES = {
    ".md",
    ".html",
    ".htm",
    ".pdf",
    ".docx",
    ".xlsx",
    ".xls",
    ".csv",
    ".pptx",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".svg",
    ".drawio",
    ".mmd",
    ".puml",
}

IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".svg"}

SUPPORTING_IMAGE_DIRS = {
    "assets",
    "image",
    "images",
    "media",
    "runtime-screenshots",
    "screenshots",
}

ROOT_EXCLUDES = {
    "AGENTS.md",
    "README.md",
    "PROJECT_ARTIFACTS.html",
}

PATH_EXCLUDES = {
    "docs/workflow/local-environment-status.md",
    "docs/workflow/requirements/TEMPLATE.md",
}

CATEGORY_ORDER = [
    "项目流程",
    "需求文档",
    "产品与 PRD",
    "设计与原型",
    "技术与数据",
    "计划与规格",
    "测试与审查",
    "发布与验收",
    "工作流状态",
    "历史产物",
    "其他产物",
]


def relative_path(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def is_supporting_image(relative: str, suffix: str) -> bool:
    path_parts = {part.lower() for part in Path(relative).parts[:-1]}
    return suffix.lower() in IMAGE_SUFFIXES and bool(path_parts & SUPPORTING_IMAGE_DIRS)


def is_artifact(path: Path) -> bool:
    if not path.is_file() or path.suffix.lower() not in ARTIFACT_SUFFIXES:
        return False
    relative = relative_path(path)
    if is_supporting_image(relative, path.suffix):
        return False
    if relative in PATH_EXCLUDES:
        return False
    if path.parent == ROOT and path.name in ROOT_EXCLUDES:
        return False
    return True


def collect_artifacts() -> list[Path]:
    artifacts = [
        path
        for path in ROOT.iterdir()
        if is_artifact(path)
    ]
    if DOCS_ROOT.is_dir():
        artifacts.extend(
            path
            for path in DOCS_ROOT.rglob("*")
            if is_artifact(path)
        )
    return sorted(set(artifacts), key=lambda path: relative_path(path).lower())


def read_title(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix not in {".md", ".html", ".htm"}:
        return path.stem
    try:
        content = path.read_text(encoding="utf-8")
    except (OSError, UnicodeDecodeError):
        return path.stem
    if suffix == ".md":
        match = re.search(r"(?m)^#\s+(.+?)\s*$", content)
        return match.group(1).strip() if match else path.stem
    match = re.search(r"<title[^>]*>(.*?)</title>", content, flags=re.I | re.S)
    if not match:
        match = re.search(r"<h1[^>]*>(.*?)</h1>", content, flags=re.I | re.S)
    if not match:
        return path.stem
    title = re.sub(r"<[^>]+>", "", match.group(1))
    return unescape(re.sub(r"\s+", " ", title)).strip() or path.stem


def category_for(path: Path) -> str:
    relative = relative_path(path)
    if path.parent == ROOT:
        return "项目流程"
    parts = [part.lower() for part in Path(relative).parts]
    if "requirements" in parts:
        return "需求文档"
    if "prd" in parts:
        return "产品与 PRD"
    if "superpowers" in parts:
        return "历史产物"
    if "plans" in parts or "specs" in parts:
        return "计划与规格"
    if "design" in parts or "prototype" in relative.lower():
        return "设计与原型"
    if any(part in parts for part in ("architecture", "data", "technical")):
        return "技术与数据"
    if any(part in parts for part in ("test", "tests", "qa", "review", "security")):
        return "测试与审查"
    if any(part in parts for part in ("release", "acceptance")):
        return "发布与验收"
    if "workflow" in parts:
        return "工作流状态"
    return "其他产物"


def artifact_row(path: Path) -> str:
    relative = relative_path(path)
    encoded = quote(relative, safe="/._-")
    title = escape(read_title(path))
    display_path = escape(relative)
    file_type = escape(path.suffix.removeprefix(".").upper())
    search_text = escape(f"{title} {relative}".lower(), quote=True)
    return (
        f'<a class="artifact-row" data-search="{search_text}" href="{encoded}" '
        'target="_blank" rel="noopener">'
        f'<span class="file-type" data-type="{file_type}">{file_type}</span>'
        '<span class="artifact-copy">'
        f'<strong>{title}</strong>'
        f'<small>{display_path}</small>'
        '</span>'
        '<span class="open-arrow" aria-hidden="true">→</span>'
        '</a>'
    )


def render_index(artifacts: list[Path]) -> str:
    grouped: dict[str, list[Path]] = defaultdict(list)
    for artifact in artifacts:
        grouped[category_for(artifact)].append(artifact)

    categories = [category for category in CATEGORY_ORDER if grouped.get(category)]
    nav_items = "\n".join(
        f'<a href="#category-{index}"><span>{escape(category)}</span>'
        f'<small>{len(grouped[category])}</small></a>'
        for index, category in enumerate(categories, start=1)
    )
    sections = "\n".join(
        (
            f'<section id="category-{index}" class="artifact-section">'
            '<header class="section-header">'
            f'<h2>{escape(category)}</h2>'
            f'<span>{len(grouped[category])} 项</span>'
            '</header>'
            '<div class="artifact-list">'
            + "\n".join(artifact_row(path) for path in grouped[category])
            + '</div></section>'
        )
        for index, category in enumerate(categories, start=1)
    )

    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>项目产物导航</title>
  <style>
    :root {{
      color-scheme: light;
      font-family: "Microsoft YaHei", "PingFang SC", Arial, sans-serif;
      color: #1f2937;
      background: #f5f7fa;
    }}
    * {{ box-sizing: border-box; }}
    html {{ scroll-behavior: smooth; }}
    body {{ margin: 0; min-width: 320px; background: #f5f7fa; }}
    button, input {{ font: inherit; }}
    .topbar {{
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      gap: 24px;
      align-items: center;
      justify-content: space-between;
      min-height: 72px;
      padding: 12px clamp(20px, 4vw, 56px);
      background: #fff;
      border-bottom: 1px solid #e5e7eb;
    }}
    .title-group {{ display: flex; gap: 12px; align-items: baseline; min-width: 0; }}
    h1 {{ margin: 0; font-size: 22px; line-height: 32px; }}
    .total {{ flex: none; font-size: 13px; color: #64748b; }}
    .search {{
      width: min(360px, 42vw);
      height: 40px;
      padding: 0 14px;
      color: #334155;
      background: #f8fafc;
      border: 1px solid #d8dee8;
      border-radius: 6px;
      outline: none;
    }}
    .search:focus {{ background: #fff; border-color: #1677ff; box-shadow: 0 0 0 2px rgb(22 119 255 / 12%); }}
    .layout {{ display: grid; grid-template-columns: 220px minmax(0, 1fr); min-height: calc(100vh - 72px); }}
    .category-nav {{
      position: sticky;
      top: 72px;
      align-self: start;
      height: calc(100vh - 72px);
      padding: 24px 16px;
      overflow-y: auto;
      background: #fff;
      border-right: 1px solid #e5e7eb;
    }}
    .category-nav a {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 40px;
      padding: 0 12px;
      font-size: 14px;
      color: #475569;
      text-decoration: none;
      border-radius: 4px;
    }}
    .category-nav a:hover {{ color: #0958d9; background: #f0f6ff; }}
    .category-nav small {{ color: #94a3b8; }}
    main {{ width: min(1120px, 100%); padding: 32px clamp(20px, 4vw, 56px) 72px; }}
    .artifact-section {{ margin-bottom: 36px; scroll-margin-top: 96px; }}
    .section-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 42px;
      border-bottom: 1px solid #dce2ea;
    }}
    .section-header h2 {{ margin: 0; font-size: 17px; line-height: 26px; }}
    .section-header span {{ font-size: 12px; color: #64748b; }}
    .artifact-list {{ background: #fff; }}
    .artifact-row {{
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr) 28px;
      gap: 14px;
      align-items: center;
      min-height: 76px;
      padding: 12px 16px;
      color: inherit;
      text-decoration: none;
      border-bottom: 1px solid #edf0f4;
    }}
    .artifact-row:hover {{ background: #f8fbff; }}
    .artifact-row:focus-visible {{ outline: 2px solid #1677ff; outline-offset: -2px; }}
    .file-type {{
      display: grid;
      width: 42px;
      height: 30px;
      place-items: center;
      font-size: 11px;
      font-weight: 700;
      color: #0958d9;
      background: #e6f4ff;
      border-radius: 4px;
    }}
    .file-type[data-type="PNG"], .file-type[data-type="JPG"], .file-type[data-type="SVG"] {{
      color: #237804;
      background: #f0f9e8;
    }}
    .file-type[data-type="PDF"] {{ color: #cf1322; background: #fff1f0; }}
    .file-type[data-type="HTML"] {{ color: #ad4e00; background: #fff7e6; }}
    .artifact-copy {{ display: flex; flex-direction: column; min-width: 0; }}
    .artifact-copy strong {{
      overflow: hidden;
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }}
    .artifact-copy small {{
      margin-top: 3px;
      overflow: hidden;
      font-size: 12px;
      line-height: 18px;
      color: #7c8798;
      text-overflow: ellipsis;
      white-space: nowrap;
    }}
    .open-arrow {{ font-size: 18px; color: #94a3b8; text-align: center; }}
    .artifact-row:hover .open-arrow {{ color: #1677ff; transform: translateX(2px); }}
    .empty {{ display: none; padding: 56px 16px; color: #64748b; text-align: center; }}
    body.no-results .empty {{ display: block; }}
    body.no-results .artifact-section {{ display: none; }}
    @media (max-width: 720px) {{
      .topbar {{ position: static; align-items: stretch; flex-direction: column; gap: 10px; padding: 16px; }}
      .search {{ width: 100%; }}
      .layout {{ display: block; min-height: 0; }}
      .category-nav {{
        position: sticky;
        top: 0;
        z-index: 9;
        display: flex;
        gap: 4px;
        width: 100%;
        height: auto;
        padding: 8px 12px;
        overflow-x: auto;
        background: #fff;
        border-right: 0;
        border-bottom: 1px solid #e5e7eb;
      }}
      .category-nav a {{ flex: none; gap: 8px; }}
      main {{ padding: 24px 16px 56px; }}
      .artifact-row {{ grid-template-columns: 42px minmax(0, 1fr) 22px; gap: 10px; padding: 12px; }}
    }}
  </style>
</head>
<body>
  <!-- 由 scripts/update_artifact_index.py 自动生成，请勿手工维护条目。 -->
  <header class="topbar">
    <div class="title-group">
      <h1>项目产物导航</h1>
      <span class="total">{len(artifacts)} 个产物</span>
    </div>
    <input id="artifact-search" class="search" type="search" placeholder="搜索产物名称或路径" aria-label="搜索产物">
  </header>
  <div class="layout">
    <nav class="category-nav" aria-label="产物分类">
      {nav_items}
    </nav>
    <main>
      {sections}
      <div class="empty">未找到匹配的产物</div>
    </main>
  </div>
  <script>
    const search = document.querySelector('#artifact-search');
    const rows = [...document.querySelectorAll('.artifact-row')];
    const sections = [...document.querySelectorAll('.artifact-section')];
    search.addEventListener('input', () => {{
      const keyword = search.value.trim().toLowerCase();
      let visibleCount = 0;
      rows.forEach((row) => {{
        const visible = !keyword || row.dataset.search.includes(keyword);
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      }});
      sections.forEach((section) => {{
        section.hidden = !section.querySelector('.artifact-row:not([hidden])');
      }});
      document.body.classList.toggle('no-results', visibleCount === 0);
    }});
  </script>
</body>
</html>
"""


def main() -> int:
    parser = argparse.ArgumentParser(description="生成或校验项目非代码产物导航")
    parser.add_argument("--check", action="store_true", help="只校验导航是否与当前产物一致")
    args = parser.parse_args()
    artifacts = collect_artifacts()
    expected = render_index(artifacts)
    if args.check:
        if not OUTPUT_PATH.is_file():
            print(f"产物导航校验失败：缺少 {OUTPUT_PATH.name}")
            return 1
        actual = OUTPUT_PATH.read_text(encoding="utf-8")
        if actual != expected:
            print("产物导航校验失败：导航已过期，请执行 python scripts/update_artifact_index.py")
            return 1
        print(f"产物导航校验通过：{len(artifacts)} 个产物")
        return 0
    OUTPUT_PATH.write_text(expected, encoding="utf-8", newline="\n")
    print(f"已更新 {OUTPUT_PATH.name}：登记 {len(artifacts)} 个产物")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
