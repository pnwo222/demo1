<script setup lang="ts">
import { useCode } from '../../hooks'

const emit = defineEmits(['refreshTime'])

const countDown = ref()

const { qrCode, refresh, loading, isError, time } = useCode()

async function refreshCode() {
  await refresh()

  time.value = 60 * 1000
  countDown.value.reset()

  emit('refreshTime')
}

function resetTime() {
  time.value = 60 * 1000
  countDown.value.reset()
}

defineExpose({
  resetTime,
})
</script>

<template>
  <div class="code">
    <div class="top-tip">
      电子社保卡身份识别码不可用于支付
    </div>
    <div class="codeimg w-160 h-160 m-auto">
      <img v-if="qrCode && !isError" class="w-100% h-100%" :src="qrCode" alt="">
      <!-- <img class="w-24 h-24 sb-logo-code" src="@/assets/image/code/sb-logo.png" alt=""> -->
    </div>
    <div class="code-refresh flex items-center justify-center mt-12">
      <svg-icon name="redo" :size="12" class="mr-4" :class="{ 'animate-spin': loading }" />
      <van-count-down ref="countDown" :time="time" format="ss" class="color-#999! text-12!" :style="{ opacity: loading ? 0 : 1 }" @finish="refreshCode" />
      <span class="ml-1">{{ loading ? '正在刷新' : '秒后自动刷新' }}</span>
      <a class="ml-19 color-[var(--van-blue)]" @click="refreshCode">刷新</a>
    </div>
  </div>
</template>

<style scoped lang="less">
.code {
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    margin-top: 21px;

    > .codeimg {
      position: relative;
      background: #fafafa;
    }

    .code-refresh {
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
      color: #999;
    }

    .animate-spin {
      animation: spin 0.6s linear infinite;
    }
  }

  .tip-footer {
    margin-top: 20px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #5280FA;
  }

  .top-tip {
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #666;
    text-align: center;
  }

  .sb-logo-code {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translate(-50%, -50%);
}
</style>
