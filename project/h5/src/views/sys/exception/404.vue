<script setup lang='ts'>
import router from '@/router'

function toHome() {
  router.replace('/')
}
</script>

<template>
  <div class="bg-white h-100vh flex items-center justify-center">
    <div class="mt--80">
      <van-empty image="network" description="404" />
      <van-button round type="primary" block @click="toHome">
        返回首页
      </van-button>
    </div>
  </div>
</template>
