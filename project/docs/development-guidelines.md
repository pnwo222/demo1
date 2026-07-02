# 基于 Snowy 框架的开发规范

## 总原则

- 后续开发是基于 `project/` 现有框架增量扩展，不从零创建独立的新项目结构。
- Agent 执行工作流时必须同时读取需求文档和框架文档：`docs/requirements/**`、`project/docs/**`。
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

推荐检查：

```powershell
cd project/snowy-admin-web
npm install
npm run build
```

如项目未提供 lint/typecheck 脚本，不得伪造执行结果，应在完成报告中说明未执行原因。

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

推荐检查：

```powershell
cd project
mvn test
mvn package
```

如本地环境缺少 JDK、Maven、MySQL 或 Redis，应在报告中说明已完成的静态检查和未执行的运行验证。

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
