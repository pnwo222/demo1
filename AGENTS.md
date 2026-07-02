# AGENTS.md

本仓库采用“需求文档独立、工作流通用”的协作方式。

Agent 和 workflow 不应写死具体业务需求。具体项目需求应放在 `docs/requirements/` 下。执行任何阶段前，Orchestrator 必须读取该目录下的全部需求文档，并将需求集合注入到对应角色任务中。

## 协作原则

- 用户输入“完成/开发/实现/新增/修复/优化 + 某功能”时，必须视为项目工作流入口，先由 Orchestrator 走简版 SDLC 流程，不得直接进入代码实现。
- PRD 和 UI 设计阶段可由开发者明确跳过。用户说“跳过 PRD”“无需 PRD”“跳过 UI”“无需设计”“直接进入技术方案/开发”等等价表达时，Orchestrator 必须记录跳过项和原因，然后进入下一合适阶段。
- 即使跳过 PRD 或 UI，也必须保留最小需求说明、范围、验收标准和风险记录；不得在业务规则、权限、数据或状态不清时直接编码。
- 只有用户明确说“跳过工作流”“直接改代码”“无需 PRD/设计/技术方案”时，才允许跳过整个前置工作流；跳过原因必须在回复中简短记录。
- 修改项目之前，先阅读本文件、`.codex/workflows/`、相关 `.codex/agents/*.md` 角色说明、`docs/requirements/` 下的全部需求文档，以及 `project/docs/` 下的框架说明和开发规范。
- 首次执行项目工作流前，必须使用 `.codex/skills/snowy-framework-bootstrap` 向开发者提示：请先确认当前 Snowy 框架能否在本机正常运行。默认不由 Agent 自动执行环境安装、构建、启动或校验脚本，除非用户明确要求；开发者未确认前后端可运行前，不进入 PRD/UI/技术设计或开发阶段。
- 工作流状态分为全局状态和需求状态：`docs/workflow/status.md` 只记录全局环境自检和需求工作项索引；每个需求或功能的阶段状态记录在 `docs/workflow/requirements/<需求ID>.md`。开发者回复“前后端已确认可运行”或等价表达后，Orchestrator 必须把全局框架运行自检状态更新为 `developer_confirmed_ready`，并记录确认来源和时间。PRD、UI、技术设计、开发、测试、审查、发布、验收等阶段进入、完成、跳过或阻塞时，必须更新对应需求状态文件。
- 后端启动前必须提示开发者确认 Java、MySQL、Redis 配置：Java 在 IDEA Project SDK、Modules SDK、Java Compiler、Maven importer、Maven runner 中都必须是 JDK 17；MySQL/Redis 配置位于 `project/snowy-web-app/src/main/resources/application.properties`，可由开发者自行修改，或在明确要求时由 Agent 按开发者提供的值修改。若只修改数据库名，只更新 MySQL JDBC URL 中 `host:port/` 后、`?` 前的库名。
- 不直接在主分支上开发，功能改动使用独立 branch 或 worktree。
- 不让开发 Agent 自己给自己放行，必须经过 Review、CI 和人工审批。
- 需求、业务规则、数据规则、权限规则不清时，不直接进入代码开发。
- 前端优先复用现有组件、路由、状态管理和样式规范。
- 后端优先遵循现有分层架构、接口规范、异常处理和事务规范。
- 开发阶段默认基于 `project/` 下已有框架进行增量开发，不按全新项目重新搭建。当前框架映射为：前端 `project/snowy-admin-web/`；后端启动模块 `project/snowy-web-app/`；后端业务插件 `project/snowy-plugin/`；后端插件 API `project/snowy-plugin-api/`；公共模块 `project/snowy-common/`。如实际结构变化，Orchestrator 必须先更新并说明映射关系。
- 后端开发时，若本地运行环境、数据库或 MySQL 缺失，不阻断代码开发；先完成 API、业务逻辑、数据结构、配置说明和可运行性降级记录，再标注未执行的验证项。
- 前端开发必须同步维护 mock 数据；当后端接口无法连接、未完成或本地环境不可用时，页面应使用 mock 数据展示主流程和关键状态。
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

