# H5 滚动列表模式

## Skill 内置代码资源

- 组件源码：`assets/reference-business-scenes/components/CommonInfiniteList/index.vue`
- 组合式方法源码：`assets/reference-business-scenes/composables/useInfiniteList.ts`
- 完整页面示例：`assets/reference-business-scenes/views/infinite-list/index.vue`

以上文件是本 Skill 的稳定资源，不依赖 `project/h5/src/views/demo/`。生成新 H5、实现业务页面或制作原型时，直接读取并复制或按需求适配这些源码。落地到 Vue 项目时，组件通常放入 `src/components/CommonInfiniteList/index.vue`，方法通常放入 `src/hooks/events/useInfiniteList.ts`。

## 使用边界

- 分页列表、记录流、资讯流、搜索结果和下拉刷新页面优先使用该模式。
- 少量固定数据、一次性选项和不分页详情不得为了形式套无限滚动。
- 默认分页参数为 `current`、`size`，符合当前 H5 框架接口习惯。
- 返回结构不一致时使用 `getItems`、`getTotal` 或 `getHasMore` 显式适配，不在组件内部猜业务字段。

## 状态职责

`useInfiniteList` 负责：

- 首次加载、追加加载和下拉刷新；
- 防止并发重复请求；
- 刷新发生在请求中时排队执行；
- 参数更新后重置分页；
- 保留已有数据并展示追加失败；
- 根据总数或当前页数量判断结束。

`CommonInfiniteList` 负责：

- Vant `List` 与 `PullRefresh` 组合；
- 加载中、空数据、加载失败、点击重试和加载完成；
- 通过默认插槽渲染具体业务卡片或 Cell；
- 沿用 H5 的白色内容区、浅灰辅助色和 8px 圆角。

## 最小用法

```vue
<script setup lang="ts">
import CommonInfiniteList from '@/components/CommonInfiniteList/index.vue'
import { useInfiniteList } from '@/hooks/events/useInfiniteList'

const {
  items,
  loading,
  refreshing,
  finished,
  error,
  loadMore,
  refresh,
  retry,
} = useInfiniteList({
  service: params => api.page(params),
  getItems: result => result.records,
  getTotal: result => result.total,
})
</script>

<template>
  <CommonInfiniteList
    v-model:loading="loading"
    v-model:refreshing="refreshing"
    :items="items"
    :finished="finished"
    :error="error"
    @load="loadMore"
    @refresh="refresh"
    @retry="retry"
  >
    <template #default="{ items: list }">
      <BusinessItem v-for="item in list" :key="item.id" :item="item" />
    </template>
  </CommonInfiniteList>
</template>
```

## 验收

- 首屏只请求一次，不因 `van-list` 初始化重复加载。
- 快速连续触底不会产生并发重复页。
- 下拉刷新回到第一页并替换旧数据。
- 加载失败可点击重试，已有列表不被清空。
- 空数据不显示“没有更多”，有数据完成后才显示结束文案。
- 切换筛选条件使用 `setParams`，不得手工同时修改页码和数组。
