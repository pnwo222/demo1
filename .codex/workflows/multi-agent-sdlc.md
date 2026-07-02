# 通用 Codex 多 Agent SDLC 工作流

本工作流是通用项目流程，不绑定具体业务。业务目标、角色、核心链路、质量重点和高风险规则必须从 `docs/requirements/` 下的全部需求文档中读取；框架结构、目录映射、技术栈和开发规范必须从 `project/docs/` 下的框架文档和 `project/` 实际代码中读取。

执行任何阶段前，Orchestrator 必须先读取 `docs/requirements/` 下的全部需求文档和 `project/docs/` 下的全部框架文档，并输出已读取的需求文档清单和框架文档清单。

```text
docs/requirements/**
project/docs/**
.codex/skills/snowy-framework-bootstrap/**
```

## 总控调度规则

所有阶段默认由 Orchestrator Agent 先出场，再分派给专业 Agent。

触发规则：

- 用户输入“完成/开发/实现/新增/修复/优化 + 某功能”时，必须视为项目工作流入口，先进入阶段 0 和 0.5，不得直接编码。
- PRD 和 UI 设计是可跳过决策点；用户明确说“跳过 PRD”“无需 PRD”“跳过 UI”“无需设计”“直接进入技术方案/开发”时，记录跳过项和原因，然后进入下一合适阶段。
- 只有用户明确说“跳过工作流”“直接改代码”“无需 PRD/设计/技术方案”时，才允许跳过整个前置工作流。
- 如果用户只给出功能名，例如“完成 内容管理-首页banner管理功能”，默认先输出简版阶段状态和一个范围确认问题。

阶段开始前默认使用简版输出，控制在 5 行以内：

```text
阶段：<当前阶段>
已读：<需求文档数量/框架文档数量/关键来源>
处理：<本阶段动作>
状态：<可继续/需确认/阻塞>
下一步：<下一阶段或一个确认问题>
```

只有在用户要求详细输出、审计报告、阶段材料清单，或出现阻塞/高风险时，才展开完整字段：

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

## 阶段门禁

- 未读取并确认 `docs/requirements/` 下全部需求文档，不进入产品设计。
- 未读取并确认 `project/docs/` 下全部框架文档，不进入产品设计、技术设计或开发。
- 首次执行项目工作流时，未使用 `snowy-framework-bootstrap` 输出框架运行提示，不进入产品设计、技术设计或开发；默认不由 Agent 自动安装、构建、启动或校验环境。IntelliJ IDEA 是后端本地开发必备工具，必须提示开发者在 IDEA 中导入 `project/`、配置 JDK 17/Maven、确认 MySQL/Redis 配置并运行后端启动类。
- 开发者未确认前端和后端可运行时，不进入 PRD/UI/技术设计或开发阶段；状态必须保持为 `blocked_until_developer_confirmed_ready`。
- 未确认是否需要 PRD/原型，不进入 Product 阶段或跳过记录。
- 未确认是否需要 UI/Figma，不进入 Design 阶段或跳过记录。
- 跳过 PRD 时，必须保留最小需求说明、范围、验收标准和风险记录。
- 跳过 UI 时，必须记录使用 Snowy 现有 UI 模式、组件和交互约束。
- 技术设计未确认，不进入开发。
- 数据模型、migration 和回滚策略未确认，不进入相关开发。
- P0/P1 Review 问题未修复，不允许合并。
- CI 和发布检查未通过，不进入全量发布。

## 阶段 0：需求和框架装载

由 Orchestrator Agent 执行。

必须明确：

- 已读取的需求文档清单。
- 已读取的框架文档清单。
- 当前框架目录映射。
- 项目目标。
- 技术栈。
- 业务角色或用户角色。
- 核心链路。
- 高风险规则。
- 质量门禁。
- 必须复用的现有框架能力。

如果需求文档缺失、框架文档缺失或内容不足，先补齐对应文档，不进入后续阶段。

## 阶段 0.5：框架运行提示

由 Orchestrator Agent 使用 `.codex/skills/snowy-framework-bootstrap` 输出开发者自检提示。默认不执行安装、构建、启动或环境校验脚本，除非用户明确要求。

必须明确：

