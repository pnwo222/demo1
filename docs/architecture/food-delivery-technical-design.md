# 外卖平台技术设计

## 1. 已读取材料

| 类型 | 路径或链接 |
| --- | --- |
| 当前需求文档 | `docs/requirements/food-delivery-platform.md` |
| HTML PRD | `docs/prd/food-delivery-platform-prd.html` |
| 低保真 HTML 原型 | `docs/design/food-delivery-low-fidelity-prototype.html` |
| Figma 设计摘要 | `docs/design/food-delivery-figma-design-summary.md` |
| Figma 文件 | https://www.figma.com/design/Q0JsHmE1sJB2Y75xlGYJir |

## 2. 架构目标

本期目标是支撑外卖主链路闭环：

```text
用户浏览商家 -> 选择商品 -> 加入购物车 -> 下单 -> 支付 -> 商家接单 -> 配送 -> 完成/取消/退款
```

技术设计优先保障：

- 金额以后端可信计算为准。
- 支付、退款、取消具备幂等和审计。
- 库存、订单、支付状态一致。
- 用户、商家、骑手、运营和管理员具备清晰权限隔离。
- Vue 3 H5 端只做展示、预估和交互，不作为关键业务规则的最终判断来源。

## 3. 模块边界

| 模块 | 前端职责 | 后端职责 | 数据职责 |
| --- | --- | --- | --- |
| 用户与地址 | 展示登录态、地址选择、不可配送提示 | 用户身份识别、地址归属和配送范围校验 | 用户、地址、配送范围索引 |
| 商家 | 商家列表、详情、营业/休息状态展示 | 商家查询、营业状态、配送规则 | 商家、门店、营业时间、配送规则 |
| 商品与 SKU | 类目、商品、SKU、库存和上下架状态展示 | 商品查询、SKU 校验、上下架和库存读写 | 商品、SKU、库存流水 |
| 购物车 | 加购、减购、清空、金额预估 | 购物车持久化或会话态、商品有效性校验 | 购物车项、快照或缓存 |
| 优惠和费用 | 展示优惠、配送费、包装费、预估金额 | 可信金额计算、优惠适用、费用拆分 | 优惠券、活动、费用明细 |
| 订单 | 确认页、订单列表、订单详情、状态展示 | 创建订单、状态机流转、取消、退款申请 | 订单主表、明细、费用快照、状态流转 |
| 支付 | 发起支付、展示支付结果 | 支付单创建、回调验签、金额校验、幂等 | 支付单、支付回调日志 |
| 商家履约 | 接单、制作中、出餐入口 | 商家权限校验、履约状态流转 | 履约记录、状态日志 |
| 配送 | 展示配送状态 | 配送任务分配、骑手状态更新 | 配送任务、骑手分配 |
| 评价 | 完成后评价入口 | 评价提交、展示和风控 | 评价表 |
| 审计与异常 | 展示处理结果 | 关键操作审计、异常订单处理 | 审计日志、异常单 |

## 4. 前后端职责分界

前端 Vue 3 H5：

- 使用 SFC 组织页面组件。
- 使用 Pinia 管理购物车、当前订单、地址和支付结果等跨页状态。
- 使用 Vue Router 管理商家列表、商家详情、购物车、确认订单、支付结果、订单详情。
- 负责 loading、empty、error、disabled、toast 和移动端适配。
- 展示购物车金额预估，但提交订单后必须使用后端返回金额。
- 前端隐藏按钮仅提升体验，不作为权限边界。

后端 Java 服务端：

- 负责所有可信业务规则，包括金额、库存、状态机、权限、支付和退款。
- 使用整数分或 BigDecimal 计算金额，不使用浮点数。
- 使用事务、幂等键、唯一约束和审计日志保护核心链路。
- 对外提供可测试 API，返回可读错误码和错误原因。
- 所有状态流转必须由后端状态机校验。

## 5. 订单状态机

| 当前状态 | 目标状态 | 触发方 | 资源影响 | 审计 | 备注 |
| --- | --- | --- | --- | --- | --- |
| 待支付 | 已支付 | 支付回调 | 确认支付，确认或扣减库存 | 必须 | 验签、金额、订单号、幂等通过后才允许 |
| 待支付 | 已取消 | 用户或超时任务 | 释放锁定库存 | 必须 | 未支付取消不产生退款 |
| 已支付 | 商家已接单 | 商家 | 进入履约 | 必须 | 商家只能操作自己门店订单 |
| 商家已接单 | 制作中 | 商家 | 更新履约进度 | 必须 | 通知用户 |
| 制作中 | 待配送 | 商家 | 生成或等待配送任务 | 必须 | 通知骑手或调度系统 |
| 待配送 | 配送中 | 骑手 | 配送任务开始 | 必须 | 骑手只能操作分配任务 |
| 配送中 | 已完成 | 骑手或系统 | 完成履约 | 必须 | 可开放评价 |
| 已支付 / 商家已接单 / 制作中 | 退款中 | 用户或运营 | 冻结退款流程 | 必须 | 退款是否允许需结合履约状态 |
| 退款中 | 已退款 | 退款回调 | 确认退款金额和资金状态 | 必须 | 回调幂等 |

