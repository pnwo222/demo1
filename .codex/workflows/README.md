# 通用 Codex 工作流索引

本目录只维护项目流程，不写死具体业务需求。业务目标、角色、核心链路和质量重点应放在 `docs/requirements/` 下的需求文档中；现有框架结构、目录映射和开发规范应放在 `project/docs/` 下的框架文档中。

## 主流程

- `multi-agent-sdlc.md`：从需求读取、产品设计、UI 设计、技术设计、开发、测试、审查、发布到验收复盘的通用多 Agent 流程。
- `auto-dispatch-parallel-development.md`：自动拆解 feature slice、分配 Agent、生成依赖图、并行开发、集成和质量门禁的通用流程。
- `git-submit-workflow.md`：开发完成后，由 Git Agent 执行 branch、commit、push、PR 的通用提交流程。

## 使用方式

1. 用户输入“完成/开发/实现/新增/修复/优化 + 某功能”时，Orchestrator 必须先进入本工作流，不得直接编码。
2. Orchestrator 先读取 `docs/requirements/` 下的全部需求文档。
3. Orchestrator 再读取 `project/docs/` 下的全部框架文档，确认本次开发基于现有 `project/` 框架增量扩展。
4. 首次执行项目工作流前，Orchestrator 使用 `.codex/skills/snowy-framework-bootstrap` 输出框架运行提示，请开发者自行确认前后端具备运行条件；默认不自动安装、构建、启动或校验环境。
5. 开发者未确认前后端可运行前，状态为 `blocked_until_developer_confirmed_ready`，不得进入 PRD/UI/技术设计或开发阶段。
6. 开发者确认可运行后，各角色 Agent 基于需求集合和框架文档，再套用通用流程。
7. PRD 和 UI 设计是可跳过决策点；用户明确说“跳过 PRD”“无需 PRD”“跳过 UI”“无需设计”“直接进入技术方案/开发”时，Orchestrator 记录跳过项和原因。
8. 跳过 PRD 或 UI 时，仍必须保留最小需求说明、范围、验收标准、风险记录和 Snowy 现有 UI/技术约束。
9. 只有用户明确说“跳过工作流”“直接改代码”“无需 PRD/设计/技术方案”时，才允许跳过整个前置工作流。
10. 工作流只约束阶段、产物、门禁和协作规则。
11. 业务判断、页面范围、技术栈命令和风险重点来自需求文档、框架文档或项目实际代码。

## 相关文件

- `.codex/agents/*.md`
- `.codex/checklists/`
- `.codex/skills/snowy-framework-bootstrap/`
- `docs/requirements/`
- `project/docs/`
- `.github/workflows/`