- 已提示开发者先确认当前 Snowy 框架能否正常运行。
- 前端运行步骤：进入 `project/snowy-admin-web`，先执行 `npm install`，再执行 `npm run dev`，打开 Vite 输出地址，通常是 `http://localhost:5173`。
- 后端运行步骤：用 IDEA 打开 `project/`，配置 JDK 17、Maven、Maven importer/runner，运行 `project/snowy-web-app/src/main/java/vip/xiaonuo/Application.java`。
- Java 配置提示：Project SDK、Modules SDK、Java Compiler、Maven importer、Maven runner 均使用 JDK 17。
- 后端配置文件：`project/snowy-web-app/src/main/resources/application.properties`。
- MySQL 配置项：`spring.datasource.dynamic.datasource.master.url`、`username`、`password`。
- Redis 配置项：`spring.data.redis.host`、`port`、`database`、`password`。
- 后端端口：`server.port=82`，启动后可访问或检测 `http://localhost:82`。
- 如果开发者未确认可运行，状态为 `blocked_until_developer_confirmed_ready`，不进入后续阶段，也不默认执行脚本。

前端自检命令：

```powershell
cd project/snowy-admin-web
npm install
npm run dev
```

后端由 IDEA 自检：

```text
IDEA 打开 project/
配置 JDK 17 和 Maven
确认 application.properties 中 MySQL/Redis
运行 snowy-web-app/src/main/java/vip/xiaonuo/Application.java
```

## 阶段 1：产品设计决策

由 Orchestrator 询问是否需要 PRD 和低保真原型。开发者可跳过。

如果不跳过，由 Product Agent 基于需求集合和框架能力输出 PRD、用户故事、MVP 范围和验收标准，并生成 HTML 版 PRD。

Product Agent 还必须输出可打开、可点击交互的低保真 HTML 原型。

PRD 必须包含：

- 背景与目标。
- 用户角色。
- 核心业务流程。
- 功能范围。
- 状态和业务规则。
- 非功能需求。
- 异常场景。
- 验收标准。
- 埋点或成功指标。
- 风险和不在本期范围。

HTML PRD 要求：

- 单文件 HTML。
- 内联 CSS。
- 适合浏览器评审和打印为 PDF。
- 保存到 `docs/prd/`。

低保真 HTML 原型要求：

- 单文件 HTML。
- 内联 CSS 和少量原生 JavaScript。
- 能直接用浏览器打开。
- 不依赖构建工具、后端接口或登录态。
- 能点击演示主路径页面切换、关键按钮和核心状态变化。
- 表达产品流程、信息结构和业务规则，不做高保真视觉。
- 不连接 Figma。
- 保存到 `docs/design/`。

如果跳过，必须记录：

- 跳过 PRD/原型的开发者决策。
- 最小需求说明。
- 功能范围。
- 验收标准。
- 风险和不在本次范围。

## 阶段 2：UI/UX 设计决策

由 Orchestrator 询问是否需要 UI/Figma 设计。开发者可跳过。

如果不跳过，由 Design Agent 基于已确认的需求集合、HTML PRD 或最小需求说明、可交互低保真 HTML 原型或跳过记录，生成设计系统并连接 Figma 生成可编辑设计图。

必须先运行项目适配的设计系统检索。检索关键词必须来自需求集合，而不是写死在 workflow 中。

Figma 设计图要求：

- 直接创建或更新 Figma 设计文件。
- 使用目标平台对应画板尺寸。
- 页面结构、组件、状态必须可编辑。
- 颜色、字体、间距、组件和交互规则来自设计系统。
- 正式 UI 必须是可落地设计稿，不允许只交付线框图、低保真原型或抽象色块占位稿。
- 每个正式页面必须包含 `Ready for Dev` 画板。
- 每个正式页面必须包含 `Handoff` 标注区域，说明 viewport、内容宽度、组件尺寸、间距、颜色 token、字体、状态要求、图片规格和前端组件拆分建议。
- 关键图片必须使用真实质感资产或可授权占位图，并说明生产替换策略。
- 分类、导航、操作按钮等 icon 必须使用统一、优美、可编辑的 SVG 图标。
- 中文界面必须使用 Figma 可正确渲染的中文字体，例如 `Noto Sans SC`，并通过截图检查无缺字、重叠、裁切。
- 图片来源和替换策略必须写入设计摘要或 Handoff。

如果跳过，必须记录：

- 跳过 UI/Figma 的开发者决策。
- 使用 Snowy 现有页面模式、组件、表格、表单、弹窗和权限按钮规范。
- 本次功能的关键交互状态。
- 移动端或后台适配要求。

## 阶段 3：技术设计

由 Architect Agent 基于需求集合、框架文档、PRD 或最小需求说明、低保真原型或跳过记录、UI 设计或 Snowy UI 约束输出技术设计。

必须明确：

