<script setup lang='ts'>
import router from '@/router'
import { useNotice } from './hooks'

const { noticeList } = useNotice()

function toNotice() {
  router.push('/notice/index')
}
</script>

<template>
  <div class="notice" @click="toNotice">
    <img src="@/assets/image/index/notice-bar@2x.png" alt="">
    <div class="notice-list" />
    <van-swipe class="notice-list-swiper" :autoplay="3000" :touchable="false" :show-indicators="false" vertical>
      <van-swipe-item v-for="(child, index) in noticeList" :key="index">
        <div v-for="(item, j) in child" :key="j" class="notice-list-item flex items-center">
          <div class="w-9 h-9 mr-8">
            <img class="w-100% h-100%" src="@/assets/image/index/rect.png" alt="">
          </div>
          <div class="elipsis max-w-80%">
            {{ item.title }}
          </div>
          <van-icon class="absolute right-0" name="arrow" color="#aaa" />
        </div>
      </van-swipe-item>
    </van-swipe>
  </div>
</template>

<style scoped lang='less'>
  .notice {
    position: relative;
    width: 100%;

    img {
      display: block;
      width: 100%;
    }

    .notice-list {
//
    }

    .notice-list-swiper {
      position: absolute;
      top: 54px;
      // border: 1px solid #000;
      // height: 78px;
      width: 100%;
      height: 78px;
      padding: 15px 14px;

      .notice-list-item {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #153150;

        &:first-child {
          margin-bottom: 8px;
        }
      }
    }
  }
</style>
