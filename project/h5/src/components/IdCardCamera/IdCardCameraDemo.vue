<script setup lang='ts'>
import { showDialog } from 'vant'
import { ref } from 'vue'
import IdCardCamera from '@/components/IdCardCamera/index.vue'

const capturedImage = ref<string>('')
const showCamera = ref(false)

// 处理拍照结果
function handleCapture(file: File) {
  // 将文件转换为预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    capturedImage.value = e.target?.result as string
    showCamera.value = false

    // 显示拍照结果
    showDialog({
      title: '拍照成功',
      message: '身份证照片已拍摄完成',
      confirmButtonText: '确定',
    })
  }
  reader.readAsDataURL(file)
}

// 打开相机
function openCamera() {
  showCamera.value = true
}

// 关闭相机
function closeCamera() {
  showCamera.value = false
}
</script>

<template>
  <div class="demo-page">
    <div class="header">
      <h1>身份证拍照演示</h1>
      <p>点击下方按钮开始拍照</p>
    </div>

    <div class="content">
      <!-- 拍照按钮 -->
      <div class="camera-button" @click="openCamera">
        <div class="button-icon">
          📷
        </div>
        <span>开始拍照</span>
      </div>

      <!-- 拍照结果预览 -->
      <div v-if="capturedImage" class="preview-section">
        <h3>拍照结果</h3>
        <div class="image-preview">
          <img :src="capturedImage" alt="身份证照片">
        </div>
        <div class="preview-actions">
          <button class="action-btn" @click="openCamera">
            重新拍照
          </button>
          <button class="action-btn primary">
            确认使用
          </button>
        </div>
      </div>
    </div>

    <!-- 相机组件 -->
    <div v-if="showCamera" class="camera-modal">
      <div class="camera-header">
        <button class="close-btn" @click="closeCamera">
          ✕
        </button>
        <span>身份证拍照</span>
      </div>
      <IdCardCamera @capture="handleCapture" />
    </div>
  </div>
</template>

<style scoped lang='less'>


// 响应式设计
@media (width <= 768px) {
  .demo-page {
    padding: 15px;

    .header h1 {
      font-size: 24px;
    }

    .content {
      .camera-button {
        padding: 25px;

        .button-icon {
          font-size: 40px;
        }

        span {
          font-size: 16px;
        }
      }

      .preview-section {
        padding: 20px;

        .preview-actions {
          flex-direction: column;
          align-items: center;

          .action-btn {
            width: 100%;
            max-width: 200px;
          }
        }
      }
    }
  }
}

.demo-page {
  min-height: 100vh;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .header {
    margin-bottom: 40px;
    color: white;
    text-align: center;

    h1 {
      margin-bottom: 10px;
      font-size: 28px;
      font-weight: 600;
    }

    p {
      font-size: 16px;
      opacity: 0.9;
    }
  }

  .content {
    max-width: 600px;
    margin: 0 auto;

    .camera-button {
      padding: 30px;
      margin-bottom: 30px;
      text-align: center;
      cursor: pointer;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgb(0 0 0 / 20%);
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgb(0 0 0 / 30%);
      }

      .button-icon {
        margin-bottom: 15px;
        font-size: 48px;
      }

      span {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }

    .preview-section {
      padding: 30px;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgb(0 0 0 / 20%);

      h3 {
        margin-bottom: 20px;
        font-size: 20px;
        color: #333;
        text-align: center;
      }

      .image-preview {
        margin-bottom: 20px;
        text-align: center;

        img {
          max-width: 100%;
          max-height: 300px;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgb(0 0 0 / 10%);
        }
      }

      .preview-actions {
        display: flex;
        gap: 15px;
        justify-content: center;

        .action-btn {
          padding: 12px 24px;
          font-size: 16px;
          color: #666;
          cursor: pointer;
          background: white;
          border: 2px solid #ddd;
          border-radius: 25px;
          transition: all 0.3s ease;

          &:hover {
            color: #007aff;
            border-color: #007aff;
          }

          &.primary {
            color: white;
            background: #007aff;
            border-color: #007aff;

            &:hover {
              background: #0056cc;
              border-color: #0056cc;
            }
          }
        }
      }
    }
  }

  .camera-modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    width: 100%;
    height: 100%;
    background: black;

    .camera-header {
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      z-index: 1001;
      display: flex;
      height: 60px;
      font-size: 18px;
      font-weight: 600;
      color: white;
      background: rgb(0 0 0 / 80%);
      align-items: center;
      justify-content: center;

      .close-btn {
        position: absolute;
        left: 20px;
        padding: 10px;
        font-size: 24px;
        color: white;
        cursor: pointer;
        background: none;
        border: none;
        border-radius: 50%;
        transition: background 0.3s ease;

        &:hover {
          background: rgb(255 255 255 / 10%);
        }
      }
    }
  }
}
</style>
