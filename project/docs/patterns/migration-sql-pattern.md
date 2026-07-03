# Migration 和初始化 SQL 模式缓存

## 来源

- `project/snowy-web-app/src/main/resources/_sql/snowy_mysql.sql`
- `BIZ_NOTICE` 表结构
- `DEV_DICT` 字典初始化
- `SYS_RESOURCE` 菜单按钮初始化
- `SYS_RELATION` 权限关系初始化

## 表结构模式

Snowy 现有业务表常见约定：

- 表名大写，下划线分隔，例如 `BIZ_NOTICE`。
- 主键字段 `ID varchar(20) NOT NULL COMMENT '主键'`。
- 字符集使用 `utf8mb4`。
- 常见通用字段：
  - `REMARK`
  - `SORT_CODE`
  - `EXT_JSON`
  - `DELETE_FLAG`
  - `CREATE_TIME`
  - `CREATE_USER`
  - `UPDATE_TIME`
  - `UPDATE_USER`
- 主键使用 `PRIMARY KEY (ID) USING BTREE`。

## 新表建议模板

```sql
CREATE TABLE `<TABLE_NAME>` (
  `ID` varchar(20) NOT NULL COMMENT '主键',
  -- 业务字段
  `REMARK` varchar(500) DEFAULT NULL COMMENT '备注',
  `SORT_CODE` int DEFAULT NULL COMMENT '排序',
  `EXT_JSON` longtext COMMENT '扩展信息',
  `DELETE_FLAG` varchar(255) DEFAULT NULL COMMENT '删除标志',
  `CREATE_TIME` datetime DEFAULT NULL COMMENT '创建时间',
  `CREATE_USER` varchar(20) DEFAULT NULL COMMENT '创建用户',
  `UPDATE_TIME` datetime DEFAULT NULL COMMENT '更新时间',
  `UPDATE_USER` varchar(20) DEFAULT NULL COMMENT '更新用户',
  PRIMARY KEY (`ID`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='<表注释>';
```

## 索引建议

- 查询条件字段建立普通索引。
- 状态、类型、时间范围、排序字段可按实际查询建立索引。
- 唯一业务编号、幂等键、外部流水号必须建立唯一约束。
- 大文本字段不建普通索引。
- 排序常用组合可以考虑组合索引，例如 `SORT_CODE + CREATE_TIME`。

## 字典模式

如字段需要枚举展示，优先评估是否接入 `DEV_DICT`：

- 字典类型命名使用大写下划线，如 `BIZ_NOTICE_STATUS`。
- 前端通过 `tool.dictList`、`$TOOL.dictTypeData`、`$TOOL.dictTypeColor` 使用。
- 简单功能也可以只用前端常量，但如需后台可配置，应使用字典。

## 初始化 SQL 位置

- 新表结构放在同类业务表附近。
- 字典记录放在 `DEV_DICT` 区域。
- 菜单按钮放在 `SYS_RESOURCE` 区域。
- 角色权限关系放在 `SYS_RELATION` 区域。

## 快速 CRUD 迁移要求

- 至少提供 migration 草案文件到 `docs/data/`。
- 如直接修改 `_sql/snowy_mysql.sql`，仍需在需求状态文件记录修改点。
- 本地无法执行 MySQL 时，不阻断代码开发，但必须记录待验证 SQL 和执行命令。
- 删除字段、改字段类型、清洗数据等破坏性 migration 不允许走快速模式。
