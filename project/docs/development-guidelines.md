# 基于 Snowy 框架的开发规范

## 总原则

- 后续开发是基于 `project/` 现有框架增量扩展，不从零创建独立的新项目结构。
- Agent 执行工作流时必须同时读取需求文档和框架文档：`docs/requirements/**`、`project/docs/**`。
- 首次执行项目工作流前，必须使用 `.codex/skills/snowy-framework-bootstrap` 输出框架运行提示，请开发者先自行确认当前 Snowy 框架能否正常运行。默认不由 Agent 自动执行环境安装、构建、启动或校验脚本，除非用户明确要求。开发者未确认前后端可运行前，不进入 PRD/UI/技术设计或开发阶段。IntelliJ IDEA 是后端本地开发必备工具，开发者必须在 IDEA 中导入 `project/`、配置 JDK 17/Maven 并运行后端启动类。
- 修改代码前先识别目标功能应落在哪个 Snowy 模块、插件或前端目录，并在阶段输出中说明映射关系。
- 优先复用现有组件、接口封装、权限体系、异常处理、分页、字典、日志、审计、配置、文件和消息能力。
- 不清楚业务规则、权限规则、状态机、金额规则、库存或资源一致性时，不直接进入代码开发。

## 前端规范

默认前端目录：

```text
project/snowy-admin-web/
```

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

开发要求：

- Controller、Service、Mapper、Entity、Param、Result、Provider 等分层遵循目标插件已有结构。
- 新业务优先放入合适插件；跨插件能力先定义 API 契约，再实现 provider。
- 数据访问遵循 MyBatis-Plus 和现有 mapper XML 约定。
- 返回值、异常、分页、排序、删除标记、字典和审计日志优先复用 `snowy-common` 与现有插件能力。
- 权限必须在后端校验，前端隐藏按钮不等于安全。
- 金额使用整数分或 `BigDecimal`，禁止使用浮点数直接计算。
- 状态机、支付回调、库存扣减、退款、取消、批量操作必须考虑幂等、事务、并发和审计。
- 本地 MySQL、Redis 或完整运行环境缺失时，不阻断编码；必须记录未执行验证、预期验证命令和环境恢复后的验证步骤。

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
- 涉及金额、订单、库存、状态、权限归属、外部流水、幂等键的字段必须明确类型和约束。
- 避免破坏性 migration；删除字段、改字段类型、清洗生产数据必须有兼容和回滚方案。
- 历史订单、支付、退款、价格、优惠、配送费等应保存必要快照，避免主数据变更污染历史记录。
- 高并发资源扣减必须说明锁、乐观锁、唯一约束、事务边界或补偿策略。

## 工作流读取要求

Orchestrator 在进入任意阶段前必须读取并输出：

- `docs/requirements/` 下的全部需求文档清单。
- `project/docs/` 下的全部框架文档清单。
- 本次涉及的前端、后端、数据模块路径映射。
- 需要复用或遵循的现有框架能力。

各专业 Agent 的输入材料必须包含框架文档摘要，不允许只拿需求文档直接按空白项目生成方案。

## 高风险重点

外卖平台需求中，下列内容必须重点审查：

- 下单、支付、退款、取消订单。
- 优惠、配送费、包装费和订单金额计算。
- 商品上下架、库存扣减和购物车价格校验。
- 用户、商家、骑手、平台运营、管理员之间的数据隔离。
- 支付回调签名、金额、订单号和幂等校验。
- 状态机非法流转和重复提交。
- 批量操作、删除、导入导出和后台权限。

这些改动必须经过 Review、QA、Security 和必要 CI 门禁，不允许开发 Agent 自己给自己放行。
