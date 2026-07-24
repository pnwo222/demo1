# AGENTS.md

本仓库采用“需求文档独立、工作流通用”的协作方式。

Agent 和 workflow 不应写死具体业务需求。具体项目需求应放在 `docs/requirements/` 下。执行任何阶段前，Orchestrator 必须读取该目录下的全部需求文档，并将需求集合注入到对应角色任务中。

## 协作原则

- 用户输入“完成/开发/实现/新增/修复/优化 + 某功能”时，必须视为项目工作流入口，先由 Orchestrator 走简版 SDLC 流程，不得直接进入代码实现。
- 工作流开始前，Orchestrator 必须先执行开发环境检测；环境检测通过或开发者选择“环境有警告但继续”后，才输出当前 Git 分支和工作区状态，并让开发者确认是否以当前分支作为开发分支。环境检测和分支确认必须分成两个阶段，不得合并输出。未确认分支前，不创建需求分支、worktree 或进入代码开发。
- 所有 `状态：需确认` 的阶段都是只读阶段；在开发者选择确认项之前，不得创建需求集成分支、worktree、需求状态文件，不得登记需求索引，也不得修改业务代码。
- PRD 和 UI 设计阶段可由开发者明确跳过。用户说“跳过 PRD”“无需 PRD”“跳过 UI”“无需设计”“直接进入技术方案/开发”等等价表达时，Orchestrator 必须记录跳过项和原因，然后进入下一合适阶段。
- 所有需要开发者决策的节点，优先使用可点击选择项，而不是只让开发者手动输入。选择项必须覆盖推荐路径、跳过路径和自定义输入路径；如果当前 Codex 客户端不支持选择控件，则在文本中给出编号选项，允许开发者输入编号或自由文本。编号选项必须逐行输出，不得挤在 `下一步` 同一行。
- 即使跳过 PRD 或 UI，也必须保留最小需求说明、范围、验收标准和风险记录；不得在业务规则、权限、数据或状态不清时直接编码。
- 当需求涉及后管、后台、管理端或运营端页面时，PRD、低保真原型或最小需求说明必须体现后管菜单设计：菜单层级、菜单名称、路由路径、权限标识、入口位置、可见角色和与现有 Snowy 菜单/权限体系的关系。即使跳过 PRD 或 UI，也必须在最小需求说明中保留该菜单设计。
- 低保真原型必须参考现有框架的信息架构、布局、导航、表格、表单、弹窗、抽屉、状态和权限交互，不得做成过度简陋的纯线框。后管原型和 H5/移动端原型必须分开输出；后管必须以完整原始 Demo 金标为基础，并复用 `prototype-demo-framework/components/` 中抽取的原始组件，不得用精简 Schema 渲染器重画。H5 必须使用 `.codex/skills/snowy-h5-app-designer`，优先参考 `project/h5/src/views/` 中最接近的实际业务页面，并使用该 skill 的多文件原型骨架、逐页蓝图和标注运行时。原型必须严格覆盖全部模块、页面、菜单、字段、操作、状态、异常和权限场景，并输出覆盖矩阵。
- 后管原型不仅要使用 `.codex/skills/snowy-admin-prototype-designer/assets/prototype-demo-framework/index.html`，还必须符合该 Demo 的原型设计规则：菜单层级来自需求；字段按语义展示；业务状态和启停操作按 Snowy 习惯拆分；上传可选择并预览/移除；所有可点击元素有交互；不得出现开发提示、教学说明或无关功能。
- 后管原型生成 HTML 前必须先输出“需求到原型页面蓝图”：逐个独立页面列出需求编号、原始需求摘录、原子需求清单、菜单路径、路由路径、权限标识、页面类型、参考 Snowy 页面、同步字段、展示字段、筛选字段、查询字段、表格字段、详情字段、新增字段、编辑字段、状态字段、敏感字段、操作按钮、状态/异常、权限差异、字段展示形态和点击交互。每个字段、按钮、状态和权限必须标记来源：`需求明确`、`框架惯例`、`待确认` 或 `不适用`。蓝图必须通过 `.codex/skills/snowy-admin-prototype-designer/scripts/validate_admin_blueprint.py`；没有蓝图、蓝图字段不来自需求、蓝图未通过校验、出现 `等状态`/`多条件筛选`/`同新增` 等压缩写法、或多个业务页面共用一套万能查询/表格/表单/抽屉时，原型视为不合格，必须退回 Product 阶段重做。
- 后管原型生成、审查或重做时必须使用 `.codex/skills/snowy-admin-prototype-designer`。该 skill 内置原始 Demo 金标、运行时 Vue 预设组件库、蓝图模板、验收清单和校验脚本。
- PRD、页面蓝图和低保真 HTML 原型属于 Product 阶段产物，默认由当前 Product Agent 直接读取需求、复用 Demo 组件并连续生成，不得仅因已有计划文件、页面较多或产物较多而调用 `executing-plans`、`subagent-driven-development`、代码开发型 worktree 或逐 Task Owner 派发。只有开发者明确要求按既有执行计划分批实施，或任务已经进入包含业务代码修改的开发阶段时，才允许使用 `executing-plans`。原型页面较多时可在同一次 Product 运行中按模块批量生成，但不得为每个页面重复启动计划、审查和上下文装载。
- 后管原型必须以多文件目录交付：`index.html` 只负责引用 CSS、状态和组件脚本，现有预设组件直接引入使用。需求没有匹配组件时，可参考 Snowy 真实框架、最接近的 Demo 组件或 Ant Design Vue 官方组件进行选择和组合；仍无法满足时才新增独立组件，并同步登记 `registry.js`、`index.html`、`component-manifest.json`、组件说明和验证用例。
- 原始组件的样式、DOM 结构和标注行为是受保护基础设施。业务原型应复用组件并替换业务内容，不得删除原始 Demo 能力、覆盖基础样式或另建平行标注/页面引擎。
- 后管原型标注必须区分全局作用域与逐页面作用域：Logo、侧边菜单、顶部导航和页签标注跨页保留；页面内容、业务抽屉和业务弹窗标注仅属于当前页面。A 页面标注不得泄漏到 B 页面，返回 A 页面后必须恢复；全局壳、页面内容以及 Teleport 到 `body` 的业务抽屉/弹窗都必须支持节点标注。
- 后管原型必须生成逐页 `prototype-contract.json`，完整声明查询字段及控件类型、表头、工具栏、分页、Demo 布局指标和自动标注目标/气泡。静态校验必须将受保护组件与 Skill 内 canonical Demo manifest 对比并检查核心组件从 `app/main.js` 实际可达，禁止自刷新 manifest 掩盖改动、只导入未使用、字段 `slice` 截断和万能页面引擎；运行时校验必须逐页验证契约并输出截图。任一失败不得进入下一阶段。
- 缺少组件时，优先从 Snowy 真实框架、最接近的 Demo 组件和 Ant Design Vue 官方组件中复用或组合；新增组件必须沿用最接近的结构和样式并补运行验证。禁止使用原生文件输入、字段名猜测、万能字段集或精简渲染器绕过组件库。
- 涉及后管且未跳过原型时，必须执行 `.codex/workflows/admin-prototype-design-workflow.md`；未输出框架参考、菜单映射、CRUD 形式、原始组件复用清单、拟真原型和覆盖矩阵时，不得进入下一阶段。
- 只有用户明确说“跳过工作流”“直接改代码”“无需 PRD/设计/技术方案”时，才允许跳过整个前置工作流；跳过原因必须在回复中简短记录。
- 修改项目之前，先阅读本文件、`.codex/workflows/`、相关 `.codex/agents/*.md` 角色说明、`docs/requirements/` 下的全部需求文档，并使用 `.codex/skills/snowy-framework-reader` 读取 `project/` 框架、`project/docs/` 框架说明、开发规范和 `project/docs/patterns/` 框架模式缓存。
- 首次执行项目工作流前，必须使用 `.codex/skills/snowy-framework-bootstrap` 先执行只读环境自检，并用 `✅`、`⚠️`、`❌` 列出 Git、Node.js、npm、前端依赖、JDK 17、Maven、IDEA、MySQL CLI、MySQL 服务、Redis 服务结果，再提示开发者确认当前 Snowy 框架能否在本机正常运行。检测结果必须在 `检测：` 后逐项换行，每个检测项独占一行，禁止用分号、逗号或空格串成一整段。默认不由 Agent 自动执行环境安装、构建、启动或校验脚本，除非用户明确要求；开发环境清单未确认前，不进入 PRD/UI/技术设计或开发阶段。
- 工作流状态分为全局状态、开发者本机环境状态和需求状态：`docs/workflow/status.md` 记录可提交的项目级状态和需求工作项索引；`docs/workflow/local-environment-status.md` 记录当前开发者本机环境检测结果，必须被 `.gitignore` 忽略，不得提交到 Git；每个需求或功能的阶段状态记录在 `docs/workflow/requirements/<需求ID>.md`。开发者回复“前后端已确认可运行”或等价表达后，Orchestrator 必须按环境检测清单确认 Git、Node.js、npm、前端依赖、JDK 17、Maven、IDEA、MySQL CLI、MySQL 服务、Redis 服务；检测结果写入 `docs/workflow/local-environment-status.md`。PRD、UI、技术设计、开发、测试、审查、发布、验收、分支和合并等单需求阶段进入、完成、跳过或阻塞时，必须更新对应需求状态文件。
- 所有文本文件必须使用 UTF-8 编码保存，尤其是 `*.md`、`*.yml`、`*.yaml`、`*.json`、`*.toml`、`*.java`、`*.vue`、`*.ts`、`*.js`、`*.properties` 和 `docs/workflow/**` 状态文件。禁止用未显式编码的 PowerShell 写入中文文件；PowerShell 读取必须使用 `Get-Content -Encoding UTF8`，写入必须使用 `Set-Content -Encoding UTF8` 或 `Out-File -Encoding UTF8`。Agent 手工编辑优先使用 `apply_patch`，避免整文件重写导致乱码。
- 项目内文档和阶段产物默认使用简体中文，包括 PRD、原型说明、技术方案、数据方案、开发计划、Review、测试计划、状态文件和 `docs/superpowers/**` 产物。代码标识符、路径、命令、API、类名、配置键、第三方固定模板句可以保留英文。除非用户明确要求英文，不得生成整篇英文项目文档。
- 根目录 `PROJECT_ARTIFACTS.html` 是非代码产物统一导航。任何 Agent 新增、重命名或删除需求、PRD、原型、设计、架构、数据、计划、图表、测试、审查、发布、验收或流程状态产物后，必须在本阶段结束前执行 `python scripts/update_artifact_index.py`，确认新产物已登记且链接可跳转。导航不登记源码、依赖、构建目录、临时文件、本机状态和原型内部 JS/CSS 实现文件。
- 后端启动前必须提示开发者确认 Java、MySQL、Redis 配置：Java 在 IDEA Project SDK、Modules SDK、Java Compiler、Maven importer、Maven runner 中都必须是 JDK 17；MySQL/Redis 配置位于 `project/snowy-web-app/src/main/resources/application.properties`，可由开发者自行修改，或在明确要求时由 Agent 按开发者提供的值修改。若只修改数据库名，只更新 MySQL JDBC URL 中 `host:port/` 后、`?` 前的库名。
- 不直接在当前分支或主分支上开发。开发者确认当前分支作为开发分支后，工作流必须先从当前分支创建新的需求集成分支；后续代码开发从该新分支再创建 worktree 开发分支/目录。worktree 开发完成并提交后，先合并回需求集成分支；在需求集成分支验证无误后，再询问开发者是否合并回开发分支。
- 不让开发 Agent 自己给自己放行，必须经过 Review、CI 和人工审批。
- 需求、业务规则、数据规则、权限规则不清时，不直接进入代码开发。
- 前端优先复用现有组件、路由、状态管理和样式规范。
- 后端优先遵循现有分层架构、接口规范、异常处理和事务规范。
- 开发阶段默认基于 `project/` 下已有框架进行增量开发，不按全新项目重新搭建。当前框架映射为：前端 `project/snowy-admin-web/`；后端启动模块 `project/snowy-web-app/`；后端业务插件 `project/snowy-plugin/`；后端插件 API `project/snowy-plugin-api/`；公共模块 `project/snowy-common/`。如实际结构变化，Orchestrator 必须先更新并说明映射关系。
- 开发环境自检必须检测开发电脑是否存在可用 MySQL CLI。PowerShell 先执行 `Get-Command mysql`、`where.exe mysql` 和 `mysql --version`；PATH 找不到时，必须在常见安装目录搜索 `mysql.exe`，找到后用绝对路径执行 `mysql.exe --version`。本地或远程数据库都适用；PATH 和搜索都找不到可执行 MySQL CLI 时，全局状态记为 `blocked_missing_mysql_cli`，不得进入后续 PRD/UI/技术设计或开发阶段。
- 前端开发必须同步维护 mock 数据；当后端接口无法连接、未完成或本地环境不可用时，页面应使用 mock 数据展示主流程和关键状态。
- 后续新增需求或修改需求的代码后，必须判断是否需要更新 `project/docs/patterns/` 框架模式缓存；如果新增了可复用的后端、前端、权限、SQL、测试或流程模式，必须同步更新对应缓存文档，并在需求状态文件记录“缓存读取/命中/更新”。
- 本项目已引入 `Agents365-ai/365-skills` 到 `.codex/skills/`。工作流、阶段产物或说明中凡涉及绘制流程图、架构图、模块图、ERD、状态机图、时序图、任务图、DAG、依赖图或其他系统可视化，必须优先使用 `.codex/skills/mermaid-skill`；需要可编辑 Draw.io 文件、复杂样式、泳道、厂商图标或精细布局时使用 `.codex/skills/drawio-skill`；需要 PlantUML/UML 语义时使用 `.codex/skills/plantuml-skill`；需要手绘白板风格时使用 `.codex/skills/excalidraw-skill`。使用前必须读取对应 `SKILL.md`，并按 skill 要求生成、校验和导出图形产物。
- 开发前必须提供开发模式选择：简单 CRUD 快速模式、标准 SDLC 模式、高风险严格模式、自定义。所有模式都必须使用 `.codex/skills/snowy-framework-reader` 读取 `project/docs/patterns/` 缓存；区别是快速模式以缓存为主路径减少探索，标准模式把缓存作为加速输入并继续完整设计，严格模式在读取缓存后仍做更深审查和验证。
- 涉及资金、权限、状态机、库存或资源、用户数据、删除和批量操作的改动必须重点审查。
- 所有功能都必须有验收标准、测试结果和残余风险说明。
- 本次新增、重命名或删除的非代码产物已同步到根目录 `PROJECT_ARTIFACTS.html`，且导航链接不存在失效项。

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

