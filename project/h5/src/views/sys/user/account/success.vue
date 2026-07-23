<script setup lang='ts'>
import { ykt } from 'icard-jssdk'
import { useUserInfo } from '@/hooks/system/useUser'
import { requireImage } from '@/utils/require'

const { userInfo } = useUserInfo()

const result = computed(() => {
  if ((userInfo.value?.identityType === '1' || userInfo.value?.identityType === '2') && userInfo.value?.stuActivatedStatus === '1') {
    return {
      title: '账号已激活',
      desc: '愿你们在这里开启精彩的旅程<br>共同书写未来的美好篇章',
      icon: requireImage('image/index/success.png'),
    }
  }

  if (userInfo.value?.identityType === '3' && userInfo.value?.aluActivatedStatus === '1') {
    return {
      title: '账号已激活',
      desc: '愿你们在这里开启精彩的旅程<br>共同书写未来的美好篇章',
      icon: requireImage('image/index/success.png'),
    }
  }

  if (userInfo.value?.identityType === '4' && userInfo.value?.teaActivatedStatus === '1') {
    return {
      title: '账号已激活',
      desc: '愿你们在这里开启精彩的旅程<br>共同书写未来的美好篇章',
      icon: requireImage('image/index/success.png'),
    }
  }

  return {
    // title: '账号已激活',
    // desc: '愿你们在这里开启精彩的旅程<br>共同书写未来的美好篇章',
    // icon: requireImage('image/index/success.png'),
    title: '等待学校激活',
    desc: '等待学校激活，请稍后再看',
    icon: requireImage('image/index/wait.png'),
  }
})

ykt.setTitle(result.value.title)
</script>

<template>
  <div v-if="result" class="result text-center">
    <div class="success-hua">
      <img class="w-338" src="@/assets/image/index/success-hua.png" alt="">
    </div>
    <div class="mt-64">
      <div class="title">
        <div>
          <img class="w-125 h-125" :src="result.icon" alt="">
        </div>
        <div class="h mb-13">
          {{ result.title }}
        </div>
        <div class="p" v-html="result.desc" />
      </div>

      <van-button class="min-w-120 mt-28! h-36! lh-36! text-16! bg-transparent!" plain round type="primary" @click="$router.replace('/')">
        返回首页
      </van-button>

      <div class="tips">
        <h1>如何使用校园账户？</h1>
        <p>
          校园账户是学校师生在使用校园网络（包括教学区有线、无线网络及宿舍有线、无线网络）和应用信息系统（包括：内网门户、教务管理等）的统一身份认证凭证，用户名为10位学号，新用户初始密码为zFf&身份证后六位（含X请小写输入，例zFf&11311x），且用户处于未激活状态，需完成激活操作才能使用。
          校园内网平台可通过学校主网站www.zjff.edu.cn点击“内网平台”图片进入，如需修改密码可在内网平台进行操作。
          账户使用过程中如有任何问题请致电呼叫中心681890。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .result {
    position: relative;
    padding-bottom: 20px;
    overflow: hidden;
    background: #f7f8fa;

    .success-hua {
      position: absolute;
      top: 12px;
      left: 50%;
      pointer-events: none;
      transform: translateX(-50%);

    }

    .title {
      .h {
        margin-top: 30px;
        font-size: 24px;
        font-weight: 500;
        line-height: 33px;
        color: #333;
      }

      .p {
        max-width: 240px;
        margin: 0 auto;
        margin-top: 10px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #999;
        text-align: center;
      }
    }

    .error {
      width: 275px;
      height: 68px;
      padding: 14px 18px;
      line-height: 20px;
      color: #819BC7;
      background: #E6EFFF;
      border: 2px dashed #819BC7;
      border-radius: 8px;
    }

    .tips {
      padding: 20px 16px;
      margin: 0 20px;
      margin-top: 30px;
      background: #fff;
      border-radius: 8px;

      h1 {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #202020;
        text-align: center;
      }

      p {
        margin-top: 12px;
        font-size: 12px;
        font-weight: 400;
        line-height: 21px;
        color: rgb(32 32 32 / 72%);
        text-align: left;
        text-indent: 2em;
      }
    }
  }
</style>
