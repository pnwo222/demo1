# H5 路由与认证模式缓存

## 当前默认模式

| 项 | 当前实现 |
| --- | --- |
| 路由入口 | `project/h5/src/router/routes/index.ts` |
| 根路由 | `/` 重定向 `/demo` |
| 组件演示 | `/demo` |
| 兜底 | 404 |
| 路由装载 | 显式登记，不扫描 `routes/modules` |
| 守卫 | NProgress 进度守卫和页面标题守卫 |
| 登录和权限 | 默认不启用 |

新业务路由应显式加入路由表，或按新项目确认后的模块化方案接入。历史业务路由文件已移除，禁止直接恢复旧 `import.meta.glob('./modules/**/*.ts')`。

## 历史认证链路参考

以下链路来自模板清理前的实际项目，只作为未来认证需求的设计参考：

1. `permissionGuard.ts` 在 `router.beforeEach` 中读取本地 Token。
2. Token 使用 `${openId}_` 前缀隔离，键名为 `TOKEN`。
3. 白名单包含登录页、Demo 和扫码页。
4. 未登录访问受保护页面时跳转 `/login?redirect=<目标路径>`。
5. 已登录但 Pinia 中无用户信息时调用 `/auth/c/getLoginUser`。
6. 用户 `isHomeCheck` 未完成时强制进入 `/auth` 做身份选择。
7. Axios 请求拦截器附加 Token；401 调用用户 Store 的退出逻辑。
8. 用户信息进入 Store 前对姓名、手机号和身份证做脱敏。
9. 一卡通 JSSDK 参与页面标题、头像和宿主页面关闭。

历史参考源码仍可从以下位置理解数据结构，但不属于当前路由入口：

- `project/h5/src/store/modules/user.ts`
- `project/h5/src/store/modules/user-types.ts`
- `project/h5/src/hooks/system/useUser/`
- `project/h5/src/api/user/`
- `project/h5/src/views/sys/user/`
- `project/h5/src/setting/axiosSetting.ts`

## 重新接入认证前的门禁

必须先确认：

- 认证提供方是 Snowy 后端、统一身份平台还是宿主 App。
- Token 名称、存储位置、刷新机制、过期机制和多用户隔离方式。
- 登录、身份选择、绑卡和激活是否仍是独立流程。
- 白名单、未登录跳转、401、403、网络失败和账号禁用行为。
- 用户敏感字段是否需要脱敏、加密或禁止落本地。
- Web 浏览器与一卡通 App 宿主是否使用同一认证方案。

确认后才能恢复认证 Store、请求头和权限守卫；不得复制历史链路后直接上线。
