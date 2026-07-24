# 开发任务状态：<任务标题>

本文件由任务负责人维护。`docs/workflow/status.md`、需求状态文件中的任务汇总区和 `PROJECT_ARTIFACTS.html` 仅由 Integration Owner 更新。

## 元信息

| 项 | 内容 |
| --- | --- |
| 需求ID | <REQ-001> |
| 任务ID | <TASK-001> |
| 任务标题 | <任务标题> |
| 负责人 | <姓名或账号> |
| 状态 | todo |
| 需求集成分支 | <codex/REQ-001-integration> |
| 任务分支 | <codex/REQ-001-task-owner> |
| 依赖任务 | - |
| 允许修改范围 | <project/...> |
| 风险等级 | P2 |
| 最新提交 | - |
| 本地检查 | - |
| 产物 | - |
| 缓存更新 | 无需更新 |
| 更新时间 | <YYYY-MM-DD HH:mm +08:00> |

## 状态约定

`todo` -> `claimed` -> `in_progress` -> `ready_for_integration` -> `in_review` -> `integrated`

阻塞时使用 `blocked`。任务领取后必须尽快提交并推送本文件；推送被拒绝时先同步需求集成分支，确认任务未被其他人领取后再继续。

```powershell
# 在需求集成分支领取并登记任务
python scripts/workflow_task.py claim --requirement REQ-001 --task TASK-001 --title "任务名称" --owner "开发者" --integration-branch codex/REQ-001-integration --task-branch codex/REQ-001-task-owner --files-allowed "project/**"

# 任务负责人在任务分支登记待集成状态
python scripts/workflow_task.py set-status --requirement REQ-001 --task TASK-001 --status ready_for_integration --commit <commit> --checks "PASS"

# Review 通过后，由 Integration Owner 在需求集成分支执行
.\scripts\integrate-task.ps1 -RequirementId REQ-001 -TaskId TASK-001 -TaskBranch codex/REQ-001-task-owner
```

## 实施记录

```text
范围:
关键实现:
接口/数据库变更:
兼容性:
```

## 验证记录

```text
检查命令:
检查结果:
未执行项:
残余风险:
```

## Review 记录

```text
Review 状态:
Reviewer:
问题:
结论:
```
