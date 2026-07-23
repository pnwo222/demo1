<script setup lang="ts">
import CircleProgress from '@/components/CircleProgress/index.vue'
import Empty from '@/components/Empty/index.vue'
import DemoSection from './DemoSection.vue'

const progress = ref(68)
</script>

<template>
  <DemoSection title="基础展示" description="按钮、标签、图标、进度和空状态等常用展示组件。">
    <div class="button-row">
      <van-button type="primary" size="small" icon="plus">
        主要操作
      </van-button>
      <van-button size="small" icon="edit">
        次要操作
      </van-button>
      <van-button type="danger" size="small" plain icon="delete-o">
        危险操作
      </van-button>
    </div>

    <van-divider content-position="left">
      状态与反馈
    </van-divider>
    <div class="tag-row">
      <van-tag type="primary">
        处理中
      </van-tag>
      <van-tag type="success">
        已完成
      </van-tag>
      <van-tag type="warning">
        待确认
      </van-tag>
      <van-tag type="danger">
        已驳回
      </van-tag>
    </div>

    <van-divider content-position="left">
      进度
    </van-divider>
    <div class="progress-demo">
      <CircleProgress
        :percentage="progress"
        :size="92"
        :stroke-width="7"
        progress-color="#2d65f0"
        show-label
        label="完成度"
      />
      <div class="progress-demo__controls">
        <van-slider v-model="progress" />
        <span>拖动调整：{{ progress }}%</span>
      </div>
    </div>

    <van-divider content-position="left">
      空状态
    </van-divider>
    <Empty text="暂无符合条件的数据" />
  </DemoSection>
</template>

<style scoped lang="less">
.button-row,
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.progress-demo {
  display: flex;
  gap: 24px;
  align-items: center;

  &__controls {
    flex: 1;

    span {
      display: block;
      margin-top: 12px;
      font-size: 12px;
      color: #969799;
    }
  }
}
</style>
