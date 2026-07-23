# Snowy 功能能力地图缓存

本文件记录框架已经具备的功能能力和可复用落点。后续需求先查本文件，命中后只补读相关代码，不再全量探索。

## 能力清单

| 能力 | 后端位置 | 前端位置 | 数据/权限位置 | 复用建议 |
| --- | --- | --- | --- | --- |
| 登录/认证/SSO/三方登录 | `snowy-plugin-auth`、`snowy-plugin-auth-api` | `src/views/auth/`、`src/api/auth/` | Sa-Token 配置、认证相关表 | 认证类需求先复用 auth，不在业务模块重写登录态 |
| 系统用户 | `snowy-plugin-sys/.../user` | `src/views/sys/user/`、`src/api/sys/userApi.js` | `SYS_USER`、`SYS_USER_EXT`、`SYS_USER_PASSWORD` | 后台用户、用户中心、重置密码、授权角色优先复用 |
| 系统组织/职位/用户组 | `snowy-plugin-sys/.../org`、`position`、`group` | `src/views/sys/org/`、`position/`、`group/` | `SYS_ORG`、`SYS_POSITION`、`SYS_GROUP` 等 | 组织树、选择器、授权用户可复用 |
| 角色和资源权限 | `snowy-plugin-sys/.../role`、`resource` | `src/views/sys/role/`、`src/views/sys/resource/` | `SYS_RESOURCE`、`SYS_RELATION` | 菜单、按钮、API 权限要同时维护 SQL、后端注解和前端 `hasPerm` |
| 业务人员/机构/岗位 | `snowy-plugin-biz/.../user`、`org`、`position` | `src/views/biz/user/`、`org/`、`position/` | `BIZ_USER`、`BIZ_ORG`、`BIZ_POSITION` 等 | 普通业务组织模型优先复用 biz，不直接改 sys |
| 业务用户组 | `snowy-plugin-biz/.../group` | `src/views/biz/group/`、`src/api/biz/bizGroupApi.js` | `BIZ_GROUP` 及相关关系 | 业务侧分组授权场景可复用 |
| 通知公告 | `snowy-plugin-biz/.../notice` | `src/views/biz/notice/`、`src/api/biz/bizNoticeApi.js` | `BIZ_NOTICE`、`SYS_RESOURCE` 的 `bizNotice*` 按钮 | 标准 CRUD、状态启停、详情页的高价值参考 |
| 业务首页 | `snowy-plugin-biz/.../index` 和 dev API | `src/views/biz/index/`、`src/components/HomeCard/`、`src/api/biz/bizIndexApi.js` | `SYS_RESOURCE` 的 `bizIndex` | 首页卡片和轮播展示类需求先查这里 |
| 轮播图/banner | `snowy-plugin-dev/.../slideshow`、`snowy-plugin-dev-api/DevSlideshowApi.java` | `src/views/dev/slideshow/`、`src/api/dev/slideshowApi.js`、`src/components/HomeCard/BizSlideshowCard/` | `DEV_SLIDESHOW`、`DEV_SLIDESHOW_PLACE`、`DEV_SLIDESHOW_STATUS`、`WHETHER_TO_CLICK`、`SKIP_MODE`、`SYS_RESOURCE` 的 `slideshow` | 首页 banner/轮播管理优先复用；已有分页、新增、编辑、删除、启停、按位置获取列表 |
| 字典 | `snowy-plugin-dev/.../dict`、`snowy-plugin-biz/.../dict` | `src/views/dev/dict/`、`src/views/biz/dict/` | `DEV_DICT` | 状态、类型、展示位置等优先进入字典；前端用 `tool.dictList` |
| 系统配置 | `snowy-plugin-dev/.../config` | `src/views/dev/config/`、`src/api/dev/configApi.js` | `DEV_CONFIG` | 登录、注册、短信、邮件、文件、密码等配置页可复用 |
| 文件上传/存储 | `snowy-plugin-dev/.../file`、文件存储工具类 | `src/views/dev/file/`、`xn-upload` | `DEV_FILE`、文件配置 | 图片/附件上传优先复用 `xn-upload` 和 dev file 能力 |
| 消息/站内信 | `snowy-plugin-dev/.../message` | `src/views/dev/message/`、layout message 组件 | 消息相关表 | 站内消息和消息详情可复用 |
| 定时任务 | `snowy-plugin-dev/.../job` | `src/views/dev/job/` | `DEV_JOB` | 定时执行、启停、立即运行类需求可复用 |
| 日志审计 | `snowy-plugin-dev/.../log` | `src/views/dev/log/` | 操作日志、访问日志表 | 操作记录、访问日志、审计展示可复用 |
| 代码生成 | `snowy-plugin-gen`、`snowy-plugin-gen-api` | `src/views/gen/`、`src/api/gen/` | 生成配置表 | 新 CRUD 可参考生成器产物，但仍要按项目缓存核验 |
| C 端用户 | `snowy-plugin-client/.../user` | `src/views/client/user/`、`src/api/client/` | `CLIENT_USER` 等 | 客户端账号、个人中心、启停用户优先复用 |
| 移动端资源 | `snowy-plugin-mobile/.../resource` | `src/views/mobile/resource/`、`src/api/mobile/resource/` | 移动端模块/菜单/按钮资源 | 移动端后台资源管理可复用 |
| H5 组件与交互 | 按业务接口归属 | `project/h5/src/components/`、`src/views/demo/` | 默认无权限；认证需单独确认 | H5 页面和原型优先复用 Vant 与项目组件 |
| H5 历史认证参考 | 认证接口需重新确认 | `project/h5/src/store/modules/user.ts`、`src/hooks/system/useUser/` | Token、openId、身份选择 | 当前未启用，只用于认证方案设计参考 |

