# 框架缓存更新规则

## 目标

通过预读 `project/` 现有框架，把常用开发模式沉淀到 `project/docs/patterns/`，让后续新增或修改需求时不用每次从零理解框架。

## 读取规则

进入开发前，Orchestrator 必须读取：

```text
project/docs/README.md
project/docs/framework-overview.md
project/docs/development-guidelines.md
project/docs/patterns/README.md
project/docs/patterns/*.md
```

简单 CRUD 快速模式至少读取：

```text
project/docs/patterns/backend-crud-pattern.md
project/docs/patterns/frontend-crud-pattern.md
project/docs/patterns/permission-sql-pattern.md
project/docs/patterns/migration-sql-pattern.md
```

## 失效规则

出现以下情况时，缓存可能失效，必须回到实际代码核对：

- `project/pom.xml`、模块结构或包名变化。
- `project/snowy-admin-web/package.json`、路由、通用组件或请求封装变化。
- 参考 CRUD 模块被重构。
- `SYS_RESOURCE`、`SYS_RELATION`、字典或初始化 SQL 结构变化。
- 实现过程中发现缓存描述与代码不一致。

## 更新规则

后续新增需求或修改需求的代码后，必须判断是否需要更新缓存：

- 新增了更好的后端 CRUD 模式，更新 `backend-crud-pattern.md`。
- 新增了更好的前端列表、表单、mock 或权限按钮模式，更新 `frontend-crud-pattern.md`。
- 新增或调整权限、菜单、角色关系写法，更新 `permission-sql-pattern.md`。
- 新增或调整 migration、字典、索引约定，更新 `migration-sql-pattern.md`。
- 新增复杂场景模式，可新增独立 pattern 文档，并在 `README.md` 登记。

## 状态记录

每个需求状态文件应记录：

```text
缓存读取:
缓存是否命中:
缓存更新:
更新文件:
原因:
时间:
```

如果无需更新缓存，记录“无需更新”，并说明原因。