0. Orchestrator 先用简短格式声明当前阶段、关键输入、下一步和是否需要确认。
1. Orchestrator 读取 `docs/requirements/` 下的全部需求文档，并读取 `project/docs/` 下的框架文档。
2. Orchestrator 使用 `.codex/skills/snowy-framework-bootstrap` 输出框架运行提示，要求开发者自行确认前端和后端能正常运行；未确认则停在本阶段。
3. Orchestrator 询问是否需要 PRD 和 UI 设计；开发者可明确跳过。
4. 如未跳过，Product Agent 基于需求和现有框架能力生成 PRD、验收标准、HTML PRD 和可交互低保真 HTML 原型。
5. 如未跳过 UI，Design Agent 建立设计系统，并连接 Figma 生成可落地设计稿。
6. Architect Agent 明确模块边界、状态机、API、数据模型、安全模型和可运维性。
7. Data Agent 细化数据库模型、migration、索引、回滚和数据一致性策略。
8. Orchestrator 按用户价值拆 feature slice。
9. Orchestrator 套用 `.codex/workflows/auto-dispatch-parallel-development.md`，生成任务图、依赖 DAG、并行 wave、owner 分配、branch/worktree 策略和集成策略。
10. Frontend、Backend、Data、QA 等 Agent 在独立 branch 或 worktree 并行开发。
11. 本地运行必要检查后提交 PR。
12. Reviewer、Security、QA Agent 做审查。
13. CI 运行 lint、typecheck、test、build、安全扫描等项目定义的质量门禁。
14. 人工负责人审批后合并。
15. 预发验证、灰度发布、全量发布。
16. 发布后监控核心指标和用户反馈。

## 通用 Definition of Done

一个功能完成必须满足：

- `docs/requirements/` 下的需求文档已全部读取，并在产物中列出已引用的需求来源。
- `project/docs/` 下的框架说明和开发规范已全部读取，并在技术产物中列出已引用的框架来源。
- 首次流程已输出 Snowy 框架运行提示，并在 `docs/workflow/status.md` 记录开发者是否确认前端和后端可运行；环境自检是全局一次，未确认时任何需求不得进入后续阶段。
- PRD 或最小需求说明已确认；如跳过 PRD，已记录跳过原因。
- 如未跳过 PRD，HTML 版 PRD 已生成并可打开。
- 如未跳过原型，可交互低保真 HTML 原型已生成并可打开，主路径页面切换、关键按钮和核心状态可点击验证。
- 交互状态和适配要求已明确；如跳过 UI 设计，已记录跳过原因和使用现有 Snowy UI 模式的约束。
- 如未跳过 UI 且涉及 UI，Figma 正式设计稿已生成或更新，且包含 Ready for Dev 画板和 Handoff 标注。
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

默认使用简版输出，控制在 5 行以内：

```text
阶段：<当前阶段>
已读：<需求文档数量/框架文档数量/关键来源>
处理：<本阶段要做什么>
状态：<可继续/需确认/阻塞>
下一步：<下一阶段或一个确认问题>
```

只有在用户要求“详细输出”“审计报告”“阶段材料清单”或出现阻塞/风险时，才展开完整字段：

```text
当前阶段：
阶段目标：
调用 Agent：
输入材料：
预期输出：
验收标准：
是否需要用户确认：
下一阶段：
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
- `docs/workflow/status.md`：全局环境自检状态和需求工作项索引。
- `docs/workflow/requirements/`：每个需求或功能的阶段状态、跳过项、产物、验收和风险记录。
- `.codex/agents/`：通用专业 Agent Markdown 角色说明。
- `.codex/workflows/`：通用多 Agent SDLC 工作流。
- `.codex/checklists/`：PR、发布、验收检查表。
- `.codex/skills/`：项目本地技能，已有内容不要随意删除。

## 默认开发目录

开发阶段默认基于 `project/` 下现有 Snowy 框架进行增量开发，禁止把流程理解为从零新建 `frontend/`、`backend/` 两个空目录。

```text
project/
  snowy-admin-web/     # 前端 Vue 3 + Ant Design Vue + Vite
  snowy-web-app/       # 后端 Spring Boot 主启动模块
  snowy-common/        # 后端公共模块
  snowy-plugin/        # 后端插件实现模块
  snowy-plugin-api/    # 后端插件 API 契约模块
  docs/                # 框架说明、开发规范和框架读取入口
```

- `project/snowy-admin-web/`：前端页面、组件、路由、状态管理、接口 client、mock 数据和前端测试。
- `project/snowy-web-app/`：后端 Spring Boot 主启动、资源配置、SQL 初始化和运行配置。
- `project/snowy-plugin/`：后端业务、系统、鉴权、开发工具等插件实现。
- `project/snowy-plugin-api/`：插件 API 契约和跨插件调用接口。
- `project/snowy-common/`：公共实体、工具、异常、分页、拦截器等基础能力。
- `project/docs/`：框架内容介绍、开发规范和后续开发前必须读取的框架文档。
