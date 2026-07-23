<script setup lang='ts'>
import { useSbCode } from '@/hooks/system/useSbCode'
// import type { PropType } from 'vue'
// import type { IUserInfoExtends } from '@/store/modules/user-types'
import { aluActivatedStatusMap, useUserInfo } from '@/hooks/system/useUser'
import { requireImage } from '@/utils/require'
import { useCode } from '../../hooks'
import Code from './code.vue'

defineOptions({
  title: '社保码',
})

const props = defineProps({
  showBack: {
    default: false,
    type: Boolean,
  },
  autoFetch: {
    default: true,
    type: Boolean,
  },
  showRed: {
    default: false,
    type: Boolean,
  },
  loop: {
    default: false,
    type: Boolean,
  },
  isFlipped: {
    default: false,
    type: Boolean,
  },
})

const emit = defineEmits(['exchange', 'refreshTime'])

const { userInfo } = useUserInfo()

function exchange() {
  console.log('[exchange]')
  emit('exchange')
}

const codeRef = ref()

watch(() => props.isFlipped, (val) => {
  if (val) {
    codeRef.value.resetTime()
  }
})

function refreshTime() {
  emit('refreshTime')
}

function resetTime() {
  codeRef.value.resetTime()
}

defineExpose({
  resetTime,
})
</script>

<template>
  <div class="code-card">
    <div class="logo h-47 pl-15 flex items-center">
      <div class="flex items-center color-#fff  text-14">
        <img class="w-18 h-18 mr-4" src="@/assets/image/code/sb-logo.png" alt="">
        我的社保卡
      </div>
      <div v-if="showBack" class="exchange" @click="exchange">
        <van-icon name="exchange" />
        校园信息
      </div>
    </div>
    <div class="msg-card">
      <div class="msg-header flex justify-between">
        <div class="msg">
          <h1>{{ userInfo.name }}</h1>
          <p>参保地：{{ userInfo.aab301Desc }}</p>
          <p>社会保障卡应用状态：<span :class="{ normal: userInfo.aaz502 === '1' }">{{ aluActivatedStatusMap[userInfo.aaz502] || '未知' }}</span></p>
          <p>社保卡金融账户激活状态：<span :class="{ normal: userInfo.kzt === '1' }">{{ userInfo.kzt === '1' ? '激活' : '未激活' }}</span></p>
          <p>卡规范版本号：{{ userInfo.aaz508?.startsWith('3') ? '三代卡' : '非三代卡' }}</p>
        </div>
        <div class="avatar">
          <img class="w-100% h-100%" :src="userInfo.avatar || requireImage('image/code/default-avatar.png')" alt="">
        </div>
      </div>

      <Code ref="codeRef" @refresh-time="refreshTime" />

      <!-- <div class="code">
        <div class="top-tip">
          电子社保卡身份识别码不可用于支付
        </div>
        <div class="codeimg w-160 h-160 m-auto">
          <img v-if="qrCode && !isError" class="w-100% h-100%" :src="qrCode" alt="">
          <img v-if="qrCode && !isError" class="w-20 h-20 sb-logo-code" src="@/assets/image/code/sb-logo.png" alt="">
        </div>
        <div class="code-refresh flex items-center justify-center mt-12">
          <svg-icon name="redo" :size="12" class="mr-4" :class="{ 'animate-spin': loading }" />
          <van-count-down ref="countDown" :time="time" format="ss" class="color-#999! text-12!" :style="{ opacity: loading ? 0 : 1 }" @finish="refreshCode" />
          <span class="ml-1">{{ loading ? '正在刷新' : '秒后自动刷新' }}</span>
          <a class="ml-19 color-[var(--van-blue)]" @click="refreshCode">刷新</a>
        </div>
      </div> -->

      <div class="tip-footer">
        在APP首页点击「亮码」-「社保卡」可直接使用
      </div>
      <div class="tips22">
        如需支付请使用「亮码」-「电子社保卡金融支付」
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
@import url('./index.less');
</style>
