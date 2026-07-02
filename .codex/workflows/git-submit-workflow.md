# 通用 Git/GitHub 提交流程

本工作流用于把 Agent 本地开发完成的改动提交到 GitHub，并进入 PR、CI、Review 和人工审批。它不绑定具体业务；提交前必须读取 `docs/requirements/` 下的全部需求文档、`project/docs/` 下的全部框架文档和项目实际脚本。

## 适用时机

当某个 feature slice 的开发、基础测试和本地验证完成后，进入提交流程。

典型触发语：

```text
提交当前代码
创建提交
推送到 GitHub
创建 PR
把这个 slice 提交
```

## 参与 Agent

| Agent | 职责 |
| --- | --- |
| Orchestrator | 判断是否允许进入提交流程，汇总阶段结果 |
| Git Agent | 分支、commit、push、PR 创建 |
| QA Agent | 确认测试和构建结果 |
| Security Agent | 确认安全扫描或风险说明 |
| Reviewer Agent | PR 后进行代码审查 |
| DevOps Agent | CI/CD、环境变量、发布前检查 |

## 标准流程

### 1. 确认 Git 状态

```powershell
git status --short
git branch --show-current
git remote -v
```

门禁：

- 当前目录必须是 Git 仓库。
- 不建议在 `main` / `master` 直接提交功能代码。
- 必须确认工作区里哪些文件属于本次任务。
- 如果有用户已有改动，不能擅自纳入提交。

### 2. 创建或切换 feature branch

分支命名建议：

```text
feature/<slice-name>
fix/<bug-name>
chore/<workflow-name>
docs/<doc-name>
```

示例：

```powershell
git checkout -b feature/user-facing-mvp
git checkout -b fix/price-preview
git checkout -b chore/github-submit-workflow
```

### 3. 提交前质量门禁

根据项目实际脚本和需求集合执行必要检查。常见命令包括：

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

```powershell
mvn test
mvn package
```

```powershell
gradle test
gradle build
```

门禁：

- 构建失败：不允许作为完成提交。
- 测试失败：必须修复或标记 WIP 并说明原因。
- 安全高危：不允许进入合并。
- 技术栈命令以当前仓库配置为准，不在工作流里写死。

### 4. 检查 diff

```powershell
git diff
git diff --stat
git status --short
```

必须确认：

- 只提交本次 feature slice 相关文件。
- 不包含临时日志、构建产物、密钥、个人配置。
- 不误提交 `node_modules`、`dist`、`out` 等生成物。

### 5. Commit

```powershell
git add <files>
git commit -m "feat: add user-facing MVP slice"
```

commit message 建议：

| 类型 | 场景 |
| --- | --- |
| feat | 新功能 |
| fix | 修复缺陷 |
| test | 测试 |
| docs | 文档 |
| chore | 工程配置 |
| refactor | 重构 |
| security | 安全修复 |

### 6. Push 到 GitHub

```powershell
git push -u origin feature/user-facing-mvp
```

门禁：

- 不强推 `main` / `master`。
- push 失败时先检查 remote、权限、网络和分支保护。
- 远程已有更新时，按团队规范 fetch/rebase 或合并。

### 7. 创建 Pull Request

如果安装了 GitHub CLI：

```powershell
gh pr create --base main --head feature/user-facing-mvp --title "feat: add user-facing MVP slice" --body-file .github/pull_request_template.md
```

PR 内容必须包含：

- 已读取的需求文档清单。
- 已读取的框架文档清单。
- feature slice 和影响范围。
- 本地验证命令和结果。
- CI 状态。
- 风险、回滚方案和残余问题。
- 需要 Review 的重点。

PR 创建后必须等待：

- GitHub Actions CI 完成。
- Reviewer 审查完成。
- Security / QA 必要检查完成。
- 人工审批完成。

### 8. 禁止事项

Agent 不允许：

- 自己 approve 自己的 PR。
- 跳过 CI。
- 直接 merge main/master。
- 直接部署生产。
- 隐藏失败测试。
- 把未确认的用户改动一起提交。

## Orchestrator 输出模板

```text
当前阶段：提交代码
阶段目标：把已完成 slice 提交到 GitHub 并创建 PR
调用 Agent：Git Agent、QA Agent、Security Agent、Reviewer Agent
输入材料：需求文档清单、框架文档清单、feature slice、代码 diff、测试结果、PR checklist
预期输出：commit、push、PR、CI 链接、提交报告
验收标准：本地门禁通过，PR 创建成功，CI 启动，未绕过 Review 和人工审批
是否需要用户确认：push、创建 PR、合并和发布前需要确认
下一阶段：CI / Review / 人工审批
```

## 提交报告模板

```text
分支：
Commit：
PR：
本地验证：
CI 状态：
Review 状态：
未提交文件：
风险：
下一步：
```
