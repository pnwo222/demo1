# Workflow Status

本文件记录可提交到 Git 的项目级全局状态和需求工作项索引。开发者本机环境检测结果不写入本文件，统一写入被 Git 忽略的 `docs/workflow/local-environment-status.md`。

## 全局状态

| 项 | 状态 | 说明 |
| --- | --- | --- |
| 框架运行自检 | local_status_required | 读取 `docs/workflow/local-environment-status.md` 的本机状态 |
| 环境状态文件 | local_only | `docs/workflow/local-environment-status.md`，不提交到 Git |
| 环境状态有效范围 | local_only | 由每个开发者在本机自行确认 |

## 需求工作项索引

| 需求ID | 需求名称 | 来源文档 | 状态文件 | 当前阶段 | 状态 |
| --- | --- | --- | --- | --- | --- |
| 20260714-fyy-tender-completion | 纺院标书软件需求完成 | `docs/requirements/纺院需求.md` | `docs/workflow/requirements/20260714-fyy-tender-completion.md` | Product 原型重画计划审阅 | 需确认 |

## 状态值

| 状态 | 含义 |
| --- | --- |
| 未开始 | 尚未进入 |
| prompted | 已给出提示，等待开发者操作 |
| blocked_until_developer_confirmed_ready | 等待开发者确认开发环境可用 |
| blocked_missing_mysql_cli | 开发环境检测未找到 PATH 或绝对路径可用的 MySQL CLI |
| developer_confirmed_ready | 当前开发者本机环境已确认可继续；记录在 `docs/workflow/local-environment-status.md` |
| developer_reported_blocked | 开发者报告环境阻塞 |
| 需确认 | 等待开发者决策或确认 |
| 已开始 | 阶段已进入，产物未完成 |
| 已跳过 | 开发者明确跳过该阶段 |
| 已完成 | 阶段产物已完成并记录 |
| 阻塞 | 阶段存在阻塞，需要处理 |

## 记录规则

1. 本文件可以提交到 Git，只记录项目级抽象状态和需求索引。
2. 个人机器检测结果必须写入 `docs/workflow/local-environment-status.md`，该文件被 `.gitignore` 忽略，不得强制提交。
3. 如果本机环境状态不是 `developer_confirmed_ready`，任何需求都不得进入 PRD/UI/技术设计或开发阶段；`blocked_missing_mysql_cli` 必须停在开发环境检测阶段。
4. 如果框架依赖、JDK/Maven、数据库/Redis 配置、`mysql` 指令状态发生变化，或开发者报告环境失效，Orchestrator 必须重新检测并更新本地环境状态文件。
5. 每个新需求或功能都必须创建独立状态文件：`docs/workflow/requirements/<需求ID>.md`。
6. PRD、UI、技术设计、数据设计、开发、测试、审查、发布、验收等阶段完成情况，必须记录在对应需求状态文件中，不写入全局阶段表。
7. `需求工作项索引` 只保留每个需求的摘要：需求ID、名称、来源文档、状态文件、当前阶段、状态。

## 全局变更记录

```text
阶段: 框架运行自检
状态: local_status_required
来源: local-environment-status.md
产物: docs/workflow/status.md
下一步: 按具体需求创建需求状态文件，并在需求文件中记录后续阶段
时间: -
```
