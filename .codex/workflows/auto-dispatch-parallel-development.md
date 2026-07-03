# 自动分配与并行开发工作流

本工作流定义 Orchestrator 如何把已确认的需求、PRD、设计稿和技术方案自动拆解为可并行开发任务，并按大厂常见研发协作方式完成分配、隔离开发、集成、门禁和汇总。

它不绑定具体业务。业务范围、风险等级和质量门禁必须来自 `docs/requirements/` 下的全部需求文档、PRD 和技术设计；框架结构、技术栈、目录映射和开发规范必须来自 `project/docs/` 下的框架文档和 `project/` 实际代码。

## 适用时机

当以下产物已确认后，进入本流程：

- `docs/requirements/` 下的全部需求文档。
- `project/docs/` 下的全部框架文档。
- HTML PRD。
- 可交互低保真 HTML 原型。
- Figma 正式设计稿或 UI 说明。
- 技术设计。
- 数据设计。
- 初步 feature slice。

## 主流模式

采用“大厂常见”的分层协作模型：

- Orchestrator 作为调度中心。
- Feature slice 作为最小业务闭环。
- Task graph 作为任务依赖图。
- Agent owner 作为专业负责人。
- Branch / worktree 作为并行隔离单元。
- Integration branch 或 PR queue 作为集成入口。
- CI、Review、QA、Security 作为合并门禁。

## 阶段 0：读取输入

Orchestrator 必须先读取并确认：

- 已读取的需求文档清单。
- 已读取的框架文档清单。
- PRD 路径。
- 设计稿或设计摘要。
- 技术设计和数据设计。
- 当前仓库结构。
- 当前分支和工作区状态。
- 原始当前分支，即开发者确认的最终合并目标。
- 需求集成分支。
- worktree 开发分支和路径。
- 已有脚本、测试、CI 和构建命令。
- 前端目录和后端目录映射。当前默认基于 Snowy 框架识别：前端 `project/snowy-admin-web/`；后端启动 `project/snowy-web-app/`；插件实现 `project/snowy-plugin/`；插件 API `project/snowy-plugin-api/`；公共模块 `project/snowy-common/`。如果实际结构变化，必须说明映射关系。

输出：

```text
当前阶段：自动分配准备
输入材料：
需求文档清单：
框架文档清单：
PRD：
设计稿：
技术设计：
数据设计：
当前分支：
原始当前分支：
需求集成分支：
Worktree 分支/路径：
工作区状态：
是否允许进入任务编排：
```

## 阶段 1：生成任务图

Orchestrator 将 feature slice 拆为任务图，不按岗位粗暴拆分，而按“可独立交付、可独立验证、依赖清晰”拆分。

任务类型：

| 类型 | Owner | 常见内容 |
| --- | --- | --- |
| product | Product Agent | 需求澄清、验收标准补充、文案规则 |
| design | Design Agent | UI 状态补齐、Handoff、素材规格 |
| architecture | Architect Agent | 模块边界、接口契约、状态机 |
| data | Data Agent | migration、索引、约束、回滚 |
| frontend | Frontend Agent | 页面、组件、状态、适配、接口接入 |
| backend | Backend Agent | API、业务逻辑、权限、事务、幂等 |
| qa | QA Agent | 测试用例、E2E、回归、验收脚本 |
| security | Security Agent | 权限、敏感数据、依赖、滥用风险 |
| devops | DevOps Agent | CI、环境变量、灰度、监控、回滚 |

每个任务必须包含：

- `task_id`
- `title`
- `owner_agent`
- `scope`
- `input_artifacts`
- `output_artifacts`
- `files_allowed`
- `dependencies`
- `blocking_rules`
- `local_checks`
- `acceptance`
- `risk_level`
- `branch_or_worktree`

推荐输出格式：

```yaml
slice_id: feature/example
tasks:
  - task_id: FE-001
    title: 实现主流程页面
    owner_agent: Frontend Agent
    dependencies: [API-001, UI-001]
    files_allowed:
      - project/snowy-admin-web/**
    local_checks:
      - npm run lint
      - npm run build
    risk_level: P1
```

## 阶段 2：依赖分层

