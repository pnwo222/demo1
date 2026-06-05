# AGENTS.md

本仓库采用“需求文档独立、工作流通用”的协作方式。

Agent 和 workflow 不应写死具体业务需求。具体项目需求应放在 `docs/requirements/` 下。执行任何阶段前，Orchestrator 必须读取该目录下的全部需求文档，并将需求集合注入到对应角色任务中。

## 协作原则

- 修改项目之前，先阅读本文件、`.codex/workflows/`、相关 `.codex/agents/` 角色说明，以及 `docs/requirements/` 下的全部需求文档。
- 不直接在主分支上开发，功能改动使用独立 branch 或 worktree。
- 不让开发 Agent 自己给自己放行，必须经过 Review、CI 和人工审批。
- 需求、业务规则、数据规则、权限规则不清时，不直接进入代码开发。
- 前端优先复用现有组件、路由、状态管理和样式规范。
- 后端优先遵循现有分层架构、接口规范、异常处理和事务规范。
- 涉及资金、权限、状态机、库存或资源、用户数据、删除和批量操作的改动必须重点审查。
- 所有功能都必须有验收标准、测试结果和残余风险说明。

## 通用 Agent 分工

| Agent | 职责 |
| --- | --- |
| Orchestrator Agent | 总控调度、读取需求、阶段门禁、产物检查、下一步推进 |
| Product Agent | PRD、用户故事、业务规则、验收标准、HTML PRD、可交互低保真 HTML 原型 |
| Design Agent | UI/UX、Figma 可落地设计稿、素材策略、Ready for Dev/Handoff、设计系统 |
| Architect Agent | 架构、模块边界、接口契约、数据模型、安全模型、可运维性 |
| Data Agent | 数据模型、migration、索引、数据一致性、回滚 |
| Frontend Agent | 前端页面、组件、路由、状态管理、适配和交互 |
| Backend Agent | 后端 API、业务逻辑、权限、事务一致性、后端测试 |
| QA Agent | 测试计划、主链路、异常场景、权限和回归测试 |
| Security Agent | 越权、敏感数据、接口滥用、依赖、密钥和高风险链路安全 |
| DevOps Agent | CI/CD、环境变量、灰度、监控、告警、回滚 |
| Reviewer Agent | Bug、安全、性能、可维护性、测试缺口审查 |
| Bug Reviewer | 真实缺陷、边界条件、兼容性、业务回归 |
| Performance Reviewer | 慢查询、重复请求、缓存、并发、前端性能 |
| Maintainability Reviewer | 复杂度、重复代码、模块边界和可维护性 |
| Release Agent | 发布说明、验收报告、灰度计划、发布后观察 |

## 标准开发流程

0. Orchestrator 先声明当前阶段、调用 Agent、输入、输出、验收标准和下一阶段。
1. Orchestrator 读取 `docs/requirements/` 下的全部需求文档。
2. Product Agent 基于需求生成 PRD、验收标准、HTML PRD 和可交互低保真 HTML 原型。
3. PRD 和低保真 HTML 原型确认后，Design Agent 建立设计系统，并连接 Figma 生成可落地设计稿。
4. Architect Agent 明确模块边界、状态机、API、数据模型、安全模型和可运维性。
5. Data Agent 细化数据库模型、migration、索引、回滚和数据一致性策略。
6. Orchestrator 按用户价值拆 feature slice。
7. Orchestrator 套用 `.codex/workflows/auto-dispatch-parallel-development.md`，生成任务图、依赖 DAG、并发 wave、owner 分配、branch/worktree 策略和集成策略。
8. Frontend、Backend、Data、QA 等 Agent 在独立 branch 或 worktree 并行开发。
9. 本地运行必要检查后提交 PR。
10. Reviewer、Security、QA Agent 做审查。
11. CI 运行 lint、typecheck、test、build、安全扫描等项目定义的质量门禁。
12. 人工负责人审批后合并。
13. 预发验证、灰度发布、全量发布。
14. 发布后监控核心指标和用户反馈。

## 通用 Definition of Done

一个功能完成必须满足：

- `docs/requirements/` 下的需求文档已全部读取，并在产物中列出已引用的需求来源。
- PRD 或需求说明已确认。
- HTML 版 PRD 已生成并可打开。
- 可交互低保真 HTML 原型已生成并可打开，主路径页面切换、关键按钮和核心状态可点击验证。
- 交互状态和适配要求已明确。
- 涉及 UI 时，Figma 正式设计稿已生成或更新，且包含 Ready for Dev 画板和 Handoff 标注。
- 技术方案已明确模块边界、接口、数据、安全和运维要求。
- 核心业务规则、权限规则、状态规则和数据一致性规则已写清。
- 代码实现遵循现有项目规范。
- 必要测试已补充并通过。
- CI 检查通过。
- Coverage 未低于主分支基线，或有明确风险接受记录。
- SAST、SCA、Secret Scan、DAST 按风险等级通过，或有明确风险接受记录。
- Review 中的 P0/P1 问题已修复。
- 涉及发布的变更有灰度和回滚方案。
- 验收标准逐条通过或记录未通过项。

## Orchestrator 阶段输出模板

每个阶段开始前，总控 Agent 必须先输出：

```text
当前阶段：
阶段目标：
调用 Agent：
输入材料：
预期输出：
验收标准：
是否需要用户确认：
下一阶段：
```

阶段完成后，总控 Agent 必须输出：

```text
阶段结果：
已生成产物：
未解决问题：
是否允许进入下一阶段：
下一步建议：
```

## 推荐质量门禁

具体命令由项目技术栈决定，通用门禁包括：

- Lint
- Typecheck
- Unit Test
- Integration Test
- E2E Test
- API Contract Test
- Build
- Coverage
- Migration 验证
- SAST
- SCA
- Secret Scan
- DAST
- 核心页面或主流程验证

## 审查优先级

- P0：资金错误、越权操作、重复扣款、重复高风险操作、核心数据损坏、生产不可用，必须修复。
- P1：影响主链路、核心体验、安全、数据一致性或发布质量的问题，合并前应修复。
- P2：体验、性能或可维护性改进，不一定阻塞上线。

## 目录说明

- `docs/requirements/`：独立业务需求文档。
- `.codex/agents/`：通用专业 Agent 配置。
- `.codex/workflows/`：通用多 Agent SDLC 工作流。
- `.codex/checklists/`：PR、发布、验收检查表。
- `.codex/skills/`：项目本地技能，已有内容不要随意删除。
