# 通用 Codex 工作流索引

本目录只维护项目流程，不写死具体业务需求。业务目标、角色、核心链路和质量重点应放在 `docs/requirements/` 下的需求文档中；现有框架结构、目录映射和开发规范应放在 `project/docs/` 下的框架文档中。

## 主流程

- `multi-agent-sdlc.md`：从需求读取、产品设计、UI 设计、技术设计、开发、测试、审查、发布到验收复盘的通用多 Agent 流程。
- `auto-dispatch-parallel-development.md`：自动拆解 feature slice、分配 Agent、生成依赖图、并行开发、集成和质量门禁的通用流程。
- `git-submit-workflow.md`：开发完成后，由 Git Agent 执行 branch、commit、push、PR 的通用提交流程。

## 使用方式

1. Orchestrator 先读取 `docs/requirements/` 下的全部需求文档。
2. Orchestrator 再读取 `project/docs/` 下的全部框架文档，确认本次开发基于现有 `project/` 框架增量扩展。
3. 各角色 Agent 基于需求集合和框架文档，再套用通用流程。
4. 工作流只约束阶段、产物、门禁和协作规则。
5. 业务判断、页面范围、技术栈命令和风险重点来自需求文档、框架文档或项目实际代码。

## 相关文件

- `.codex/agents/*.md`
- `.codex/checklists/`
- `docs/requirements/`
- `project/docs/`
- `.github/workflows/`