Orchestrator 根据任务依赖生成 DAG，并把任务分为 wave。

常见 wave：

| Wave | 目标 | 可并行任务 |
| --- | --- | --- |
| Wave 0 | 澄清和补齐规格 | product、design、architecture |
| Wave 1 | 契约和数据底座 | architecture、data、backend contract、qa test plan |
| Wave 2 | 主体实现 | frontend、backend、data migration、qa case |
| Wave 3 | 联调和修复 | frontend integration、backend integration、qa smoke |
| Wave 4 | 门禁和交付 | review、security、ci、release notes |

并行原则：

- 没有依赖关系的任务可以并行。
- 共享同一批核心文件的任务不并行写入。
- API 契约和数据模型未稳定前，前后端只能基于 mock 或 contract 并行。
- 并行开发开始前必须读取本机开发环境检测结果；如果 `docs/workflow/local-environment-status.md` 为 `blocked_missing_mysql_cli`，不得进入任何开发 wave。
- 前端任务必须同步产出 mock 数据；后端不可用时，前端页面使用 mock 数据完成展示和交互验证。
- 高风险状态、金额、权限、资源扣减类任务必须先完成技术设计和测试设计。
- QA 和 Security 不等开发结束才开始，应从 Wave 1 起并行准备。

## 阶段 3：分配执行单元

每个并行任务必须拥有独立执行单元。

推荐策略：

| 场景 | 策略 |
| --- | --- |
| 多 Agent 同时改不同目录 | 独立 feature branch 即可 |
| 多 Agent 同时改同一仓库不同模块 | 独立 git worktree |
| 任务存在强依赖 | 后置任务等待前置任务产物 |
| 任务只产出文档或测试计划 | 可在同一分支串行提交 |
| 高风险核心链路 | 独立 branch，单独 PR，强制 Review |

本项目默认分支/worktree 链路：

```text
base_branch(开发者确认的当前分支)
  -> integration_branch(需求集成分支)
      -> worktree_branch/worktree_path(实际开发)
      -> merge back to integration_branch
  -> 用户确认后再 merge back to base_branch
```

规则：

- 不直接在 `base_branch` 写功能代码。
- 需求开始后先从 `base_branch` 创建 `integration_branch`。
- worktree 必须从 `integration_branch` 创建。
- worktree 开发完成后先提交，再合并回 `integration_branch`。
- `integration_branch` 完成验证后，必须询问开发者是否合回 `base_branch`，不得自动合并。

分支命名：

```text
feature/<slice-id>/<agent-or-task>
fix/<slice-id>/<bug>
test/<slice-id>/<qa>
chore/<slice-id>/<infra>
```

worktree 命名：

```text
../worktrees/<slice-id>-frontend
../worktrees/<slice-id>-backend
../worktrees/<slice-id>-data
../worktrees/<slice-id>-qa
```

每个执行单元开始前必须读取任务相关框架文档，并把 `files_allowed` 限定到 Snowy 实际模块路径，例如 `project/snowy-admin-web/**`、`project/snowy-plugin/**`、`project/snowy-plugin-api/**`、`project/snowy-common/**` 或 `project/snowy-web-app/**`。

## 阶段 4：并行执行规则

每个 Agent 开始前必须声明：

```text
任务 ID：
Owner：
输入材料：
允许修改范围：
禁止修改范围：
依赖任务：
本地检查：
完成产物：
```

并行写入规则：

- Agent 只能修改 `files_allowed` 中的文件。
- 发现必须修改范围外文件时，先回报 Orchestrator。
- 多个 Agent 需要修改同一文件时，由 Orchestrator 改为串行或指定一个 owner。
- 公共契约文件由 Architect 或 Backend 维护，Frontend 只消费。
- migration 由 Data Agent 维护，Backend 不直接改。
- 测试用例可由 QA 维护，开发 Agent 可补充贴近实现的单元测试。
- 前端接口层必须支持真实 API 与 mock 数据切换，切换方式以项目现有配置、环境变量或 adapter 约定为准。
- 后端仅因运行环境缺失无法运行时，可继续完成不涉及数据库操作的代码实现，并在任务状态中记录 `pending_environment_verification`。
- 本机环境状态为 `blocked_missing_mysql_cli` 时，必须停止并行开发计划，回到开发环境检测阶段。

