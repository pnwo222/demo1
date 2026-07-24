# 通用 Codex 工作流索引

本目录只维护项目流程，不写死具体业务需求。业务目标、角色、核心链路和质量重点应放在 `docs/requirements/` 下的需求文档中；现有框架结构、目录映射和开发规范应放在 `project/docs/` 下的框架文档中。

## 主流程

- `multi-agent-sdlc.md`：从需求读取、产品设计、UI 设计、技术设计、开发、测试、审查、发布到验收复盘的通用多 Agent 流程。
- `admin-prototype-design-workflow.md`：Snowy 后管拟真原型设计流程，约束后管低保真 HTML 原型必须按现有框架布局、CRUD 形式、菜单、权限和状态设计。
- `auto-dispatch-parallel-development.md`：自动拆解 feature slice、分配 Agent、生成依赖图、并行开发、集成和质量门禁的通用流程。
- `git-submit-workflow.md`：开发完成后，由 Git Agent 执行 branch、commit、push、PR 的通用提交流程。

## 使用方式

1. 用户输入“完成/开发/实现/新增/修复/优化 + 某功能”时，Orchestrator 必须先进入本工作流，不得直接编码。
2. Orchestrator 先读取 `docs/requirements/` 下的全部需求文档。
3. Orchestrator 再读取 `project/docs/` 下的全部框架文档，并读取 `docs/workflow/status.md` 全局状态，确认本次开发基于现有 `project/` 框架增量扩展。
4. 环境自检由每个开发者在被 Git 忽略的 `docs/workflow/local-environment-status.md` 记录；项目需求索引写入 `docs/workflow/status.md`，每个需求状态写入 `docs/workflow/requirements/<需求ID>.md`。
5. 首次执行项目工作流前，Orchestrator 使用 `.codex/skills/snowy-framework-bootstrap` 输出框架运行提示，请开发者自行确认前后端具备运行条件；默认不自动安装、构建、启动或校验环境。
6. 开发环境清单未确认前，`docs/workflow/local-environment-status.md` 本机状态为 `blocked_until_developer_confirmed_ready` 或对应阻塞状态，任何需求不得进入 PRD/UI/技术设计或开发阶段。
7. 开发者回复“前后端已确认可运行”或等价表达后，Orchestrator 仍必须补齐 Git、Node.js、npm、前端依赖、JDK 17、Maven、IDEA、MySQL CLI、MySQL 服务、Redis 服务检测；满足后更新 `docs/workflow/local-environment-status.md` 为 `developer_confirmed_ready`。如果存在阻塞项，记录对应阻塞状态并停在开发环境检测阶段；后续新需求不重复要求环境自检，除非依赖、配置、CLI 或运行状态变化。
8. 开发者确认可运行后，各角色 Agent 基于需求集合、框架文档和当前需求状态文件，再套用通用流程。
9. PRD 和 UI 设计是可跳过决策点；用户明确说“跳过 PRD”“无需 PRD”“跳过 UI”“无需设计”“直接进入技术方案/开发”时，Orchestrator 记录跳过项和原因。
10. 跳过 PRD 或 UI 时，仍必须保留最小需求说明、范围、验收标准、风险记录和 Snowy 现有 UI/技术约束。
11. 所有需要开发者确认的节点，优先使用可点击选择项；不支持选择控件时，输出编号选项并允许自由输入。
12. 只有用户明确说“跳过工作流”“直接改代码”“无需 PRD/设计/技术方案”时，才允许跳过整个前置工作流。
13. 工作流只约束阶段、产物、门禁和协作规则。
14. 业务判断、页面范围、技术栈命令和风险重点来自需求文档、框架文档或项目实际代码。
15. 工作流中凡需要绘制流程图、架构图、模块图、ERD、状态机图、时序图、任务图、DAG、依赖图或其他系统可视化，必须优先使用本项目 `.codex/skills/` 中来自 `Agents365-ai/365-skills` 的图形 skills：默认使用 `.codex/skills/mermaid-skill`；需要可编辑 Draw.io、复杂样式、泳道、厂商图标或精细布局时使用 `.codex/skills/drawio-skill`；需要 PlantUML/UML 语义时使用 `.codex/skills/plantuml-skill`；需要手绘白板风格时使用 `.codex/skills/excalidraw-skill`。使用前必须读取对应 `SKILL.md`，并按 skill 要求完成校验和导出。
16. 分支确认后必须选择“创建新需求”或“恢复已有需求”。恢复需求读取既有状态、集成分支和未完成任务，不重复创建需求。
17. 并行开发任务使用 `docs/workflow/tasks/<需求ID>/<任务ID>.md`。任务负责人只维护自己的任务文件；Integration Owner 单独维护需求汇总、全局索引和产物导航。
18. Owner 日常集成运行 `scripts/integrate-task.ps1`，不要求再次调用 AI；冲突、契约变化、业务歧义和高风险判断再交给 AI/人工处理。

## 相关文件

- `.codex/agents/*.md`
- `.codex/checklists/`
- `.codex/skills/snowy-framework-bootstrap/`
- `.codex/skills/mermaid-skill/`
- `.codex/skills/drawio-skill/`
- `.codex/skills/plantuml-skill/`
- `.codex/skills/excalidraw-skill/`
- `docs/requirements/`
- `docs/workflow/status.md`
- `docs/workflow/requirements/`
- `docs/workflow/tasks/`
- `scripts/workflow_task.py`
- `scripts/integrate-task.ps1`
- `project/docs/`
- `.github/workflows/`
