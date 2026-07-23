<script setup lang="ts">
import { theme, themeVars } from '@/hooks/system/useTheme'
</script>

<template>
  <van-config-provider :theme="theme" :theme-vars="themeVars">
    <router-view />
  </van-config-provider>
</template>

<style lang="less">
@import url('@/assets/less/vant.less');
</style>
