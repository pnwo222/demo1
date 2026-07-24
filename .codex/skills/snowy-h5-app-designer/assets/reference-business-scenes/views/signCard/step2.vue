<script setup lang='ts'>
import { showLoadingToast, showToast } from 'vant'
import { uploadApi } from '@/api/upload'
import { applySbCard } from '@/api/user/user'
import CircleProgress from '@/components/CircleProgress/index.vue'
import { useChooseImage } from '@/hooks/events/useChooseImage'
import { useStorage } from '@/hooks/system/useStorage'
import { useUserInfo } from '@/hooks/system/useUser'
import router from '@/router'

const signCardInfo = useStorage.ss.get('signCardInfo')

const { userInfo } = useUserInfo()

const loading1 = ref(0)
const success1 = ref(false)
const loading2 = ref(0)
const success2 = ref(false)
const loading3 = ref(0)
const success3 = ref(false)

const form = ref({
  oneInchPic: '',
  idCardFrontPic: '',
  idCardBackPic: '',
  postalCode: '315211',
  ...signCardInfo,
})

const showCamera = ref(false)
const cameraType = ref(1)
const disabled = computed(() => {
  return !form.value.oneInchPic || !form.value.idCardFrontPic || !form.value.idCardBackPic
})

// 一寸照
const [state, { chooseImage }] = useChooseImage({
  maxCount: 1,
}, {
  onBeforeChoose: () => {
    success1.value = false
    loading1.value = 20
    form.value.oneInchPic = ''
  },
  onChangeFile: (images) => {
    const file = images[0].compressedFile
    uploadApi({
      file,
      name: 'file',
    }, (progress) => {
      const p = progress.progress * 100
      loading1.value = Math.max(p, 10) >= 90 ? 90 : p
    }).then((res) => {
      form.value.oneInchPic = res.data
      success1.value = true
      loading1.value = 100
    })
  },
})

// 身份证正面
const [state2, { chooseImage: chooseImage2 }] = useChooseImage({
  maxCount: 1,
}, {
  onBeforeChoose: () => {
    success2.value = false
    loading2.value = 20
    form.value.idCardFrontPic = ''
  },
  onChangeFile: (images) => {
    const file = images[0].compressedFile
    uploadApi({
      file,
      name: 'file',
    }, (progress) => {
      const p = progress.progress * 100
      loading2.value = Math.max(p, 10) >= 90 ? 90 : p
    }).then((res) => {
      form.value.idCardFrontPic = res.data
      success2.value = true
      loading2.value = 100
    })
  },
})

// 身份证背面
const [state3, { chooseImage: chooseImage3 }] = useChooseImage({
  maxCount: 1,
}, {
  onBeforeChoose: () => {
    success3.value = false
    loading3.value = 20
    form.value.idCardBackPic = ''
  },
  onChangeFile: (images) => {
    const file = images[0].compressedFile
    uploadApi({
      file,
      name: 'file',
    }, (progress) => {
      const p = progress.progress * 100
      loading3.value = Math.max(p, 10) >= 90 ? 90 : p
    }).then((res) => {
      form.value.idCardBackPic = res.data
      success3.value = true
      loading3.value = 100
    })
  },
})

const isLoading = ref(false)

// watch(() => state.value.images, (val) => {
//   if (val?.length) {
//     console.log('[val]', val)
//     success1.value = false
//     uploadApi({
//       file: val[0].file,
//       name: 'file',
//     }, (progress) => {
//       loading1.value = progress.progress * 100 >= 90 ? 90 : progress.progress * 100
//       console.log('[loading1.value]', loading1.value)
//     }).then((res) => {
//       form.value.oneInchPic = res.data
//       success1.value = true
//       loading1.value = 100
//       console.log('[form.value.oneInchPic]', form.value.oneInchPic)
//     })
//   }
// })

// function handleCapture(e) {
//   console.log('[handleCapture]]', e)
//   if (cameraType.value == 1) {
//     uploadApi({
//       file: e.file,
//       name: 'file',
//     }).then((res) => {
//       form.value.idCardFrontPic = res.data
//       // form.value.idCardFrontPic = e.previewUrl
//       console.log('[form.value.idCardFrontPic]', form.value.idCardFrontPic)
//     })
//   }
//   if (cameraType.value == 2) {
//     uploadApi({
//       file: e.file,
//       name: 'file',
//     }).then((res) => {
//       form.value.idCardBackPic = res.data
//       // form.value.idCardBackPic = e.previewUrl
//       console.log('[form.value.idCardBackPic]', form.value.idCardBackPic)
//     })
//   }
//   showCamera.value = false
// }

// function openCamera(type: number) {
//   cameraType.value = type
//   showCamera.value = true
// }

function handleSubmit() {
  if (isLoading.value) {
    return
  }

  if (!form.value.oneInchPic) {
    showToast('请上传一寸照')
    return
  }
  if (!form.value.idCardFrontPic) {
    showToast('请上传人像面')
    return
  }
  if (!form.value.idCardBackPic) {
    showToast('请上传国徽面')
    return
  }

  const loading = showLoadingToast({
    message: '请稍后...',
    duration: 0,
  })

  isLoading.value = true
  applySbCard(form.value).then(() => {
    router.push('/sign-card/result')
  }).finally(() => {
    loading.close()
    isLoading.value = false
  })
  // router.push('/sign-card/result')
}
</script>

