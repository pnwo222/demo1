<script setup lang='ts'>
import { showDialog } from 'vant'
import { useAvatar, useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'
import UserTypeBox from './components/userType/index.vue'
import { useBalance } from './hooks/useBalance'

const {
  userInfo,
  isAlumni,
  isCurrentStudent,
  isNewStudent,
  isTeacher,
  isVisitor,
  hasSbCard,
} = useUserInfo()

const { avatar } = useAvatar()

const { balance } = useBalance({
  autoFetch: !isVisitor.value,
})

const studentBalanceMore = computed(() => {
  return balance.value?.length <= 1 && !isTeacher.value
})

function toInfo() {
  router.push({
    path: '/mine/info',
  })
}

function toBind() {
  router.push({
    path: '/auth',
  })
}

function toXf() {
  router.push({
    path: '/xf/index',
  })
}

function toSbCard() {
  if (!hasSbCard.value) {
    showDialog({
      message: '您尚未绑定社保卡，为避免影响后续的功能使用，请先绑定社保卡',
      confirmButtonText: '立即绑定',
      showCancelButton: true,
    }).then(() => {
      router.push({
        path: '/card',
      })
    }).catch(() => {})
    return
  }
  router.push({
    path: '/code',
  })
}

const { checkUser } = useUserInfo()

checkUser()
</script>

<template>
  <div class="mine">
    <div class="header relative">
      <div class="info flex items-center relative">
        <div class="avatar">
          <img :src="avatar" alt="">
        </div>
        <div class="text ml-15">
          <div class="name">
            {{ userInfo?.name }}
          </div>
          <div class="vip">
            <img v-if="userInfo.isCheck" src="@/assets/image/mine/vip.png" alt="">
            <img v-else src="@/assets/image/mine/novip.png" alt="">
          </div>
        </div>
        <div class="mine-detail" @click="toInfo">
          <span class="ml-8">个人资料</span> <van-icon name="arrow" class="ml-1" />
        </div>

        <!-- <div class="absolute top-4 right-10">
          <UserTypeBox />
        </div> -->
      </div>
    </div>
    <div class="relative z-100 pl-20 pr-20 mt--160">
      <!-- 我的校园卡 -->
      <div v-if="isCurrentStudent || isNewStudent || isAlumni || isTeacher" class="mycard">
        <div class="msg">
          <h1>{{ userInfo?.name }}</h1>
          <div v-if="isCurrentStudent || isNewStudent || isAlumni" class="p flex flex-wrap">
            <div class="flex items-center justify-start">
              <div class="ywa">
                录取年份：
              </div>
              <div class="flex-1">
                {{ userInfo?.year }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="ywa">
                录取学院：
              </div>
              <div class="flex-1">
                {{ userInfo?.stuCollegeName }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="ywa">
                录取专业：
              </div>
              <div class="flex-1">
                {{ userInfo?.stuMajorName }}
              </div>
            </div>
            <div v-if="!isNewStudent" class="flex items-center">
              <div class="ywa">
                学&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：
              </div>
              <div class="flex-1">
                {{ userInfo?.stuNo }}
              </div>
            </div>
          </div>

          <div v-if="isTeacher" class="p flex flex-wrap">
            <div class="flex items-center justify-start">
              <div class="ywa">
                入职年份：
              </div>
              <div class="flex-1">
                {{ userInfo?.tYear }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="ywa">
                部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门：
              </div>
              <div class="flex-1">
                {{ userInfo?.teaDeptName }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="ywa">
                工&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：
              </div>
              <div class="flex-1">
                {{ userInfo?.teaNo }}
              </div>
            </div>
          </div>
        </div>

        <div class="code" @click="toSbCard">
          <img src="@/assets/image/mine/code.png" alt="">
        </div>
      </div>

      <!-- 我的账户 -->
      <div v-if="isCurrentStudent || isAlumni || isTeacher" class="myaccount w-334 min-h-100 m-auto mt-14">
        <div class="title">
          <img src="@/assets/image/mine/zb.png" alt="">
        </div>
        <div class="money bg-#fff flex flex-wrap items-center pl-24 pr-24 mt-16">
          <div v-for="item in balance" :key="item.wlkh" class="w-50%">
            <div>{{ item.zhlxmc }}（元）</div>
            <div class="text-18 color-#333 mt-4 font-bold">
              {{ item.ye1 }}
            </div>
          </div>
          <!-- <div v-if="isTeacher">
            <div>教师钱包余额（元）</div>
            <div class="text-18 color-#333 mt-4 font-bold">
              {{ balance?.ye1 }}
            </div>
          </div> -->
          <div v-if="studentBalanceMore" class="w-50%">
            <div>消费记录（元）</div>
            <div class="btns mt-6" @click="toXf">
              在线查询
            </div>
          </div>
        </div>
      </div>

      <!-- 访客提示绑卡 -->
      <div v-if="isVisitor" class="minecard mt--160">
        <div class="card-title">
          <div>
            <img class="w-161 h-26" src="@/assets/image/mine/order-card-text.png" alt="">
          </div>
          <p>为了更好的为您提供服务，邀请您进行校园卡绑定</p>
          <div class="order" @click="toBind">
            立即绑定
          </div>
        </div>
      </div>
    </div>

    <van-cell-group inset>
      <van-cell v-if="isVisitor" is-link :border="false" to="/yy/index">
        <template #title>
          <div class="flex items-center">
            <img class="w-20 h-20 mr-8" src="@/assets/image/mine/xfjl.png" alt="">
            访客预约记录
          </div>
        </template>
      </van-cell>
      <van-cell v-if="isTeacher || (!studentBalanceMore && !isVisitor)" is-link :border="false" to="/xf/index">
        <template #title>
          <div class="flex items-center">
            <img class="w-20 h-20 mr-8" src="@/assets/image/mine/xfjl.png" alt="">
            消费记录
          </div>
        </template>
      </van-cell>
      <van-cell v-if="isCurrentStudent || isTeacher || isAlumni" is-link :border="false" to="/mj/index">
        <template #title>
          <div class="flex items-center">
            <img class="w-20 h-20 mr-8" src="@/assets/image/mine/mj.png" alt="">
            门禁记录
          </div>
        </template>
      </van-cell>
      <van-cell v-if="isCurrentStudent || isTeacher" is-link :border="false" to="/book/record">
        <template #title>
          <div class="flex items-center">
            <img class="w-20 h-20 mr-8" src="@/assets/image/mine/ts.png" alt="">
            图书借阅记录
          </div>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>

<style scoped lang='less'>
  @import url('./index.less');

  .p {
    width: 280px;
  }

  .ywa {
    min-width: 74px;
    flex-shrink: 0;
  }
</style>

<style lang="less">
.mine img {
  display: block;
}
</style>
