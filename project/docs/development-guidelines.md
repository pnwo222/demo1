# 基于 Snowy 框架的开发规范

## 总原则

- 后续开发是基于 `project/` 现有框架增量扩展，不从零创建独立的新项目结构。
- Agent 执行工作流时必须同时读取需求文档和框架文档：`docs/requirements/**`、`project/docs/**`。
- 开发前必须读取 `project/docs/patterns/**` 框架模式缓存；所有模式都读缓存。简单 CRUD 快速模式优先使用缓存减少重复探索；标准模式使用缓存加速但仍保留完整设计和审查；高风险严格模式读取缓存后仍需补读实际代码和高风险链路。
- 首次执行项目工作流前，必须使用 `.codex/skills/snowy-framework-bootstrap` 输出框架运行提示，请开发者先自行确认当前 Snowy 框架能否正常运行。默认不由 Agent 自动执行环境安装、构建、启动或校验脚本，除非用户明确要求。开发环境清单未确认前，不进入 PRD/UI/技术设计或开发阶段。IntelliJ IDEA 是后端本地开发必备工具，开发者必须在 IDEA 中导入 `project/`、配置 JDK 17/Maven 并运行后端启动类。
- 环境检测输出必须使用列表布局，每项以 `✅`、`⚠️`、`❌` 标明结果。必检项包括 Git、Node.js、npm、前端依赖、JDK 17、Maven、IDEA、MySQL CLI、MySQL 服务、Redis 服务。
- 环境检测结果写入 `docs/workflow/local-environment-status.md`，该文件必须被 `.gitignore` 忽略，不提交到 Git；`docs/workflow/status.md` 仍是可提交的项目级状态和需求索引。
- 修改代码前先识别目标功能应落在哪个 Snowy 模块、插件或前端目录，并在阶段输出中说明映射关系。
- 修改代码后必须判断是否需要更新 `project/docs/patterns/`；如果新增了可复用框架模式、例外规则或更好的模板，必须同步更新缓存。
- 修改代码前必须确认 Git 分支链路：先确认当前分支作为最终合并目标，再创建需求集成分支，实际开发从需求集成分支创建 worktree 开发分支/目录；worktree 完成后先合并回需求集成分支，验证无误后再询问是否合并回最初当前分支。
- 优先复用现有组件、接口封装、权限体系、异常处理、分页、字典、日志、审计、配置、文件和消息能力。
- 不清楚业务规则、权限规则、状态机、金额规则、库存或资源一致性时，不直接进入代码开发。

## 编码规范

- 所有文本文件统一使用 UTF-8 编码，遵循仓库根目录 `.editorconfig`。
- Markdown、需求文档、workflow、agent、skill、状态文件、Java、Vue、TypeScript、JavaScript、JSON、YAML、TOML、properties 都必须按 UTF-8 保存。
- Windows PowerShell 读取中文文件必须使用 `Get-Content -Encoding UTF8`。
- Windows PowerShell 写入中文文件必须使用 `Set-Content -Encoding UTF8` 或 `Out-File -Encoding UTF8`；不允许使用未指定编码的 `>`、`>>`、`Set-Content`、`Out-File` 更新中文文件。
- Agent 修改 Markdown 和状态文件时优先使用 `apply_patch` 做局部修改，不整文件重写。
- 如果文件中出现 `�`、`锟斤拷`、`涓`、`鏂` 等乱码，先修复编码，不继续追加记录。

## 输出语言规范

- 项目文档和阶段产物默认使用简体中文。
- PRD、原型说明、技术方案、数据方案、开发计划、测试计划、Review、验收记录、状态文件和 `docs/superpowers/**` 产物必须默认中文。
- 代码标识符、文件路径、命令、API、类名、方法名、配置键和 SQL 标识符可以保留英文。
- 使用 superpowers 或第三方英文模板时，最终落盘文件必须转成中文，除非开发者明确要求英文。

## 前端规范

默认前端目录：

```text
project/snowy-admin-web/
```

前端必需环境：

- Git。
- Node.js，建议 18+。
- npm；本项目存在 `package-lock.json`，默认使用 npm。
- `node_modules`；首次运行前执行 `npm install`。
- Vite dev server；执行 `npm run dev` 后打开输出地址，通常是 `http://localhost:5173`。

