# 外卖平台数据设计

## 1. 已读取材料

| 类型 | 路径 |
| --- | --- |
| 当前需求文档 | `docs/requirements/food-delivery-platform.md` |
| 技术设计 | `docs/architecture/food-delivery-technical-design.md` |
| HTML PRD | `docs/prd/food-delivery-platform-prd.html` |
| Figma 设计摘要 | `docs/design/food-delivery-figma-design-summary.md` |

## 2. 数据设计原则

- 金额字段统一使用整数分 `*_amount_cent`、`*_fee_cent`、`*_price_cent`，禁止浮点数。
- 订单、支付、退款、库存、状态流转必须保留历史快照或流水。
- 用户、商家、骑手等权限归属字段必须直接落表，支持后端数据隔离校验。
- 高风险创建和回调操作必须具备唯一约束或幂等记录。
- migration 优先兼容旧代码：先新增、再双写/兼容读、最后清理，不做破坏性删除。
- 表名避免使用 SQL 保留字，订单主表建议使用 `fd_order` 而不是 `order`。

## 3. 数据实体和字段

字段类型以通用关系型数据库表达，真实 SQL 类型由后端数据库选型确认后再映射。

### 3.1 用户与地址

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_user` | `id bigint pk` | 用户 ID |
|  | `mobile varchar(32) unique` | 手机号，按隐私要求可加密或脱敏存储 |
|  | `status varchar(32)` | `ACTIVE`、`DISABLED` |
|  | `created_at datetime`、`updated_at datetime` | 创建和更新时间 |
| `fd_user_address` | `id bigint pk` | 地址 ID |
|  | `user_id bigint index` | 归属用户 |
|  | `receiver varchar(64)`、`phone varchar(32)` | 收件人信息 |
|  | `province/city/district varchar(64)` | 行政区 |
|  | `detail varchar(255)` | 详细地址 |
|  | `longitude decimal(10,6)`、`latitude decimal(10,6)` | 坐标 |
|  | `is_default boolean` | 默认地址 |
|  | `status varchar(32)` | `ACTIVE`、`DELETED` |

### 3.2 商家、配送规则和营业状态

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_merchant` | `id bigint pk` | 商家 ID |
|  | `name varchar(128)` | 商家名称 |
|  | `status varchar(32)` | `PENDING`、`ACTIVE`、`DISABLED` |
|  | `business_status varchar(32)` | `OPEN`、`CLOSED` |
|  | `logo_url varchar(512)`、`cover_url varchar(512)` | 图片 |
|  | `min_order_amount_cent bigint` | 起送金额 |
|  | `delivery_fee_cent bigint` | 基础配送费 |
| `fd_merchant_business_time` | `id bigint pk` | 营业时间 ID |
|  | `merchant_id bigint index` | 商家 |
|  | `weekday tinyint` | 周几 |
|  | `start_time varchar(8)`、`end_time varchar(8)` | 时段 |
| `fd_delivery_rule` | `id bigint pk` | 配送规则 ID |
|  | `merchant_id bigint index` | 商家 |
|  | `service_radius_meter int` | 服务半径 |
|  | `base_fee_cent bigint` | 配送费 |
|  | `status varchar(32)` | 状态 |

