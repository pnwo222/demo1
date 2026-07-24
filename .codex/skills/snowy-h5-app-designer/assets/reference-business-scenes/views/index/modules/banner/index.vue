<script setup lang='ts'>
import type { IClientBanner } from '@/api/index/banner/types'
import { useJump } from '@/hooks/system/useJump'
import { useBanner } from './hooks'

const { jump } = useJump()

const { list } = useBanner()

function handleJump(item: IClientBanner) {
  if (item.isJump === '1' && item.jumpUrl) {
    jump(item.jumpUrl, 'tab')
  }
}
</script>

<template>
  <van-swipe class="banner" :autoplay="3000" indicator-color="white">
    <van-swipe-item v-for="item in list" :key="item.id" @click="handleJump(item)">
      <div class="img m-auto w-355 h-140">
        <img class="w-100% h-100%" :src="item.image" alt="">
      </div>
    </van-swipe-item>
  </van-swipe>
</template>

<style scoped lang='less'>
  .banner {
    width: 100%;

    .img {
      overflow: hidden;
      border-radius: 36px;
    }

    img {
      // object-fit: cover;
    }
  }
</style>