<template>
  <div class="step2 pt-10 f-cell pb-60">
    <van-cell-group inset title="材料上传">
      <div class="msg">
        <h1>一寸证件照</h1>
        <p>照片要求：白色底，免冠正面照。露出五官，不化妆不美颜。规格为358像素（宽）×441像素（高），分辨率350dpi。</p>

        <div class="card m-auto mt-36">
          <div class="avatar" @click="chooseImage">
            <img v-if="state.images[0]?.previewUrl || form.oneInchPic" style="object-fit: cover;" :src="state.images[0]?.previewUrl || form.oneInchPic" alt="avatar">
            <img v-else src="@/assets/image/signCard/man@2x.png" alt="avatar">
            <img :class="[(state.images[0]?.previewUrl || form.oneInchPic) ? 'opacity-70' : 'opacity-100']" class="camera" src="@/assets/image/signCard/camera.png">
            <div v-if="loading1" class="loading mt-4 flex items-center">
              <van-progress class="w-100%" :percentage="loading1" track-color="#ddd" :show-pivot="false" :color="success1 ? 'var(--van-green)' : '#1989FA'" />
              <!-- <van-icon v-if="success1" size="8" name="success" color="var(--van-green)" /> -->
            </div>
            <!-- <van-circle v-model:current-rate="loading1" :rate="loading1 ? 100 : 0" class="loading" :color="success1 ? 'var(--van-green)' : '#1989FA'" /> -->
          </div>
        </div>

        <h1 class="mt-56">
          身份证的正反面
        </h1>
        <div class="sfz mt-8 flex justify-between">
          <div>
            <div class="w-132 h-85 m-auto relative" @click="chooseImage2">
              <img v-if="state2.images[0]?.previewUrl || form.idCardFrontPic" style="object-fit: cover;" class="w-132 h-85" :src="state2.images[0]?.previewUrl || form.idCardFrontPic">
              <img v-else class="w-132 h-85" src="@/assets/image/signCard/card-front@2x.png">
              <img class="camera camera-small" src="@/assets/image/signCard/camera.png">

              <div v-if="loading2" class="loading mt-4">
                <van-progress class="w-100%" :percentage="loading2" track-color="#ddd" :show-pivot="false" :color="success2 ? 'var(--van-green)' : '#1989FA'" />
                <!-- <van-icon v-if="success2" class="translate-y--2" size="12" name="checked" color="var(--van-green)" /> -->
              </div>

              <p class="color-#333! text-center mt-13!">
                上传人像面
              </p>
            </div>
          </div>
          <div>
            <div class="w-132 h-85 m-auto relative" @click="chooseImage3">
              <img v-if="state3.images[0]?.previewUrl || form.idCardBackPic" style="object-fit: cover;" class="w-132 h-85" :src="state3.images[0]?.previewUrl || form.idCardBackPic">
              <img v-else class="w-132 h-85" src="@/assets/image/signCard/card-back@2x.png">
              <img class="camera camera-small" src="@/assets/image/signCard/camera.png">

              <div v-if="loading3" class="loading mt-4">
                <van-progress class="w-100%" :percentage="loading3" track-color="#ddd" :show-pivot="false" :color="success3 ? 'var(--van-green)' : '#1989FA'" />
                <!-- <van-icon v-if="success3" class="translate-y--2" size="12" name="checked" color="var(--van-green)" /> -->
              </div>

              <p class="color-#333! text-center mt-13!">
                上传国徽面
              </p>
            </div>
          </div>
        </div>

        <h1 class="mt-16 color-#666! text-14!">
          拍摄须知
        </h1>
        <div class="mt-4">
          <img class="w-100%" src="@/assets/image/signCard/tips@2x.png" alt="">
        </div>
      </div>
    </van-cell-group>

    <div class="mt-18 flex justify-between px-12">
      <van-button type="primary" round plain class="w-144 h-44! bg-transparent! mr-10!" @click="router.back()">
        上一步
      </van-button>
      <van-button type="primary" round class="w-198 h-44!" :disabled="disabled" @click="handleSubmit">
        立即提交
      </van-button>
    </div>

    <!-- <IdCardCamera v-if="showCamera" :type="cameraType" @capture="handleCapture" @close="showCamera = false" /> -->
  </div>
</template>

<style scoped lang='less'>
  .step2 {
    img {
      display: block;
    }

    .msg {
      padding: 14px 12px;
      background: #fff;
      border-radius: 8px;

      h1 {
        font-size: 16px;
        font-weight: 500;
        line-height: 22px;
        color: #333;
      }

      p {
        margin-top: 4px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #999;
      }

      .card {
        .avatar {
          position: relative;
          width: 108px;
          margin: 0 auto;

          img {
            width: 108px;
            height: 133px;
            object-fit: cover;
          }

          .camera {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 54px;
            height: 54px;
            transform: translate(-50%, -50%);
          }
        }
      }
    }

    .sfz {
      >div {
        position: relative;
        width: 156px;
        height: 144px;
        padding: 14px 12px;
        border: 1px solid #EBECEF;

        .camera-small {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 36px;
          height: 36px;
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  .loading {
    position: absolute;
    top: 100%;
    left: 0%;
    z-index: 200;
    width: 100%;
    text-align: center;
    // transform: translate(-50%, -50%);
  }
</style>