| 设计项 | 必须明确的问题 | 常见产物 |
| --- | --- | --- |
| 模块边界 | 各业务模块分别由哪些前后端或服务负责 | 架构图、模块图 |
| 接口契约 | 前端如何调用后端 API，请求、响应、错误码、分页、权限 | OpenAPI、API 文档 |
| 数据模型 | 核心实体、关系、生命周期、历史快照 | ERD、Migration |
| 状态机 | 哪些状态可以流转，谁触发，影响什么资源 | 状态机图 |
| 一致性策略 | 关键链路如何保证幂等、事务、补偿和回滚 | 事务/补偿方案 |
| 安全模型 | 角色、权限、数据隔离、敏感数据保护 | Threat Model、权限矩阵 |
| 可运维性 | 日志、指标、告警、限流、降级、回滚 | Runbook、SLO |

## 阶段 4：数据设计

由 Data Agent 输出：

- 数据实体和字段。
- 表关系。
- 索引和唯一约束。
- Migration 顺序。
- 回滚或兼容策略。
- 大数据量和慢查询风险。
- 与核心业务一致性相关的数据风险。

## 阶段 5：按用户价值切 Feature Slice

由 Orchestrator 基于需求集合、框架文档、PRD 或最小需求说明、技术设计和数据设计拆分 feature slice。

不要按岗位切成“前端做全部页面、后端做全部接口”。应按一个可验收的业务闭环切。

每个 slice 必须包含：

- 用户价值。
- 前端任务。
- 后端任务。
- 数据库影响。
- 测试要求。
- 验收标准。
- 依赖关系。
- 风险和回滚策略。

## 阶段 6：自动分配与并行开发

进入开发前，优先套用 `auto-dispatch-parallel-development.md`，由 Orchestrator 生成任务图、依赖 DAG、并行 wave、owner 分配、branch/worktree 策略和集成策略。

默认基于现有 `project/` 框架增量开发：

```text
project/
  snowy-admin-web/
  snowy-web-app/
  snowy-common/
  snowy-plugin/
  snowy-plugin-api/
```

Orchestrator 必须先读取 `project/docs/` 并输出前端、后端、插件、公共模块目录映射；不得按全新项目假设创建 `project/frontend/` 或 `project/backend/`。

Frontend Agent：

- 实现页面、组件、路由和状态管理。
- 处理适配、交互、loading、empty、error 和异常状态。
- 不信任前端对关键业务规则的最终判断，最终校验以可信服务为准。
- 同步维护 mock 数据、mock 接口或 mock adapter。
- 当后端接口无法连接、未完成或本地环境不可用时，使用 mock 数据展示主流程、关键状态和异常状态。

Backend Agent：

- 实现 API、业务逻辑、权限、事务、幂等和审计。
- 更新接口文档和测试。
- 本地运行环境、数据库或 MySQL 缺失时，不阻断开发；先完成代码、接口契约、配置示例、migration 草案和未验证项记录。
- 无法连接数据库时，必须在完成报告中说明未执行的验证、预期验证命令和恢复环境后的验证步骤。

Data Agent：

- 实施 migration、索引、约束和兼容策略。

QA Agent：

- 同步准备主链路、异常链路、权限和回归测试。

## 阶段 7：测试与质量门禁

根据需求集合和技术栈执行项目定义的质量门禁。

通用门禁包括：

- Lint。
- Typecheck。
- Unit Test。
- Integration Test。
- E2E Test。
- API Contract Test。
- Build。
- Coverage。
- Migration 验证。
- 核心页面或主流程验证。
- SAST。
- SCA。
- Secret Scan。
- DAST。

## 阶段 8：审查

不让开发 Agent 自己给自己放行。

推荐 Reviewer：

| Reviewer | 重点 |
| --- | --- |
| Bug Reviewer | 主链路、边界条件、异常状态、真实缺陷 |
| Security Reviewer | 越权、敏感数据、接口滥用、高风险回调 |
| Performance Reviewer | 慢查询、重复请求、缓存、并发和前端性能 |
| Maintainability Reviewer | 组件边界、模块边界、重复代码、复杂度 |
| QA Reviewer | 测试覆盖、异常场景、回归风险 |

执行规则：

- 高风险 PR 必须并行执行多类审查。
- 普通 PR 至少执行 Reviewer Agent 汇总审查。
- P0 必须修复，不允许合并。
- P1 合并前应修复。
- P2 可记录为后续优化。

## 阶段 9：部署发布

发布流程：

1. CI 构建、测试、安全扫描全部通过。
2. 预发环境完成 UAT 和联调。
3. Feature Flag 控制高风险功能暴露范围。
4. Canary 小流量发布，观察核心指标。
5. 逐步全量。
6. 异常时按预案回滚前端资源、后端服务、配置和数据。

## 阶段 10：验收和复盘

验收维度来自需求集合和 PRD。

复盘关注：

- 需求是否误解。
- 核心规则是否返工。
- CI 失败原因。
- Review 问题类型。
- 线上问题和回滚情况。
- 哪些 Agent 或 workflow 规则需要更新。
