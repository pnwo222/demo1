<script setup lang='ts'>
import { showDialog } from 'vant'
import { useUserInfo } from '@/hooks/system/useUser'

const { userInfo } = useUserInfo()

const form = ref({
  name: userInfo.value?.name,
  idCard: userInfo.value?.idCardNumber,
})

const agreen = ref(false)

function notNow() {
  showDialog({
    message: '后续可在“APP-我的”页面绑定电子社保卡',
    confirmButtonText: '我知道了',
  })
}

// showDialog({
//   message: '鉴于您尚未办理社保卡，目前无法进行社保卡的绑定操作。建议您尽快申请办理社保卡',
//   confirmButtonText: '立即申领',
//   showCancelButton: true,

// })
</script>

<template>
  <div class="auth">
    <div class="title mt-46 relative z-2 pl-24">
      <h1>账户尚未绑定社保卡</h1>
      <p>请先完成绑定</p>
    </div>

    <div class="card-content relative z-2">
      <div class="role-select">
        <div class="input mb-18">
          {{ form.name }}
        </div>
        <div class="input mb-46">
          {{ form.idCard }}
        </div>
      </div>

      <div class="agreen">
        <van-checkbox v-model="agreen" :icon-size="px2vw(14)">
          <div class="mt--3">
            同意使用实名信息（包括姓名和身份证号）进行社保卡绑定
          </div>
        </van-checkbox>
      </div>

      <van-button class="mt-8!" type="primary" round block :disabled="!agreen">
        立即绑定
      </van-button>
      <van-button class="no-bg mt-16!" type="default" round block @click="notNow">
        暂不绑定
      </van-button>
    </div>
  </div>
</template>

<style scoped lang='less'>
@import url('./style/index.less');

.auth {
  position: relative;
  padding-right: 0;
  padding-left: 0;

  &::before {
    position: absolute;
    top: -60px;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: url('@/assets/image/index/sb-bg.png') no-repeat top center;
    background-size: 100% auto;
    content: '';
  }

  .title {
    h1 {
      font-size: 24px;
      font-weight: 600;
      line-height: 33px;
      color: #333;
      text-align: left;
    }

    p {
      margin: 0;
      margin-top: 10px;
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      color: rgb(51 51 51 / 80%);
      text-align: left;
    }
  }

  .card-content {
    min-height: 400px;
    padding: 34px 24px;
    margin-top: 40px;
    background: linear-gradient( 180deg, rgb(255 255 255 / 50%) 0%, rgb(255 255 255 / 0%) 100%);
    border-radius: 24px 24px 0 0;
    backdrop-filter: blur(10px);

    .role-select {
      margin-top: 0;
      flex-wrap: wrap;

      .input {
        width: 100%;
        color: #666;
        background: #F5F5F5;
      }
    }
  }
}
</style>
