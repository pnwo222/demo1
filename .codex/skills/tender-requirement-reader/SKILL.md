---
name: tender-requirement-reader
description: Read tender/bid Word or PDF documents, extract text, tables, diagrams, images, and embedded attachments as reference assets, classify software development requirements, ignore hardware procurement/specification content, and write structured Chinese requirement documents into docs/requirements. Use when the user asks to parse 标书、招标文件、投标文件、技术部分、需求应答文件, or to split tender content into project requirements.
---

# Tender Requirement Reader

Use this skill to turn tender documents into implementation-ready requirement documents for this repository.

The default tender source directory is:

```text
docs/tenders/
```

The default output directory is:

```text
docs/requirements/
```

Extracted reference assets should be stored under:

```text
docs/tenders/assets/<标书文件名>/
```

## Boundaries

- Extract software development requirements only.
- Ignore hardware procurement, device model parameters, quantities, installation material, physical specifications, and pure product descriptions.
- Keep software that integrates with hardware, such as device status monitoring, access records, authentication APIs, biometric data management, and remote device configuration.
- If the tender includes H5/mobile requirements but the current repository has no H5 framework, record them as `H5 框架待补充` instead of forcing them into the existing admin frontend.
- Treat diagrams, screenshots, page mockups, flowcharts, and embedded attachments in the Word file as reference assets. Extract them and list their paths in the requirement document.
- Do not treat hardware product photos or physical device diagrams as software requirements, but keep them as reference assets when they clarify integration, user flows, device status, access records, or UI examples.
- Preserve tender source traceability by citing document name and paragraph/table markers when available.
- Output Chinese by default.

## Required Reading

Before writing requirements, read:

```text
AGENTS.md
docs/tenders/**
docs/requirements/**
project/docs/patterns/framework-inventory.md
project/docs/patterns/module-map.md
project/docs/patterns/feature-capability-map.md
```

If a Word document must be extracted, use:

```bash
python .codex/skills/tender-requirement-reader/scripts/extract_docx_text.py <input.docx> --out <extract.txt> --asset-dir docs/tenders/assets/<标书文件名>
```

Use the bundled workspace Python when available. The script writes UTF-8 text, includes paragraph/table markers, and exports `word/media/*` plus `word/embeddings/*`.
For numbered headings such as `1.3.2.2.师生管理`, the script emits `[SECTION][level=...][number=...][parent=...] ...`; use these markers first when building feature trees and menu candidates.

### Parsing Word `.bin` Embedded Objects

Word stores editable embedded objects under `word/embeddings/*.bin`. These are often OLE compound files, not normal images.

When a `.bin` appears:

1. Check the header. OLE compound files start with `D0 CF 11 E0 A1 B1 1A E1`.
2. Try to read the OLE `Package` stream.
3. If the `Package` stream starts with `PK`, treat it as an embedded zipped Office package.
4. For embedded Visio packages, write the package out as `<oleObject>.vsdx`.
5. Inspect the `.vsdx` zip:
   - `visio/pages/page*.xml` for shapes and relationships.
   - `visio/pages/_rels/page*.xml.rels` for linked images.
   - `visio/media/*` for embedded EMF/PNG/JPEG previews.
6. Extract readable text hints from XML and EMF data. Use them to identify whether the embedded object is an architecture diagram, feature map, flowchart, UI screenshot, or other reference material.

The extraction script does this automatically when the optional Python package `olefile` is available. If `olefile` is missing, keep the `.bin` as a reference asset and record that package extraction was skipped.

For the current sample tender, `oleObject1.bin` is a Microsoft Visio OLE object. Its `Package` stream can be extracted as `oleObject1.vsdx`, and readable hints include software architecture and feature-map terms such as 数据治理、数据安全、宁波市高校一卡通端学校专区、宁波市高校一卡通后管、内容管理、师生管理、权限管理、日志管理.

## Extraction Workflow

1. Locate tender documents in `docs/tenders/`.
2. Extract each Word/PDF into UTF-8 text and export reference assets.
   - For Word `.bin` embedded objects, extract and analyze the OLE package when possible.
