<script setup lang='ts'>
import { requireImage } from '@/utils/require'

const result = {
  title: '提交成功',
  desc: '您的资料已提交！<br>请等待工作人员统一入校办理！',
  icon: requireImage('image/index/success.png'),
}
</script>

<template>
  <div v-if="result" class="result text-center flex justify-center items-center">
    <div class="mt--60">
      <div class="title">
        <div>
          <img class="w-125 h-125" :src="result.icon" alt="">
        </div>
        <div class="h mb-13">
          {{ result.title }}
        </div>
        <div class="p" v-html="result.desc" />
      </div>

      <van-button
        class="min-w-120 mt-28! h-36! lh-36! text-16! bg-transparent! mr-20!"
        plain
        round
        type="primary"
        @click="$router.replace('/')"
      >
        返回首页
      </van-button>
      <van-button
        class="min-w-120 mt-28! h-36! lh-36! text-16! bg-transparent!"
        style="

--van-button-primary-border-color: #979797;--van-button-primary-background: #333;"
        plain
        round
        type="primary"
        @click="$router.go(-2)"
      >
        重新申领
      </van-button>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .result {
    height: 100vh;
    overflow: hidden;
    background: #fff;

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
        line-height: 20px;
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
  }
</style>
