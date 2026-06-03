# 提交代码检查表

## Git 状态

- [ ] 当前目录是 Git 仓库
- [ ] 当前分支不是 main/master，或用户明确要求直接提交
- [ ] 已确认 remote origin
- [ ] 已确认工作区变更属于本次任务
- [ ] 未误提交用户已有无关改动

## 生成物和敏感信息

- [ ] 未提交 `node_modules/`
- [ ] 未提交 `frontend/dist/`
- [ ] 未提交 `backend/out/`
- [ ] 未提交日志文件
- [ ] 未提交密钥、token、cookie、私有配置
- [ ] `.gitignore` 覆盖常见生成物

## 本地门禁

- [ ] 前端 `npm run build` 通过
- [ ] 后端 Java 编译通过
- [ ] API smoke 通过
- [ ] 如有测试，Unit/Integration/E2E/Contract 已通过或说明缺口
- [ ] 如有安全扫描，SAST/SCA/Secret Scan 已通过或说明缺口

## Commit

- [ ] commit message 符合规范
- [ ] commit 只包含本次 slice 相关文件
- [ ] commit 前已检查 `git diff --stat`
- [ ] commit 后已检查 `git status --short`

## Push / PR

- [ ] 已 push 到 feature branch
- [ ] 已创建 PR
- [ ] PR 模板填写完整
- [ ] PR 关联需求、issue 或 feature slice
- [ ] PR 中包含本地验证命令和结果
- [ ] PR 中包含风险和回滚方案

## 禁止绕过

- [ ] 未跳过 CI
- [ ] 未自行 approve
- [ ] 未直接 merge main/master
- [ ] 未直接发布生产
