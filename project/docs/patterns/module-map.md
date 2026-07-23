# Snowy 模块归属缓存

本文件用于回答“新需求应该放在哪里开发”。除非框架结构发生变化，后续需求应优先按本映射定位落点。

## 总体规则

- 不新建独立 `frontend/`、`backend/` 根目录，所有开发都在 `project/` 现有 Snowy 框架内增量完成。
- 后台管理类功能优先落在现有插件分组：`auth`、`biz`、`client`、`dev`、`gen`、`mobile`、`sys`。
- 有跨插件调用需求时，先在 `snowy-plugin-api` 定义或复用 API 契约，再由 `snowy-plugin` 中对应 provider 实现。
- 前端 API 和页面目录应与后端插件分组保持一致。
- SQL 初始化、菜单、按钮、字典和权限资源集中维护在 `project/snowy-web-app/src/main/resources/_sql/snowy_mysql.sql`。
- 面向用户的独立移动端页面落在 `project/h5/`；后管的移动端资源管理仍落在 Snowy `mobile` 模块，两者不得混淆。

## 后端模块归属

| 模块 | 包根 | 适合放置的需求 |
| --- | --- | --- |
| `snowy-plugin-auth` | `vip.xiaonuo.auth` | 登录、登出、验证码、SSO、第三方登录、Token 会话 |
| `snowy-plugin-biz` | `vip.xiaonuo.biz` | 业务组织、业务人员、业务岗位、业务首页、业务通知、一般业务后台 CRUD |
| `snowy-plugin-client` | `vip.xiaonuo.client` | C 端用户、C 端账号中心、客户端关系数据 |
| `snowy-plugin-dev` | `vip.xiaonuo.dev` | 字典、系统配置、文件、邮件、短信、消息、定时任务、监控、轮播图等开发支撑能力 |
| `snowy-plugin-gen` | `vip.xiaonuo.gen` | 代码生成、生成配置、模板预览 |
| `snowy-plugin-mobile` | `vip.xiaonuo.mobile` | 移动端模块、菜单、按钮资源管理 |
| `snowy-plugin-sys` | `vip.xiaonuo.sys` | 系统用户、角色、组织、职位、用户组、模块/菜单/按钮/字段权限 |
| `snowy-common` | `vip.xiaonuo.common` | 公共注解、异常、分页、实体、工具、拦截器、缓存、切面 |
| `snowy-web-app` | `vip.xiaonuo` | 应用启动、全局配置、资源配置、SQL 初始化 |

## 插件 API 归属

| API 模块 | 适用情况 |
| --- | --- |
| `snowy-plugin-auth-api` | 其他插件需要鉴权、登录态或认证相关能力 |
| `snowy-plugin-biz-api` | 其他插件需要业务组织、业务用户、业务字典等能力 |
| `snowy-plugin-client-api` | 其他插件需要 C 端用户或客户端关系能力 |
| `snowy-plugin-dev-api` | 其他插件需要字典、配置、文件、消息、轮播图等开发支撑能力 |
| `snowy-plugin-gen-api` | 其他插件需要代码生成能力 |
| `snowy-plugin-mobile-api` | 其他插件需要移动端资源能力 |
| `snowy-plugin-sys-api` | 其他插件需要系统用户、角色、组织、资源权限能力 |

## 前端模块归属

| 前端路径 | 后端对应 | 适合放置的需求 |
| --- | --- | --- |
| `src/views/auth/`、`src/api/auth/` | `snowy-plugin-auth` | 登录、SSO、三方认证、会话监控 |
| `src/views/biz/`、`src/api/biz/` | `snowy-plugin-biz` | 业务后台、业务首页、业务人员、通知公告、普通业务 CRUD |
| `src/views/client/`、`src/api/client/` | `snowy-plugin-client` | C 端用户管理 |
| `src/views/dev/`、`src/api/dev/` | `snowy-plugin-dev` | 字典、配置、文件、消息、任务、轮播图、监控 |
| `src/views/gen/`、`src/api/gen/` | `snowy-plugin-gen` | 代码生成 |
| `src/views/mobile/`、`src/api/mobile/` | `snowy-plugin-mobile` | 移动端资源管理 |
| `src/views/sys/`、`src/api/sys/` | `snowy-plugin-sys` | 系统用户、角色、组织、权限资源 |
| `src/components/` | 通用组件 | 可跨页面复用的 UI 组件 |
| `src/utils/` | 通用工具 | 请求、权限、格式化、字典、加密等工具 |

