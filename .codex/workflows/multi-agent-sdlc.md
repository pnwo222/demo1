# 通用 Codex 多 Agent SDLC 工作流

本工作流是通用项目流程，不绑定具体业务。业务目标、角色、核心链路、质量重点和高风险规则必须从 `docs/requirements/` 下的全部需求文档中读取；框架结构、目录映射、技术栈和开发规范必须从 `project/docs/` 下的框架文档和 `project/` 实际代码中读取。

执行任何阶段前，Orchestrator 必须先输出当前 Git 分支和工作区状态，并让开发者确认是否以当前分支作为最终合并目标。开发者确认后，Orchestrator 再读取 `docs/requirements/` 下的全部需求文档、`project/docs/` 下的全部框架文档、`project/docs/patterns/` 下的框架模式缓存、`docs/workflow/status.md` 全局状态，以及当前需求对应的 `docs/workflow/requirements/<需求ID>.md`。如果当前需求还没有状态文件，必须先按 `docs/workflow/requirements/TEMPLATE.md` 创建。

```text
docs/requirements/**
docs/workflow/status.md
docs/workflow/requirements/<需求ID>.md
project/docs/**
project/docs/patterns/**
.codex/skills/snowy-framework-bootstrap/**
```

## 总控调度规则

所有阶段默认由 Orchestrator Agent 先出场，再分派给专业 Agent。

状态记录规则：

- 环境自检是全局状态，只记录在 `docs/workflow/status.md`。
- 需求、PRD、UI、技术设计、数据设计、开发、测试、审查、发布、验收等阶段是需求状态，必须记录在 `docs/workflow/requirements/<需求ID>.md`。
- 每个阶段进入、完成、跳过或阻塞时，Orchestrator 必须更新对应状态文件。
- 状态文件必须记录阶段、状态、来源、产物、下一步和时间。
- 不允许只在对话中说明阶段变化而不更新状态文件。
- 每个需求状态文件必须记录缓存读取、缓存命中和缓存更新结果。
- 每个需求状态文件必须记录原始当前分支、需求集成分支、worktree 开发分支、worktree 路径、合并状态和是否已询问合回原始分支。

编码规则：

- 所有工作流、Agent、Skill、需求、PRD、设计、技术方案和状态文件必须使用 UTF-8 编码。
- Windows PowerShell 读取中文文件必须使用 `Get-Content -Encoding UTF8`；写入中文文件必须使用 `Set-Content -Encoding UTF8` 或 `Out-File -Encoding UTF8`。
- 禁止用未指定编码的 `Set-Content`、`Out-File`、`>`、`>>` 更新中文 Markdown 或状态文件。
- 状态文件和 Markdown 文档优先使用 `apply_patch` 做局部修改，避免整文件重写导致旧内容乱码。
- 如果读取时发现 `�`、`锟斤拷`、`涓`、`鏂` 等乱码，必须先处理编码问题，再进入阶段推进。

语言规则：

- 项目文档和阶段产物默认使用简体中文。
- PRD、原型说明、技术方案、数据方案、开发计划、测试计划、Review、验收记录、状态文件和 `docs/superpowers/**` 产物必须默认中文。
- 路径、命令、API、类名、方法名、配置键、SQL 标识符和第三方固定模板句可以保留英文。
- 如果使用 superpowers 或其他英文模板生成计划，落盘前必须转成中文；除非用户明确要求英文，不得生成整篇英文文档。

触发规则：

- 用户输入“完成/开发/实现/新增/修复/优化 + 某功能”时，必须视为项目工作流入口，先进入阶段 0 和 0.5，不得直接编码。
- 进入阶段 0 前，必须先执行“当前分支确认”。输出 `git branch --show-current` 和 `git status --short` 的结果，并提供选择：以当前分支作为最终合并目标、切换到其他分支、暂停。
- 开发者确认当前分支后，工作流必须从该分支创建新的需求集成分支，例如 `codex/integration-<需求ID>` 或 `codex/<需求短名>`。
- 后续代码开发必须从需求集成分支创建 worktree 开发分支/目录；worktree 开发完成并提交后，先合并回需求集成分支。
- 需求集成分支验证无误后，Orchestrator 必须询问开发者是否合并回最初确认的当前分支，不得自动合并。
- 对每个新功能，Orchestrator 必须分配需求ID，并在 `docs/workflow/status.md` 的需求索引中登记，在 `docs/workflow/requirements/<需求ID>.md` 中记录后续阶段。
- PRD 和 UI 设计是可跳过决策点；用户明确说“跳过 PRD”“无需 PRD”“跳过 UI”“无需设计”“直接进入技术方案/开发”时，记录跳过项和原因，然后进入下一合适阶段。
- 只有用户明确说“跳过工作流”“直接改代码”“无需 PRD/设计/技术方案”时，才允许跳过整个前置工作流。
- 如果用户只给出功能名，例如“完成 某功能”，默认先输出简版阶段状态和一个范围确认问题。
- 所有需要开发者确认的节点，优先使用 Codex 可点击选择项；如果当前环境没有选择控件，则输出编号选项，允许开发者输入编号或自由文本。
- Orchestrator 必须提供开发模式选择：简单 CRUD 快速模式、标准 SDLC 模式、高风险严格模式、自定义。
- 所有开发模式都必须读取 `project/docs/patterns/` 缓存。简单 CRUD 快速模式优先按缓存实现并减少重复探索；标准 SDLC 模式把缓存作为加速输入但仍保留完整设计、拆分和审查；高风险严格模式读取缓存后仍必须补读实际代码并加强审查。
- 如果需求符合后台单表或少量表 CRUD，Orchestrator 必须推荐“简单 CRUD 快速模式”，并优先读取 `project/docs/patterns/*crud*`、`permission-sql-pattern.md`、`migration-sql-pattern.md`。