## 文件编码规范

- 仓库文本文件统一使用 UTF-8；根目录 `.editorconfig` 已声明默认编码。
- Markdown、workflow、agent、skill、需求、状态、Java、Vue、TypeScript、JavaScript、JSON、YAML、TOML、properties 文件都必须按 UTF-8 保存。
- Windows PowerShell 读写中文文件时必须显式指定 `-Encoding UTF8`。
- 不得使用 `Set-Content`、`Out-File`、重定向符号 `>`、`>>` 写入中文文件，除非显式指定 UTF-8 且确认不会整文件转码。
- Agent 修改文件优先使用 `apply_patch`；需要整文件生成时，先确认目标文件编码，并在生成后用 UTF-8 读取检查是否乱码。
- 如果发现 `�`、`锟斤拷`、`涓`、`鏂` 等乱码，应停止继续追加内容，先恢复或重写为 UTF-8 后再改动。

## 输出语言规范

- 默认输出语言为简体中文。
- `docs/requirements/`、`docs/prd/`、`docs/design/`、`docs/architecture/`、`docs/data/`、`docs/workflow/`、`docs/superpowers/` 下的 Markdown/HTML 产物默认使用中文。
- 使用 superpowers、第三方模板或英文示例生成计划时，最终落盘文件必须转成中文；只保留必要的英文技术名词、路径、命令、类名、方法名和 API。
- 如果用户要求英文，才允许生成英文文档，并在文件中记录“输出语言: English”。

