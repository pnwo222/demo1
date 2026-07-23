<script setup lang='ts'>
import { requireImage } from '@/utils/require'

defineProps({
  text: {
    type: String,
    default: '暂无数据',
  },
  img: {
    type: String,
    default: requireImage('image/index/empty-2.png'),
  },
})
</script>

<template>
  <div class="empty">
    <div class="empty-img m-auto">
      <img class="w-168" :src="img" alt="">
    </div>
    <p class="empty-text mt--12">
      {{ text }}
    </p>
  </div>
</template>

<style scoped lang='less'>
  .empty {
    width: 100%;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #999;
    text-align: center;
  }
</style>
