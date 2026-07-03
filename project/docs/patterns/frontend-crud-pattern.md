# 前端 CRUD 模式缓存

## 来源

- `project/snowy-admin-web/src/api/biz/bizNoticeApi.js`
- `project/snowy-admin-web/src/views/biz/notice/index.vue`
- `project/snowy-admin-web/src/views/biz/notice/form.vue`
- `project/snowy-admin-web/src/views/biz/notice/detail.vue`

## 适用场景

- Snowy 管理端后台页面。
- 列表 + 搜索 + 新增/编辑抽屉 + 删除/批量删除。
- 可选详情抽屉、状态切换、字典展示、图片上传。

## API Client 模式

位置：

```text
project/snowy-admin-web/src/api/biz/<module>Api.js
```

模式：

```js
import { baseRequest } from '@/utils/request'

const request = (url, ...arg) => baseRequest(`/biz/<module>/` + url, ...arg)

export default {
	page(data) {
		return request('page', data, 'get')
	},
	submitForm(data, edit = false) {
		return request(edit ? 'edit' : 'add', data)
	},
	delete(data) {
		return request('delete', data)
	},
	detail(data) {
		return request('detail', data, 'get')
	}
}
```

实际项目通常使用带业务前缀的方法名，例如 `noticePage`、`noticeSubmitForm`。

## 列表页模式

位置：

```text
project/snowy-admin-web/src/views/biz/<module>/index.vue
```

常用组件：

- `xn-panel`
- `a-form`
- `a-row` / `a-col`
- `a-input`
- `a-select`
- `a-range-picker`
- `a-button`
- `s-table`
- `xn-batch-button`
- `a-image`
- `a-tag`
- `a-switch`
- `a-popconfirm`

关键状态：

```js
const searchFormState = ref({})
const searchFormRef = ref()
const tableRef = ref()
const formRef = ref()
const selectedRowKeys = ref([])
const advanced = ref(false)
```

表格配置：

- `:columns="columns"`
- `:data="loadData"`
- `:row-key="(record) => record.id"`
- `:tool-config="toolConfig"`
- `:row-selection="options.rowSelection"`
- `:scroll="{ x: 'max-content' }"`

权限控制：

- 新增按钮：`v-if="hasPerm('<permissionAdd>')"`
- 批量删除：`v-if="hasPerm('<permissionBatchDelete>')"`
- 操作列按 `hasPerm` 判断是否加入 columns。
- 操作按钮按 `hasPerm('<permissionEdit>')`、`hasPerm('<permissionDelete>')` 显示。

搜索处理：

- 查询按钮调用 `tableRef.refresh(true)`。
- 重置调用 `searchFormRef.value.resetFields()` 后刷新。
- 时间范围在 `loadData` 中拆成后端参数。

```js
if (searchFormParam.createTime) {
	searchFormParam.startCreateTime = searchFormParam.createTime[0]
	searchFormParam.endCreateTime = searchFormParam.createTime[1]
	delete searchFormParam.createTime
}
```

## 表单抽屉模式

位置：

```text
project/snowy-admin-web/src/views/biz/<module>/form.vue
```

常用组件：

- `xn-form-container`
- `a-form`
- `a-input`
- `a-radio-group`
- `a-checkbox-group`
- `a-input-number`
- `a-textarea`
- `xn-upload`
- `xn-editor`

关键写法：

- `open = ref(false)` 控制抽屉。
- `formData = ref({})` 保存表单。
- `submitLoading = ref(false)` 保存提交状态。
- `defineEmits({ successful: null })` 通知列表刷新。
- `defineExpose({ onOpen })` 暴露打开方法。

打开逻辑：

- 编辑时 `cloneDeep(record)`。
- 新增时设置默认值。
- 如字段保存为 JSON 字符串，打开时转数组，提交时再 `JSON.stringify`。

校验：

- 使用 `required` from `@/utils/formRules`。
- 动态必填逻辑放在自定义 validator 或提交前判断。

提交：

- `formRef.value.validate()`。
- clone 表单数据。
- 映射前端组合字段为后端字段。
- 调用 `submitForm(data, data.id)`。
- 成功后关闭并 `emit('successful')`。

## Mock fallback 模式

简单 CRUD 快速模式要求前端支持 mock fallback：

- 新增 `mockData.js`，导出一组可展示主流程的数据。
- `loadData` 调用真实 API 失败时，使用 mock 数据本地筛选和分页。
- mock 只用于本地演示，不替代后端权限和业务校验。

## 快速 CRUD 页面验收

- 搜索可用。
- 重置可用。
- 列表展示主要字段。
- 新增/编辑弹窗可打开。
- 表单校验生效。
- 删除/批量删除有确认。
- 后端失败时能展示 mock 主流程。
- 权限按钮能按 `hasPerm` 控制显示。
