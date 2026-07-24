<script setup lang='ts'>
import dayjs from 'dayjs'
import html2canvas from 'html2canvas'
import { ykt } from 'icard-jssdk'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'

const { userInfo } = useUserInfo()

const info = ref({
  name: userInfo.value.realName,
  position: userInfo.value.position,
  componey: userInfo.value.componey,
  mobile: userInfo.value.phone,
  email: userInfo.value.email,
  address: userInfo.value.homeAddress,
  avatar: '',
})

const cardRef = ref<HTMLElement>()

// 保存名片为图片
async function saveCardAsImage() {
  try {
    if (!cardRef.value) {
      console.error('未找到卡片元素')
      return
    }

    try {
      const canvas = await html2canvas(cardRef.value, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2, // 提高图片质量
        width: cardRef.value.offsetWidth,
        height: cardRef.value.offsetHeight,
      })

      // 将 canvas 转换为 blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!)
        }, 'image/png')
      })

      // 创建临时地址
      const tempUrl = URL.createObjectURL(blob)

      // 使用临时地址下载文件
      ykt.downloadFile({
        fileUrl: tempUrl,
        fileName: `${dayjs().valueOf()}.png`,
      })

      // 下载完成后释放临时地址
      setTimeout(() => {
        URL.revokeObjectURL(tempUrl)
      }, 1000)
    }
    catch (error) {
      console.error('error:', error)
    }
  }
  catch (error) {
    console.error('保存名片失败:', error)
  }
}
</script>

<template>
  <div class="xymp">
    <div ref="cardRef" class="card">
      <div class="bg">
        <img src="@/assets/image/xymp/xymp.png" alt="">
      </div>
      <div class="content relative z-100">
        <div class="logo">
          <img class="w-100%" src="@/assets/image/code/fy-logo.png" alt="">
        </div>

        <div class="text">
          <img class="w-100%" src="@/assets/image/xymp/xymp-text.png" alt="">
        </div>

        <div class="info">
          <div class="flex items-center">
            <h1>{{ info.name }}</h1>
            <h2>{{ info.position }}</h2>
          </div>
          <p>{{ info.componey }}</p>
          <div class="bd" />
          <p class="small">
            电话：{{ info.mobile }}
          </p>
          <p class="small">
            邮箱：{{ info.email }}
          </p>
          <p class="small">
            地址：{{ info.address }}
          </p>

          <div class="avatar">
            <img class="w-100% h-100%" :src="userInfo.avatar || requireImage('image/code/default-avatar.png')" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="btn px-23 flex justify-around mt-30">
      <van-button type="primary" round class="min-w-144! text-16!" @click="saveCardAsImage">
        保存名片
      </van-button>
      <!-- <van-button type="primary" round plain class="min-w-144!  text-16!" @click="router.push('/xymp/form')">
        编辑名片
      </van-button> -->
    </div>
  </div>
</template>

<style scoped lang='less'>
  .xymp {
    min-height: 100vh;
    padding: 24px 0;
    overflow: hidden;
    background: linear-gradient( 180deg, #FFF 0%, #EDF2FE 100%);

    .card {
      position: relative;
    }

    .bg {
      z-index: 1;
      width: 360px;
      min-height: 272px;
      margin: 0 auto;

      img {
        display: block;
        width: 100%;
      }
    }

    .content {
      position: absolute;
      bottom: 14px;
      left: 50%;
      padding: 24px 20px;
      transform: translate(-50%, 0);

      .logo {
        width: 188px;
        // margin-left: 24px;
      }

      .text {
        position: absolute;
        top: 27px;
        right: 20px;
        width: 45px;
      }

      .info {
        position: relative;
        width: 300px;
        min-height: 158px;
        padding: 16px 12px;
        padding-bottom: 8px;
        margin: 0 auto;
        margin-top: 31px;
        background: #FFF;
        border-radius: 4px;
        box-shadow: 0 2px 10px 0 #2A50B5;

        >div {
          line-height: 1;

          h1 {
            font-size: 18px;
            font-weight: 500;
            line-height: 25px;
            color: rgb(0 0 0 / 84%);
          }

          h2 {
            margin: 0;
            margin-left: 10px;
            font-size: 14px;
            font-weight: 500;
            line-height: 1;
            color: rgb(0 0 0 / 84%);
          }
        }

        p {
          margin-top: 5px;
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: rgb(102 102 102 / 84%);
        }

        .avatar {
          position: absolute;
          top: -22px;
          right: 20px;
          width: 72px;
          height: 89px;
          padding: 6px;
          overflow: hidden;
          background: #FFF;
          border-radius: 9px;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .bd {
        width: 100%;
        height: 1px;
        margin-top: 12px;
        margin-bottom: 12px;
        border: 1px solid #f3f3f3;
      }

      p.small {
        font-size: 12px;
        font-weight: 400;
        line-height: 16px;
        color: rgb(0 0 0 / 85%);
      }
    }
  }
</style>
