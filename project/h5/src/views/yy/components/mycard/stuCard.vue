<script setup lang='ts'>
import dayjs from 'dayjs'
import { useSbCode } from '@/hooks/system/useSbCode'
import Code from '@/views/code/components/mycard/code.vue'

defineOptions({
  title: '学生码',
})

const props = defineProps({
  type: {
    type: [String, Number],
    default: 1, // 0: 新生码 1: 学生码 2: 教职码 3: 校友码
  },
  userInfo: {
    type: Object,
    default: () => ({}),
  },
})
const emit = defineEmits(['toDetail'])

const time = ref(60 * 1000)
const countDown = ref()

const { qrCode, refresh, loading, isError } = useSbCode({
  autoFetch: true,
  red: !(Number(props.userInfo.auditStatus) === 1),
})

async function refreshCode() {
  await refresh()

  countDown.value.reset()
}

function toDetail() {
  emit('toDetail')
}
</script>

<template>
  <div class="code-card">
    <div class="logo h-76 pl-16 pr-16 flex items-center justify-between">
      <div>
        <h1>{{ userInfo.visitorName }}</h1>
        <p>{{ userInfo.idCard }}</p>
      </div>
      <div class="exchange" @click="toDetail">
        预约信息
        <van-icon name="arrow" />
      </div>
    </div>
    <!-- <div v-if="Number(userInfo.auditStatus) === 1" class="msg-card">
      <div class="top-tip">
        电子社保卡身份识别码不可用于支付
      </div>
      <div class="code">
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
      </div>

      <div class="tip-footer">
        在APP首页点击「亮码」-「社保卡」可直接使用
      </div>
      <div class="tips22">
        如需支付请使用「亮码」-「电子社保卡金融支付」
      </div>
    </div> -->

    <Code v-if="Number(userInfo.auditStatus) === 1" class="msg-card" />

    <div class="yy-box mt-12!">
      <div class="yy-cnt">
        <p>
          <span>被&nbsp;&nbsp;访&nbsp;&nbsp;人：</span><span>{{ userInfo.intervieweeName }}</span>
        </p>
        <p>
          <span>拜访部门：</span><span>{{ userInfo.visitDept }}</span>
        </p>
        <p>
          <span>开始时间：</span><span>{{ dayjs(userInfo.startTime).format('YYYY.MM.DD') }}</span>
        </p>
        <p>
          <span>结束时间：</span><span>{{ dayjs(userInfo.endTime).format('YYYY.MM.DD') }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
@import url('./index.less');
</style>
