# 外卖平台 Codex 工作流索引

## 主流程

- `multi-agent-sdlc.md`：产品设计 -> UI 设计 -> 技术设计 -> 开发 -> 测试 -> 审查 -> 部署 -> 验收。

## 新增：提交代码流程

- `git-submit-workflow.md`：开发完成后，如何由 Git Agent 执行 branch、commit、push、PR。

提交代码阶段应放在：

```text
阶段 5：并行开发
阶段 6：测试与质量门禁
阶段 6.5：提交代码到 GitHub
阶段 7：PR Review
阶段 8：部署发布
阶段 9：验收复盘
```

## 提交代码阶段门禁

- 本地质量门禁必须通过。
- 必须检查 diff。
- 不允许误提交用户无关改动。
- 不允许提交构建产物、日志、密钥。
- Agent 可以 commit、push、创建 PR。
- Agent 不允许 approve、merge、跳过 CI、直接发布生产。

## 相关文件

- `.codex/agents/git.toml`
- `.codex/checklists/commit-checklist.md`
- `.github/pull_request_template.md`
- `.github/workflows/ci.yml`
- `.gitignore`
