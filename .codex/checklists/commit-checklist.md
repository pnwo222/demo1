# 提交代码检查表

## Git 状态

- [ ] 当前目录是 Git 仓库。
- [ ] 当前分支不是 `main` / `master`，或用户明确要求直接提交。
- [ ] 已确认 remote。
- [ ] 已确认工作区变更属于本次任务。
- [ ] 未误提交用户已有的无关改动。

## 生成物和敏感信息

- [ ] 未提交依赖目录。
- [ ] 未提交构建产物。
- [ ] 未提交编译输出。
- [ ] 未提交日志文件。
- [ ] 未提交密钥、token、cookie、私有配置。
- [ ] `.gitignore` 覆盖常见生成物。

## 本地门禁

- [ ] 已根据当前项目脚本执行必要 lint。
- [ ] 已根据当前项目脚本执行必要 typecheck。
- [ ] 已根据当前项目脚本执行必要测试。
- [ ] 已根据当前项目脚本执行必要 build。
- [ ] 如有接口或端到端链路，已执行 smoke 或 E2E。
- [ ] 如有安全扫描，SAST / SCA / Secret Scan 已通过或说明缺口。

## Commit

- [ ] commit message 符合规范。
- [ ] commit 只包含本次 slice 相关文件。
- [ ] commit 前已检查 `git diff --stat`。
- [ ] commit 后已检查 `git status --short`。

## Push / PR

- [ ] 已 push 到 feature branch。
- [ ] 已创建 PR。
- [ ] PR 模板填写完整。
- [ ] PR 关联需求文档、issue 或 feature slice。
- [ ] PR 中包含本地验证命令和结果。
- [ ] PR 中包含风险和回滚方案。

## 禁止绕过

- [ ] 未跳过 CI。
- [ ] 未自行 approve。
- [ ] 未直接 merge main/master。
- [ ] 未直接发布生产。