## 阶段 5：日常同步

Orchestrator 维护简短状态板：

```text
Slice：
Wave：
任务总数：
进行中：
已完成：
阻塞：
风险：
下一次集成点：
```

任务状态：

- `todo`
- `in_progress`
- `blocked`
- `ready_for_integration`
- `in_review`
- `done`

阻塞规则：

- 同一阻塞连续三次无法解决，升级给用户或人工 owner。
- 影响主链路、数据一致性、安全或发布的阻塞，不能静默绕过。
- 依赖产物缺失时，不允许用猜测实现核心逻辑。

## 阶段 6：集成策略

推荐使用 Integration branch 或 PR queue。

流程：

1. 每个任务完成本地检查。
2. Orchestrator 汇总 diff、产物和风险。
3. 低风险任务先合入 integration branch。
4. 高风险任务单独 PR，Review 后再合入。
5. integration branch 运行完整 CI。
6. 修复冲突和回归问题。
7. 通过后创建面向主分支的最终 PR。

集成前检查：

- 任务产物齐全。
- 本地检查通过。
- 没有越界修改。
- 没有未声明依赖。
- 没有密钥、日志、构建产物。
- 没有 P0/P1 已知问题。

## 阶段 7：质量门禁

按风险等级选择门禁。

| 风险 | 必须门禁 |
| --- | --- |
| P0/P1 | unit、integration、contract、E2E、security、review、manual approval |
| P2 | lint、unit、build、review |
| docs/design | artifact review、link check、visual check |
| infra | CI dry run、rollback plan、secret scan |

通用门禁：

- Lint。
- Typecheck。
- Unit Test。
- Integration Test。
- E2E 或 Smoke。
- API Contract。
- Build。
- Coverage。
- Migration 验证。
- SAST。
- SCA。
- Secret Scan。
- Review。

## 阶段 8：审查和合并

审查按风险路由：

| 风险类型 | Reviewer |
| --- | --- |
| 主链路或真实缺陷 | Bug Reviewer |
| 权限、敏感数据、外部回调 | Security Reviewer |
| 慢查询、并发、重复请求 | Performance Reviewer |
| 模块边界、复杂度 | Maintainability Reviewer |
| 测试覆盖、回归风险 | QA Reviewer |

合并规则：

- 开发 Agent 不能 approve 自己的 PR。
- P0 必须修复。
- P1 合并前应修复。
- P2 可记录为后续优化。
- CI 未通过不允许进入最终合并。
- 人工审批是最终合并前门禁。

## 阶段 9：失败恢复

常见失败处理：

| 失败 | 处理 |
| --- | --- |
| 分支冲突 | Orchestrator 指派单一 owner 串行解决 |
| 契约变更 | Architect 更新 contract，Frontend/Backend 重新同步 |
| migration 失败 | Data Agent 回滚或补兼容 migration |
| 后端运行环境缺失但不涉及数据库操作 | Backend Agent 继续编码，补配置说明和待验证清单；Frontend Agent 使用 mock 数据推进 |
| 开发环境缺少 mysql 指令 | 本机环境状态标记 `blocked_missing_mysql_cli`，不进入任何开发 wave |
| CI 失败 | 按失败类型路由给对应 Agent |
| 测试不稳定 | QA Agent 标记 flaky，开发 Agent 修复根因 |
| 安全高危 | Security Agent 阻断合并 |

## Orchestrator 输出模板

```text
当前阶段：自动分配与并行开发
阶段目标：
需求文档：
输入产物：
Feature Slice：
任务图：
并行 Wave：
任务分配：
分支/Worktree 策略：
集成策略：
质量门禁：
风险与阻塞：
是否需要用户确认：
下一阶段：
```

## 完成标准

- 任务图已生成。
- 任务依赖已明确。
- 并行 wave 已明确。
- 每个任务都有 owner、范围、产物和检查命令。
- branch/worktree 策略已明确。
- 集成策略已明确。
- CI、Review、QA、Security 门禁已明确。
- 残余风险和阻塞已记录。
