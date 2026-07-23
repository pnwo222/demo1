<script setup lang="ts">
import IdCardCamera from '@/components/IdCardCamera/index.vue'
import DemoSection from './DemoSection.vue'

const showCamera = ref(false)
const capturedImage = ref('')

function handleCapture(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    capturedImage.value = String(reader.result)
    showCamera.value = false
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <DemoSection title="设备能力" description="身份证拍摄需要浏览器相机权限，建议使用 HTTPS 或 localhost 在移动设备上验证。">
    <van-cell-group inset>
      <van-cell title="身份证拍摄" label="调用项目 IdCardCamera 组件" is-link @click="showCamera = true" />
    </van-cell-group>
    <van-image
      v-if="capturedImage"
      class="captured-image"
      :src="capturedImage"
      fit="cover"
      radius="8"
    />

    <div v-if="showCamera" class="camera-layer">
      <van-nav-bar title="身份证拍摄" left-arrow @click-left="showCamera = false" />
      <IdCardCamera @capture="handleCapture" />
    </div>
  </DemoSection>
</template>

<style scoped lang="less">
.captured-image {
  width: 100%;
  height: 180px;
  margin-top: 16px;
}

.camera-layer {
  position: fixed;
  inset: 0;
  z-index: 31000;
  background: #000;
}
</style>
