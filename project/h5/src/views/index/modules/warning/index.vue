<script setup lang='ts'>
import { getLocalStorage } from '@/hooks/system/useStorage'
import { useUserInfo } from '@/hooks/system/useUser'

const { hasSbCard, is3Card } = useUserInfo()

const isShow = getLocalStorage('warning', 2)

const text = computed(() => {
  if (!is3Card.value) {
    return '您正在使用的是非社保三代卡，请尽快前往有关部门升级至三代卡，以确保持续享受所有功能和服务。'
  }
  return '您尚未绑定社保卡，点击前往绑定以确保功能正常使用。'
})
</script>

<template>
  <div>
    <div v-if="!hasSbCard && isShow === 2" class="warning pl-10 pr-10 mt-19 mb--8">
      <van-notice-bar
        left-icon="warning-o"
        :text="text"
        closeable
        class="pr-30!"
      />
      <div class="close" @click="isShow = 1">
        <img src="@/assets/image/index/close.png" alt="">
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .warning {
    position: relative;
    width: 100%;

    :deep(.van-notice-bar) {
      height: 35px;
      padding: 0 12px;
      line-height: 35px;
      color: #FF6A2A;
      background: #FFF8D6;
      border-radius: 4px;
    }
  }

  .close {
    position: absolute;
    top: 8px;
    right: 20px;
    z-index: 100;
    width: 16px;
    height: 16px;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