状态机实现要求：

- 后端维护显式 transition 表或枚举映射。
- 每次流转记录 `from_status`、`to_status`、`actor_type`、`actor_id`、`reason`、`request_id`。
- 非法跳转返回业务错误码，不修改订单。
- 状态更新必须带当前状态条件，例如 `where id = ? and status = ?`，防止并发覆盖。

## 6. 核心 API 设计

统一约定：

- 认证：`Authorization: Bearer <token>`。
- 幂等：涉及创建订单、支付回调、退款回调、取消等高风险操作必须带 `idempotencyKey` 或使用业务唯一键。
- 金额单位：对外可展示元字符串，接口内部金额字段建议使用整数分 `amountCent`。
- 错误响应包含 `code`、`message`、`traceId`。

### 用户 H5 API

| 方法 | 路径 | 用途 | 关键校验 |
| --- | --- | --- | --- |
| GET | `/api/h5/merchants` | 商家列表 | 地址可配送、营业状态 |
| GET | `/api/h5/merchants/{merchantId}` | 商家详情 | 商家可见、营业信息 |
| GET | `/api/h5/merchants/{merchantId}/products` | 商品和 SKU | 上下架、库存展示 |
| GET | `/api/h5/cart` | 获取购物车 | 用户归属 |
| POST | `/api/h5/cart/items` | 加购 | SKU 上架、库存提示、商家一致 |
| PATCH | `/api/h5/cart/items/{itemId}` | 改数量 | 用户归属、库存提示 |
| DELETE | `/api/h5/cart/items` | 清空购物车 | 用户归属 |
| POST | `/api/h5/orders/preview` | 订单预览和后端重算 | 地址、库存、营业、金额 |
| POST | `/api/h5/orders` | 创建订单 | 幂等、库存、金额、地址 |
| POST | `/api/h5/orders/{orderId}/cancel` | 取消订单 | 归属、状态机 |
| GET | `/api/h5/orders/{orderId}` | 订单详情 | 归属和数据隔离 |
| POST | `/api/h5/orders/{orderId}/refunds` | 申请退款 | 归属、状态机、金额 |

### 支付 API

| 方法 | 路径 | 用途 | 关键校验 |
| --- | --- | --- | --- |
| POST | `/api/h5/orders/{orderId}/payments` | 创建支付单 | 订单归属、待支付状态、金额 |
| POST | `/api/payment/callbacks/{channel}` | 支付回调 | 签名、金额、订单号、渠道流水幂等 |
| POST | `/api/refund/callbacks/{channel}` | 退款回调 | 签名、金额、退款单号、幂等 |

### 商家和配送 API

| 方法 | 路径 | 用途 | 关键校验 |
| --- | --- | --- | --- |
| GET | `/api/merchant/orders` | 商家订单列表 | 商家门店归属 |
| POST | `/api/merchant/orders/{orderId}/accept` | 接单 | 商家归属、状态机 |
| POST | `/api/merchant/orders/{orderId}/cooking` | 制作中 | 商家归属、状态机 |
| POST | `/api/merchant/orders/{orderId}/ready` | 出餐待配送 | 商家归属、状态机 |
| GET | `/api/rider/tasks` | 骑手任务列表 | 骑手归属 |
| POST | `/api/rider/tasks/{taskId}/pickup` | 取餐配送中 | 任务归属、状态机 |
| POST | `/api/rider/tasks/{taskId}/complete` | 送达完成 | 任务归属、状态机 |

## 7. 数据模型概要

| 实体 | 关键字段 |
| --- | --- |
| `user` | `id`、`mobile`、`status`、`created_at` |
| `user_address` | `id`、`user_id`、`receiver`、`phone`、`geo_point`、`detail` |
| `merchant` | `id`、`name`、`status`、`business_status`、`delivery_rule_id` |
| `product_category` | `id`、`merchant_id`、`name`、`sort_no` |
| `product` | `id`、`merchant_id`、`category_id`、`name`、`status` |
| `sku` | `id`、`product_id`、`name`、`price_cent`、`package_fee_cent`、`status` |
| `inventory` | `sku_id`、`available_qty`、`locked_qty`、`version` |
| `cart_item` | `id`、`user_id`、`merchant_id`、`sku_id`、`quantity` |
| `order` | `id`、`order_no`、`user_id`、`merchant_id`、`status`、`pay_status`、`total_amount_cent`、`pay_amount_cent` |
| `order_item` | `id`、`order_id`、`sku_id`、`sku_snapshot`、`quantity`、`price_cent` |
| `order_fee` | `order_id`、`fee_type`、`amount_cent`、`source_ref` |
| `payment_order` | `id`、`payment_no`、`order_id`、`channel`、`amount_cent`、`status`、`channel_trade_no` |
| `refund_order` | `id`、`refund_no`、`order_id`、`amount_cent`、`status`、`reason` |
| `delivery_task` | `id`、`order_id`、`rider_id`、`status` |
| `order_status_log` | `id`、`order_id`、`from_status`、`to_status`、`actor_type`、`actor_id`、`request_id` |
| `audit_log` | `id`、`biz_type`、`biz_id`、`action`、`actor_type`、`actor_id`、`result`、`trace_id` |

