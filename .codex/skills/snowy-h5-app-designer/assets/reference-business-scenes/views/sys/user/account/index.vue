<script setup lang='ts'>
import { ykt } from 'icard-jssdk'
import { showLoadingToast } from 'vant'
import { activateAccount, check } from '@/api/user/user'
import PasswordTip from '@/components/PasswordTip/index.vue'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'

const { userInfo, userStore, isActivated } = useUserInfo()

const tel = ref('0574-86328007')

const showPwd = ref(false)
const showConfirmPwd = ref(false)

const isLoading = ref(false)

const validate = ref(false)
const confirmPasswordTip = ref('')

const form = ref({
  username: userInfo.value?.stuNo || userInfo.value?.teaNo,
  password: '',
  confirmPassword: '',
})

const canSubmit = computed(() => {
  return validate.value && (form.value.password === form.value.confirmPassword)
})

function handleBlur() {
  if (form.value.password !== form.value.confirmPassword) {
    confirmPasswordTip.value = '密码不一致'
  }
  else {
    confirmPasswordTip.value = ''
  }
}

function handleSubmit() {
  if (isLoading.value) {
    return
  }

  const loading = showLoadingToast({
    message: '请稍后...',
    duration: 0,
  })

  isLoading.value = true
  activateAccount({
    password: form.value.password,
  }).then(() => {
    router.push('/account/success')
  }).catch((err) => {
    if (err.cause?.code === 111) {
      router.push('/account/success')
    }
  }).finally(() => {
    isLoading.value = false
    loading.close()
  })
}

function handleCall() {
  ykt.callPhone(tel.value)
}

if (isActivated.value) {
  router.replace('/account/success')
}
else {
  check().then((res) => {
    if (res.msg === '1' || res.msg === '2') {
      router.replace('/account/success')
    }

    if (res.msg === '1') {
      userStore.fetchUserInfo()
    }
  })
}
</script>

<template>
  <div class="account">
    <div class="relative z-2 overflow-hidden">
      <div class="title mt-62">
        <h1>
          欢迎加入
          <br>
          浙江纺织服装职业技术学院
        </h1>
        <div class="bd mt-5" />
        <p class="mt-12">
          为保障您的账户及个人信息安全，请修改初始密码
        </p>
      </div>

      <div class="form mt-36">
        <div class="input">
          <div class="icon">
            <img class="w-18" src="@/assets/image/index/user@2x.png" alt="">
          </div>
          <input v-model="form.username" class="pointer-events-none" type="text" readonly placeholder="">
        </div>
        <div class="input">
          <div class="icon">
            <img class="w-18" src="@/assets/image/index/pwd@2x.png" alt="">
          </div>
          <input
            v-model="form.password"
            :type="showPwd ? 'text' : 'password'"
            placeholder="请输入新的密码"
            maxlength="16"
          >

          <div class="eye" @click.stop="showPwd = !showPwd">
            <img v-if="!showPwd" class="w-20" src="@/assets/image/index/eye@2x.png" alt="">
            <img v-else class="w-20" src="@/assets/image/index/eye-open.png" alt="">
          </div>
        </div>
        <PasswordTip v-if="form.password" v-model:validate="validate" :value="form.password" />
        <div class="input">
          <div class="icon">
            <img class="w-18" src="@/assets/image/index/pwd@2x.png" alt="">
          </div>
          <input
            v-model="form.confirmPassword"
            :type="showConfirmPwd ? 'text' : 'password'"
            placeholder="请确认密码"
            maxlength="16"
            @input="handleBlur"
          >
          <div class="eye" @click.stop="showConfirmPwd = !showConfirmPwd">
            <img v-if="!showConfirmPwd" class="w-20" src="@/assets/image/index/eye@2x.png" alt="">
            <img v-else class="w-20" src="@/assets/image/index/eye-open.png" alt="">
          </div>
        </div>
        <div v-if="confirmPasswordTip" class="error">
          {{ confirmPasswordTip }}
        </div>
        <p class="tip">
          新密码设置要求：<br>
          密码长度8~16位；至少包含数字、大写字母、小写字母或特殊字符的三种以上；请勿包含账号名、办公电话、手机号码及使用连续3位以上的相同或连续的字母、数字（如：aaa、abc、123等）。
        </p>

        <van-button class="mt-16!" type="primary" round block :disabled="!canSubmit" @click="handleSubmit">
          立即激活
        </van-button>

        <div class="faq mt-13">
          <div class="img">
            <div>
              <span class="span">
                <span>校园账号</span>
              </span>
              <span>
                是学校师生在使用校园网络（包括教学区有线、无线网络及宿舍有线、无线网络）和应用信息系统（包括：内网门户、教务管理等）的统一身份认证凭证，用户名为10位学号，新用户初始密码为zFf&身份证后六位（含X请小写输入，例zFf&11311x），且用户处于未激活状态，需完成激活操作才能使用。<br>
              </span>
              <div>
                账号使用过程中如有任何问题请致电呼叫中心<a @click="handleCall">{{ tel }}</a>。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .account {
    position: relative;
    min-height: 100vh;
    padding: 0 24px;
    padding-bottom: calc(env(safe-area-inset-bottom) + 36px);
    background: rgb(240 242 245);

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 375px;
      height: 430px;
      background: linear-gradient( 180deg, rgb(255 255 255 / 0%) 0%, #A6BEFF 100%);
      content: '';
      opacity: 0.28;
    }

    img {
      display: block;
    }

    &::before {
      position: absolute;
      top: -80px;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 100%;
      background: url('@/assets/image/index/account-bg.png') no-repeat top center;
      background-size: 100% auto;
      content: '';
    }

    h1 {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      color: #333;
    }

    p {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #456B8C;
    }

    .error {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: red;
    }

    .bd {
      width: 79px;
      height: 5px;
      background: #2D65F9;
    }

    .form {
      .input {
        position: relative;
        display: flex;
        width: 327px;
        height: 48px;
        padding: 0 20px;
        margin-bottom: 12px;
        background: #F8F9FB;
        border-radius: 24px;
        align-items: center;
      }

      .icon {
        flex-shrink: 0;
        margin-right: 15px;
      }

      input {
        width: 100%;
        height: 48px;
        font-size: 16px;
        font-weight: 500;
        line-height: 48px;
        color: #666;
        background: transparent;
        border: none;
        outline: none;

        &::placeholder {
          color: #999;
        }
      }

      .eye {
        position: absolute;
        top: 14px;
        right: 20px;
      }
    }

    p.tip {
      margin-top: 12px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #999;
    }

    .faq {
      // 两端对齐
      text-align: justify;

      .img {
        width: 328px;
        height: 274px;
        padding: 57px 14px;
        font-size: 13px;
        font-weight: 400;
        line-height: 23px;
        color: rgb(32 32 32 / 72%);
        background: url('@/assets/image/index/what-account@2x.png') no-repeat center center;
        background-size: 100% auto;

        >div {
          text-indent: 1.8em;
        }

        .span {
          position: relative;
          color: #202020;

          >span {
            position: relative;
            z-index: 2;
          }

          &::before {
            position: absolute;
            bottom: -1px;
            left: -1px;
            z-index: 0;
            width: 54px;
            height: 6px;
            background: linear-gradient( 270deg, #73F49F 0%, #68DCEC 100%);
            content: '';
          }
        }
      }
    }
  }
</style>
