<script setup lang='ts'>
import { closeToast, showLoadingToast, showToast } from 'vant'
import { onMounted, onUnmounted, ref } from 'vue'
import { IdCardImageProcessor } from '@/utils/imageUtils'

interface Props {
  onCapture?: ({
    file,
    previewUrl,
  }: {
    file: File
    previewUrl: string
  }) => void
  enableCompression?: boolean
  type?: number
}

const props = withDefaults(defineProps<Props>(), {
  onCapture: undefined,
  enableCompression: true,
  type: 1, // 1人像 2国徽
})

const emit = defineEmits(['close', 'capture'])

// 相机相关状态
const videoRef = ref<HTMLVideoElement>()
const canvasRef = ref<HTMLCanvasElement>()
const stream = ref<MediaStream | null>(null)
const isCameraActive = ref(false)
const isCapturing = ref(false)

// 相机配置
const constraints = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    facingMode: 'environment', // 使用后置摄像头
  },
}

// 初始化相机
async function initCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia(constraints)
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      videoRef.value.play()
      isCameraActive.value = true
    }
  }
  catch (error) {
    console.error('相机初始化失败:', error)
    showToast('相机初始化失败，请检查相机权限')
  }
}

// 停止相机
function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  isCameraActive.value = false
}

// 拍照功能
async function capturePhoto() {
  if (!videoRef.value || !canvasRef.value || isCapturing.value) return

  isCapturing.value = true
  showLoadingToast({
    message: '正在处理图片...',
    forbidClick: true,
  })

  try {
    const video = videoRef.value
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      showToast('无法获取画布上下文')
      return
    }

    // 设置画布尺寸
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // 绘制视频帧到画布
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // 将画布内容转换为文件
    canvas.toBlob(async (blob) => {
      if (blob) {
        let file = new File([blob], `id-card-${Date.now()}.jpg`, {
          type: 'image/jpeg',
        })

        // 如果启用压缩，则处理图片
        if (props.enableCompression) {
          try {
            file = await IdCardImageProcessor.process(file)
          }
          catch (error) {
            console.error('图片处理失败:', error)
            showToast('图片处理失败，使用原始图片')
          }
        }

        closeToast()

        videoRef.value.pause()

        const s = setTimeout(() => {
          emit('capture', {
            file,
            previewUrl: URL.createObjectURL(file) as string,
          })
          clearTimeout(s)
        }, 600)
        // showToast('拍照成功')
      }
      else {
        closeToast()
        showToast('拍照失败')
      }
      isCapturing.value = false
    }, 'image/jpeg', 0.8)
  }
  catch (error) {
    closeToast()
    console.error('拍照失败:', error)
    showToast('拍照失败')
    isCapturing.value = false
  }
}

// 切换摄像头
async function switchCamera() {
  if (!stream.value) return

  // 停止当前摄像头
  stopCamera()

  // 切换摄像头配置
  const newConstraints = {
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: constraints.video.facingMode === 'environment' ? 'user' : 'environment',
    },
  }

  try {
    stream.value = await navigator.mediaDevices.getUserMedia(newConstraints)
    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      videoRef.value.play()
      isCameraActive.value = true
    }
    // 更新配置
    constraints.video.facingMode = newConstraints.video.facingMode
  }
  catch (error) {
    console.error('切换摄像头失败:', error)
    showToast('切换摄像头失败')
  }
}

// 组件挂载时初始化相机
onMounted(() => {
  initCamera()
})

// 组件卸载时停止相机
onUnmounted(() => {
  stopCamera()
})
</script>

