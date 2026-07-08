"""Render a requirement Markdown file into a standalone HTML viewer."""

from __future__ import annotations

import argparse
import html
import re
from pathlib import Path


HEADING_RE = re.compile(r"^(#{1,6})\s+(.+)$")


def slugify(text: str, index: int) -> str:
    base = re.sub(r"[^\w\u4e00-\u9fff-]+", "-", text, flags=re.UNICODE).strip("-").lower()
    return f"section-{index}-{base or 'untitled'}"


def render_inline(text: str) -> str:
    escaped = html.escape(text)
    escaped = re.sub(r"`([^`]+)`", r"<code>\1</code>", escaped)
    escaped = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", escaped)
    return escaped


def is_table_separator(line: str) -> bool:
    cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell or "") for cell in cells)


def render_table(lines: list[str]) -> str:
    rows = [[cell.strip() for cell in line.strip().strip("|").split("|")] for line in lines]
    if len(rows) >= 2 and is_table_separator(lines[1]):
        head = rows[0]
        body = rows[2:]
    else:
        head = []
        body = rows

    parts = ["<div class=\"table-wrap\"><table>"]
    if head:
        parts.append("<thead><tr>")
        parts.extend(f"<th>{render_inline(cell)}</th>" for cell in head)
        parts.append("</tr></thead>")
    parts.append("<tbody>")
    for row in body:
        parts.append("<tr>")
        parts.extend(f"<td>{render_inline(cell)}</td>" for cell in row)
        parts.append("</tr>")
    parts.append("</tbody></table></div>")
    return "\n".join(parts)


def markdown_to_html(markdown: str) -> tuple[str, list[tuple[int, str, str]]]:
    lines = markdown.splitlines()
    output: list[str] = []
    toc: list[tuple[int, str, str]] = []
    in_code = False
    list_open = False
    index = 0
    i = 0

    while i < len(lines):
        line = lines[i]

        if line.strip().startswith("```"):
            if list_open:
                output.append("</ul>")
                list_open = False
            if not in_code:
                output.append("<pre><code>")
                in_code = True
            else:
                output.append("</code></pre>")
                in_code = False
            i += 1
            continue

        if in_code:
            output.append(html.escape(line))
            i += 1
            continue

        if not line.strip():
            if list_open:
                output.append("</ul>")
                list_open = False
            i += 1
            continue

        heading = HEADING_RE.match(line)
        if heading:
            if list_open:
                output.append("</ul>")
                list_open = False
            level = len(heading.group(1))
            title = heading.group(2).strip()
            index += 1
            anchor = slugify(title, index)
            toc.append((level, title, anchor))
            output.append(f"<h{level} id=\"{anchor}\">{render_inline(title)}</h{level}>")
            i += 1
            continue

        if "|" in line and i + 1 < len(lines) and is_table_separator(lines[i + 1]):
            if list_open:
                output.append("</ul>")
                list_open = False
            table_lines = [line, lines[i + 1]]
            i += 2
            while i < len(lines) and "|" in lines[i] and lines[i].strip():
                table_lines.append(lines[i])
                i += 1
            output.append(render_table(table_lines))
            continue

        if re.match(r"^\s*[-*]\s+", line):
            if not list_open:
                output.append("<ul>")
                list_open = True
            item = re.sub(r"^\s*[-*]\s+", "", line)
            output.append(f"<li>{render_inline(item)}</li>")
            i += 1
            continue

        if re.match(r"^\s*\d+\.\s+", line):
            if not list_open:
                output.append("<ul>")
                list_open = True
            item = re.sub(r"^\s*\d+\.\s+", "", line)
            output.append(f"<li>{render_inline(item)}</li>")
            i += 1
            continue

        if list_open:
            output.append("</ul>")
            list_open = False
        output.append(f"<p>{render_inline(line)}</p>")
        i += 1

    if list_open:
        output.append("</ul>")
    if in_code:
        output.append("</code></pre>")

    return "\n".join(output), toc


