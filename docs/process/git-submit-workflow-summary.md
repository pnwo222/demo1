# 提交代码工作流说明

## 当前新增内容

本项目已新增“提交代码到 GitHub”的工作流，用于把 Agent 开发完成的代码从本地推入 GitHub PR 流程。

新增文件：

- `.codex/agents/git.toml`
- `.codex/workflows/git-submit-workflow.md`
- `.codex/workflows/README.md`
- `.codex/checklists/commit-checklist.md`
- `.github/pull_request_template.md`
- `.github/workflows/ci.yml`
- `.gitignore`

## 流程位置

```text
产品设计
-> UI 设计
-> 技术设计
-> Feature Slice 拆分
-> 开发
-> 本地测试与质量门禁
-> 提交代码到 GitHub
-> PR Review
-> CI
-> 人工审批
-> 部署发布
-> 验收复盘
```

## 执行方式

你可以对 Codex 说：

```text
提交当前代码
```

或：

```text
由 Orchestrator 调度 Git Agent，提交当前 feature slice，push 到 GitHub 并创建 PR。
```

Git Agent 会执行：

1. 检查 Git 仓库状态。
2. 检查当前分支。
3. 创建或切换 feature branch。
4. 运行本地门禁。
5. 检查 diff。
6. commit。
7. push。
8. 创建 PR。
9. 输出提交报告。

## 当前项目限制

当前目录还不是 Git 仓库，所以现在还不能直接 push 或创建 PR。

需要先执行：

```powershell
git init
git checkout -b feature/food-delivery-mvp
git remote add origin <你的 GitHub 仓库地址>
```

如果你已经有 GitHub 仓库地址，可以直接告诉 Codex：

```text
使用这个 GitHub 仓库：<repo-url>，初始化 Git 并提交当前代码
```

## 禁止绕过

- 不跳过 CI。
- 不自行 approve。
- 不直接 merge main/master。
- 不直接发布生产。
- 不隐藏失败测试。
- 不误提交无关改动。
