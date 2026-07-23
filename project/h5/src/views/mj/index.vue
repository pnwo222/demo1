<script setup lang='ts'>
import type { IClientAccess } from '@/api/mj/types'
import dayjs from 'dayjs'
import { getAccessListApi } from '@/api/mj'
import { createMjDatePicker } from '@/components/OpenMjDatePicker'
import List from '@/views/index/components/List/index.vue'

const listRef = ref()

const form = ref({
  // 默认近一周
  startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
  endDate: dayjs().format('YYYY-MM-DD'),
})

const formFormat = computed(() => {
  return {
    beginTime: `${form.value.startDate} 00:00:00`,
    endTime: `${form.value.endDate} 23:59:59`,
  }
})

const config = {
  loadData: getAccessListApi,
  resultField: 'records',
  pageSize: 10,
  params: {
    beginTime: `${form.value.startDate} 00:00:00`,
    endTime: `${form.value.endDate} 23:59:59`,
  },
}

const { open } = createMjDatePicker({
  value: form,
  field: 'startDate',
  field2: 'endDate',
  props: {
    title: '日期选择',
  },
  onConfirm: () => {
    console.log('confirm')
    listRef.value.refresh(formFormat.value)
  },
})
</script>

<template>
  <div class="mj-page">
    <div class="mj-header" @click="open">
      {{ form.startDate }}-{{ form.endDate }} <svg-icon name="down" color="#97A0B4" />
    </div>
    <List
      ref="listRef" :config="{
        ...config,
        params: formFormat,
      }"
    >
      <template #default="{ data }: { data: IClientAccess }">
        <div class="card">
          <div class="time">
            {{ data.authenTime }}
          </div>
          <div class="title mt-12">
            <div>
              <span>验证方式：</span>{{ data.authenTypeStr }}
            </div>
            <div>
              <span>设备位置：</span>{{ data.readerLocation }}
            </div>
            <div>
              <span>通行方向：</span>
              <span v-if="data.direction === '0'">进  </span>
              <span v-else-if="data.direction === '1'">出</span>
              <span v-else-if="data.direction === '2'">双向</span>
            </div>

            <div class="dot" :class="[data.passState === '1' ? 'success' : 'error']">
              {{ data.passState === '1' ? '通过' : '未通过' }}
            </div>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>

<style scoped lang='less'>
  .mj-page {
    padding: 10px;
    padding-top: 40px;

    .mj-header {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 100;
      width: 100%;
      height: 40px;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      color: #333;
      text-align: center;
      background: #FFF;
    }

    .card {
      position: relative;
      padding: 12px 16px;
      padding-top: 0;
      margin-top: 10px;
      background: #fff;
      border-radius: 8px;

      .time {
        height: 40px;
        padding-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        line-height: 40px;
        color: #333;
        border-bottom: 1px solid #f7f7f7;
      }

      .title {
        position: relative;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #333;

        span {
          color: #666;
        }
      }

      .dot {
        position: absolute;
        top: 0;
        right: 0;
        padding: 2px 6px;
        font-size: 14px;
        color: #00B578;
        background: rgb(0 181 120 / 10%);
        border-radius: 4px;

        &.error {
          color: #858A99;
          background: #F3F3F4;
        }
      }
    }
  }
</style>
