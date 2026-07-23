<script setup lang='ts'>
import type { IVisitRecord } from '@/api/index/yy/types'
import { ykt } from 'icard-jssdk'
import { useStorage } from '@/hooks/system/useStorage'
import router from '@/router'
import { maskIdCard, maskName } from '@/utils'
import StuCard from './components/mycard/stuCard.vue'
import { auditStatusMap, reasonMap } from './data'

ykt.forbidScreenshot()

const userInfo = ref({
  type: 1,
  status: 3,
})

const statusMap = ref({
  1: {
    color: 'rgba(0, 181, 120, 1)',
    background: 'rgba(0, 181, 120, .1)',
    leftIcon: 'passed',
  },
  2: {
    color: '#FF6A2A',
    background: '#FFF8D6',
    leftIcon: 'warning-o',
  },
  3: {
    color: '#FF6A2A',
    background: '#FFF8D6',
    leftIcon: 'warning-o',
  },
  4: {
    color: '#E63633',
    background: '#FFE9E9',
    leftIcon: 'warning-o',
  },
})

const detail = useStorage.ss.get('yyDetail') as IVisitRecord
// detail.visitorName = maskName(detail.visitorName)
detail.idCard = maskIdCard(detail.idCard)

function toDetail() {
  router.push('/yy/form?read=1')
}
</script>

<template>
  <div class="code-page">
    <div class="mb-16 f-bar">
      <van-notice-bar
        :color="statusMap[detail.auditStatus].color"
        :background="statusMap[detail.auditStatus].background"
        :left-icon="statusMap[detail.auditStatus].leftIcon"
      >
        {{ auditStatusMap[detail.auditStatus] }}
      </van-notice-bar>
    </div>
    <StuCard :user-info="detail" :type="userInfo.type" @to-detail="toDetail" />
  </div>
</template>

<style scoped lang='less'>
  .code-page {
    width: 100%;
    min-height: 100vh;
    padding: 10px;
    perspective: 2000px;

    img {
      display: block;
    }

    .code-card-box {
      position: relative;
      width: 335px;
      min-height: 496px;
      transition: transform 0.6s ease-in-out;
      transform-style: preserve-3d;
    }

    .code-card-box.flipped {
      transform: rotateY(-180deg);
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

  }

  .f-bar {
    --van-notice-bar-height: 35px;

    :deep(.van-notice-bar) {
      border-radius: 4px;
    }
  }
</style>

<style lang='less'>

</style>