### 3.3 商品、SKU 和库存

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_product_category` | `id bigint pk` | 类目 ID |
|  | `merchant_id bigint index` | 商家 |
|  | `name varchar(64)` | 类目名称 |
|  | `sort_no int` | 排序 |
|  | `status varchar(32)` | `ACTIVE`、`HIDDEN` |
| `fd_product` | `id bigint pk` | 商品 ID |
|  | `merchant_id bigint index` | 商家 |
|  | `category_id bigint index` | 类目 |
|  | `name varchar(128)` | 商品名称 |
|  | `description varchar(512)` | 描述 |
|  | `image_url varchar(512)` | 图片 |
|  | `status varchar(32)` | `ON_SALE`、`OFF_SALE` |
| `fd_sku` | `id bigint pk` | SKU ID |
|  | `product_id bigint index` | 商品 |
|  | `merchant_id bigint index` | 冗余商家 ID，用于权限和查询 |
|  | `name varchar(128)` | SKU 名称 |
|  | `price_cent bigint` | 售价 |
|  | `package_fee_cent bigint` | 包装费 |
|  | `status varchar(32)` | `ON_SALE`、`OFF_SALE` |
| `fd_inventory` | `sku_id bigint pk` | SKU |
|  | `available_qty int` | 可售库存 |
|  | `locked_qty int` | 下单锁定库存 |
|  | `sold_qty int` | 已售库存 |
|  | `version bigint` | 乐观锁版本 |
| `fd_inventory_log` | `id bigint pk` | 库存流水 |
|  | `sku_id bigint index` | SKU |
|  | `order_id bigint index nullable` | 关联订单 |
|  | `change_type varchar(32)` | `LOCK`、`RELEASE`、`CONFIRM`、`COMPENSATE` |
|  | `quantity int` | 变化数量 |
|  | `before_available_qty int`、`after_available_qty int` | 变化前后 |
|  | `request_id varchar(128)` | 幂等或请求 ID |

### 3.4 购物车

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_cart_item` | `id bigint pk` | 购物车项 |
|  | `user_id bigint index` | 用户 |
|  | `merchant_id bigint index` | 商家 |
|  | `sku_id bigint index` | SKU |
|  | `quantity int` | 数量 |
|  | `selected boolean` | 是否选中 |
|  | `created_at datetime`、`updated_at datetime` | 时间 |

建议唯一约束：`uk_cart_user_sku(user_id, sku_id)`，防止同一用户同一 SKU 重复购物车行。

### 3.5 优惠和费用

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_coupon` | `id bigint pk` | 优惠券 |
|  | `name varchar(128)` | 名称 |
|  | `discount_amount_cent bigint` | 优惠金额 |
|  | `threshold_amount_cent bigint` | 门槛金额 |
|  | `status varchar(32)` | 状态 |
| `fd_user_coupon` | `id bigint pk` | 用户券 |
|  | `user_id bigint index` | 用户 |
|  | `coupon_id bigint index` | 券 |
|  | `status varchar(32)` | `UNUSED`、`LOCKED`、`USED`、`EXPIRED` |
|  | `order_id bigint nullable` | 关联订单 |
| `fd_order_fee` | `id bigint pk` | 订单费用明细 |
|  | `order_id bigint index` | 订单 |
|  | `fee_type varchar(32)` | `ITEM_TOTAL`、`DISCOUNT`、`DELIVERY`、`PACKAGE`、`PAYABLE`、`REFUND` |
|  | `amount_cent bigint` | 金额，可正可负 |
|  | `source_type varchar(32)`、`source_id bigint nullable` | 费用来源 |
|  | `description varchar(255)` | 展示说明 |

### 3.6 订单和订单快照

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_order` | `id bigint pk` | 订单 ID |
|  | `order_no varchar(64) unique` | 订单号 |
|  | `user_id bigint index` | 用户 |
|  | `merchant_id bigint index` | 商家 |
|  | `address_id bigint nullable` | 地址 ID |
|  | `address_snapshot text` | 地址快照 |
|  | `status varchar(32)` | 订单状态 |
|  | `pay_status varchar(32)` | `UNPAID`、`PAID`、`REFUNDING`、`REFUNDED` |
|  | `total_amount_cent bigint` | 商品总额 |
|  | `discount_amount_cent bigint` | 优惠金额 |
|  | `delivery_fee_cent bigint` | 配送费 |
|  | `package_fee_cent bigint` | 包装费 |
|  | `pay_amount_cent bigint` | 应付金额 |
|  | `idempotency_key varchar(128)` | 下单幂等键 |
|  | `paid_at datetime nullable`、`cancelled_at datetime nullable`、`completed_at datetime nullable` | 生命周期时间 |
| `fd_order_item` | `id bigint pk` | 明细 ID |
|  | `order_id bigint index` | 订单 |
|  | `merchant_id bigint index` | 冗余商家 |
|  | `product_id bigint`、`sku_id bigint` | 商品和 SKU |
|  | `product_snapshot text`、`sku_snapshot text` | 名称、图片、规格、价格快照 |
|  | `quantity int` | 数量 |
|  | `price_cent bigint`、`package_fee_cent bigint` | 下单价格快照 |
| `fd_order_status_log` | `id bigint pk` | 状态日志 |
|  | `order_id bigint index` | 订单 |
|  | `from_status varchar(32)`、`to_status varchar(32)` | 前后状态 |
|  | `actor_type varchar(32)`、`actor_id bigint nullable` | 触发方 |
|  | `reason varchar(255)` | 原因 |
|  | `request_id varchar(128)` | 幂等或请求 ID |

