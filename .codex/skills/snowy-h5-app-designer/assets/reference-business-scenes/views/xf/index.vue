<script setup lang='ts'>
import type { IClientXf } from '@/api/xf/types'
import dayjs from 'dayjs'
import { groupBy } from 'lodash-es'
import { getXfListHistoryApi, getXfListTodayApi } from '@/api/xf'
import { createXfDatePicker } from '@/components/OpenXfDatePicker'
import { useStorage } from '@/hooks/system/useStorage'
import router from '@/router'
import List from '@/views/index/components/List/index.vue'

interface IGroupData extends IClientXf {
  payDate: string
  children: IClientXf[]
}

const listRef = ref()

const form = ref({
  beginTime: dayjs().format('YYYY-MM-DD'),
  endTime: dayjs().format('YYYY-MM-DD'),
})

const formFormat = computed(() => {
  return {
    beginTime: `${form.value.beginTime} 00:00:00`,
    endTime: `${form.value.endTime} 23:59:59`,
  }
})

const isToday = computed(() => {
  return dayjs(form.value.beginTime).isSame(dayjs(), 'day') && dayjs(form.value.endTime).isSame(dayjs(), 'day')
})

const config = ref({
  loadData: isToday.value ? getXfListTodayApi : getXfListHistoryApi,
  resultField: 'records',
  pageSize: 20,
  formatData: (data: IClientXf[]) => {
    const formatData = data.map((item) => {
      return {
        ...item,
        payDate: dayjs(item.payTime).format('YYYY-MM-DD'),
        payTime: dayjs(item.payTime).format('HH:mm:ss'),
      }
    })
    const groupData = Object.entries(groupBy(formatData, 'payDate')).map(([key, value]) => {
      return {
        payDate: key,
        children: value,
      }
    })
    return groupData
  },
})

function toDetail(record) {
  router.push({
    path: '/xf/detail',
  })

  useStorage.ss.set('xfDetail', record)
}

const maxDate = dayjs().add(-1, 'day')

const { open } = createXfDatePicker({
  value: form,
  field: 'beginTime',
  field2: 'endTime',
  props: {
    title: '日期选择',
    maxDate: new Date(maxDate.year(), maxDate.month(), maxDate.date()),
  },
  onConfirm: () => {
    if (isToday.value) {
      config.value.loadData = getXfListTodayApi
    }
    else {
      config.value.loadData = getXfListHistoryApi
    }
    nextTick(() => {
      listRef.value.refresh(formFormat.value)
    })
  },
})
</script>

<template>
  <div class="notice-page">
    <div class="mj-header" @click="open">
      <span v-if="isToday">今日消费</span>
      <span v-else>{{ form.beginTime }}-{{ form.endTime }}</span>
      <svg-icon class="ml-4" name="down" color="#97A0B4" />
    </div>
    <List
      ref="listRef" :config="{
        ...config,
        params: formFormat,
      }"
      empty-text="暂无消费记录"
    >
      <template #default="{ data }: { data: IGroupData }">
        <div class="card">
          <div class="time">
            {{ data.payDate }}
          </div>
          <div
            v-for="item in data.children"
            :key="item.id"
            class="each flex justify-between items-center"
            @click="toDetail(item)"
          >
            <div>
              <div class="title">
                {{ item.payMerchant }}
              </div>
              <div class="p-time mt-2">
                {{ item.payTime }}
              </div>
            </div>
            <div class="price">
              {{ item.payAmount }}
            </div>
          </div>
        </div>
      </template>
    </List>
  </div>
</template>

<style scoped lang='less'>
  .yy-header {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 48px;
    font-size: 14px;
    font-weight: 400;
    line-height: 48px;
    color: #333;
    text-align: center;
    background: #FFF;
  }

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

  .notice-page {
    padding: 10px;
    padding-top: 58px;

    .card {
      position: relative;
      padding: 12px 16px;
      padding-top: 0;
      padding-bottom: 0;
      margin-bottom: 10px;
      background: #fff;
      border-radius: 4px;

      .time {
        height: 50px;
        font-size: 16px;
        font-weight: 600;
        line-height: 50px;
        color: #000;
        border-bottom: 1px solid #fafafa;
      }

      .title {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #000;
      }

      .p-time {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #666;
      }

      .price {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #333;
      }

      .each {
        padding: 12px 0;
        border-bottom: 1px solid #fafafa;

        &:last-child {
          border-bottom: none;
        }
      }
    }
  }
</style>
