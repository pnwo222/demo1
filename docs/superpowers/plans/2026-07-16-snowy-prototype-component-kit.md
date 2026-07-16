# Snowy 原型组件套件实施计划

> **For agentic workers:** 本计划在当前会话内按 TDD 顺序执行；不得为 Product 原型创建 worktree 或使用开发型 subagent 流程。

**目标：** 将单体 Snowy 原型 Demo 改造成组件注册、显式页面 Schema、固定标注运行时和单 HTML 构建器组成的组件套件。

**架构：** 源文件位于 Demo 的 `src/`，构建器读取模板、CSS、组件运行时、标注运行时和页面 Schema，验证后输出 `index.html`。Python 静态校验器同时检查构建清单和受保护组件源码。

**技术栈：** Node.js 标准库、Vue 3 CDN、Ant Design Vue CDN、Python unittest。

## 全局约束

- 输出必须是 UTF-8 单 HTML。
- 每个业务字段显式声明组件，不做字段名猜测。
- 已注册组件必须复用；缺失组件先扩展并注册。
- 标注运行时不可由业务 Schema 覆盖。
- 不修改未跟踪的 `project/h5/`。

### 任务 1：组件注册表与 Schema 校验

**文件：**
- 新建 `assets/prototype-demo-framework/src/component-registry.js`
- 新建 `assets/prototype-demo-framework/src/schema-validator.js`
- 新建 `tests/test_component_kit.mjs`

**产出接口：** `createComponentRegistry()`、`validatePrototypeSchema(schema, registry)`。

- [ ] 先写未知组件、缺少组件声明、重复页面 ID 和合法 Schema 测试并确认失败。
- [ ] 实现组件清单与 Schema 校验。
- [ ] 运行 Node 测试并确认通过。

### 任务 2：Snowy 页面组件和字段组件

**文件：**
- 新建 `src/snowy-components.js`
- 新建 `src/snowy-core.css`
- 新建 `src/demo-schema.js`

**产出接口：** `createSnowyComponents(Vue, antd)` 和 `snowyDemoSchema`。

- [ ] 先写组件名称、禁止原生上传和 Demo Schema 字段组件覆盖测试并确认失败。
- [ ] 实现外壳、查询、表格、抽屉、上传、状态和展示组件。
- [ ] 用显式 Demo Schema 覆盖标准 CRUD、树形页面和组件示例。
- [ ] 运行测试并确认通过。

### 任务 3：固定标注运行时

**文件：**
- 新建 `src/annotation-runtime.js`
- 新建 `src/annotation.css`

**产出接口：** `createSnowyAnnotationComponent(Vue, antd, dayjs)`。

- [ ] 先写标注组件注册、持久化、页面需求和另存为源码契约测试并确认失败。
- [ ] 抽离标注工具栏、节点选择、评论输入、气泡、详情编辑和本地持久化。
- [ ] 运行测试并确认通过。

### 任务 4：单 HTML 构建器

**文件：**
- 新建 `src/shell.html`
- 新建 `build-prototype.mjs`
- 生成 `index.html`

**产出接口：** `buildPrototype({ schemaPath, outputPath })`。

- [ ] 先写构建输出、组件清单、无本地资源引用和 UTF-8 测试并确认失败。
- [ ] 实现模板注入、源码边界、清单和 Schema 内联。
- [ ] 构建 Demo 并运行测试。

### 任务 5：工作流和校验器切换

**文件：**
- 修改 `SKILL.md`
- 修改 `admin-prototype-design-workflow.md`
- 修改 `validate_admin_prototype.py`
- 修改 `AGENTS.md`、`PROJECT_WORKFLOW.md`、`PROJECT_WORKFLOW.png`

- [ ] 增加“先生成 Schema，再执行构建器”的硬门禁。
- [ ] 校验构建清单、组件源码边界、未知组件和禁止模式。
- [ ] 运行 Python/Node 正反例测试、Demo 构建和流程图导出。
