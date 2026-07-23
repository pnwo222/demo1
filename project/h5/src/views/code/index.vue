<script setup lang='ts'>
import { ykt } from 'icard-jssdk'
import { getVisitMyselfApi } from '@/api/mine/index'
import { useUserInfo } from '@/hooks/system/useUser'
import SbCard from './components/mycard/sbCard.vue'
import StuCard from './components/mycard/stuCard.vue'
import { tipMap } from './data'

ykt.forbidScreenshot()

const { userInfo, isVisitor } = useUserInfo()

const startAni = ref(false)
const isFlipped = ref(false)

const sbCardRef = ref()
const stuCardRef = ref()
const isChanged = ref(false)

function exchange() {
  isFlipped.value = !isFlipped.value

  if (isChanged.value) return
  if (isFlipped.value) {
    // sbCardRef.value.refresh()
    isChanged.value = true
  }
}

if (userInfo.value.identityType === '0') {
  ykt.setTitle('访客码')
}
else if (userInfo.value.identityType === '3') {
  ykt.setTitle('校友码')
}
else if (userInfo.value.identityType === '2') {
  ykt.setTitle('学生码')
}
else if (userInfo.value.identityType === '4') {
  ykt.setTitle('教职码')
}
else if (userInfo.value.identityType === '1') {
  ykt.setTitle('新生码')
}

const visitMyself = ref()
if (isVisitor.value) {
  getVisitMyselfApi().then((res) => {
    visitMyself.value = res.records[0]
  })
}

const { checkUser } = useUserInfo()

checkUser()
</script>

<template>
  <div class="code-page">
    <!-- 访客 -->
    <div v-if="isVisitor" class="code-card-box">
      <div class="sbCard">
        <SbCard loop :show-red="!visitMyself" @exchange="exchange" />
      </div>
    </div>

    <!-- 学生/教职/新生/校友  -->
    <div v-else class="code-card-box">
      <div class="code-card-box-inner pointer-events-none" :class="{ flipped: isFlipped }">
        <div class="stuCard">
          <StuCard ref="stuCardRef" :is-flipped="isFlipped" @exchange="exchange" />
        </div>
        <div class="sbCard sbCard-flip">
          <SbCard ref="sbCardRef" :is-flipped="isFlipped" :loop="isFlipped" show-back :auto-fetch="false" @exchange="exchange" />
        </div>
      </div>

      <div class="code-card-box-inner code-card-box-inner2">
        <div v-show="!isFlipped" class="stuCard">
          <StuCard :is-flipped="isFlipped" @exchange="exchange" @refresh-time="stuCardRef?.resetTime()" />
        </div>
        <div v-show="isFlipped" class="sbCard">
          <SbCard :is-flipped="isFlipped" :loop="isFlipped" show-back :auto-fetch="false" @exchange="exchange" @refresh-time="sbCardRef?.resetTime()" />
        </div>
      </div>
    </div>

    <div v-if="tipMap[userInfo.identityType]" class="tips" v-html="tipMap[userInfo.identityType]" />

    <!-- 预约提示 -->
    <div v-if="isVisitor" class="yy-box mt-12!">
      <div class="yy-head">
        今日已预约
      </div>
      <div v-if="visitMyself" class="yy-cnt">
        <p>
          <span>被&nbsp;&nbsp;访&nbsp;&nbsp;人：</span><span>{{ visitMyself.intervieweeName }}</span>
        </p>
        <p>
          <span>拜访部门：</span><span>{{ visitMyself.visitDept }}</span>
        </p>
        <p>
          <span>开始时间：</span><span>{{ visitMyself.startTime }}</span>
        </p>
        <p>
          <span>结束时间：</span><span>{{ visitMyself.endTime }}</span>
        </p>
      </div>
      <div v-else class="yy-cnt">
        <div class="empty m-auto">
          今日无预约
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .code-page {
    width: 100%;
    min-height: 100vh;
    padding: 18px 20px;
    background: linear-gradient( 180deg, #FFF 0%, #EDF2FE 100%);

    img {
      display: block;
    }

    .code-card-box {
      position: relative;
      width: 335px;
      min-height: 523px;
      perspective: 2000px;
    }

    .code-card-box-inner {
      position: relative;
      transition: transform 0.6s ease-in-out;
      transform-style: preserve-3d;
    }

    .code-card-box-inner.flipped {
      transform: rotateY(-180deg);
    }

    .code-card-box-inner2 {
      z-index: 100;
      opacity: 0;
    }

    .sbCard, .stuCard {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
    }

    .stuCard {
      z-index: 2;
      transform: rotateY(0deg);
    }

    .sbCard-flip {
      z-index: 1;
      transform: rotateY(-180deg);
    }

    .yy-box {
      width: 335px;
      margin: 0 auto;
      background: #FFF;
      border-radius: 12px;

      .yy-head {
        width: 335px;
        height: 32px;
        padding: 0 24px;
        font-size: 14px;
        font-weight: 600;
        line-height: 32px;
        color: #3E5EAB;
        background: linear-gradient( 94deg, rgb(77 143 255 / 30%) 0%, rgb(75 220 207 / 30%) 100%);
        border-radius: 12px 12px 0 0;
      }

      .yy-cnt {
        min-height: 116px;
        padding: 8px 24px;
        font-size: 14px;
        font-weight: 400;
        line-height: 24px;
        color: #666;

        >p {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .empty {
          font-size: 24px;
          font-weight: 600;
          line-height: 116px;
          color: #D6D6D6;
          text-align: center;
        }
      }
    }

  }
</style>

<style lang='less'>
.code-page .tips {
  width: 335px;
  // height: 232px;
  padding: 12px;
  margin: 0 auto;
  margin-top: 12px;
  background: #FFF;
  border-radius: 12px;

  h1 {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: rgb(32 32 32 / 85%);
  }

  p {
    margin-top: 4px;
    margin-bottom: 16px;
    font-size: 12px;
    font-weight: 400;
    line-height: 21px;
    color: rgb(32 32 32 / 72%);
    text-indent: 2em;
  }
}
</style>
