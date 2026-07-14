---
name: snowy-admin-prototype-designer
description: Use when creating, reviewing, or regenerating Snowy admin/backend/management low-fidelity HTML prototypes from requirements, tender decomposition, PRD, or minimum requirement notes.
---

# Snowy Admin Prototype Designer

## Overview

Generate Snowy-style admin low-fidelity HTML prototypes from requirements. The skill prevents "Demo shell + generic CRUD" outputs by requiring a page blueprint before HTML and validating that every covered requirement maps to concrete UI.

## Required Inputs

- Read all relevant `docs/requirements/**` files, PRD, tender decomposition, or minimum requirement notes.
- Read Snowy framework context through `snowy-framework-reader`, especially `project/docs/patterns/frontend-crud-pattern.md` and matching real pages under `project/snowy-admin-web/src/views/**`.
- Use the bundled demo template:
  `assets/prototype-demo-framework/index.html`

## Workflow

1. Build the framework reference list.
   Include matched Snowy files, CRUD form, table pattern, drawer/modal pattern, permission pattern, and status pattern.

2. Build the menu and page map.
   For each independent page, record menu path, route path, permission code, visible roles, page type, and source requirement id.

3. Create and validate the page blueprint before writing HTML.
   Use `references/page-blueprint-template.md`. Every independent page must have its own source requirement excerpt, atomic requirement list, query fields, table fields, detail fields, create fields, edit fields, actions, states, permissions, display semantics, click behavior, and field source notes. Do not compress original requirements into vague phrases.

4. Generate the HTML from the bundled demo template.
   Copy `assets/prototype-demo-framework/index.html` to `docs/design/<requirement-id>-admin-low-fidelity.html`, then replace title, logo, menus, fields, data, drawers, modals, and interactions according to the blueprint.

5. Generate or embed the coverage matrix.
   Use `references/prototype-acceptance-checklist.md`. A row marked `已覆盖` must map to the blueprint and to concrete HTML UI or behavior.

6. Run validation.
   First run `python scripts/validate_admin_blueprint.py <blueprint.md>` and fix any `FAIL`. Then run `python scripts/validate_admin_prototype.py <html-file>` and fix any `FAIL`. Treat `WARN` as review items; do not proceed if warnings indicate vague requirements, generic CRUD, missing blueprint, or fake coverage. For the bundled template itself, run `python scripts/validate_admin_prototype.py --template assets/prototype-demo-framework/index.html`.

## Hard Rules