## 标准开发流程

前置 1. Orchestrator 先执行开发环境检测，只输出环境清单和环境选择项；状态为 `需确认` 时只能等待开发者选择，不创建分支或状态文件。
前置 2. 环境检测通过或开发者选择“环境有警告但继续”后，Orchestrator 再执行分支确认，输出当前 Git 分支和工作区状态。
前置 3. 开发者确认当前分支作为开发分支后，Orchestrator 才能从当前分支创建新的需求集成分支，并记录开发分支和需求集成分支。
1. Orchestrator 读取 `docs/requirements/` 下的全部需求文档，并读取 `project/docs/` 下的框架文档和 `project/docs/patterns/` 模式缓存；使用 `.codex/skills/snowy-framework-bootstrap` 输出或更新框架运行提示和本机环境检测清单；未确认或阻塞则停在本阶段。
2. Orchestrator 提供开发模式选择：简单 CRUD 快速模式、标准 SDLC 模式、高风险严格模式、自定义。
3. Orchestrator 询问是否需要 PRD 和 UI 设计；开发者可明确跳过。简单 CRUD 快速模式可默认跳过 PRD/UI，但必须保留最小需求说明、字段、接口、验收标准、风险记录；如涉及后管页面，还必须保留后管菜单设计。
4. 如未跳过，Product Agent 基于需求和现有框架能力生成 PRD、验收标准、HTML PRD 和可交互低保真 HTML 原型；如涉及后管页面，必须套用 `.codex/workflows/admin-prototype-design-workflow.md`，PRD 和原型必须体现菜单层级、入口、权限、Snowy CRUD 形式和覆盖矩阵；如同时涉及后管和 H5，必须分别生成后管低保真原型和 H5 低保真原型。
5. 如未跳过 UI，Design Agent 建立设计系统，并连接 Figma 生成可落地设计稿。
6. Architect Agent 明确模块边界、状态机、API、数据模型、安全模型和可运维性。简单 CRUD 快速模式可用轻量技术方案替代完整架构文档。
7. Data Agent 细化数据库模型、migration、索引、回滚和数据一致性策略。简单 CRUD 快速模式可合并到轻量技术方案或开发清单。
8. Orchestrator 按用户价值拆 feature slice；简单 CRUD 快速模式可压缩为“后端+SQL+权限”“前端+mock”“验证+状态”三类任务。
9. Orchestrator 套用 `.codex/workflows/auto-dispatch-parallel-development.md`，从需求集成分支创建 worktree 开发分支/目录，生成任务图、依赖 DAG、并行 wave、owner 分配和集成策略；简单 CRUD 快速模式只生成轻量执行清单。
10. Frontend、Backend、Data、QA 等 Agent 在 worktree 开发分支/目录中开发并提交。
11. worktree 开发完成后，合并回需求集成分支，并在需求集成分支验证。
12. 需求集成分支确认无误后，Orchestrator 询问开发者是否合并回开发分支。
13. 本地运行必要检查后提交 PR。
14. Reviewer、Security、QA Agent 做审查。
15. CI 运行 lint、typecheck、test、build、安全扫描等项目定义的质量门禁。
16. 人工负责人审批后合并。
17. 预发验证、灰度发布、全量发布。
18. 发布后监控核心指标和用户反馈。