<template>
  <div class="id-card-camera">
    <!-- 相机预览区域 -->
    <div class="camera-overlay">
      <video
        ref="videoRef"
        class="camera-video"
        autoplay
        muted
        playsinline
      />

      <!-- 人像框 -->
      <div class="portrait-frame">
        <img v-if="props.type === 1" src="@/assets/image/rx.png" class="w-98 h-128 rx" alt="">
        <img v-else-if="props.type === 2" src="@/assets/image/gh.png" class="w-75 h-80 gh" alt="">
      </div>

      <!-- 拍照说明 -->
      <div v-if="props.type === 1" class="capture-instructions">
        请将人像对准线框
      </div>
      <div v-if="props.type === 2" class="capture-instructions">
        请将国徽对准线框
      </div>
    </div>

    <!-- 控制按钮区域 -->
    <div class="controls-container">
      <!-- 切换摄像头按钮 -->
      <!-- <button
        class="switch-camera-btn"
        @click="switchCamera"
        :disabled="!isCameraActive"
      >
        <div class="switch-icon">🔄</div>
      </button> -->

      <!-- 拍照按钮 -->
      <div
        class="capture-button"
        :disabled="!isCameraActive || isCapturing"
        @click="capturePhoto"
      >
        <div class="capture-icon" />
      </div>
    </div>

    <!-- 隐藏的画布用于拍照 -->
    <canvas ref="canvasRef" style="display: none;" />

    <van-icon name="cross" :size="32" color="#fff" class="close-icon z-90 absolute top-20 right-20 opacity-70" @click="emit('close')" />
  </div>
</template>

<style scoped lang='less'>
.id-card-camera {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  width: 100%;
  height: 100%;
  // background: rgba(0,0,0,0.6);
  overflow: hidden;

  // 背景内容
  .background-content {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;

    .background-text {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 16px;
      color: #999;
      white-space: nowrap;
      opacity: 0.3;
      transform: translate(-50%, -50%);
      animation: float 3s ease-in-out infinite;
    }
  }

  // 相机覆盖层
  .camera-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 2;
    display: flex;
    width: 100%;
    height: 100%;
    // background: rgba(255, 255, 255, 0.1);
    border-radius: 0;
    transform: translate(-50%, -50%);
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // inset: 0;

    .camera-video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 20px;
    }

    // 人像框
    .portrait-frame {
      position: relative;
      z-index: 3;
      width: 295px;
      height: 180px;
      margin-bottom: 20px;
      background: rgb(0 0 0 / 30%);
      border-radius: 12px;
      box-shadow: rgb(0 0 0 / 80%) 0  0  0  100vh;

      .rx {
        position: absolute;
        top: 16px;
        right: 20px;
      }

      .gh {
        position: absolute;
        top: 16px;
        left: 20px;
      }
    }

    // 拍照说明
    .capture-instructions {
      position: relative;
      z-index: 3;
      padding: 8px 16px;
      font-size: 16px;
      color: #fff;
      text-align: center;
      text-shadow: 0 1px 2px rgb(0 0 0 / 50%);
      border-radius: 20px;
    }
  }

  // 控制按钮容器
  .controls-container {
    position: absolute;
    bottom: 50px;
    left: 50%;
    z-index: 3;
    display: flex;
    transform: translateX(-50%);
    align-items: center;
    gap: 40px;

    // 切换摄像头按钮
    .switch-camera-btn {
      display: flex;
      width: 50px;
      height: 50px;
      cursor: pointer;
      background: rgb(255 255 255 / 20%);
      border: none;
      border-radius: 50%;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgb(255 255 255 / 30%);
        transform: scale(1.1);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
        transform: none;
      }

      .switch-icon {
        font-size: 20px;
        color: white;
      }
    }

    // 拍照按钮
    .capture-button {
      display: flex;
      width: 64px;
      height: 64px;
      cursor: pointer;
      background: #fff;
      border: none;
      border-radius: 100%;
      transition: all 0.3s ease;
      align-items: center;
      justify-content: center;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 25px rgb(0 0 0 / 40%);
      }

      &:active {
        transform: scale(0.95);
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        transform: none;
      }

      .capture-icon {
        position: relative;
        width: 56px;
        height: 56px;
        margin: 0 auto;
        background: #fff;
        border: 2px solid #000;
        border-radius: 100%;
      }
    }
  }
}
</style>
