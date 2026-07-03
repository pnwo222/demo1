# Workflow Status

本文件只记录项目级全局状态、开发环境检测和需求工作项索引。环境自检是全局一次，不跟随单个需求重复确认；具体需求的阶段状态记录在 `docs/workflow/requirements/<需求ID>.md`。

## 全局状态

| 项 | 状态 | 说明 |
| --- | --- | --- |
| 框架运行自检 | blocked_missing_mysql_cli | 全局一次，开发环境检测未通过 |
| 前端运行确认 | 已确认 | `project/snowy-admin-web` 可按 `npm install`、`npm run dev` 运行 |
| 后端运行确认 | 已确认 | IDEA 中 JDK/Maven 使用 17，可运行 `Application.java` |
| MySQL 指令检测 | blocked_missing_mysql_cli | 当前执行 `Get-Command mysql` 和 `where.exe mysql` 均未找到 |
| 确认来源 | 开发者回复“项目能运行”；Agent 检测 mysql 指令缺失 | 前后端已确认，但开发环境 MySQL 指令未通过 |
| 确认时间 | 2026-07-03 | 安装 mysql 指令后重新检测并更新 |
| 环境状态有效范围 | 阻塞中 | 直到 mysql 指令可用，并重新确认开发环境 |

## 需求工作项索引

| 需求ID | 需求名称 | 来源文档 | 状态文件 | 当前阶段 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 20260702-1624-home-banner-management | 内容管理-首页banner管理功能 | `docs/requirements/纺院需求.md` | `docs/workflow/requirements/20260702-1624-home-banner-management.md` | 开发环境检测 | 阻塞 |

## 状态值

| 状态 | 含义 |
| --- | --- |
| 未开始 | 尚未进入 |
| prompted | 已给出提示，等待开发者操作 |
| blocked_until_developer_confirmed_ready | 等待开发者确认前后端和 `mysql` 指令可用 |
| blocked_missing_mysql_cli | 开发环境检测需要 `mysql` 指令，但开发电脑未检测到 |
| developer_confirmed_ready | 开发者已确认前后端可运行，且 `mysql` 指令可用 |
| developer_reported_blocked | 开发者报告环境阻塞 |
| 需确认 | 等待开发者决策或确认 |
| 已开始 | 阶段已进入，产物未完成 |
| 已跳过 | 开发者明确跳过该阶段 |
| 已完成 | 阶段产物已完成并记录 |
| 阻塞 | 阶段存在阻塞，需要处理 |

## 记录规则

1. 环境自检只记录在本文件的“全局状态”中；同一环境下的新需求不重复要求确认。
2. 如果“框架运行自检”不是 `developer_confirmed_ready`，任何需求都不得进入 PRD/UI/技术设计或开发阶段；`blocked_missing_mysql_cli` 必须停在开发环境检测阶段。
3. 如果框架依赖、JDK/Maven、数据库/Redis 配置、`mysql` 指令状态发生变化，或开发者报告环境失效，Orchestrator 必须把全局状态改回 `prompted`、`developer_reported_blocked` 或对应阻塞状态，并重新给出运行提示。
4. 每个新需求或功能都必须创建独立状态文件：`docs/workflow/requirements/<需求ID>.md`。
5. PRD、UI、技术设计、数据设计、开发、测试、审查、发布、验收等阶段完成情况，必须记录在对应需求状态文件中，不写入全局阶段表。
6. `需求工作项索引` 只保留每个需求的摘要：需求ID、名称、来源文档、状态文件、当前阶段、状态。

## 全局变更记录

```text
阶段: 框架运行自检
状态: blocked_missing_mysql_cli
来源: 开发者回复“项目能运行”；Agent 检测 mysql 指令缺失
产物: docs/workflow/status.md
下一步: 安装 MySQL Client 或将 mysql.exe 所在目录加入 PATH，重新检测后再进入后续阶段
时间: 2026-07-03
```
