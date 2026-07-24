<script setup lang='ts'>
import { showFailToast } from 'vant'
import { useJump } from '@/hooks/system/useJump'
import { useApp } from './hooks'

const { appList } = useApp()
const { jump } = useJump()

function goto(item) {
  if (item.id === 'more') {
    jump('/appmore', 'tab')
    return
  }

  if (item.usedStatus === 'ENABLE') {
    jump(item.url, 'tab')
    return
  }

  showFailToast('应用正在维护中，请稍后再试')
}
</script>

<template>
  <div class="app-index flex justify-start">
    <div v-for="item in appList" :key="item.id" class="app-item" :class="[item.usedStatus]" @click="goto(item)">
      <div class="app-item-icon">
        <img :src="item.image" alt="">
      </div>
      <div class="app-item-label text-center">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .app-index {
    width: 100%;
    padding: 0 16px;
    margin-left: -7px;

    .app-item {
      display: flex;
      width: 20%;
      margin: 0 7px;
      text-align: center;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;

      // &.DISABLED {
      //   // opacity: 0.5;
      //   filter: grayscale(100%);

      //   // .app-item-icon img {
      //   //   opacity: 0.6;
      //   // }

      //   // .app-item-label {
      //   //   color: #999;
      //   // }
      // }

      .app-item-icon {
        height: 56px;
      }

      img {
        width: 56px;
        height: 56px;
        object-fit: cover;
        margin: 0 auto;
      }
    }

    .app-item-label {
      margin-top: 8px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #333;
    }
  }
</style>