开发要求：

- 页面放入与业务域对应的 `src/views/` 子目录。
- 接口调用优先放入 `src/api/`，不要在页面中散落硬编码 URL。
- 路由接入遵循现有 `src/router/`、菜单和权限约定。
- 状态管理遵循现有 Pinia store 组织方式。
- UI 优先复用 Ant Design Vue、现有 `src/components/` 和 Snowy 已有页面模式。
- 必须覆盖 loading、empty、error、无权限、接口失败和长文本等状态。
- 后端不可用时，同步维护 mock 数据、mock adapter 或可降级数据来源，保证主流程可演示。
- 金额、库存、权限和状态流转只做展示或预校验，最终以后端可信结果为准。

前端运行：

```powershell
cd project/snowy-admin-web
npm install
npm run dev
```

开发者打开 Vite 输出的本地地址，通常是 `http://localhost:5173`。如需生产构建，再手动执行 `npm run build`。

## 后端规范

默认后端目录映射：

```text
project/snowy-web-app/       # 主启动模块
project/snowy-plugin/        # 插件实现
project/snowy-plugin-api/    # 插件 API 契约
project/snowy-common/        # 公共能力
```

后端必需环境：

- IntelliJ IDEA，用于打开 `project/` 并运行后端启动类。
- JDK 17；IDEA Project SDK、Modules SDK、Java Compiler、Maven importer、Maven runner 均必须使用 JDK 17。
- Maven；本项目无 `mvnw`，可使用命令行 Maven，或使用 IDEA Maven home/importer/runner。
- MySQL 服务和 MySQL CLI；CLI 可来自 PATH，也可使用搜索到的 `mysql.exe` 绝对路径。
- Redis 服务。
- 后端配置文件：`project/snowy-web-app/src/main/resources/application.properties`。

开发要求：

- Controller、Service、Mapper、Entity、Param、Result、Provider 等分层遵循目标插件已有结构。
- 新业务优先放入合适插件；跨插件能力先定义 API 契约，再实现 provider。
- 数据访问遵循 MyBatis-Plus 和现有 mapper XML 约定。
- 返回值、异常、分页、排序、删除标记、字典和审计日志优先复用 `snowy-common` 与现有插件能力。
- 权限必须在后端校验，前端隐藏按钮不等于安全。
- 金额使用整数分或 `BigDecimal`，禁止使用浮点数直接计算。
- 状态机、外部回调、资源扣减、逆向流程、批量操作必须考虑幂等、事务、并发和审计。
- 不涉及数据库操作的后端编码，可在本地运行环境缺失时继续推进，并记录未执行验证、预期验证命令和环境恢复后的验证步骤。
- 开发环境检测必须先检测开发电脑是否存在可用 MySQL CLI；PowerShell 先执行 `Get-Command mysql`、`where.exe mysql` 和 `mysql --version`。PATH 找不到时，必须在常见安装目录搜索 `mysql.exe`，找到后用绝对路径执行 `mysql.exe --version`。本地或远程数据库都适用；PATH 和搜索都找不到可执行 MySQL CLI 时全局状态记为 `blocked_missing_mysql_cli`，不得进入 PRD/UI/技术设计或开发阶段。

后端可选命令行检查：

```powershell
cd project
mvn test
mvn package
```

默认后端由开发者在 IDEA 中运行；如本地环境缺少 JDK、Maven、MySQL 或 Redis，应在报告中说明开发者自检未完成或运行失败原因。

后端运行前必须确认 Java、MySQL、Redis 配置：