def build_html(markdown_path: Path, body: str, toc: list[tuple[int, str, str]]) -> str:
    title = markdown_path.stem
    toc_html = "\n".join(
        f"<a class=\"toc-level-{level}\" href=\"#{anchor}\">{html.escape(text)}</a>"
        for level, text, anchor in toc
    )
    return f"""<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} - 需求可视化</title>
  <style>
    :root {{
      color-scheme: light;
      --bg: #f5f7fb;
      --panel: #ffffff;
      --text: #1f2937;
      --muted: #667085;
      --line: #d9e2ef;
      --brand: #1769e0;
      --brand-soft: #e8f1ff;
      --risk: #a15c00;
    }}
    * {{ box-sizing: border-box; }}
    body {{ margin: 0; font-family: "Microsoft YaHei", "Noto Sans SC", Arial, sans-serif; color: var(--text); background: var(--bg); }}
    .shell {{ display: grid; grid-template-columns: 280px minmax(0, 1fr); min-height: 100vh; }}
    aside {{ position: sticky; top: 0; height: 100vh; overflow: auto; padding: 24px 18px; background: #0f172a; color: #e5edf9; }}
    aside h1 {{ margin: 0 0 18px; font-size: 18px; line-height: 1.35; }}
    aside a {{ display: block; color: #c8d6ee; text-decoration: none; border-radius: 6px; padding: 7px 8px; line-height: 1.35; }}
    aside a:hover {{ background: rgba(255,255,255,.09); color: #fff; }}
    .toc-level-1 {{ font-weight: 700; margin-top: 6px; }}
    .toc-level-2 {{ padding-left: 16px; }}
    .toc-level-3, .toc-level-4, .toc-level-5, .toc-level-6 {{ padding-left: 30px; font-size: 13px; color: #9fb0cc; }}
    main {{ padding: 30px; }}
    .hero {{ background: linear-gradient(135deg, #ffffff, #eef5ff); border: 1px solid var(--line); border-radius: 8px; padding: 24px; margin-bottom: 18px; }}
    .hero h2 {{ margin: 0 0 8px; font-size: 24px; }}
    .hero p {{ margin: 0; color: var(--muted); }}
    .content {{ background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 28px; }}
    h1, h2, h3 {{ scroll-margin-top: 24px; }}
    h1 {{ font-size: 28px; border-bottom: 1px solid var(--line); padding-bottom: 12px; }}
    h2 {{ margin-top: 34px; font-size: 22px; color: #123c7c; }}
    h3 {{ margin-top: 24px; font-size: 18px; }}
    h4, h5, h6 {{ margin-top: 20px; }}
    p, li {{ line-height: 1.75; }}
    p {{ margin: 10px 0; }}
    ul {{ margin: 8px 0 16px 20px; padding: 0; }}
    code {{ background: #eef2f7; border-radius: 4px; padding: 2px 5px; }}
    pre {{ overflow: auto; background: #0b1220; color: #dbeafe; border-radius: 8px; padding: 14px; }}
    .table-wrap {{ overflow: auto; margin: 14px 0 22px; border: 1px solid var(--line); border-radius: 8px; }}
    table {{ width: 100%; border-collapse: collapse; min-width: 720px; }}
    th, td {{ border-bottom: 1px solid var(--line); padding: 10px 12px; text-align: left; vertical-align: top; }}
    th {{ background: var(--brand-soft); color: #0f3f85; font-weight: 700; }}
    tr:last-child td {{ border-bottom: 0; }}
    @media (max-width: 900px) {{
      .shell {{ grid-template-columns: 1fr; }}
      aside {{ position: relative; height: auto; }}
      main {{ padding: 16px; }}
      .content {{ padding: 18px; }}
    }}
  </style>
</head>
<body>
  <div class="shell">
    <aside>
      <h1>{html.escape(title)}</h1>
      {toc_html}
    </aside>
    <main>
      <section class="hero">
        <h2>需求可视化页面</h2>
        <p>来源 Markdown：{html.escape(str(markdown_path))}。请以 Markdown 为主源，本页面用于开发快速查看和评审。</p>
      </section>
      <article class="content">
        {body}
      </article>
    </main>
  </div>
</body>
</html>
"""


def main() -> None:
    parser = argparse.ArgumentParser(description="Render requirement Markdown into a standalone HTML viewer.")
    parser.add_argument("input", type=Path)
    parser.add_argument("--out", type=Path)
    args = parser.parse_args()

    markdown = args.input.read_text(encoding="utf-8")
    body, toc = markdown_to_html(markdown)
    output = args.out or args.input.with_suffix(".html")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(build_html(args.input, body, toc), encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
