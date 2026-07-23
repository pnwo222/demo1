<script setup lang='ts'>
import type { IClientArticle } from '@/api/index/news/types'
import { getNewsPage } from '@/api/index/news'
import router from '@/router'
import List from '../../components/List/index.vue'
import NewsTitle from '../../components/NewsTitle/index.vue'

const config = {
  loadData: getNewsPage,
  resultField: 'records',
  maxNum: 10,
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
  pageSize: 10,
}

function toDetail(data: any) {
  router.push({
    path: '/news/detail',
    query: { id: data.id },
  })
}

function handleMore() {
  router.push('/news')
}
</script>

<template>
  <div class="news">
    <div class="header flex items-center justify-between pl-16 pr-16">
      <NewsTitle title="校园资讯" />
      <span class="more flex items-center" @click="handleMore">
        查看更多
        <div class="down">
          <van-icon class="down-icon" name="down" />
        </div>
      </span>
    </div>
    <List class="mt-8" :config="config" @to-detail="toDetail" />
  </div>
</template>

<style scoped lang='less'>
  .news {
    // padding-bottom: 100px;
    padding-bottom: calc(env(safe-area-inset-bottom) + 80px);

    .more {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #333;

      .down {
        height: 17px;
        margin-top: -13px;
        margin-left: 3px;
        overflow: hidden;
      }

      .down-icon {
        margin-top: 10px;
        transform: rotate(-90deg);
      }
    }
  }
</style>