- IDEA Project SDK、Modules SDK、Java Compiler、Maven importer、Maven runner 必须全部使用 JDK 17。
- MySQL、Redis 配置位于 `project/snowy-web-app/src/main/resources/application.properties`。
- 数据库操作需要本机可用的 `mysql` 指令；缺失时先安装 MySQL Client 或把 `mysql.exe` 所在目录加入 PATH。
- MySQL 必填配置项：`spring.datasource.dynamic.datasource.master.url`、`spring.datasource.dynamic.datasource.master.username`、`spring.datasource.dynamic.datasource.master.password`。
- 修改数据库名时，只修改 MySQL JDBC URL 中 `host:port/` 后、`?` 前的库名。例如 `jdbc:mysql://localhost:3306/snowy?...` 改为 `jdbc:mysql://localhost:3306/demo?...`。
- Redis 必填配置项：`spring.data.redis.host`、`spring.data.redis.port`、`spring.data.redis.database`、`spring.data.redis.password`。
- Agent 可先询问开发者 MySQL 地址、端口、库名、账号、密码，以及 Redis 地址、端口、库号、密码；只有在开发者明确要求时，才按开发者提供的值修改配置文件。
- 如果开发者只要求修改数据库名，Agent 只询问新库名，并只更新 `spring.datasource.dynamic.datasource.master.url`，不改 host、port、账号、密码和 URL 查询参数。
- 也可以让开发者自行修改 `application.properties`，修改后由开发者重新启动后端验证。
- 端口可达只代表网络可连，不代表账号、密码、库名一定正确；后端启动失败时必须回到配置文件核对。

当命令行缺少 JDK 17 或 Maven 时，使用 IDEA 兜底验证：

1. IDEA 打开 `project/`。
2. `File > Project Structure > Project` 设置 SDK 为 JDK 17。
   - 如果 SDK 下拉框只有 `1.8 java version "1.8.0_381"` 或 `<无 SDK>`，选择 `添加 SDK > 下载 JDK`。
   - 版本选择 `17`。
   - 供应商选择 `Eclipse Temurin` 或 `JetBrains Runtime`。
   - 下载完成后选择新 JDK 17，并把语言级别设置为 `17`。
3. `File > Project Structure > Modules` 中把所有模块 SDK 设置为 `Project SDK 17`，至少包括 `snowy-common`、`snowy-plugin`、`snowy-plugin-api`、`snowy-web-app`。
4. `Settings > Build, Execution, Deployment > Compiler > Java Compiler` 中把项目和模块字节码目标设置为 `17`。
5. `Settings > Build, Execution, Deployment > Build Tools > Maven` 确认 Maven home。
6. Maven importer 和 runner 的 JDK/JRE 都选择 JDK 17。
7. 等待 Maven 导入完成。
8. 运行 `project/snowy-web-app/src/main/java/vip/xiaonuo/Application.java`。
9. 用 `Test-NetConnection 127.0.0.1 -Port 82` 验证后端端口。

## 数据和 Migration 规范

- 新表、字段、索引、唯一约束和初始化数据必须由 Data Agent 或对应 owner 明确。
- 涉及金额、业务单据、资源数量、状态、权限归属、外部流水、幂等键的字段必须明确类型和约束。
- 避免破坏性 migration；删除字段、改字段类型、清洗生产数据必须有兼容和回滚方案。
- 历史业务单据、交易记录、逆向流程、价格、费用和规则结果等应保存必要快照，避免主数据变更污染历史记录。
- 高并发资源扣减必须说明锁、乐观锁、唯一约束、事务边界或补偿策略。

## 工作流读取要求

Orchestrator 在进入任意阶段前必须读取并输出：

- `docs/requirements/` 下的全部需求文档清单。
- `project/docs/` 下的全部框架文档清单。
- `project/docs/patterns/` 下相关缓存文档清单。
- 本次涉及的前端、后端、数据模块路径映射。
- 需要复用或遵循的现有框架能力。
- 缓存是否命中，以及开发后是否更新缓存。

各专业 Agent 的输入材料必须包含框架文档摘要，不允许只拿需求文档直接按空白项目生成方案。

## 高风险重点

业务需求中，下列内容必须重点审查：

- 金额、交易、逆向流程、取消和补偿。
- 费用、优惠、价格和金额计算。
- 资源上下架、库存或额度扣减、前后端价格或状态一致性校验。
- 不同角色、组织、租户或运营主体之间的数据隔离。
- 外部回调签名、金额、业务编号和幂等校验。
- 状态机非法流转和重复提交。
- 批量操作、删除、导入导出和后台权限。

这些改动必须经过 Review、QA、Security 和必要 CI 门禁，不允许开发 Agent 自己给自己放行。