阶段开始前默认使用简版输出，控制在 5 行以内：

```text
阶段：<当前阶段>
已读：<需求文档数量/框架文档数量/关键来源>
处理：<本阶段动作>
状态：<可继续/需确认/阻塞>
下一步：<下一阶段或一个确认问题>
```

确认节点必须同时提供推荐路径、跳过路径和自定义路径。默认选项：

| 节点 | 选择项 |
| --- | --- |
| 当前分支确认 | 以当前分支作为最终合并目标；切换到其他分支；暂停 |
| 环境自检 | 已确认前后端可运行；环境有问题；稍后确认 |
| 开发模式决策 | 简单 CRUD 快速模式；标准 SDLC 模式；高风险严格模式；自定义 |
| PRD/原型决策 | 生成 PRD 和低保真原型；跳过 PRD，进入 UI 决策；跳过 PRD 和 UI，进入技术方案 |
| UI/Figma 决策 | 生成 UI/Figma；跳过 UI，复用 Snowy 现有 UI；返回补充 PRD |
| 技术方案确认 | 确认并进入开发拆分；需要调整；返回补充需求 |
| 数据方案确认 | 确认并进入开发拆分；需要调整；本次无数据变更 |
| 开发完成确认 | 进入测试；继续开发；暂停 |
| 验收确认 | 验收通过；有问题需修复；记录风险后通过 |

## 开发模式决策

开发模式在框架装载和环境自检之后、PRD/UI 决策之前确认。

| 模式 | 适用条件 | 缓存读取 | 产物和门禁 |
| --- | --- | --- | --- |
| 简单 CRUD 快速模式 | 后台管理单表或少量表 CRUD；常规分页、搜索、新增、编辑、删除；无复杂状态机、金额、资源扣减、外部回调或敏感数据高风险 | 必读并优先使用 `backend-crud-pattern.md`、`frontend-crud-pattern.md`、`permission-sql-pattern.md`、`migration-sql-pattern.md` | 可跳过 PRD/UI；保留最小需求说明、字段/接口/表结构、轻量开发清单、基础验证和缓存更新记录 |
| 标准 SDLC 模式 | 一般业务功能、跨前后端、有业务规则或交互流程 | 必读全部相关缓存；缓存用于加速理解，但仍要输出技术方案、数据方案、Feature Slice、DAG/Wave | 常规 PRD/UI 可选、技术设计、数据设计、任务拆分、开发、测试、审查 |
| 高风险严格模式 | 涉及金额、核心权限、状态机、资源扣减、外部回调、敏感数据、删除或批量高风险操作 | 必读缓存，但必须补读实际代码和高风险链路，不得只按缓存套模板 | 强制补齐技术/数据/安全/QA 设计，多类 Review，严格门禁 |
| 自定义 | 开发者明确指定 | 至少读取相关缓存并记录取舍 | 按开发者确认执行，风险不可省略 |

简单 CRUD 快速模式的默认执行清单：

1. 需求确认、模块定位、字段/接口/表结构确认。
2. 后端 CRUD、SQL、权限点。
3. 前端 API、列表、表单、mock fallback。
4. 构建/检查、状态记录、缓存更新判断。

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

