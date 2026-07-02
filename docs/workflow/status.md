# Workflow Status

本文件只记录项目级全局状态和需求工作项索引。环境自检是全局一次，不跟随单个需求重复确认；具体需求的阶段状态记录在 `docs/workflow/requirements/<需求ID>.md`。

## 全局状态

| 项 | 状态 | 说明 |
| --- | --- | --- |
| 框架运行自检 | developer_confirmed_ready | 全局一次，开发者已确认可运行 |
| 前端运行确认 | 已确认 | `project/snowy-admin-web` 可按 `npm install`、`npm run dev` 运行 |
| 后端运行确认 | 已确认 | IDEA 中 JDK/Maven 使用 17，可运行 `Application.java` |
| 确认来源 | 开发者回复“项目能运行” | 等价于“前后端已确认可运行” |
| 确认时间 | 2026-07-02 16:16:09 +08:00 | 如后续重新确认，更新此项 |
| 环境状态有效范围 | 全局有效 | 直到框架依赖、JDK/Maven、数据库/Redis 配置变化，或开发者报告环境失效 |

## 需求工作项索引

| 需求ID | 需求名称 | 来源文档 | 状态文件 | 当前阶段 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 20260702-1624-home-banner-management | 内容管理-首页banner管理功能 | `docs/requirements/纺院需求.md` | `docs/workflow/requirements/20260702-1624-home-banner-management.md` | PRD/原型决策 | 需确认 |

## 状态值

| 状态 | 含义 |
| --- | --- |
| 未开始 | 尚未进入 |
| prompted | 已给出提示，等待开发者操作 |
| blocked_until_developer_confirmed_ready | 等待开发者确认前后端可运行 |
| developer_confirmed_ready | 开发者已确认前后端可运行 |
| developer_reported_blocked | 开发者报告环境阻塞 |
| 需确认 | 等待开发者决策或确认 |
| 已开始 | 阶段已进入，产物未完成 |
| 已跳过 | 开发者明确跳过该阶段 |
| 已完成 | 阶段产物已完成并记录 |
| 阻塞 | 阶段存在阻塞，需要处理 |

## 记录规则

1. 环境自检只记录在本文件的“全局状态”中；同一环境下的新需求不重复要求确认。
2. 如果“框架运行自检”不是 `developer_confirmed_ready`，任何需求都不得进入 PRD/UI/技术设计或开发阶段。
3. 如果框架依赖、JDK/Maven、数据库/Redis 配置发生变化，或开发者报告环境失效，Orchestrator 必须把全局状态改回 `prompted` 或 `developer_reported_blocked`，并重新给出运行提示。
4. 每个新需求或功能都必须创建独立状态文件：`docs/workflow/requirements/<需求ID>.md`。
5. PRD、UI、技术设计、数据设计、开发、测试、审查、发布、验收等阶段完成情况，必须记录在对应需求状态文件中，不写入全局阶段表。
6. `需求工作项索引` 只保留每个需求的摘要：需求ID、名称、来源文档、状态文件、当前阶段、状态。

## 全局变更记录

```text
阶段: 框架运行自检
状态: developer_confirmed_ready
来源: 开发者回复“项目能运行”
产物: docs/workflow/status.md
下一步: 按具体需求创建需求状态文件，并在需求文件中记录后续阶段
时间: 2026-07-02 16:16:09 +08:00
```
