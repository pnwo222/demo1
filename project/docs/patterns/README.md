# 框架模式缓存

本目录是对 `project/` 现有 Snowy 框架的预读缓存，用来减少后续需求每次从零理解框架的成本。

## 已缓存模式

| 文档 | 内容 | 主要来源 |
| --- | --- | --- |
| `backend-crud-pattern.md` | 后端单表 CRUD 分层、接口、Service、Param、Mapper 模式 | `snowy-plugin-biz` 的 `notice` 模块 |
| `frontend-crud-pattern.md` | 管理端列表、搜索、表单、API client、mock fallback 模式 | `snowy-admin-web/src/views/biz/notice` |
| `permission-sql-pattern.md` | 菜单、按钮权限、API 权限、角色关系 SQL 模式 | `_sql/snowy_mysql.sql` |
| `migration-sql-pattern.md` | 表结构、字段、索引、初始化 SQL 约定 | `_sql/snowy_mysql.sql` 和 `BIZ_NOTICE` |
| `cache-update-rules.md` | 缓存何时读取、何时刷新、后续需求如何回写 | 本项目工作流约定 |

## 使用规则

- 简单 CRUD 快速模式必须优先读取本目录缓存，再读取少量目标参考文件。
- 标准 SDLC 模式也应读取相关缓存，用于减少框架探索时间。
- 如果缓存与实际代码冲突，以实际代码为准，并在本目录更新缓存。
- 后续新增或修改需求的代码后，如果沉淀出新的框架模式、例外规则或可复用模板，必须同步更新对应缓存文档。
