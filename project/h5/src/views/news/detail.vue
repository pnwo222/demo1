<script setup lang='ts'>
import router from '@/router'
import { useNewsDetail } from './hooks'

const { getDetail, newsDetail } = useNewsDetail()

onMounted(() => {
  getDetail(router.currentRoute.value.query.id as string)
})
</script>

<template>
  <div class="detail">
    <div class="title">
      {{ newsDetail?.title }}
    </div>
    <div class="desc flex justify-between mt-8">
      <span>{{ newsDetail?.publisher }}</span>
      <span>{{ newsDetail?.createTime }}</span>
    </div>

    <div class="content mt-20" v-html="newsDetail?.content" />
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
  }
</style>

<style lang="less">
  .detail {
    .content {
      font-size: 16px;
      font-weight: 400;
      line-height: 26px;
      color: #333;

      p, h1, h2, h3, h4, h5, h6 {
        margin-block: 1em;
        margin-inline: 0;
        unicode-bidi: isolate;
      }

      img {
        max-width: 100%;
      }
    }
  }
</style>
