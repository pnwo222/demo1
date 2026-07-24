<script setup lang='ts'>
import { useUserInfo } from '@/hooks/system/useUser'
import AppList from './modules/app/index.vue'
import Banner from './modules/banner/index.vue'
import ModuleBox from './modules/module/index.vue'
import News from './modules/news/index.vue'
import Notice from './modules/notice/index.vue'
import School from './modules/school/index.vue'
import Warning from './modules/warning/index.vue'

const { checkUser } = useUserInfo()

checkUser()
</script>

<template>
  <div class="index">
    <div class="header">
      <!-- 选择学校 -->
      <School class="mt-20 pl-10 pr-10" />
      <!-- 未绑卡提示 -->
      <Warning class="mt-10" />
      <!-- banner -->
      <Banner class="mt-24" />

      <!-- 应用列表 -->
      <AppList class="mt-24" />
    </div>
    <div class="relative z-100 pl-10 pr-10">
      <!-- 公告 -->
      <Notice class="mt-1" />
    </div>
    <div>
      <!-- 模块 -->
      <ModuleBox class="mt-20" />
      <!-- 新闻 -->
      <News class="mt-20" />
    </div>
  </div>
</template>

<style scoped lang='less'>
  .index {
    width: 100%;
    background: #fff;

    .header {
      width: 100%;
      min-height: 310px;
      overflow: hidden;
      background: url('@/assets/image/index/index-head.png') no-repeat;
      background-position: top center;
      background-size: 100% 100%;
    }

    :deep(.lists .card) {
      &:first-child {
        padding-top: 0;
      }
    }
  }
</style>

<style lang="less">
.index img {
  display: block;
}
</style>
