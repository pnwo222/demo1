<script setup lang='ts'>
import type { IClientNotice } from '@/api/index/notice/types'
import { getNoticePage } from '@/api/index/notice'
import router from '@/router'
import List from '@/views/index/components/List/index.vue'

const config = {
  loadData: getNoticePage,
  resultField: 'records',
  pageSize: 20,
}

function toDetail(id: string) {
  router.push({
    path: '/notice/detail',
    query: { id },
  })
}
</script>

<template>
  <div class="notice-page">
    <List :config="config">
      <template #default="{ data }: { data: IClientNotice}">
        <div class="card" @click="toDetail(data.id)">
          <div class="time">
            {{ data.createTime }}
          </div>
          <div class="title mt-8">
            {{ data.title }}
          </div>

          <!-- <div class="dot"></div> -->
        </div>
      </template>
    </List>
  </div>
</template>

<style scoped lang='less'>
  .notice-page {
    padding: 10px;

    .card {
      position: relative;
      padding: 12px 16px;
      margin-bottom: 12px;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px 0 rgb(0 0 0 / 2%);

      .time {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #999;
      }

      .title {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333;
      }

      .dot {
        position: absolute;
        top: 16px;
        right: 16px;
        width: 8px;
        height: 8px;
        background: #FF4B30;
        border-radius: 100%;
      }
    }
  }
</style>