## 常见需求落点

| 需求类型 | 后端落点 | 前端落点 | 数据/权限落点 |
| --- | --- | --- | --- |
| 普通后台单表 CRUD | `snowy-plugin-biz/src/main/java/vip/xiaonuo/biz/modular/<module>/` | `src/views/biz/<module>/`、`src/api/biz/<module>Api.js` | 新表、菜单、按钮、API 权限 |
| 开发支撑 CRUD | `snowy-plugin-dev/src/main/java/vip/xiaonuo/dev/modular/<module>/` | `src/views/dev/<module>/`、`src/api/dev/<module>Api.js` | 字典、配置、菜单、按钮 |
| 系统权限/菜单/角色 | `snowy-plugin-sys/.../resource` 或 `.../role` | `src/views/sys/resource/`、`src/views/sys/role/` | `SYS_RESOURCE`、`SYS_RELATION` |
| 文件上传/附件 | 优先复用 `snowy-plugin-dev` 的 file 能力 | 复用 `xn-upload` 或 dev/file 页面模式 | 文件配置、文件表 |
| 字典和状态值 | 优先复用 `dev` 字典能力，业务侧可通过 biz dict 展示 | `tool.dictList`、`$TOOL.dictTypeData` | `DEV_DICT` |
| 轮播图/banner | 优先复用 `snowy-plugin-dev` 的 slideshow 能力 | `src/views/dev/slideshow/`、首页 `BizSlideshowCard` | `DEV_SLIDESHOW`、`DEV_SLIDESHOW_*` 字典、`SYS_RESOURCE` |
| 首页卡片/业务首页 | `snowy-plugin-biz` 和可复用 dev API | `src/views/biz/index/`、`src/components/HomeCard/` | 视具体数据源补 SQL/权限 |
| 移动端资源 | `snowy-plugin-mobile/.../resource` | `src/views/mobile/resource/` | 移动端菜单/按钮资源 |
| H5 用户页面 | 按接口归属落到 `client`、`biz` 或专用插件 | `project/h5/src/views/<feature>/` | H5 路由显式登记；认证按需求确认 |

## H5 前端落点

```text
project/h5/src/views/<feature>/index.vue
project/h5/src/views/<feature>/components/
project/h5/src/api/<feature>/
project/h5/src/router/routes/index.ts
project/h5/src/components/
```

新 H5 页面先复用 `/demo` 与 `src/components/`，新增跨页面组件后更新 `h5-ui-component-pattern.md`。

## 新模块文件模板

后端单模块通常包含：

```text
controller/<Name>Controller.java
service/<Name>Service.java
service/impl/<Name>ServiceImpl.java
mapper/<Name>Mapper.java
mapper/mapping/<Name>Mapper.xml
entity/<Name>.java
param/<Name>AddParam.java
param/<Name>EditParam.java
param/<Name>IdParam.java
param/<Name>PageParam.java
enums/<Name>Enum.java
provider/<Name>ApiProvider.java
```

前端单模块通常包含：

```text
src/api/<group>/<name>Api.js
src/views/<group>/<name>/index.vue
src/views/<group>/<name>/form.vue
src/views/<group>/<name>/detail.vue
```

并非每个需求都需要全量文件：只读列表不需要表单，简单 CRUD 不一定需要 provider，复杂详情才需要 `detail.vue`。

## 快速定位规则

- 需求名包含“系统、角色、菜单、权限、资源、组织、用户组”：优先查 `sys`。
- 需求名包含“业务、后台业务、通知、首页”：优先查 `biz`。
- 需求名包含“字典、配置、文件、消息、任务、监控、轮播、banner”：优先查 `dev`。
- 需求名包含“客户端、C端、会员”：优先查 `client`。
- 需求名包含“移动端菜单/按钮/模块”：优先查 `mobile`。
- 找不到归属时，先查 `feature-capability-map.md`，再用 `rg` 搜功能名和相近词。
