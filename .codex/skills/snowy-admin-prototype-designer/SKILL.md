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

3. Create the page blueprint before writing HTML.
   Use `references/page-blueprint-template.md`. Every independent page must have its own query fields, table fields, detail fields, create fields, edit fields, actions, states, permissions, display semantics, and click behavior.

4. Generate the HTML from the bundled demo template.
   Copy `assets/prototype-demo-framework/index.html` to `docs/design/<requirement-id>-admin-low-fidelity.html`, then replace title, logo, menus, fields, data, drawers, modals, and interactions according to the blueprint.

5. Generate or embed the coverage matrix.
   Use `references/prototype-acceptance-checklist.md`. A row marked `已覆盖` must map to the blueprint and to concrete HTML UI or behavior.

6. Run validation.
   Run `python scripts/validate_admin_prototype.py <html-file>` and fix any `FAIL`. Treat `WARN` as review items; do not proceed if warnings indicate generic CRUD, missing blueprint, or fake coverage. For the bundled template itself, run `python scripts/validate_admin_prototype.py --template assets/prototype-demo-framework/index.html`.

## Hard Rules

- Do not generate admin prototypes from blank HTML or generic admin templates.
- Do not use one universal table, universal drawer, universal field array, or universal `currentConfig` to stand in for multiple business pages.
- Do not let different pages share the same `标题/名称、状态、排序、备注` form unless the requirement explicitly says those are the fields.
- Do not mark a requirement `已覆盖` unless the HTML contains the page, field, action, state, or interaction named by the blueprint.
- Do not put developer-facing notes in visible business UI: no `mock`, `s-table`, `xn-*`, `hasPerm`, `toolConfig`, selector names, event names, or workflow explanations.
- If H5/mobile is involved, output a separate H5 prototype file. This skill only governs the admin prototype.

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
