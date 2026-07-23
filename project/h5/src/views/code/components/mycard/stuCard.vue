<script setup lang='ts'>
import type { PropType } from 'vue'
import type { IUserInfoExtends } from '@/store/modules/user-types'
import { UserIdentityType } from '@/api/user/enums'
import { useSbCode } from '@/hooks/system/useSbCode'
import { useUserInfo } from '@/hooks/system/useUser'
import { requireImage } from '@/utils/require'
import { useCode } from '../../hooks'
import Code from './code.vue'

defineOptions({
  title: '学生码',
})

const props = defineProps({
  type: {
    // default: 1, // 0: 新生码 1: 学生码 2: 教职码 3: 校友码
    type: String as PropType<UserIdentityType>,
    default: UserIdentityType.NEW_STUDENT,
  },
  userInfo: {
    type: Object as PropType<IUserInfoExtends>,
    default: () => ({}),
  },
  isFlipped: {
    default: false,
    type: Boolean,
  },
})

const emit = defineEmits(['exchange', 'refreshTime'])

const { userInfo, isNewStudent, isCurrentStudent, isAlumni, isTeacher } = useUserInfo()

function exchange() {
  emit('exchange')
}

const codeRef = ref()

watch(() => props.isFlipped, (val) => {
  codeRef.value.resetTime()
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
      <div class="flex items-center">
        <img class="w-18" src="@/assets/image/logo/fy.png" alt="">
        <img class="w-174 ml-4" src="@/assets/image/logo/fy-name.png" alt="">
      </div>
      <div class="exchange" @click="exchange">
        <van-icon name="exchange" />
        社保卡信息
      </div>
    </div>
    <div class="msg-card">
      <div class="msg-header flex justify-between">
        <div class="msg">
          <h1>{{ userInfo.name }}</h1>
          <template v-if="isNewStudent">
            <p>录取年份：{{ userInfo.year }}</p>
            <p>录取学院：{{ userInfo.stuCollegeName }}</p>
            <p>录取专业：{{ userInfo.stuMajorName }}</p>
          </template>
          <template v-if="isCurrentStudent || isAlumni">
            <p>入学年份：{{ userInfo.year }}</p>
            <p>所属学院：{{ userInfo.stuCollegeName || userInfo.aluCollege }}</p>
            <p>在校专业：{{ userInfo.stuMajorName || userInfo.aluMajor }}</p>
            <p>学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：{{ userInfo.stuNo || userInfo.aluNo }}</p>
          </template>
          <template v-if="isTeacher">
            <p>入职年份：{{ userInfo.tYear }}</p>
            <p>部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门：{{ userInfo.teaDeptName }}</p>
            <p>工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：{{ userInfo.teaNo }}</p>
            <p class="opacity-0">
              工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：{{ userInfo.teaNo }}
            </p>
          </template>
        </div>
        <div class="avatar">
          <img class="w-100% h-100%" :src="userInfo.avatar || requireImage('image/code/default-avatar.png')" alt="">
        </div>
      </div>

      <Code ref="codeRef" @refresh-time="refreshTime" />

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
