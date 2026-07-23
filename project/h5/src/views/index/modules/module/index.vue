<script setup lang='ts'>
import { useJump } from '@/hooks/system/useJump'
import NewsTitle from '../../components/NewsTitle/index.vue'
import { useModule } from './hooks'

const { moduleList } = useModule()
const { jump } = useJump()
</script>

<template>
  <div>
    <div v-for="item in moduleList" :key="item.id" class="mod pl-16 pr-16 mb-20">
      <NewsTitle class="mb-8" :title="item.name" />
      <!-- 布局 4 -->
      <div v-if="item.displayMode === '4'" class="flex justify-between flex-wrap mb--10">
        <div v-for="(child, index) in item.list" :key="index" class="mod-img w-166 h-72 mb-10" @click="jump(child.link, 'tab')">
          <img class="w-100% h-100%" :src="child.image" alt="">
        </div>
      </div>

      <!-- 布局 3 -->
      <div v-else-if="item.displayMode === '3'" class="flex justify-between">
        <div v-for="(child, index) in item.list.filter((_, i) => i === 0)" :key="index" class="mod-img w-166 h-161" @click="jump(child.link, 'tab')">
          <img class="w-100% h-100%" :src="child.image" alt="">
        </div>
        <div class="flex flex-col justify-between">
          <div v-for="(child, index) in item.list.filter((_, i) => i < 3 && i > 0)" :key="index" class="mod-img w-166" :class="[index === 0 ? 'h-86' : 'h-65']" @click="jump(child.link, 'tab')">
            <img class="w-100% h-100%" :src="child.image" alt="">
          </div>
        </div>
      </div>
      <!-- 布局 2 -->
      <div v-else-if="item.displayMode === '2'" class="flex justify-between">
        <div v-for="(child, index) in item.list.filter((_, i) => i < 2)" :key="index" class="mod-img w-166 h-72" @click="jump(child.link, 'tab')">
          <img class="w-100% h-100%" :src="child.image" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .mod {
    width: 100%;

    .mod-img {
      overflow: hidden;
      border-radius: 16px;
    }
  }
</style>