- 未确认当前分支作为最终合并目标，不创建需求集成分支、worktree 或进入代码开发。
- 未读取并确认 `docs/requirements/` 下全部需求文档，不进入产品设计。
- 未读取并确认 `project/docs/` 下全部框架文档，不进入产品设计、技术设计或开发。
- 未读取相关 `project/docs/patterns/` 模式缓存，不进入技术设计或开发。
- 未确认开发模式，不进入 PRD/UI 决策、技术设计或开发。
- 首次执行项目工作流时，未使用 `snowy-framework-bootstrap` 输出框架运行提示，不进入产品设计、技术设计或开发；默认不由 Agent 自动安装、构建、启动或校验环境。IntelliJ IDEA 是后端本地开发必备工具，必须提示开发者在 IDEA 中导入 `project/`、配置 JDK 17/Maven、确认 MySQL/Redis 配置并运行后端启动类。
- 开发者未确认前端和后端可运行时，任何需求都不进入 PRD/UI/技术设计或开发阶段；全局状态必须保持为 `blocked_until_developer_confirmed_ready`。
- `docs/workflow/status.md` 未记录 `developer_confirmed_ready` 时，不进入任何需求的 PRD/UI/技术设计或开发阶段。
- 全局环境自检已为 `developer_confirmed_ready` 时，后续需求不重复要求自检；只有框架依赖、JDK/Maven、数据库/Redis 配置变化，或开发者报告环境失效时，才重置全局环境状态并重新提示。
- 未确认是否需要 PRD/原型，不进入 Product 阶段或跳过记录。
- 未确认是否需要 UI/Figma，不进入 Design 阶段或跳过记录。
- 跳过 PRD 时，必须保留最小需求说明、范围、验收标准和风险记录。
- 跳过 UI 时，必须记录使用 Snowy 现有 UI 模式、组件和交互约束。
- 技术设计未确认，不进入开发。
- 数据模型、migration 和回滚策略未确认，不进入相关开发。
- P0/P1 Review 问题未修复，不允许合并。
- CI 和发布检查未通过，不进入全量发布。
- 开发完成后未判断是否需要更新 `project/docs/patterns/` 缓存，不进入验收复盘。

## 阶段 -1：当前分支确认

由 Orchestrator 在任何需求工作流前执行。

必须输出：

```text
当前分支：
工作区状态：
拟作为最终合并目标：
下一步选择：
```

选择项：

1. 以当前分支作为最终合并目标。
2. 切换到其他分支后再开始。
3. 暂停。

确认后：

- 记录原始当前分支为 `base_branch`。
- 从 `base_branch` 创建需求集成分支，例如 `codex/integration-<需求ID>` 或 `codex/<需求短名>`。
- 后续 worktree 从需求集成分支创建。
- worktree 开发完成后合并回需求集成分支。
- 需求集成分支验证通过后，再询问是否合并回 `base_branch`。

## 阶段 0：需求和框架装载

由 Orchestrator Agent 执行。

必须明确：

- 已读取的需求文档清单。
- 已读取的框架文档清单。
- 已读取的框架模式缓存清单。
- 当前框架目录映射。
- 项目目标。
- 技术栈。
- 业务角色或用户角色。
- 核心链路。
- 高风险规则。
- 质量门禁。
- 必须复用的现有框架能力。
- 缓存是否命中、是否需要补读实际代码。

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
- 修改数据库名：只修改 MySQL JDBC URL 中 `host:port/` 后、`?` 前的库名，例如 `jdbc:mysql://localhost:3306/snowy?...` 改为 `jdbc:mysql://localhost:3306/demo?...`。
- Redis 配置项：`spring.data.redis.host`、`port`、`database`、`password`。
- 后端端口：`server.port=82`，启动后可访问或检测 `http://localhost:82`。
- 如果开发者未确认可运行，全局状态为 `blocked_until_developer_confirmed_ready`，不进入任何需求后续阶段，也不默认执行脚本。
- 开发者回复“前后端已确认可运行”或等价表达后，Orchestrator 必须更新 `docs/workflow/status.md`：框架运行自检为 `developer_confirmed_ready`，前端/后端运行确认为 `已确认`，并记录确认来源和时间。
- 该确认是全局一次确认；每个需求只在自身状态文件中引用该全局状态，不重复记录环境自检阶段。

## 阶段 0.6：开发模式选择

由 Orchestrator 提供选择项：

1. 简单 CRUD 快速模式。
2. 标准 SDLC 模式。
3. 高风险严格模式。
4. 自定义。

如果 Orchestrator 判断需求符合简单 CRUD，应推荐快速模式，但最终由开发者确认。确认后必须写入当前需求状态文件。

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

优先提供选择项：

1. 生成 PRD 和低保真原型。
2. 跳过 PRD，进入 UI 决策。
3. 跳过 PRD 和 UI，进入技术方案。
4. 自定义。

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

优先提供选择项：

1. 生成 UI/Figma。
2. 跳过 UI，复用 Snowy 现有 UI。
3. 返回补充 PRD/原型。
4. 自定义。

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