详细字段、索引、唯一约束和 migration 顺序由阶段 4 Data Agent 输出。

## 8. 一致性、幂等和事务策略

### 下单

1. 前端调用 `orders/preview` 获取后端重算金额。
2. 前端提交订单时带 `idempotencyKey` 和预览版本。
3. 后端事务内校验商家营业、商品上架、库存、地址可配送和金额。
4. 创建订单、订单明细、费用快照、状态日志。
5. 库存策略建议本期采用“下单锁库存，未支付超时释放；支付确认后转为已扣减”。

### 支付回调

- 以渠道流水号、支付单号或回调事件 ID 建唯一约束。
- 回调先落库，再校验签名、金额、订单号和支付状态。
- 更新支付单和订单状态时使用条件更新。
- 重复回调返回成功但不重复扣款、不重复状态流转。

### 退款

- 退款申请创建退款单，金额以后端订单费用快照为准。
- 退款回调以退款单号和渠道退款流水幂等。
- 已退款后不得重复退款。

### 库存并发

- 使用 `available_qty >= quantity` 条件更新，或乐观锁 `version`。
- 记录库存流水，包含锁定、释放、扣减和补偿。
- 超时未支付订单由定时任务释放库存。

## 9. 权限和安全模型

| 角色 | 数据边界 | 后端校验 |
| --- | --- | --- |
| 用户 | 自己的地址、购物车、订单、退款 | `user_id = currentUser.id` |
| 商家 | 自己门店、商品、订单 | `merchant_id in currentMerchantScope` |
| 骑手 | 分配给自己的配送任务 | `rider_id = currentRider.id` |
| 平台运营 | 按运营角色和数据范围 | RBAC + 数据范围 |
| 管理员 | 系统配置、安全和运维 | 最小权限 + 强审计 |

安全要求：

- 支付和退款回调必须验签，拒绝伪造回调。
- 敏感接口限流，防止重复提交、刷单和接口滥用。
- 订单详情、退款、商家履约和骑手任务必须防越权。
- 审计日志记录高风险操作，不记录完整密钥、支付签名原文或敏感个人信息。
- Secret Scan、SCA、SAST、DAST 作为发布门禁。

## 10. 日志、指标和告警

日志：

- 每个请求生成 `traceId`。
- 订单、支付、退款、库存、状态机流转写业务日志和审计日志。
- 支付回调记录原始事件摘要、验签结果、金额校验结果和幂等命中结果。

指标：

- 下单成功率。
- 支付成功率。
- 支付回调重复率。
- 支付回调验签失败数。
- 订单非法状态跳转次数。
- 库存扣减失败数。
- 越权拦截次数。
- 退款处理时长。

告警：

- 支付验签失败突增。
- 支付成功率低于阈值。
- 重复回调率异常上升。
- 库存扣减失败或超卖风险。
- P0/P1 接口错误率上升。

## 11. 灰度和回滚影响

灰度：

- 支付、退款、库存和订单状态机改动应使用 Feature Flag 或灰度商家范围。
- 前端 H5 新页面可按用户或商家分流。
- 先在预发环境完成支付回调、库存并发和越权测试。

回滚：

- 前端静态资源可回滚到上一版本。
- 后端接口需保持向后兼容，新增字段默认可空或有默认值。
- migration 禁止破坏性删除；先加字段、双写或兼容读，再清理。
- 状态机新增状态需提供旧版本兼容映射。

## 12. 风险与取舍

| 风险 | 等级 | 应对 |
| --- | --- | --- |
| 重复支付或重复退款 | P0 | 渠道流水唯一约束、幂等表、条件更新、审计 |
| 越权访问订单或商家数据 | P0 | 后端数据范围校验、安全审查、越权测试 |
| 金额不一致 | P0 | 费用快照、后端重算、金额字段整数分或 BigDecimal |
| 库存超卖 | P1 | 条件更新、库存流水、超时释放、并发测试 |
| 状态机非法跳转 | P1 | 显式 transition 表、条件更新、状态机单测 |
| 图片质量和加载失败 | P2 | CDN 多规格裁切、失败占位图、懒加载 |
| 复杂营销规则膨胀 | P2 | 本期只支持基础优惠券和满减，复杂营销后置 |

## 13. ADR 建议

建议后续写入 ADR：

- ADR-001：金额字段统一使用整数分还是 Java BigDecimal。
- ADR-002：库存采用下单锁定还是支付后扣减。
- ADR-003：订单状态机实现方式，枚举映射还是数据库 transition 表。
- ADR-004：支付回调幂等键选择，渠道流水号、支付单号或事件 ID。

## 14. 阶段 4 输入

Data Agent 下一阶段需要基于本文输出：

- 详细表结构和字段类型。
- 索引、唯一约束和外键或逻辑约束。
- migration 顺序。
- 回滚或兼容策略。
- 库存、支付、订单状态一致性相关的数据风险。