建议唯一约束：`uk_order_user_idem(user_id, idempotency_key)`，防止重复下单。

### 3.7 支付和退款

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_payment_order` | `id bigint pk` | 支付单 |
|  | `payment_no varchar(64) unique` | 支付单号 |
|  | `order_id bigint index` | 订单 |
|  | `user_id bigint index` | 用户 |
|  | `channel varchar(32)` | 支付渠道 |
|  | `amount_cent bigint` | 支付金额 |
|  | `status varchar(32)` | `CREATED`、`SUCCESS`、`FAILED`、`CLOSED` |
|  | `channel_trade_no varchar(128) nullable` | 渠道交易号 |
|  | `paid_at datetime nullable` | 支付时间 |
| `fd_payment_callback_log` | `id bigint pk` | 支付回调日志 |
|  | `channel varchar(32)` | 渠道 |
|  | `event_id varchar(128)` | 渠道事件 ID |
|  | `payment_no varchar(64)` | 支付单号 |
|  | `channel_trade_no varchar(128)` | 渠道交易号 |
|  | `amount_cent bigint` | 回调金额 |
|  | `verify_result varchar(32)` | 验签结果 |
|  | `process_result varchar(32)` | 处理结果 |
|  | `raw_digest varchar(255)` | 原始报文摘要，不存敏感明文 |
| `fd_refund_order` | `id bigint pk` | 退款单 |
|  | `refund_no varchar(64) unique` | 退款单号 |
|  | `order_id bigint index` | 订单 |
|  | `payment_id bigint index` | 支付单 |
|  | `amount_cent bigint` | 退款金额 |
|  | `status varchar(32)` | `CREATED`、`PROCESSING`、`SUCCESS`、`FAILED` |
|  | `reason varchar(255)` | 原因 |
|  | `channel_refund_no varchar(128) nullable` | 渠道退款号 |
| `fd_refund_callback_log` | `id bigint pk` | 退款回调日志 |
|  | `channel varchar(32)`、`event_id varchar(128)` | 渠道和事件 |
|  | `refund_no varchar(64)`、`channel_refund_no varchar(128)` | 退款标识 |
|  | `amount_cent bigint` | 回调金额 |
|  | `verify_result varchar(32)`、`process_result varchar(32)` | 结果 |

建议唯一约束：

- `uk_pay_callback_channel_event(channel, event_id)`
- `uk_pay_channel_trade(channel, channel_trade_no)`
- `uk_refund_callback_channel_event(channel, event_id)`
- `uk_refund_channel_trade(channel, channel_refund_no)`

### 3.8 配送、评价、审计

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `fd_delivery_task` | `id bigint pk` | 配送任务 |
|  | `order_id bigint unique` | 订单 |
|  | `merchant_id bigint index` | 商家 |
|  | `rider_id bigint index nullable` | 骑手 |
|  | `status varchar(32)` | `WAITING`、`PICKED_UP`、`DELIVERING`、`COMPLETED`、`CANCELLED` |
|  | `picked_up_at datetime nullable`、`completed_at datetime nullable` | 时间 |
| `fd_review` | `id bigint pk` | 评价 |
|  | `order_id bigint unique` | 订单 |
|  | `user_id bigint index`、`merchant_id bigint index` | 归属 |
|  | `rating int`、`content varchar(512)` | 内容 |
|  | `status varchar(32)` | 状态 |
| `fd_audit_log` | `id bigint pk` | 审计日志 |
|  | `biz_type varchar(64)`、`biz_id bigint` | 业务对象 |
|  | `action varchar(64)` | 操作 |
|  | `actor_type varchar(32)`、`actor_id bigint nullable` | 操作人 |
|  | `result varchar(32)` | 结果 |
|  | `trace_id varchar(128)` | 链路 ID |
|  | `summary varchar(512)` | 摘要 |
| `fd_abnormal_order` | `id bigint pk` | 异常订单 |
|  | `order_id bigint index` | 订单 |
|  | `type varchar(64)` | 类型 |
|  | `status varchar(32)` | `OPEN`、`PROCESSING`、`CLOSED` |
|  | `owner_id bigint nullable` | 处理人 |

## 4. 表关系

- `fd_user` 1:N `fd_user_address`。
- `fd_merchant` 1:N `fd_product_category`、`fd_product`、`fd_sku`。
- `fd_product_category` 1:N `fd_product`。
- `fd_product` 1:N `fd_sku`。
- `fd_sku` 1:1 `fd_inventory`，1:N `fd_inventory_log`。
- `fd_user` 1:N `fd_cart_item`，`fd_sku` 1:N `fd_cart_item`。
- `fd_order` 1:N `fd_order_item`、`fd_order_fee`、`fd_order_status_log`。
- `fd_order` 1:N `fd_payment_order`，通常一笔成功支付。
- `fd_payment_order` 1:N `fd_refund_order`。
- `fd_order` 1:1 `fd_delivery_task`。
- `fd_order` 1:1 `fd_review`。
- `fd_audit_log` 通过 `biz_type + biz_id` 关联多类业务对象。

## 5. 索引和唯一约束

| 表 | 索引或约束 | 用途 |
| --- | --- | --- |
| `fd_user` | `uk_user_mobile(mobile)` | 登录和唯一身份 |
| `fd_user_address` | `idx_address_user(user_id, status)` | 用户地址列表 |
| `fd_merchant` | `idx_merchant_status(status, business_status)` | 商家列表筛选 |
| `fd_product_category` | `idx_category_merchant_sort(merchant_id, sort_no)` | 商家商品类目 |
| `fd_product` | `idx_product_merchant_status(merchant_id, status)` | 商家商品列表 |
| `fd_sku` | `idx_sku_product_status(product_id, status)`、`idx_sku_merchant(merchant_id)` | SKU 查询和权限 |
| `fd_inventory` | `pk(sku_id)` | 库存行锁或乐观锁 |
| `fd_inventory_log` | `idx_inventory_log_sku_time(sku_id, created_at)`、`idx_inventory_log_order(order_id)` | 库存追踪 |
| `fd_cart_item` | `uk_cart_user_sku(user_id, sku_id)`、`idx_cart_user(user_id, updated_at)` | 购物车 |
| `fd_user_coupon` | `idx_user_coupon_user_status(user_id, status)` | 可用券 |
| `fd_order` | `uk_order_no(order_no)`、`uk_order_user_idem(user_id, idempotency_key)` | 订单号和幂等 |
| `fd_order` | `idx_order_user_time(user_id, created_at)`、`idx_order_merchant_status_time(merchant_id, status, created_at)` | 用户和商家订单列表 |
| `fd_order_item` | `idx_order_item_order(order_id)`、`idx_order_item_merchant(merchant_id, created_at)` | 详情和商家统计 |
| `fd_order_fee` | `idx_order_fee_order(order_id)` | 费用明细 |
| `fd_order_status_log` | `idx_order_status_log_order(order_id, created_at)`、`uk_order_status_request(order_id, request_id)` | 状态追踪和幂等 |
| `fd_payment_order` | `uk_payment_no(payment_no)`、`idx_payment_order(order_id)`、`uk_payment_channel_trade(channel, channel_trade_no)` | 支付查询和幂等 |
| `fd_payment_callback_log` | `uk_pay_callback_channel_event(channel, event_id)` | 回调幂等 |
| `fd_refund_order` | `uk_refund_no(refund_no)`、`idx_refund_order(order_id)`、`uk_refund_channel_trade(channel, channel_refund_no)` | 退款查询和幂等 |
| `fd_refund_callback_log` | `uk_refund_callback_channel_event(channel, event_id)` | 退款回调幂等 |
| `fd_delivery_task` | `uk_delivery_order(order_id)`、`idx_delivery_rider_status(rider_id, status, created_at)` | 骑手任务 |
| `fd_review` | `uk_review_order(order_id)`、`idx_review_merchant_time(merchant_id, created_at)` | 评价 |
| `fd_audit_log` | `idx_audit_biz(biz_type, biz_id)`、`idx_audit_trace(trace_id)`、`idx_audit_actor(actor_type, actor_id, created_at)` | 审计查询 |
| `fd_abnormal_order` | `idx_abnormal_status(status, created_at)`、`idx_abnormal_order(order_id)` | 异常处理 |

## 6. Migration 顺序

1. 基础身份和商家：
   - `fd_user`
   - `fd_user_address`
   - `fd_merchant`
   - `fd_merchant_business_time`
   - `fd_delivery_rule`
2. 商品和库存：
   - `fd_product_category`
   - `fd_product`
   - `fd_sku`
   - `fd_inventory`
   - `fd_inventory_log`
3. 购物车和优惠：
   - `fd_cart_item`
   - `fd_coupon`
   - `fd_user_coupon`
4. 订单主链路：
   - `fd_order`
   - `fd_order_item`
   - `fd_order_fee`
   - `fd_order_status_log`
5. 支付和退款：
   - `fd_payment_order`
   - `fd_payment_callback_log`
   - `fd_refund_order`
   - `fd_refund_callback_log`
6. 履约、评价和审计：
   - `fd_delivery_task`
   - `fd_review`
   - `fd_audit_log`
   - `fd_abnormal_order`
7. 灰度期数据校验：
   - 校验主键、唯一约束、状态枚举、金额字段非负规则。
   - 校验订单费用明细之和和订单主表金额一致。
   - 校验库存 `available_qty + locked_qty + sold_qty` 不出现负数或异常。

## 7. 回滚和兼容策略

- 新表 migration 可通过禁用新功能开关回滚业务入口，表结构保留。
- 新字段先允许空或提供默认值，待旧代码不再写入后再改为强约束。
- 禁止在同一版本直接删除字段、重命名字段或变更字段语义。
- 状态枚举新增时旧代码应将未知状态展示为“处理中”或“异常处理中”。
- 金额和库存字段变更必须先双写并比对，再切读。
- 回滚支付或退款逻辑时不得删除回调日志，以免丢失幂等证据。
- 若库存锁定策略回滚，需要提供批处理释放过期锁定库存，并核对订单状态。

## 8. 大数据量和慢查询风险

| 场景 | 风险 | 应对 |
| --- | --- | --- |
| 用户订单列表 | 用户长期使用后数据量大 | `idx_order_user_time`，按时间倒序分页，避免深翻页 |
| 商家订单管理 | 商家高峰期按状态筛选频繁 | `idx_order_merchant_status_time`，状态和时间联合索引 |
| 骑手任务列表 | 配送中任务需快速刷新 | `idx_delivery_rider_status`，只查进行中状态 |
| 审计日志 | 写入量大、查询维度多 | 按时间归档或分区，保留 `biz`、`trace`、`actor` 索引 |
| 支付回调日志 | 高并发重复回调 | 唯一约束先拦截，日志按事件 ID 查询 |
| 商品列表 | 商家商品和 SKU 多 | 商家、状态、排序索引；图片和长描述不参与频繁查询 |
| 地理配送范围 | 经纬度过滤复杂 | 初期用商家配送半径粗筛，后续引入地理索引或配送范围服务 |

## 9. 核心一致性风险

| 风险 | 等级 | 数据侧控制 |
| --- | --- | --- |
| 重复下单 | P0 | `uk_order_user_idem(user_id, idempotency_key)` |
| 重复支付回调 | P0 | `uk_pay_callback_channel_event`、`uk_payment_channel_trade` |
| 重复退款回调 | P0 | `uk_refund_callback_channel_event`、`uk_refund_channel_trade` |
| 金额来源不清 | P0 | `fd_order_fee` 费用明细和 `fd_order` 金额快照 |
| 历史商品变更影响订单 | P1 | `product_snapshot`、`sku_snapshot`、价格快照 |
| 库存超卖 | P1 | `fd_inventory` 条件更新、`version`、`fd_inventory_log` |
| 状态并发覆盖 | P1 | 更新订单时带当前 `status` 条件，状态日志记录 `request_id` |
| 越权查询 | P0 | 核心表冗余 `user_id`、`merchant_id`、`rider_id` 支持快速数据范围过滤 |
| 审计证据缺失 | P1 | 高风险操作写 `fd_audit_log` 和业务状态日志 |

## 10. 阶段 5 输入

Orchestrator 下一阶段可基于本数据设计拆分 feature slice：

- 用户选店和商品浏览。
- 购物车与订单预览。
- 创建订单、库存锁定和费用快照。
- 支付回调幂等与状态流转。
- 商家履约和配送状态。
- 取消、退款和审计。
- 权限、异常订单和质量门禁。
