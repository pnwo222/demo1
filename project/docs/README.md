# Project Framework Docs

本目录保存 Agent 工作流执行前必须读取的框架文档。业务需求仍放在仓库根目录的 `docs/requirements/` 下，本目录只描述 `project/` 现有框架结构、目录映射和开发规范。

## 必读文件

| 文件 | 用途 |
| --- | --- |
| `framework-overview.md` | 介绍 Snowy 框架定位、技术栈、模块关系和前后端目录映射 |
| `development-guidelines.md` | 说明基于 Snowy 框架增量开发时的前端、后端、数据和工作流规范 |
| `patterns/` | 预读 Snowy 代码后沉淀的后端 CRUD、前端 CRUD、权限 SQL、migration 和缓存更新规则 |

## 工作流要求

Orchestrator 执行任何阶段前必须读取：

```text
docs/requirements/**
project/docs/**
project/docs/patterns/**
project/README.md
```

专业 Agent 执行任务时，必须把本目录文档作为框架约束输入，不得按空白项目或旧的 `frontend/backend` 双目录假设直接生成方案。

后续新增需求或修改需求的代码后，如产生新的可复用模式，必须同步更新 `patterns/` 下对应缓存文档。
