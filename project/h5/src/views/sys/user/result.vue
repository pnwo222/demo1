<script setup lang='ts'>
import router from '@/router'
import { requireImage } from '@/utils/require'

const resultMap = ref({
  1: {
    title: '认证成功',
    desc: '欢迎加入校园大家庭<br>去开启你的智慧校园生活吧',
    icon: requireImage('image/index/success.png'),
  },
  2: {
    title: '认证失败',
    desc: '很抱歉，未在学校数据中匹配到您的相关信息如有疑问，请联系0574-65772287',
    error: 1,
    icon: requireImage('image/index/error.png'),
  },
})

const result = computed(() => {
  return resultMap.value[router.currentRoute.value.query.status as string]
})
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

        <div v-if="result.error" class="error m-auto mt-24 text-12">
          <van-icon name="warning" color="rgb(129,155,199)" :size="14" />
          若您为校友，请先前往<br>
          <strong class="color-#4F6996;text-14;font-bold">“浙纺服职院校友会”</strong>小程序完成校友认证
        </div>
      </div>

      <van-button class="min-w-120 mt-43! h-36! lh-36! text-16!" plain round type="primary" @click="$router.replace('/')">
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
