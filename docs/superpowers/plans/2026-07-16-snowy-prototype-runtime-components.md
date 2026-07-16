# Snowy 原型 Demo 运行时组件化实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将完整 Snowy 原型 Demo 改为可直接双击运行的多文件 Vue 组件应用。

**Architecture:** 使用经典脚本将预设组件注册到全局注册表；根应用提供共享响应式上下文，组件通过 `inject` 复用原有字段和动作。原始 Demo 金标只用于回归，不参与运行。

**Tech Stack:** Vue 3 global build、Ant Design Vue CDN、经典 JavaScript、CSS、Node test、Python validator。

## Global Constraints

- 保留原始 Demo 内容、样式和交互。
- `file://` 直接打开，不依赖服务器和 ES Module。
- 现有组件优先复用；缺失组件参考 Snowy 框架与 Demo 扩展并登记。
- `project/h5/` 不在本次修改范围。

---

### Task 1: 入口组件引用契约

**Files:**
- Modify: `.codex/skills/snowy-admin-prototype-designer/tests/test_original_component_build.mjs`
- Modify: `.codex/skills/snowy-admin-prototype-designer/tests/test_validate_admin_prototype.py`

**Interfaces:**
- Produces: 对外部 CSS、组件脚本、状态脚本和轻量入口的自动校验。

- [ ] 先写入口仍内嵌完整 Demo 时失败的测试。
- [ ] 运行测试并确认因缺少运行时组件引用而失败。

### Task 2: 拆分原始样式与运行时

**Files:**
- Create: `assets/prototype-demo-framework/styles/snowy-prototype.css`
- Create: `assets/prototype-demo-framework/app/prototype-data.js`
- Create: `assets/prototype-demo-framework/app/prototype-state.js`

**Interfaces:**
- Produces: `window.SnowyPrototypeData` 和 `window.createSnowyPrototypeContext()`。

- [ ] 原样迁移样式。
- [ ] 拆分示例数据与共享状态。
- [ ] 保留上传、CRUD、页面需求和标注行为。

### Task 3: 注册预设 Vue 组件

**Files:**
- Create: `assets/prototype-demo-framework/components/*.js`
- Create: `assets/prototype-demo-framework/components/registry.js`

**Interfaces:**
- Consumes: `window.SnowyPrototypeComponents`、根应用提供的 `snowyPrototypeContext`。
- Produces: `registerSnowyPrototypeComponents(app)`。

- [ ] 将原始模板按页面和交互边界拆成预设组件。
- [ ] 每个组件使用原始模板结构和样式类。
- [ ] 在注册表登记所有组件。

### Task 4: 建立轻量入口

**Files:**
- Modify: `assets/prototype-demo-framework/index.html`
- Create: `assets/prototype-demo-framework/app/main.js`

**Interfaces:**
- Consumes: 数据、组件注册表和共享状态工厂。
- Produces: 可双击启动的 Vue 应用。

- [ ] 入口只保留挂载节点和依赖引用。
- [ ] 按依赖顺序加载经典脚本。
- [ ] 创建根应用、提供上下文、注册组件并挂载。

### Task 5: 工作流与校验

**Files:**
- Modify: `.codex/skills/snowy-admin-prototype-designer/SKILL.md`
- Modify: `.codex/workflows/admin-prototype-design-workflow.md`
- Modify: `.codex/skills/snowy-admin-prototype-designer/references/prototype-acceptance-checklist.md`
- Modify: `.codex/skills/snowy-admin-prototype-designer/scripts/validate_admin_prototype.py`
- Modify: `AGENTS.md`
- Modify: `PROJECT_WORKFLOW.md`
- Modify: `PROJECT_WORKFLOW.png`

**Interfaces:**
- Produces: 预设组件优先、缺失组件扩展和登记的工作流门禁。

- [ ] 更新组件使用规则和扩展规则。
- [ ] 校验外部组件引用、入口体积和禁止重新内嵌实现。
- [ ] 运行 Node、Python、编码及 Git 差异检查。