## 轮播图/banner 能力细节

已核验代码：

- 后端管理接口：`project/snowy-plugin/snowy-plugin-dev/src/main/java/vip/xiaonuo/dev/modular/slideshow/controller/DevSlideshowController.java`
- 后端业务逻辑：`project/snowy-plugin/snowy-plugin-dev/src/main/java/vip/xiaonuo/dev/modular/slideshow/service/impl/DevSlideshowServiceImpl.java`
- 实体：`project/snowy-plugin/snowy-plugin-dev/src/main/java/vip/xiaonuo/dev/modular/slideshow/entity/DevSlideshow.java`
- 插件 API：`project/snowy-plugin-api/snowy-plugin-dev-api/src/main/java/vip/xiaonuo/dev/api/DevSlideshowApi.java`
- 前端管理页：`project/snowy-admin-web/src/views/dev/slideshow/index.vue`
- 前端表单：`project/snowy-admin-web/src/views/dev/slideshow/form.vue`
- 前端 API：`project/snowy-admin-web/src/api/dev/slideshowApi.js`
- 首页使用点：`project/snowy-admin-web/src/views/biz/index/index.vue`、`project/snowy-admin-web/src/components/HomeCard/BizSlideshowCard/index.vue`
- SQL：`project/snowy-web-app/src/main/resources/_sql/snowy_mysql.sql`

能力边界：

- 管理端已有分页、标题/位置/状态筛选、新增、编辑、删除、批量删除、启用、禁用。
- 表字段包含 `title`、`place`、`image`、`pathDetails`、`status`、`sortCode`、`extJson` 和通用字段。
- 展示位置、状态、点击、跳转方式依赖 `DEV_DICT` 字典。
- 业务使用侧通过 `DevSlideshowApi` 按位置获取启用轮播，未配置时会返回静态兜底图。
- 当前管理 Controller 未加 `@SaCheckPermission`，如新需求要求严格按钮/API 权限，应补齐后端权限注解、前端 `hasPerm` 和 `SYS_RESOURCE`。

## 缓存命中规则

| 需求关键词 | 命中能力 | 还需补读 |
| --- | --- | --- |
| 首页 banner、轮播图、广告位 | 轮播图/banner | `slideshow` 后端、前端、字典和首页使用点 |
| 通知公告、公告详情、公告启停 | 通知公告 | `biz/notice` 后端、前端和 `BIZ_NOTICE` SQL |
| 菜单、按钮、权限、资源 | 角色和资源权限 | `sys/resource`、`permission-sql-pattern.md` |
| 字典、状态、类型、枚举展示 | 字典 | `dev/dict`、`DEV_DICT` SQL |
| 文件、图片、附件、上传 | 文件上传/存储 | `dev/file`、`xn-upload`、文件配置 |
| 业务首页、工作台卡片 | 业务首页 | `biz/index`、`components/HomeCard` |
| 系统用户、角色授权 | 系统用户、角色和资源权限 | `sys/user`、`sys/role`、`SYS_RELATION` |
| H5、移动端页面、Vant、H5 原型 | H5 组件与交互 | `h5-ui-component-pattern.md`、`project/h5/src/views/demo/` |
| H5 登录、Token、身份选择 | H5 历史认证参考 | `h5-routing-auth-pattern.md`，并重新确认接口协议 |

## 缓存失配处理

- 如果本文件声明已有能力，但代码中找不到对应文件，以代码为准，并更新本文件。
- 如果新需求只是在现有能力上加字段或加筛选，优先按原模块增量修改。
- 如果新需求是同类但归属不同，复用模式，不直接搬动现有模块。
- 如果涉及资金、权限、状态机、库存、用户敏感数据、删除或批量操作，即使命中缓存，也必须进入更严格审查。
