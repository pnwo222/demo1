<script setup lang='ts'>
import { showDialog } from 'vant'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'

const { hasSbCard } = useUserInfo()

function toCode() {
  if (!hasSbCard.value) {
    showDialog({
      message: '您尚未绑定社保卡，为避免影响后续的功能使用，请先绑定社保卡',
      confirmButtonText: '立即绑定',
      showCancelButton: true,
    }).then(() => {
      router.push({
        path: '/card',
      })
    }).catch(() => {})
    return
  }
  router.push({
    path: '/code',
  })
}
</script>

<template>
  <div class="TabLayout">
    <div class="cnts relative">
      <router-view />
    </div>
    <van-tabbar class="z-1000" route inactive-color="#666" replace>
      <van-tabbar-item to="/index">
        <template #icon="props">
          <img v-show="props.active" class="w-85! h-32! translate-x-12 translate-y-3" src="@/assets/image/index/home-active@2x.png" alt="">
          <img v-show="!props.active" class="w-85! h-32! translate-x-12 translate-y-3" src="@/assets/image/index/home-unactive@2x.png" alt="">
        </template>
      </van-tabbar-item>
      <van-tabbar-item @click="toCode">
        <template #icon="props">
          <img v-show="props.active" class="w-44! h-44! translate-y--8 translate-x-2" src="@/assets/image/index/code-nav@2x.png" alt="">
          <img v-show="!props.active" class="w-44! h-44! translate-y--8 translate-x-2" src="@/assets/image/index/code-nav@2x.png" alt="">
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/mine">
        <template #icon="props">
          <img v-show="props.active" class="w-80! h-32! translate-x--12 translate-y-3" src="@/assets/image/index/mine-active@2x.png" alt="">
          <img v-show="!props.active" class="w-80! h-32! translate-x--12 translate-y-3" src="@/assets/image/index/mine-unactive@2x.png" alt="">
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style scoped lang='less'>
  .TabLayout {
    position: relative;

    :deep(.van-tabbar-item) {
      flex-direction: row;
      background: none;

      .van-tabbar-item__icon {
        margin-bottom: 0;
      }

      .van-tabbar-item__text {
        margin-left: 3px;
        font-size: 14px;
      }
    }

    :deep(.van-tabbar) {
      bottom: calc(6px);
      left: 50%;
      // box-shadow: 0px -1px 4px 0px rgba(0,0,0,0.13);
      width: 316px;
      height: 80px !important;
      padding-bottom: 0 !important;
      background: url('@/assets/image/index/tabbar@2x.png') no-repeat center center;
      background-size: 100% auto;
      transform: translateX(-50%);

      &::after {
        border: none !important;
      }
    }
  }

  .cnts {
    // padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
  }
</style>