- Do not generate admin prototypes from blank HTML or generic admin templates.
- Do not use one universal table, universal drawer, universal field array, or universal `currentConfig` to stand in for multiple business pages.
- Do not let different pages share the same `标题/名称、状态、排序、备注` form unless the requirement explicitly says those are the fields.
- Do not replace explicit requirement fields with summary phrases such as `多条件筛选`, `等状态`, `相关字段`, `已列出`, `同新增`, or `与上一页一致`.
- Do not add create, edit, delete, import, export, audit, or authorization operations only because Snowy supports them. Every operation must be marked as `需求明确`, `框架惯例`, or `待确认`; risky or data-changing operations need explicit requirement support or a `待确认` note.
- Do not mark a requirement `已覆盖` unless the HTML contains the page, field, action, state, or interaction named by the blueprint.
- Do not use broad coverage rows such as `ADM-S-001~020` as proof of coverage. Each independent page needs its own coverage row.
- Do not put developer-facing notes in visible business UI: no `mock`, `s-table`, `xn-*`, `hasPerm`, `toolConfig`, selector names, event names, or workflow explanations.
- If H5/mobile is involved, output a separate H5 prototype file. This skill only governs the admin prototype.
- Demo annotations are examples only. When generating a real prototype, annotation numbers and notes must be extracted from the current requirements, PRD, tender text, or validated page blueprint. Do not copy demo-specific rules such as "7-day date range", "published/pending/offline status", upload size, or menu examples unless the current requirement explicitly states them or they are marked as `待确认`.
- Annotate only important or special requirement points: constraints, enumerations, status meanings, sensitive data handling, permission differences, risky operations, validation rules, exception states, and business rules that are easy to misunderstand. Do not annotate generic regions such as "filter area", "table area", or "operation area" unless the note contains a concrete requirement rule.
- If annotation/comment mode is enabled, it must support selecting a concrete UI node and adding a comment near that node, similar to Codex browser comments. Hovering a commentable node should highlight it before selection; clicking selects the node and opens the nearby comment input; after saving, a numbered marker must appear on or near that node and the saved comment must be added to the current page annotation list for review. Numbered markers must not cover the annotated text or control; render them through a page-level overlay/fixed positioning so parent `overflow` or table clipping cannot hide the marker, and auto-avoid the viewport edge.
- Annotation content inputs must use multiline textarea controls. The quick node-comment textarea auto-grows within a bounded row range, Enter inserts a newline instead of submitting, and the explicit send button submits only non-empty content. Create/edit annotation content fields must also preserve line breaks in both edit and preview states.
- Annotation additions, edits, deletions, and node bindings must persist locally after every confirmed operation so a refresh does not lose work; “另存为” must also embed the latest state into the exported HTML. Keep an immutable baseline for automatically generated annotations: deleting a user-created annotation removes it, deleting a user modification of an automatic annotation restores the baseline, and deleting an unchanged automatic annotation only hides the local copy without destroying the baseline.
- Every prototype page must provide a `页面需求` entry in the top annotation toolbar. It opens a right-side drawer that previews the page's overall requirement description by default, derived from the validated page blueprint rather than generic Demo wording. Match the annotation detail interaction: hovering the content reveals an edit icon, and only clicking that icon switches to an editable textarea. Show Save only after the content changes; canceling edit restores the previous text. Store descriptions independently by page, persist confirmed edits locally, and embed them in “另存为” HTML. Do not render a bottom `annotation-card` or a visible requirement-description list inside the business page.
- Treat the Demo component preset page as a reference library, not as required business navigation. Reuse its upload, image, status, switch, badge, progress, attachment, avatar, tree, and action patterns only when the current blueprint needs them; remove the preset menu/page from real prototypes unless the requirement explicitly asks for a component showcase.

## Strict Blueprint Gate

Before writing HTML, the blueprint must pass these checks:

- Every page keeps the exact source excerpt or a faithful Chinese quote-length paraphrase under `原始需求摘录`.
- Every page decomposes requirements into atomic rows: `同步字段`, `展示字段`, `筛选字段`, `详情字段`, `状态字段`, `敏感字段`, `操作`, `异常`, and `权限`.
- Every query/table/detail/form/action item has a source tag: `需求明确`, `框架惯例`, or `待确认`.
- Read-only or synchronized pages default to `只读查询`; create/edit/delete/import/export are not allowed unless the requirement states them or they are explicitly marked `待确认`.
- Coverage matrix rows are page-level and field-level enough to trace back to the blueprint; grouped ranges and self-claimed coverage are invalid.

## Field Semantics

Render fields by meaning, not by raw text:

| Field Meaning | Required Shape |
| --- | --- |
| image, cover, avatar, icon | thumbnail, avatar, or empty image placeholder |
| upload | local choose, preview, remove |
| business status | tag/badge |
| enable/disable | switch |
| amount | right-aligned number |
| date/time | formatted datetime |
| sensitive id/phone | masked text |
| permission/scope | role, range, tree, or operation group |
| long text | ellipsis with detail drawer |
| file/attachment | file name, type, preview/download action |

## Interaction Contract

Every visible clickable element must do something matching its label:

- Query filters the current page data or displays an empty/error state.
- Reset clears query fields.
- Add opens the page-specific create drawer/modal.
- Edit opens the page-specific edit drawer/modal with current row data.
- Detail opens a read-only page-specific view.
- Delete removes the row after confirmation.
- Batch delete requires selected rows.
- Switch changes the current row state.
- Import opens upload modal and shows result feedback.
- Export opens direct export or approval flow according to data sensitivity.
- Pagination changes page state.
- Upload chooses local file/image, previews it, and supports removal.

## Output Summary

Use this summary after generation:

```text
后管原型:
蓝图:
框架参考:
菜单覆盖:
页面覆盖:
字段/交互覆盖:
覆盖矩阵:
校验结果:
未决问题:
是否允许进入下一阶段:
```
