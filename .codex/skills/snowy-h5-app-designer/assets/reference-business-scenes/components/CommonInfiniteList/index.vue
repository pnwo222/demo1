<script setup lang="ts" generic="TItem">
const props = withDefaults(
  defineProps<{
    items: readonly TItem[]
    loading: boolean
    refreshing: boolean
    finished: boolean
    error?: string | boolean
    emptyText?: string
    finishedText?: string
    refreshSuccessText?: string
    loadingText?: string
    pullRefresh?: boolean
  }>(),
  {
    error: '',
    emptyText: '暂无数据',
    finishedText: '没有更多了',
    refreshSuccessText: '刷新成功',
    loadingText: '加载中...',
    pullRefresh: true,
  },
)

const emit = defineEmits<{
  (event: 'update:loading', value: boolean): void
  (event: 'update:refreshing', value: boolean): void
  (event: 'load'): void
  (event: 'refresh'): void
  (event: 'retry'): void
}>()

const innerLoading = computed({
  get: () => props.loading,
  set: value => emit('update:loading', value),
})

const innerRefreshing = computed({
  get: () => props.refreshing,
  set: value => emit('update:refreshing', value),
})

const errorText = computed(() =>
  typeof props.error === 'string' && props.error
    ? props.error
    : '加载失败，点击重试',
)
const showEmpty = computed(() =>
  !props.items.length && !props.loading && !props.refreshing && !props.error,
)
const visibleFinishedText = computed(() =>
  props.items.length ? props.finishedText : '',
)
</script>

<template>
  <van-pull-refresh
    v-model="innerRefreshing"
    class="common-infinite-list"
    :disabled="!pullRefresh"
    :success-text="refreshSuccessText"
    @refresh="emit('refresh')"
  >
    <van-list
      v-model:loading="innerLoading"
      class="common-infinite-list__list"
      :finished="finished"
      :finished-text="visibleFinishedText"
      :error="Boolean(error)"
      :error-text="errorText"
      :loading-text="loadingText"
      @load="emit('load')"
      @click-error="emit('retry')"
    >
      <div v-if="items.length" class="common-infinite-list__content">
        <slot :items="items" />
      </div>

      <div v-else-if="showEmpty" class="common-infinite-list__empty">
        <van-empty image="search" :description="emptyText" />
      </div>
    </van-list>
  </van-pull-refresh>
</template>

<style scoped lang="less">
.common-infinite-list {
  min-height: 240px;
  background: #fff;
}

.common-infinite-list__list {
  min-height: inherit;
}

.common-infinite-list__content {
  width: 100%;
}

.common-infinite-list__empty {
  display: grid;
  min-height: 240px;
  place-items: center;

  :deep(.van-empty) {
    padding: 28px 0;
  }

  :deep(.van-empty__image) {
    width: 112px;
    height: 112px;
  }

  :deep(.van-empty__description) {
    margin-top: 12px;
    font-size: 13px;
    color: #969799;
  }
}
</style>
