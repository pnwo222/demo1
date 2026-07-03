# 后端 CRUD 模式缓存

## 来源

- `project/snowy-plugin/snowy-plugin-biz/src/main/java/vip/xiaonuo/biz/modular/notice/`
- `BizNoticeController.java`
- `BizNoticeService.java`
- `BizNoticeServiceImpl.java`
- `BizNotice.java`
- `BizNoticeAddParam.java`
- `BizNoticeEditParam.java`
- `BizNoticeIdParam.java`
- `BizNoticePageParam.java`
- `BizNoticeMapper.java`
- `mapper/mapping/BizNoticeMapper.xml`

## 适用场景

- 后台管理类单表 CRUD。
- 分页、查询、新增、编辑、删除、详情。
- 可选启用/禁用、状态切换、批量删除。
- 业务逻辑不复杂，主要复用 Snowy 分层和权限体系。

## 推荐目录

```text
project/snowy-plugin/snowy-plugin-biz/src/main/java/vip/xiaonuo/biz/modular/<module>/
  controller/<Entity>Controller.java
  entity/<Entity>.java
  enums/<Entity>StatusEnum.java
  mapper/<Entity>Mapper.java
  mapper/mapping/<Entity>Mapper.xml
  param/<Entity>AddParam.java
  param/<Entity>EditParam.java
  param/<Entity>IdParam.java
  param/<Entity>PageParam.java
  service/<Entity>Service.java
  service/impl/<Entity>ServiceImpl.java
```

## Controller 模式

- 类注解：`@Tag`、`@RestController`、`@Validated`。
- 使用 `@Resource` 注入 Service。
- 分页接口：
  - `@SaCheckPermission("/biz/<module>/page")`
  - `@GetMapping("/biz/<module>/page")`
  - 返回 `CommonResult<Page<Entity>>`
- 新增/编辑/删除：
  - 使用 `@CommonLog`
  - 使用 `@SaCheckPermission`
  - POST 请求使用 `@RequestBody @Valid`
  - 删除参数使用 `@Valid @NotEmpty List<IdParam>`
- 详情：
  - GET 请求
  - 参数使用 `@Valid IdParam`

常用接口：

```java
page(PageParam param)
add(AddParam param)
edit(EditParam param)
delete(List<IdParam> paramList)
detail(IdParam param)
```

## Service 模式

- `ServiceImpl<Mapper, Entity>` + 自定义 Service 接口。
- 查询使用 `QueryWrapper<Entity>().checkSqlInjection()`。
- 常用条件：
  - `like`
  - `eq`
  - `between`
- 排序：
  - 如果传入 `sortField` 和 `sortOrder`，先用 `CommonSortOrderEnum.validate` 校验。
  - 排序字段用 `StrUtil.toUnderlineCase(sortField)`。
  - 否则使用业务默认排序，例如 `sortCode`。
- 分页使用 `CommonPageRequest.defaultPage()`。
- 新增使用 `BeanUtil.toBean(param, Entity.class)` 后 `save`。
- 编辑先 `queryEntity(id)`，再 `BeanUtil.copyProperties(param, entity)`，最后 `updateById`。
- 删除使用 `removeByIds(CollStreamUtil.toList(paramList, IdParam::getId))`。
- 详情使用 `queryEntity(id)`，不存在时抛 `CommonException`。
- 变更方法加 `@Transactional(rollbackFor = Exception.class)`。

## Entity 模式

- 继承 `CommonEntity`，复用审计字段和通用字段。
- 使用 `@Getter`、`@Setter`。
- 使用 `@TableName("<TABLE_NAME>")`。
- 主键字段使用 `@TableId`。
- 字段使用 `@Schema(description = "...")`。
- Snowy 现有表多使用大写表名和下划线字段名。

## Param 模式

- `PageParam` 包含：
  - `current`
  - `size`
  - `sortField`
  - `sortOrder`
  - `searchKey`
  - 业务筛选字段
  - 时间范围字段，如 `startCreateTime`、`endCreateTime`
- `IdParam` 包含必填 `id`。
- `AddParam` 和 `EditParam` 使用 Jakarta Validation。
- `EditParam` 必须包含 `id`。

## Mapper 模式

- Mapper 接口继承 `BaseMapper<Entity>`。
- XML 文件保留 MyBatis mapper 标准头。
- 简单 CRUD 不需要自定义 SQL 时，XML 可以为空 mapper。

## 快速 CRUD 默认约束

- 所有 Controller 接口必须有 `@SaCheckPermission`。
- 新增、编辑、删除、状态变更必须有 `@CommonLog`。
- 删除必须只按 ID 列表删除。
- 排序字段必须防 SQL 注入。
- 业务校验放在 Service，不只依赖前端。
- 涉及金额、权限、状态机、资源扣减、外部回调时，不使用快速模式，切回标准或高风险模式。
