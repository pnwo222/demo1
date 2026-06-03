# Git/GitHub 提交代码工作流

本工作流用于外卖平台 Vue3 H5 + Java 项目，把 Agent 本地开发完成的代码提交到 GitHub，并进入 PR、CI、Review 和人工审批。

## 适用时机

当某个 feature slice 的开发、基础测试和本地验证完成后，进入提交代码阶段。

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
| DevOps Agent | CI/CD、环境变量、部署前检查 |

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

如果当前目录不是 Git 仓库：

```powershell
git init
git checkout -b feature/food-delivery-mvp
```

如果已有 GitHub 仓库：

```powershell
git remote add origin <github-repo-url>
```

### 2. 创建或切换 feature branch

分支命名建议：

```text
feature/<slice-name>
fix/<bug-name>
chore/<workflow-name>
```

外卖平台示例：

```powershell
git checkout -b feature/food-delivery-mvp
git checkout -b feature/order-checkout
git checkout -b chore/github-submit-workflow
```

### 3. 提交前质量门禁

前端：

```powershell
cd frontend
npm run build
```

后端：

```powershell
javac -encoding UTF-8 -d backend\out backend\src\main\java\com\demo\fooddelivery\FoodDeliveryServer.java
```

API smoke：

```powershell
powershell -ExecutionPolicy Bypass -File scripts\api-smoke.ps1
```

如果项目后续接入 Spring Boot、Maven 或 Gradle，需要替换为：

```powershell
mvn test
mvn package
```

或：

```powershell
gradle test
gradle build
```

门禁：

- 构建失败：不允许作为完成提交。
- 测试失败：必须修复或标记 WIP。
- 安全高危：不允许进入合并。

### 4. 检查 diff

```powershell
git diff
git diff --stat
git status --short
```

必须确认：

- 只提交本次 feature slice 相关文件。
- 不包含临时日志、构建产物、密钥、个人配置。
- 不误提交 `node_modules`、`backend/out`、`dist` 等生成物。

推荐增加 `.gitignore`：

```text
node_modules/
frontend/dist/
backend/out/
*.log
```

### 5. Commit

```powershell
git add <files>
git commit -m "feat: add food delivery MVP"
```

commit message 规则：

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
git push -u origin feature/food-delivery-mvp
```

门禁：

- 不强推 main/master。
- 如果 push 失败，先检查 remote、权限、网络和分支保护。
- 如果远程已有更新，先 fetch/rebase 或按团队规范处理。

### 7. 创建 Pull Request

如果安装了 GitHub CLI：

```powershell
gh pr create --base main --head feature/food-delivery-mvp --title "feat: add food delivery MVP" --body-file .github/pull_request_template.md
```

如果没有 `gh`，Git Agent 输出 GitHub 网页创建 PR 的链接和填写内容。

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
输入材料：feature slice、代码 diff、测试结果、PR checklist
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
