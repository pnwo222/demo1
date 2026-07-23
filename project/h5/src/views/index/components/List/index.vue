<script setup lang='ts'>
import type { PropType } from 'vue'
import type { InfiniteScrollOptions } from '@/hooks/events/useInfiniteScroll'
import { useInfiniteScroll } from '@/hooks/events/useInfiniteScroll'
import { requireImage } from '@/utils/require'
import Card from './components/Card/index.vue'

const props = defineProps({
  config: {
    type: Object as PropType<InfiniteScrollOptions>,
    default: () => ({
      loadData: async () => {},
      params: {},
      resultField: 'list',
      pageSize: 10,
    }),
  },
  keyName: {
    type: String,
    default: '_id',
  },
  emptyText: {
    type: String,
    default: '暂无数据',
  },
  emptyImg: {
    type: String,
    default: requireImage('image/index/empty-2.png'),
  },
})

const emit = defineEmits(['toDetail'])

const [state, { loadMore, reset: resetData, setFetch }] = useInfiniteScroll(props.config)

watch(() => props.config.loadData, (newVal) => {
  setFetch(newVal)
})

function refresh(params?: any) {
  resetData()
  loadMore(params)
}

defineExpose({
  refresh,
  state,
})
</script>

<template>
  <div class="lists">
    <van-list
      v-model:loading="state.loadingMore"
      :finished="!state.hasMore"
      :finished-text="state.data?.length ? '没有更多了' : ''"
      @load="loadMore"
    >
      <template v-for="(item, i) in state.data" :key="item[keyName] || i">
        <slot :data="item" :state="state">
          <Card :data="item" :type="item.type" @click="emit('toDetail', item)" />
        </slot>
      </template>
      <Empty v-if="!state.hasMore && !state.data?.length" class="mt-30%!" :text="emptyText" :img="emptyImg" />
    </van-list>
  </div>
</template>

<style scoped lang='less'>
  .lists {
    width: 100%;
    overflow: hidden;
    border-radius: 4px;
  }
</style>
