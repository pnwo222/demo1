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
- Open the runtime Demo entry at `assets/prototype-demo-framework/index.html` and read its referenced files.
- Treat `assets/prototype-demo-framework/golden/original-demo.html` as the immutable visual and functional baseline.
- Read `assets/prototype-demo-framework/components/README.md` and `component-manifest.json`; reuse the imported runtime Vue components instead of recreating Snowy UI or annotation behavior.

## Workflow

1. Build the framework reference list.
   Include matched Snowy files, CRUD form, table pattern, drawer/modal pattern, permission pattern, and status pattern.

2. Build the menu and page map.
   For each independent page, record menu path, route path, permission code, visible roles, page type, and source requirement id.

3. Create and validate the page blueprint before writing HTML.
   Use `references/page-blueprint-template.md`. Every independent page must have its own source requirement excerpt, atomic requirement list, query fields, table fields, detail fields, create fields, edit fields, actions, states, permissions, display semantics, click behavior, and field source notes. Do not compress original requirements into vague phrases.

4. Generate a multi-file prototype directory from the runtime component set.
   Run `node assets/prototype-demo-framework/build-prototype.mjs <output-directory>` and modify the copied data and page components. `index.html` remains a lightweight entry that imports CSS, state and Vue component scripts. Reuse matching files under `components/` for the Snowy shell, query form, table, upload, drawers, modals, component presets and annotation system. Update the copied `prototype-contract.json` from the validated blueprint; every page contract declares its activation/root selectors, complete query fields and control types, table fields, toolbar actions, pagination, Demo layout metrics, and concrete automatic-annotation target/marker selectors.

5. Generate or embed the coverage matrix.
   Use `references/prototype-acceptance-checklist.md`. A row marked `已覆盖` must map to the blueprint and to concrete HTML UI or behavior.

6. Run validation.
   First run `python scripts/validate_admin_blueprint.py <blueprint.md>`. Then run `python scripts/validate_admin_prototype.py <prototype-directory>/index.html`. Finally run `node scripts/runtime_check_admin_prototype.mjs <prototype-directory>/index.html <screenshot-directory>`. Static validation compares protected files with the canonical Demo manifest, rejects dead imports, field slicing and universal page engines, and validates `prototype-contract.json`. Runtime validation checks every declared page's visible fields, semantic controls, toolbar, pagination, layout metrics and automatic annotation bindings, then writes per-page screenshots and `runtime-validation.json` for auditable visual review. For the bundled Demo itself, add `--template` to the static validator.

## Hard Rules

