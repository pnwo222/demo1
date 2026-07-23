<script setup lang='ts'>
import { requireImage } from '@/utils/require'

const result = {
  title: '',
  desc: '您在浙江省内查询到已持有社会保障<br>卡,请勿重新申领!',
  icon: requireImage('image/signCard/sfrzsb.png'),
}
</script>

<template>
  <div v-if="result" class="result text-center flex justify-center items-center">
    <div class="mt--60">
      <div class="title">
        <div>
          <img class="w-298 h-195" :src="result.icon" alt="">
        </div>
        <div class="h mb-13">
          {{ result.title }}
        </div>
        <div class="p" v-html="result.desc" />
      </div>

      <van-button
        class="min-w-120 mt-48! h-36! lh-36! text-16! bg-transparent! mr-20!"
        plain
        round
        type="primary"
        @click="$router.replace('/')"
      >
        返回首页
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
        margin-top: -20px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333;
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
