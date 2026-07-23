<script setup lang='ts'>
import router from '@/router'
import { useActivityDetail } from './hooks'

const { getDetail, activityDetail } = useActivityDetail()

onMounted(() => {
  getDetail(router.currentRoute.value.query.id as string)
})
</script>

<template>
  <div class="detail">
    <div class="title">
      {{ activityDetail?.title }}
    </div>
    <div class="desc flex justify-between mt-8">
      <span>{{ activityDetail?.createTime }}</span>
    </div>

    <div class="content mt-20" v-html="activityDetail?.content" />
  </div>
</template>

<style scoped lang='less'>
  .detail {
    width: 100%;
    min-height: 100vh;
    padding: 10px 16px;
    background: #fff;

    .title {
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      color: #333;
    }

    .desc {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #999;
    }

    .content {
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      color: #333;

      img {
        max-width: 100%;
      }
    }
  }
</style>