3. Build a section map from headings, numbered paragraphs, and tables.
   - Preserve heading numbers such as `1.3.2.2` and child headings such as `1.3.2.2.1`.
   - Build a parent-child tree before classifying requirements.
   - Treat heading hierarchy as a strong signal for menu/function hierarchy, but confirm with the actual content description rather than assuming every heading is a menu.
4. Classify content:
   - `软件范围`: H5/mobile, backend admin, management admin, interfaces, data, workflow, permissions, reports, logs, integrations.
   - `硬件排除`: device purchase, physical specs, quantities, installation material.
   - `接口/对接`: external systems, authentication, payments, sync, callbacks.
   - `数据`: source systems, entities, fields, import/export, validation.
   - `参考素材`: diagrams, screenshots, page mockups, flowcharts, embedded files, appendix files.
   - `风险/待确认`: vague wording, missing APIs, missing data fields, unclear owners, missing H5 framework.
5. Write or update a requirement Markdown file in `docs/requirements/`.

## Section Hierarchy and Menu Inference

Tender Word documents often express product structure through numbered sections. The parser must understand hierarchy before splitting features.

Rules:

- A parent heading with several software child headings is a candidate menu group or first-level menu.
- Child headings with independent descriptions, fields, pages, operations, or acceptance criteria are candidate second-level menus or standalone feature modules.
- Example pattern: `1.3.2.2 师生管理` with children `1.3.2.2.1 学生管理`, `1.3.2.2.2 教职工管理`, `1.3.2.2.3 历史学生管理` usually means `师生管理` is a parent menu/group, and the three children are independent menu pages or feature modules.
- Do not blindly convert every section into a menu. If the child section only describes a tab, field group, report area, operation step, or shared rule, record it as page structure or function detail under the parent instead.
- If a parent heading has no independent page content but only groups child functions, mark it as `菜单分组` or `一级菜单候选`.
- If a child heading has independent CRUD/search/detail/import/export/audit/status rules, mark it as `二级菜单候选` and an independent feature.
- If the hierarchy is ambiguous, keep the relationship and add `待确认: 是否作为菜单`.

For each backend/admin feature inferred from headings, record:

```text
章节层级:
父级章节:
子级章节:
菜单推断:
菜单层级:
菜单名称:
是否独立功能:
推断依据:
待确认:
```

## Output Structure

Use this structure unless the user asks otherwise:

```markdown
# <项目名>标书软件需求拆解

## 来源
## 解析范围
## 不纳入本次软件开发范围
## 可参考素材
## 总体目标
## 需求分组
## H5/移动端需求
## 后管（学校端）需求
## 后管（管理端）需求
## 接口与数据对接需求
## PAM/人员与设备协同管理需求
## 数据对象初稿
## 权限与角色
## 验收标准
## 待确认问题
## 后续落地建议
```

For each feature group, include:

```text
编号:
名称:
来源:
章节层级:
父级功能/菜单:
子功能/子菜单:
用户/角色:
功能说明:
主要字段/数据:
接口/对接:
菜单推断:
验收标准:
风险/待确认:
当前框架落点:
参考素材:
```

## Snowy Placement Rules

- Admin backend pages usually map to existing Snowy admin frontend and backend plugin modules under `project/`.
- General business admin features usually start from `biz` or `dev` module patterns.
- System user, role, menu, permissions, logs, and organization features usually reuse `sys` and `dev` capabilities.
- Banner/轮播图-like needs should check `project/docs/patterns/feature-capability-map.md` first.
- H5/mobile user-facing pages stay as requirements until the user provides an H5 framework.

## Quality Gates

Before finishing:

- Confirm hardware-only content was excluded.
- Confirm H5/mobile content was not silently dropped.
- Confirm source document names are listed.
- Confirm extracted diagrams, screenshots, and attachments are listed as reference assets.
- Confirm requirement output is UTF-8 Chinese.
- Confirm existing requirement files were not overwritten unless explicitly requested.
- If new reusable tender parsing rules emerge, update this skill.
