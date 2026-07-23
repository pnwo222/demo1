<script setup lang='ts'>
import { showToast } from 'vant'
import { createApiPicker } from '@/components/OpenApiPicker'
import router from '@/router'

const form = ref({
  bank: '',
  _backName: '',
})

const { open: openBankPicker } = createApiPicker({
  value: form,
  field: 'bank',
  showLabelField: '_backName',
  props: {
    title: '办卡银行选择',
    columns: [
      {
        text: '农业银行',
        value: '1',
      },
      {
        text: '其他银行',
        value: '2',
      },
    ],
  },

})

function submit() {
  if (!form.value.bank) {
    showToast('请选择银行')
    return
  }
  if (form.value.bank === '2') {
    showToast('其他银行请前往“浙里办”APP申请办理')
    return
  }
  router.push('/sign-card/step1')
}
</script>

<template>
  <div class="sign-card relative">
    <div class="text absolute">
      <div class="desc">
        <p>持有外省社保卡的同学请务必提前申请；</p>
        <p class="mt-8!">
          我校合作银行为【农业银行】，经常组织校内现场服务，社保卡开户银行选择合作银行可更便利地开展开户、领卡、补卡等操作。
        </p>
        <p class="mt-10!">
          提交社保卡申办申请后，合作银行可提前制作社保卡，学生报到时可在校内领取并激活。
        </p>
      </div>

      <div class="bank" @click="openBankPicker">
        {{ form._backName || '请选择银行' }} <svg-icon :size="12" name="down" color="#97A0B4" />
      </div>

      <div class="submit w-148 h-34 m-auto mt-18" @click="submit">
        <img v-if="form.bank" class="ani w-100%" src="@/assets/image/signCard/s@2x.png" alt="">
        <img v-else class="w-100%" src="@/assets/image/signCard/un-s@2x.png" alt="">
      </div>

      <div class="faq">
        <p>2025年9月，宁波市人力资源和社会保障局、浙江纺织服装职业技术学院、宁波市一卡通科技有限公司合作，创新建设了我市首个社保卡“一卡通”高校应用试点项目，实现以社保卡为载体，为师生提供校园身份认证与金融交易等社保卡“高校一卡通”服务。目前已实现校园大门人行通道、智慧教室门禁、智慧教室多媒体中控、图书馆借还书、食堂消费等服务对接。</p>
        <p>广大师生欲获得社保卡“高校一卡通”功能，需满足以下条件：</p>
        <p>1、拥有浙江省内的社保卡（必选）；【每人可办理一张浙江省社保卡】</p>
        <p>2、激活浙江省社保卡的金融账户（必选）；【使用电子社保码进行消费时，由个人社保卡银行账户存款支付】</p>
        <p>3、推荐办理宁波市社保卡，可享受更便捷的本地服务</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .sign-card {
    @keyframes rotates {
      0% {
        transform: rotate(0deg);
      }

      10% {
        transform: rotate(-3deg);
      }

      20% {
        transform: rotate(3deg);
      }

      30% {
        transform: rotate(-2deg);
      }

      40% {
        transform: rotate(2deg);
      }

      50% {
        transform: rotate(0deg);
      }

      100% {
        transform: rotate(0deg);
      }
    }

    width: 375px;
    height: 1319px;
    background: url('@/assets/image/signCard/sign-card.jpg') no-repeat center center;
    background-size: 100% 100%;

    .text {
      top: 495px;
      width: 100%;
      min-height: 300px;
      padding-bottom: 40px;
      overflow: hidden;
      // background: rgb(0 0 0 / 40%);

      .desc {
        height: 150px;
        padding: 0 40px;
        padding-right: 30px;
        margin-top: 5px;
        font-size: 14px;
        line-height: 17px;
        color: #1788D0;
        text-indent: 1.6em;

        >p {
          &:last-child {
            height: 52px;
            margin-top: 5px;
          }
        }
      }

      .bank {
        width: 240px;
        height: 40px;
        margin: 0 auto;
        margin-top: 52px;
        font-size: 14px;
        font-weight: 400;
        line-height: 40px;
        color: #666;
        text-align: center;
        // border: 1px solid #000;
      }
    }

    .ani {
      animation: rotates 2s ease-in-out infinite;
    }

    .faq {
      width: 300px;
      height: 360px;
      // padding-bottom: 20px;
      margin: 0 auto;
      margin-top: 122px;
      overflow-y: auto;
      font-size: 13px;
      font-weight: 400;
      line-height: 22px;
      color: #4D5A4D;
      text-indent: 2em;
    }
  }
</style>
