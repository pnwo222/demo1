# 通用 PR 检查表

## 总控流程

- [ ] Orchestrator 已说明本 PR 属于哪个 feature slice。
- [ ] Orchestrator 已说明调用过哪些专业 Agent。
- [ ] Orchestrator 已检查阶段门禁。
- [ ] 需要用户确认的产物已确认。

## 基本信息

- [ ] PR 有清晰标题和变更说明。
- [ ] 关联了需求文档、issue 或任务。
- [ ] 如涉及新需求，HTML PRD 已生成或更新。
- [ ] 如涉及 UI，低保真 HTML 原型已生成或更新。
- [ ] 如涉及正式 UI，Figma 设计图已生成或更新。
- [ ] 如涉及正式 UI，已使用项目设计系统或 `.codex/skills/ui-ux-pro-max` 生成页面规则。
- [ ] 说明了影响范围：前端、后端、数据、配置、权限、运维、文档等。
- [ ] 说明了风险点。
- [ ] 说明了回滚方案。

## 前端验证

- [ ] Lint 通过。
- [ ] Typecheck 通过。
- [ ] Unit Test 通过。
- [ ] Build 通过。
- [ ] Coverage 未低于主分支基线。
- [ ] 目标设备或目标视口验证通过。
- [ ] Loading / Empty / Error / Offline 状态已覆盖。
- [ ] 防重复点击或重复提交已处理。

## 后端验证

- [ ] Unit Test 通过。
- [ ] Integration Test 通过。
- [ ] API Contract 已更新或确认不变。
- [ ] Build 通过。
- [ ] Coverage 未低于主分支基线。
- [ ] 数据库 migration 已验证。
- [ ] 数据库 rollback 或兼容策略已说明。

## 业务验证

- [ ] 核心用户流程已按需求文档验证。
- [ ] 关键状态流转合法。
- [ ] 关键资源或金额类规则以可信服务为准。
- [ ] 幂等、防重复提交或并发风险已验证。
- [ ] 角色权限和数据隔离已验证。
- [ ] 异常场景和失败提示已覆盖。

## 安全和数据

- [ ] 后端权限校验完整。
- [ ] 无敏感数据泄漏。
- [ ] 无密钥提交。
- [ ] 高风险回调、导入、批量操作或外部接口已校验来源和幂等性。
- [ ] SAST 已通过或无高危。
- [ ] SCA 已通过或无高危。
- [ ] Secret Scan 已通过。
- [ ] DAST 已执行或说明不适用。
- [ ] 数据库变更有 migration。
- [ ] 数据库变更有回滚或兼容策略。

## 审查

- [ ] Bug Review 已完成。
- [ ] Security Review 已完成。
- [ ] Performance Review 已完成。
- [ ] Maintainability Review 已完成。
- [ ] QA Review 已完成。
- [ ] P0/P1 问题已修复。
