<script setup lang='ts'>
import { showDialog } from 'vant'
import { selectIdentity } from '@/api/user/user'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'
import { useUserStore } from '@/store/modules/user'
import { px2vw } from '@/utils'

const userStore = useUserStore()

const { userInfo } = useUserInfo()

const roleType = ref('0')
const agreen = ref(false)

function notNow() {
  showDialog({
    message: '后续可在学校“我的”页面进行身份信息的绑定与认证',
    confirmButtonText: '我知道了',
  }).then(() => {
    userInfo.value.isHomeCheck = '1'
    router.push({
      path: '/index',
    })
  })
}

function select(nogo?: boolean) {
  selectIdentity({
    identity: roleType.value,
  }).then(async () => {
    if (nogo) return
    await userStore.fetchUserInfo()
    router.push({
      path: '/result',
      query: {
        // 1成功 2失败
        status: 1,
      },
    })
  }).catch(() => {
    if (nogo) return
    router.push({
      path: '/result',
      query: {
        status: 2,
      },
    })
  })
}

select(true)
</script>

<template>
  <div class="auth">
    <h1>请选择您的身份</h1>
    <p>请选择您的实际身份，<br>以便为您提供更准确的服务</p>

    <div class="role-select">
      <div class="role" :class="{ active: roleType === '1' }" @touchend="roleType = '1'">
        <div class="text color-#333 font-500">
          我是学生/校友
        </div>
        <div class="man">
          <img src="@/assets/image/index/sta.png" alt="">
        </div>
        <div class="flex justify-center w-140 mt-13">
          <van-radio v-model="roleType" class="pointer-events-none" name="1" />
        </div>
      </div>
      <div class="role" :class="{ active: roleType === '2' }" @touchend="roleType = '2'">
        <div class="text color-#202020 font-400">
          我是教职工
        </div>
        <div class="man">
          <img src="@/assets/image/index/tea.png" alt="">
        </div>
        <div class="flex justify-center w-140 mt-13">
          <van-radio v-model="roleType" class="pointer-events-none" name="2" />
        </div>
      </div>
    </div>

    <div class="agreen">
      <van-checkbox v-model="agreen" :icon-size="px2vw(14)">
        <div class="mt--3">
          同意使用实名信息（包括姓名和身份证号）进行校园身份绑定
        </div>
      </van-checkbox>
    </div>

    <van-button class="mt-8!" type="primary" round block :disabled="!agreen || !roleType || roleType === '0'" @click="select()">
      确认选择
    </van-button>
    <van-button class="no-bg mt-16!" type="default" round block @click="notNow">
      都不是
    </van-button>
  </div>
</template>

<style scoped lang='less'>
@import url('./style/index.less');
</style>