- Do not generate admin prototypes from blank HTML, generic admin templates, or the previous simplified Schema renderer.
- Preserve the original Demo's full content and capabilities: all menu levels, Banner CRUD, menu resources, component preset page, field display types, uploads, drawers, modals and complete annotation workflow.
- Reuse the imported runtime components. Existing components must not be redrawn with different classes, spacing, controls, wording or reduced interactions.
- Importing or registering a component is not reuse unless it is reachable from `app/main.js` and rendered by the page. Protected CSS and components must match the canonical Demo manifest, not a manifest regenerated inside the output directory. `refresh-component-manifest.mjs` may register extensions, but it cannot authorize changes to protected files.
- If a required component does not exist, choose or compose from the matching Snowy framework page, the closest Demo component, or official Ant Design Vue components. Only create a standalone component when those sources cannot satisfy the requirement. Add new components to `components/registry.js`, load them from `index.html`, update `components/README.md`, run `refresh-component-manifest.mjs <prototype-directory>`, and add static/runtime checks.
- The original Demo golden file is immutable. The runtime component directory must preserve the same capabilities and equivalent browser rendering while keeping `index.html` free of the full inline implementation.
- Automatic annotations must bind to the concrete field, table column, button, status, drawer field, or other requirement node they explain. Never bind every automatic annotation on a page to one shared container such as `query-card` merely to make markers visible.
- Components may be reused, but every business page must independently preserve all requirement fields and operations. Component reuse must not turn different pages into one shortened universal CRUD.
- Never truncate blueprint fields with `slice`, maximum-column shortcuts, or viewport-driven omission. Use horizontal table scrolling, query expand/collapse and column settings while keeping the complete field contract.
- Do not let different pages share the same `标题/名称、状态、排序、备注` form unless the requirement explicitly says those are the fields.
- Do not replace explicit requirement fields with summary phrases such as `多条件筛选`, `等状态`, `相关字段`, `已列出`, `同新增`, or `与上一页一致`.
- Do not add create, edit, delete, import, export, audit, or authorization operations only because Snowy supports them. Every operation must be marked as `需求明确`, `框架惯例`, or `待确认`; risky or data-changing operations need explicit requirement support or a `待确认` note.
- Do not mark a requirement `已覆盖` unless the HTML contains the page, field, action, state, or interaction named by the blueprint.
- Every generated page must have a `prototype-contract.json` entry. A field or annotation is not covered until the runtime validator finds its concrete visible control/header/marker on that page.
- Do not use broad coverage rows such as `ADM-S-001~020` as proof of coverage. Each independent page needs its own coverage row.
- Do not put developer-facing notes in visible business UI: no `mock`, `s-table`, `xn-*`, `hasPerm`, `toolConfig`, selector names, event names, or workflow explanations.
- If H5/mobile is involved, output a separate H5 prototype file. This skill only governs the admin prototype.
- Demo annotations are examples only. When generating a real prototype, annotation numbers and notes must be extracted from the current requirements, PRD, tender text, or validated page blueprint. Do not copy demo-specific rules such as "7-day date range", "published/pending/offline status", upload size, or menu examples unless the current requirement explicitly states them or they are marked as `待确认`.
- Annotate only important or special requirement points: constraints, enumerations, status meanings, sensitive data handling, permission differences, risky operations, validation rules, exception states, and business rules that are easy to misunderstand. Do not annotate generic regions such as "filter area", "table area", or "operation area" unless the note contains a concrete requirement rule.
- If annotation/comment mode is enabled, it must support selecting a concrete UI node and adding a comment near that node, similar to Codex browser comments. Hovering a commentable node should highlight it before selection; clicking selects the node and opens the nearby comment input; after saving, a numbered marker must appear on or near that node and the saved comment must be added to the current page annotation list for review. Numbered markers must not cover the annotated text or control; render them through a page-level overlay/fixed positioning so parent `overflow` or table clipping cannot hide the marker, and auto-avoid the viewport edge.
- The hover/selection highlight must remain a separate fixed overlay instead of mutating the target element. Use a clearly visible 3px blue border with a translucent blue fill; the selected state may use a slightly stronger fill and halo without changing page layout.
- Annotation scope must be explicit. Use `global` for the persistent shell such as the logo, sidebar menu, header and tabs; use `page:<page-id>` for page content and business drawers/modals opened by that page. On every page switch, clear hover/selection/draft overlays before restoring only `global` plus the new page scope. A page-scoped marker must never appear on another page, while a global marker must remain visible exactly once across page switches.
- Annotation event capture must cover the complete prototype application, not only the page content container. Sidebar menus, headers, tabs, business drawers and business modals must be commentable. Exclude only the annotation toolbar/composer/editor and transient Ant Design utility overlays. Prefer stable `data-annotation-key` anchors; do not use an unscoped `nth-of-type` selector as node identity when pages reuse the same DOM structure.
- Annotation mode must behave like a DOM inspector: every rendered DOM element is selectable, including layout containers, SVG nodes, `page-content`, page roots, query/table cards and teleported drawer/modal descendants. Do not use a tag/class allowlist; exclude only the annotation system's own toolbar, bubbles, outlines, composer and editor. Apply the annotation cursor at `body` level so Teleport content inherits it.
- While annotation mode is active, capture and cancel business `pointerdown`, `mousedown`, `pointerup`, `mouseup`, `click`, `dblclick` and `contextmenu` effects before component handlers run; hovering remains available for node inspection and the captured click is used only to select an annotation target. Selects, links, switches, uploads, menus, drawers and business buttons must not execute their normal behavior. Pressing `Escape` cancels any draft and exits annotation mode.
- The expanded annotation toolbar has no separate “标注模式” label. Its four actions are “开启标注/正在标注”, “页面需求”, “另存为” and “全部删除”; they render as borderless 19px icon-only buttons by default and reveal their labels only while hovered or keyboard-focused, except for the active annotation action which stays expanded.
- The expanded toolbar is fully content-sized without a forced minimum width. Keep the collapse control visually separate from the tightly spaced action group, and add a second subtle divider before the destructive “全部删除” action; do not stretch the action group or leave empty input-like space. When annotation mode is active, the first action reads “正在标注” and remains expanded with icon and text until the mode exits. The toolbar must opt out of the annotation bubble cursor: toolbar chrome uses the normal default cursor and actionable buttons use the normal pointer cursor.
- The Snowy desktop sidebar remains fixed to the left viewport while the main page scrolls. Use `position: fixed`, `height: 100vh` and independent vertical overflow; offset the sibling content layout by the live expanded/collapsed sidebar width (`232px`/`80px`) so the fixed menu never covers or shifts content unexpectedly.
- Annotation content inputs must use multiline textarea controls. The quick node-comment textarea auto-grows within a bounded row range, Enter inserts a newline instead of submitting, and the explicit send button submits only non-empty content. Create/edit annotation content fields must also preserve line breaks in both edit and preview states.
- Annotation additions, edits, deletions, and node bindings must persist locally after every confirmed operation so a refresh does not lose work; “另存为” must also embed the latest state into the exported HTML. Keep an immutable baseline for automatically generated annotations: deleting a user-created annotation removes it, deleting a user modification of an automatic annotation restores the baseline, and deleting an unchanged automatic annotation only hides the local copy without destroying the baseline.
- Every prototype page must provide a `页面需求` entry in the top annotation toolbar. It opens a right-side drawer that previews the page's overall requirement description by default, derived from the validated page blueprint rather than generic Demo wording. Match the annotation detail interaction: hovering the content reveals an edit icon, and only clicking that icon switches to an editable textarea. Show Save only after the content changes; canceling edit restores the previous text. Store descriptions independently by page, persist confirmed edits locally, and embed them in “另存为” HTML. Do not render a bottom `annotation-card` or a visible requirement-description list inside the business page.
- Treat the Demo component preset page as a reference library, not as required business navigation. Reuse its upload, image, status, switch, badge, progress, attachment, avatar, tree, and action patterns only when the current blueprint needs them; remove the preset menu/page from real prototypes unless the requirement explicitly asks for a component showcase.

## Large Scope Performance Rules

- Product documents and prototypes are not code-development tasks. Generate or revise the blueprint and HTML prototype directly in the current Product run. This project does not use Superpowers or its execution modes. Do not create Product-stage worktrees, split pages into Task 1/2/3 Owner execution, or run a separate review Agent after every intermediate file solely to generate PRD, blueprint, and prototype artifacts.
- Read and normalize the requirement set once per Product run. Reuse an already accepted requirement baseline, PRD, and blueprint when their source requirements have not changed; regenerate only changed pages and their coverage rows.
- For more than 10 independent admin pages, batch page-blueprint/business-configuration work by module. Batches may run independently only when they write separate files or structured fragments. One owner must assemble the shared HTML template so parallel Agents never edit the same monolithic HTML.
- Use one requirement/blueprint quality review before HTML generation and one final prototype review after static/runtime validation. Add another repair/review cycle only when a concrete `FAIL`, P0, or P1 finding exists; do not repeat full reviews after harmless warnings.
- Strict coverage is unchanged: batching and reuse reduce repeated reading and rewriting, but may not omit fields, actions, states, permissions, exceptions, node bindings, or page-level coverage rows.

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
