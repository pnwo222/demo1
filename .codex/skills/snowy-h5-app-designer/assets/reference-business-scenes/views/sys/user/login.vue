<script setup lang='ts'>
import { ykt } from 'icard-jssdk'
import { useLoginPageVisibility } from '@/hooks/system/usePageVisibility'
import { useStorage } from '@/hooks/system/useStorage'
import router from '@/router'
import { useUserStore } from '@/store/modules/user'
import { detectOS } from '@/utils/device'

const isIOS = detectOS() === 'ios'

console.log('[isIOS]', isIOS)

const userStore = useUserStore()

// const form = ref<ILoginParams>({
//   account: '<历史测试账号已移除>',
//   password: '<历史测试密码已移除>',
// })

// function toLogin() {
//   userStore.login(toRaw(form.value)).then(() => {
//     router.push('/index')
//   })
// }

onMounted(() => {
  // if (useStorage.ss.get('close')) {
  //   nextTick(() => {
  //     ykt.closePage()
  //   })
  // }
})

/** 监听页面前后台切换 */
useLoginPageVisibility(
  // 页面进入后台时的回调
  () => {
    console.log('页面进入后台')
  },

  () => {
    console.log('页面进入前台')
    if (useStorage.ss.get('close')) {
      ykt.closePage()
    }
  },
)

window.addEventListener('beforeunload', () => {
  ykt.closePage()
})

const token = router.currentRoute.value.query.token as unknown as string
const openId = router.currentRoute.value.query.openId as unknown as string
console.log('[openid]', openId)
if (openId) {
  useStorage.ls.set('openId', openId)
}

if (token) {
  userStore.setToken(token)
  // router.replace('/index')
  if (ykt.isIcard() && isIOS) {
    ykt.openLink({
      url: location.origin + location.pathname,
      replace: true,
    })
  }
  else {
    router.replace('/index')
    // location.href = './'
  }

  setTimeout(() => {
    useStorage.ss.set('close', 1)
  }, 1000)
}
</script>

<template>
  <div class="relative h-100vh p-48 bg-white text-16" />
</template>

<style scoped lang='less'>
p {
  --at-apply: 'mt-24 text-16';
}

.input {
  --at-apply: 'relative flex items-center h-40 mb-12 b-b-1 b-b-solid b-b-#efefef';
}

input {
  --at-apply: 'w-180 h-32 text-14 color-#333 bg-transparent b-none';
}

.login-btn {
  --at-apply: 'h-45 m-auto m-t50 text-16 line-height-45 color-white bg-#29c988 border-rd-5 text-center';
}
</style>
