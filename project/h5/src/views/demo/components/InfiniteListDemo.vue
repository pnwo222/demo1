<script setup lang="ts">
import { showToast } from 'vant'
import CommonInfiniteList from '@/components/CommonInfiniteList/index.vue'
import { useInfiniteList } from '@/hooks/events/useInfiniteList'
import DemoSection from './DemoSection.vue'

interface DemoItem {
  id: number
  title: string
  summary: string
  status: '进行中' | '已完成'
  time: string
}

interface DemoListResult {
  records: DemoItem[]
  total: number
}

const source = Array.from({ length: 17 }, (_, index): DemoItem => ({
  id: index + 1,
  title: `校园服务事项 ${String(index + 1).padStart(2, '0')}`,
  summary: index % 2 ? '查看事项办理进度与最新反馈' : '移动端滚动列表标准展示内容',
  status: index % 3 ? '进行中' : '已完成',
  time: `07-${String(23 - (index % 9)).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:30`,
}))

const failNext = ref(false)
const emptyMode = ref(false)

async function queryList({ current, size }: { current: number, size: number }) {
  await new Promise(resolve => setTimeout(resolve, 450))
  if (failNext.value) {
    failNext.value = false
    throw new Error('网络开小差了，点击重试')
  }
  const records = emptyMode.value
    ? []
    : source.slice((current - 1) * size, current * size)
  return {
    records,
    total: emptyMode.value ? 0 : source.length,
  }
}

const {
  items,
  loading,
  refreshing,
  finished,
  error,
  loadMore,
  refresh,
  retry,
} = useInfiniteList<DemoItem, Record<string, never>, DemoListResult>({
  service: queryList,
  pageSize: 5,
  getItems: result => result.records,
  getTotal: result => result.total,
})

async function simulateError() {
  failNext.value = true
  await refresh()
}

async function toggleEmpty() {
  emptyMode.value = !emptyMode.value
  await refresh()
}
</script>

<template>
  <DemoSection title="滚动列表" description="统一处理分页加载、下拉刷新、空状态和失败重试。">
    <div class="list-demo__actions">
      <van-button size="small" icon="replay" @click="refresh">
        刷新
      </van-button>
      <van-button size="small" icon="warning-o" @click="simulateError">
        模拟失败
      </van-button>
      <van-button size="small" icon="delete-o" @click="toggleEmpty">
        {{ emptyMode ? '恢复数据' : '空状态' }}
      </van-button>
    </div>

    <div class="list-demo__viewport">
      <CommonInfiniteList
        v-model:loading="loading"
        v-model:refreshing="refreshing"
        :items="items"
        :finished="finished"
        :error="error"
        empty-text="暂无服务事项"
        @load="loadMore"
        @refresh="refresh"
        @retry="retry"
      >
        <template #default="{ items: list }">
          <button
            v-for="item in list"
            :key="item.id"
            class="list-demo__item"
            type="button"
            @click="showToast(`查看：${item.title}`)"
          >
            <span class="list-demo__main">
              <strong>{{ item.title }}</strong>
              <small>{{ item.summary }}</small>
              <time>{{ item.time }}</time>
            </span>
            <van-tag :type="item.status === '已完成' ? 'success' : 'primary'">
              {{ item.status }}
            </van-tag>
            <van-icon name="arrow" />
          </button>
        </template>
      </CommonInfiniteList>
    </div>
  </DemoSection>
</template>

<style scoped lang="less">
.list-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.list-demo__viewport {
  height: 360px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #ebedf0;
  border-radius: 8px;
}

.list-demo__item {
  display: flex;
  width: 100%;
  min-height: 86px;
  padding: 14px 12px;
  color: #323233;
  text-align: left;
  background: #fff;
  border: 0;
  border-bottom: 1px solid #f2f3f5;
  box-sizing: border-box;
  gap: 10px;
  align-items: center;

  &:active {
    background: #f7f8fa;
  }

  .van-icon {
    flex: none;
    color: #c8c9cc;
  }
}

.list-demo__main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;

  strong {
    overflow: hidden;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  small,
  time {
    margin-top: 3px;
    overflow: hidden;
    font-size: 12px;
    line-height: 18px;
    color: #969799;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
