<script setup lang='ts'>
import type { IClientActivity } from '@/api/index/activity/types'
import { ykt } from 'icard-jssdk'
import { getActivityPage } from '@/api/index/activity'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'
import List from '../index/components/List/index.vue'

const { userInfo } = useUserInfo()

const config = {
  loadData: getActivityPage,
  resultField: 'records',
  pageSize: 10,
  formatData(data) {
    return data.map((item: IClientActivity) => ({
      ...item,
      type: item.displayMode,
      time: item.createTime,
      title: item.title,
      org: '',
      img: item.image?.split(','),
    }))
  },
}

function toDetail(data: any) {
  router.push({
    path: '/activity/detail',
    query: { id: data.id },
  })
}
</script>

<template>
  <div class="news-page p-10">
    <List :config="config" empty-text="暂无活动" @to-detail="toDetail" />
  </div>
</template>

<style scoped lang='less'>
  .news-page {
    width: 100%;

  }
</style>
