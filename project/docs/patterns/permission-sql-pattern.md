# 权限和菜单 SQL 模式缓存

## 来源

- `project/snowy-web-app/src/main/resources/_sql/snowy_mysql.sql`
- `SYS_RESOURCE`
- `SYS_RELATION`
- 通知公告菜单和权限记录

## 菜单资源模式

菜单记录位于 `SYS_RESOURCE`。

通知公告示例：

```text
菜单名: 通知公告
permission: notice
type: MENU
path: /biz/notice
component: biz/notice/index
icon: appstore-outlined
```

新业务菜单建议：

- 挂在业务管理目录下时，父级参考现有业务目录。
- `path` 与前端路由目录保持一致。
- `component` 指向 `src/views` 下相对路径，不带 `.vue`。
- `permission` 使用稳定英文标识。
- `sortCode` 与同级菜单协调。

## 按钮资源模式

按钮也在 `SYS_RESOURCE`，父级是菜单 ID。

常见按钮：

| 操作 | 按钮名称 | permission 建议 |
| --- | --- | --- |
| 新增 | 新增<功能名> | `<module>Add` |
| 编辑 | 编辑<功能名> | `<module>Edit` |
| 删除 | 删除<功能名> | `<module>Delete` |
| 批量删除 | 批量删除 | `<module>BatchDelete` |
| 详情 | <功能名>详情 | `<module>Detail` |
| 状态变更 | 更新状态 | `<module>UpdateStatus` |

前端 `hasPerm` 使用按钮 permission，而不是 API URL。

## API 权限关系模式

API 权限通过 `SYS_RELATION` 关联角色和 API URL。

通知公告示例：

```text
relationCategory: SYS_ROLE_HAS_PERMISSION
objectId: 角色 ID
targetId: /biz/notice/page
extJson: {"apiUrl":"/biz/notice/page","scopeCategory":"SCOPE_ALL","scopeDefineOrgIdList":[]}
```

常见 API：

- `/biz/<module>/page`
- `/biz/<module>/add`
- `/biz/<module>/edit`
- `/biz/<module>/delete`
- `/biz/<module>/detail`

如有状态变更：

- `/biz/<module>/disableStatus`
- `/biz/<module>/enableStatus`

## 角色拥有菜单和按钮模式

角色菜单授权通过 `SYS_RELATION` 的 `SYS_ROLE_HAS_RESOURCE`。

`extJson` 中记录：

```json
{"menuId":"<菜单ID>","buttonInfo":["<按钮ID1>","<按钮ID2>"]}
```

## 生成新权限时的注意事项

- 不复用已有 ID。
- 菜单、按钮、API 权限必须一致。
- Controller `@SaCheckPermission` 必须与 API 权限 URL 一致。
- 前端 `hasPerm` 必须与按钮 permission 一致。
- SQL 初始化中如果只加 API 权限而没有按钮资源，页面按钮可能不显示。
- 如果开发环境无法确认管理员角色 ID，先写 migration 草案和待确认项，不硬猜生产数据。
