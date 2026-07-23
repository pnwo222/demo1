<script setup lang='ts'>
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="news-title relative">
    <span class="relative z-10">{{ title }}</span>
    <img class="title-xing w-18 absolute right--18 top--4" src="@/assets/image/index/title-xing.png" alt="">
    <img class="title-bg w-32 absolute left-10% top-7" src="@/assets/image/index/title-bg.png" alt="">
  </div>
</template>

<style scoped lang='less'>
  .news-title {
    display: inline-block;
    font-size: 18px;
    font-weight: 600;
    line-height: 25px;
    color: #153150;

    img {
      pointer-events: none;
    }
  }
</style>
