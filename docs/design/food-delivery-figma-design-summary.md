# 外卖平台 H5 Figma 设计摘要

## 输入材料

- 当前需求文档：`docs/requirements/food-delivery-platform.md`
- HTML PRD：`docs/prd/food-delivery-platform-prd.html`
- 可交互低保真原型：`docs/design/food-delivery-low-fidelity-prototype.html`
- 设计系统检索：`design-system/food-delivery-platform/MASTER.md`

## Figma 文件

- 文件名：Food Delivery Platform H5 Design
- 文件链接：https://www.figma.com/design/Q0JsHmE1sJB2Y75xlGYJir
- Figma Page：Food Delivery H5 - Ready for Dev

## 页面列表

| 画板 | 目标 |
| --- | --- |
| 00 Design System Summary / Handoff | 设计系统、素材策略、Ready for Dev 和 Handoff 总说明 |
| 01 Home Merchant List / Ready for Dev | 附近商家、地址切换、商家营业/休息/可配送状态 |
| 02 Shop Menu / Ready for Dev | 商家详情、商品 SKU、库存、下架和购物车结算栏 |
| 03 Checkout Payment / Ready for Dev | 确认订单、费用明细、后端重算金额和支付幂等提示 |
| 04 Order Tracking States / Ready for Dev | 订单状态机、配送进度、异常与权限状态 |

## 设计系统摘要

- 风格：移动端高信息密度、白底卡片、暖红强调、清晰价格与状态。
- 颜色：
  - Primary：`#DC2626`
  - Gold：`#CA8A04`
  - Background：`#FAF6F2`
  - Surface：`#FFFFFF`
  - Text：`#2D1212`
  - Success：`#107848`
- 字体：`Noto Sans SC`
- 触控：按钮高度不低于 44px，邻近触控目标间距不低于 8px。
- 避免：作品集式大留白、低质图片、仅靠前端判断的业务提示、表意不清的图标。

## 组件清单

- 地址栏
- 搜索入口
- 商家卡片
- 商品卡片
- 购物车结算栏
- 费用明细
- 支付状态卡
- 订单状态进度条
- 底部导航
- Toast / Alert
- 空、错、禁用状态

## 关键交互

- 首页根据地址展示可配送商家，休息中商家按钮禁用。
- 商家详情可按 SKU 加购，低库存和下架商品状态明确。
- 结算页展示商品、地址、优惠、配送费、包装费和后端重算应付金额。
- 支付提示明确签名、金额、订单号和幂等校验。
- 订单跟踪按状态机展示进度，非法状态跳转、越权访问和重复退款由后端拒绝并写入审计日志。

## 状态设计

- Loading：列表、商品、订单详情使用骨架或浅色占位。
- Empty：购物车为空时提供去选商品入口。
- Error：库存不足、地址不可配送、金额变化、支付失败使用醒目但不遮挡的错误提示。
- Disabled：休息中、下架、库存不足、不可配送等状态不允许继续主操作。
- Security：越权访问和非法操作由后端拦截，前端只做反馈展示。

## 适配要求

- 主画板：390x844。
- 内容宽度：358px。
- 页面左右安全边距：16px。
- 底部导航：84px。
- 前端实现建议：Vue 3 SFC + Pinia 管理购物车、订单状态和支付回调结果。

## 素材和图标

- 菜品图：Unsplash 授权占位图，作者 Sergio Mena Ferreira，图片 ID `EXfWNPsiu8s`。
- 素材链接：https://unsplash.com/photos/EXfWNPsiu8s
- 生产替换策略：使用商家实拍图，建议 1:1 输出 900px+；CDN 裁切支持 `160x160`、`320x180`、`750x420`。
- 图标：Figma 内使用可编辑 SVG 图标，风格参考 Lucide 线性图标。

## 阶段结论

阶段 2 UI/UX 设计产物已生成，可进入用户确认。确认后允许进入阶段 3 技术设计，由 Architect Agent 输出模块边界、API 契约、状态机、数据模型、安全模型和可运维方案。
