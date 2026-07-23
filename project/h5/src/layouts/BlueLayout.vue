<script setup lang='ts'>
</script>

<template>
  <div class="BlueLayout blue-mask">
    <div class="relative z-100">
      <router-view />
    </div>
  </div>
</template>

<style scoped lang='less'>
  .BlueLayout {
    position: relative;
  }
</style>

<style lang='less'>
.blue-mask {
  &::before {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 297px;
    background: url('@/assets/image/index/mb.png') no-repeat center center / 100% 100%;
    content: '';
    // background: linear-gradient( 92deg, rgba(84, 146, 255, 0.24) 0%, rgba(61, 213, 205, 0.24) 100%);
    // border: 1px solid #979797;
    // opacity: 0.24;
  }
}
</style>
