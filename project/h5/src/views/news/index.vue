<script setup lang='ts'>
import type { IClientArticle } from '@/api/index/news/types'
import { getNewsPage } from '@/api/index/news'
import router from '@/router'
import List from '../index/components/List/index.vue'

const config = {
  loadData: getNewsPage,
  resultField: 'records',
  pageSize: 10,
  formatData(data) {
    return data.map((item: IClientArticle) => ({
      ...item,
      type: item.displayMode,
      time: item.createTime,
      title: item.title,
      org: item.publisher,
      img: item.image?.split(','),
    }))
  },
}

function toDetail(data: any) {
  router.push({
    path: '/news/detail',
    query: { id: data.id },
  })
}
</script>

<template>
  <div class="news-page p-10">
    <List :config="config" @to-detail="toDetail" />
  </div>
</template>

<style scoped lang='less'>
  .news-page {
    width: 100%;

  }
</style>
