<script setup lang='ts'>
import { ykt } from 'icard-jssdk'

function handleScan() {
  ykt.scan({
    goBackDirectly: true,
  }).then((res) => {
    console.log('[result]', res)
    location.href = res.result
  })
}
</script>

<template>
  <div class="index" @click="handleScan">
    扫码
  </div>
</template>

<style scoped lang='less'>
  .index {
    width: 100%;
  }
</style>
