<script setup lang='ts'>
import dayjs from 'dayjs'
import { getBookBorrowHisApi, getBookBorrowNowApi } from '@/api/book'
import { requireImage } from '@/utils/require'
import BookCard from '@/views/book/components/card/index.vue'
import { useBookDetail } from '@/views/book/hooks'
import List from '@/views/index/components/List/index.vue'

const { openDetail } = useBookDetail()

const listRef = ref()
const tab = ref(1)

const config = ref({
  loadData: getBookBorrowNowApi,
  resultField: 'records',
  pageSize: 10,
})

const searchForm = ref({

})

function changeTab(name: number) {
  console.log(name)
  if (name === 1) {
    config.value.loadData = getBookBorrowNowApi
  }
  else if (name === 2) {
    config.value.loadData = getBookBorrowHisApi
  }

  nextTick(() => {
    listRef.value.refresh()
  })
}

const total = computed(() => {
  return listRef.value?.state?.total || 0
})
</script>

<template>
  <div class="book-page">
    <div class="yy-header">
      <van-tabs v-model:active="tab" class="f-tab" @change="changeTab">
        <van-tab title="在借中" :name="1" />
        <van-tab title="借阅清单" :name="2" />
      </van-tabs>
    </div>
    <div v-if="tab === 1 && total" class="alert">
      共 <span>{{ total }}</span> 本在借图书
    </div>
    <List
      ref="listRef" :config="{
        ...config,
        params: searchForm,
      }"
      :empty-img="requireImage('image/index/empty.png')"
    >
      <template #default="{ data }">
        <BookCard :data="data" class="mb-8" show-pub show-footer-time @click="openDetail(data)" />
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

  .book-page {
    padding: 10px;
    padding-top: 56px;

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

    .alert {
      width: 400px;
      height: 40px;
      padding-left: 20px;
      margin-bottom: 10px;
      margin-left: -10px;
      font-size: 14px;
      font-weight: 400;
      line-height: 40px;
      color: #333;
      background: #FFF;

      span {
        margin: 0 2px;
        font-size: 16px;
        font-weight: 500;
      }
    }
  }
</style>