## 通用 Definition of Done

一个功能完成必须满足：

- `docs/requirements/` 下的需求文档已全部读取，并在产物中列出已引用的需求来源。
- `project/docs/` 下的框架说明和开发规范已全部读取，并在技术产物中列出已引用的框架来源。
- `project/docs/patterns/` 下相关框架模式缓存已读取；开发完成后已判断是否需要更新缓存，并在需求状态文件中记录结果。
- 首次流程已输出 Snowy 框架运行提示，并在 `docs/workflow/local-environment-status.md` 记录开发环境检测清单；环境自检是全局一次，未确认或存在阻塞项时任何需求不得进入后续阶段。
- PRD 或最小需求说明已确认；如跳过 PRD，已记录跳过原因。
- 如涉及后管、后台、管理端或运营端页面，后管菜单设计已明确，包括菜单层级、菜单名称、路由路径、权限标识、入口位置和可见角色。
- 如涉及后管、后台、管理端或运营端页面且未跳过原型，已执行 Snowy 后管拟真原型设计工作流，已基于完整原始 Demo 复用抽取组件生成后管原型，并输出框架参考清单、菜单映射、CRUD 形式选择、组件复用清单和覆盖矩阵。
- 如涉及后管、后台、管理端或运营端页面且未跳过原型，已输出需求到原型页面蓝图并通过 `validate_admin_blueprint.py`；每个独立页面都有原始需求摘录、原子需求清单、同步字段、展示字段、筛选字段、查询字段、表格字段、详情字段、新增字段、编辑字段、状态字段、敏感字段、操作按钮、状态/异常、权限和字段展示形态；每项均来自需求、框架惯例或明确标记待确认；覆盖矩阵能追溯到蓝图和 HTML，且不得使用范围行自称覆盖。
- 如未跳过 PRD，HTML 版 PRD 已生成并可打开。
- 如未跳过原型，可交互低保真 HTML 原型已生成并可打开，主路径页面切换、关键按钮和核心状态可点击验证；原型已参考现有框架，后管与 H5/移动端原型分文件输出，并通过原型需求覆盖矩阵证明全部功能点已覆盖或记录未覆盖原因。
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

