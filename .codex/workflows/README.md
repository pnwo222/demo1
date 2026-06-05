# 通用 Codex 工作流索引

本目录只维护项目流程，不写死具体业务需求。业务目标、角色、核心链路、技术栈和质量重点应放在 `docs/requirements/` 下的需求文档中。

## 主流程

- `multi-agent-sdlc.md`：从需求读取、产品设计、UI 设计、技术设计、开发、测试、审查、发布到验收复盘的通用多 Agent 流程。
- `auto-dispatch-parallel-development.md`：自动拆解 feature slice、分配 Agent、生成依赖图、并行开发、集成和质量门禁的通用流程。
- `git-submit-workflow.md`：开发完成后，由 Git Agent 执行 branch、commit、push、PR 的通用提交流程。

## 使用方式

1. Orchestrator 先读取 `docs/requirements/` 下的全部需求文档。
2. 各角色 Agent 基于需求集合，再套用通用流程。
3. 工作流只约束阶段、产物、门禁和协作规则。
4. 业务判断、页面范围、技术栈命令和风险重点来自需求文档或项目实际代码。

## 相关文件

- `.codex/agents/`
- `.codex/checklists/`
- `docs/requirements/`
- `.github/workflows/`
