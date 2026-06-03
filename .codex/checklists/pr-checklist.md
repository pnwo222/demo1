# 外卖平台 PR 检查表

## 总控流程

- [ ] Orchestrator 已说明本 PR 属于哪个 feature slice
- [ ] Orchestrator 已说明调用过哪些专业 Agent
- [ ] Orchestrator 已检查阶段门禁
- [ ] 需要用户确认的产物已确认

## 基本信息

- [ ] PR 有清晰标题和变更说明
- [ ] 关联了需求、issue 或任务
- [ ] 如涉及新需求，HTML PRD 已生成或更新
- [ ] 如涉及 UI，Figma 设计图已生成或更新
- [ ] 如涉及 UI，已使用 `.codex/skills/ui-ux-pro-max` 生成设计系统或页面规则
- [ ] 说明了影响范围：用户端、商家端、骑手端、运营后台、Java API、数据库
- [ ] 说明了风险点
- [ ] 说明了回滚方案

## Vue3 H5 验证

- [ ] Lint 通过
- [ ] Typecheck 通过
- [ ] Unit Test 通过
- [ ] Build 通过
- [ ] Coverage 未低于主分支基线
- [ ] 移动端页面验证通过
- [ ] Loading / Empty / Error / Offline 状态已覆盖
- [ ] 防重复点击已处理

## Java 后端验证

- [ ] Unit Test 通过
- [ ] Integration Test 通过
- [ ] API Contract 已更新或确认不变
- [ ] Build 通过
- [ ] Coverage 未低于主分支基线
- [ ] 数据库 migration 已验证
- [ ] 数据库 rollback 或兼容策略已说明

## 外卖业务验证

- [ ] 商家营业状态校验
- [ ] 商品上架/下架校验
- [ ] SKU 和库存校验
- [ ] 购物车金额展示和后端最终金额一致
- [ ] 优惠、配送费、包装费计算正确
- [ ] 订单状态流转合法
- [ ] 支付或退款幂等性已验证
- [ ] 用户、商家、骑手、运营权限已验证

## 安全和数据

- [ ] 后端权限校验完整
- [ ] 无敏感数据泄漏
- [ ] 无密钥提交
- [ ] 支付回调签名校验完整
- [ ] SAST 已通过或无高危
- [ ] SCA 已通过或无高危
- [ ] Secret Scan 已通过
- [ ] DAST 已执行或说明不适用
- [ ] 数据库变更有 migration
- [ ] 数据库变更有回滚或兼容策略

## 审查

- [ ] Bug Review 已完成
- [ ] Security Review 已完成
- [ ] Performance Review 已完成
- [ ] Maintainability Review 已完成
- [ ] QA Review 已完成
- [ ] P0/P1 问题已修复