当 `状态` 为 `需确认` 时，Orchestrator 必须优先给出选择项。常用决策节点如下：

| 决策节点 | 默认选择项 |
| --- | --- |
| 开发环境检测 | 环境通过，进入分支确认；环境有警告但继续；环境阻塞先处理；暂停 |
| 分支确认 | 以当前分支作为开发分支并继续；切换到其他分支；暂停 |
| 开发模式决策 | 简单 CRUD 快速模式；标准 SDLC 模式；高风险严格模式；自定义 |
| PRD/原型决策 | 生成 PRD 和低保真原型；跳过 PRD，进入 UI 决策；跳过 PRD 和 UI，进入技术方案 |
| UI/Figma 决策 | 生成 UI/Figma；跳过 UI，复用 Snowy 现有 UI；返回补充 PRD |
| 技术方案确认 | 确认并进入开发拆分；需要调整；返回补充需求 |
| 开发完成确认 | 进入测试；继续开发；暂停 |
| 验收确认 | 验收通过；有问题需修复；记录风险后通过 |

## 开发模式

| 模式 | 适用场景 | 缓存使用 | 任务粒度 |
| --- | --- | --- | --- |
| 简单 CRUD 快速模式 | 后台单表或少量表 CRUD，常规分页、搜索、新增、编辑、删除，无复杂状态机和高风险规则 | 必读并优先按缓存实现，只补读少量参考代码 | 后端+SQL+权限、前端+mock、验证+状态 |
| 标准 SDLC 模式 | 一般功能、多个模块、有一定业务规则或交互流程 | 必读，作为加速输入；仍输出完整技术/数据/任务拆分 | 正常 Feature Slice、DAG、Wave |
| 高风险严格模式 | 金额、权限、状态机、资源扣减、外部回调、敏感数据、批量高风险操作 | 必读，但不能替代实际代码审查和安全/QA 深查 | 更细任务、更强 Review/QA/Security |
| 自定义 | 开发者指定流程 | 按用户选择，但不得跳过必要缓存读取和风险记录 | 按确认结果 |

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
- `PROJECT_ARTIFACTS.html`：仓库全部非代码交付产物的分类导航，由 `scripts/update_artifact_index.py` 自动维护。
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
- `project/docs/patterns/`：框架预读缓存，记录后端 CRUD、前端 CRUD、权限 SQL、migration 和缓存更新规则。
