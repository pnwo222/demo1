<script setup lang="ts">
import { sendErrorAnalytics } from '@/hooks/events/useAnalytics'

// 1. 模拟 JavaScript 运行时错误
function simulateJSError() {
  console.log('模拟 JavaScript 运行时错误...')
  // @ts-expect-error - 故意访问未定义变量来模拟错误
  console.log(undefinedVariable.someProperty)
}

// 2. 模拟 Promise 拒绝
function simulatePromiseRejection() {
  console.log('模拟 Promise 拒绝...')
  Promise.reject(new Error('这是一个模拟的 Promise 拒绝错误'))
}

// 3. 模拟异步错误
function simulateAsyncError() {
  console.log('模拟异步错误...')
  setTimeout(() => {
    throw new Error('这是一个模拟的异步错误')
  }, 1000)
}

// 4. 模拟资源加载错误
function simulateResourceError() {
  console.log('模拟资源加载错误...')
  const img = new Image()
  img.src = 'https://nonexistent-domain.com/nonexistent-image.jpg'
  // 不设置 onerror 回调，让错误事件冒泡到 window 级别被捕获
  // 或者设置回调但不阻止默认行为
  img.onerror = () => {
    console.log('图片加载失败，这会被错误追踪捕获')
    // 不调用 event.preventDefault() 或 return false，让事件继续冒泡
  }
}

// 5. 模拟网络请求错误
function simulateNetworkError() {
  console.log('模拟网络请求错误...')
  fetch('https://nonexistent-api.com/data')
    .then(response => response.json())
}

// 6. 模拟对象错误
function simulateObjectError() {
  console.log('模拟对象错误...')
  const obj: any = null
  obj.someMethod()
}

// 7. 模拟类型错误
function simulateTypeError() {
  console.log('模拟类型错误...')

  // 方法1：在 Vue 组件中抛出错误，会被 app.config.errorHandler 捕获
  const str = 'hello'
  // 故意调用不存在的方法来模拟错误
  ;(str as any).push('world')
}

// 8. 模拟自定义错误
function simulateCustomError() {
  console.log('模拟自定义错误...')
  const customError = new Error('这是一个自定义错误')
  ;(customError as any).customProperty = 'custom value'
  ;(customError as any).errorCode = 'CUSTOM_001'
  ;(customError as any).userId = 'user123'
}
</script>

<template>
  <div class="error-simulator-panel">
    <h3>错误模拟控制面板</h3>
    <div class="button-group">
      <van-button
        type="primary"
        size="small"
        @click="simulateJSError"
      >
        JS 运行时错误
      </van-button>
      <van-button
        type="warning"
        size="small"
        @click="simulatePromiseRejection"
      >
        Promise 拒绝
      </van-button>
      <van-button
        type="danger"
        size="small"
        @click="simulateAsyncError"
      >
        异步错误
      </van-button>
      <van-button
        type="info"
        size="small"
        @click="simulateResourceError"
      >
        资源加载错误
      </van-button>
      <van-button
        type="primary"
        size="small"
        @click="simulateNetworkError"
      >
        网络请求错误
      </van-button>
      <van-button
        type="warning"
        size="small"
        @click="simulateObjectError"
      >
        对象错误
      </van-button>
      <van-button
        type="danger"
        size="small"
        @click="simulateTypeError"
      >
        类型错误
      </van-button>
      <van-button
        type="info"
        size="small"
        @click="simulateCustomError"
      >
        自定义错误
      </van-button>
    </div>
    <div class="info">
      <p>点击按钮模拟不同类型的错误，查看控制台和网络面板中的错误追踪数据</p>
    </div>
  </div>
</template>

<style lang="less" scoped>
// // 响应式设计
// @media (width <= 768px) {
//   .error-simulator-panel {
//     position: fixed;
//     inset: auto 10px 10px;
//     max-width: none;

//     .button-group {
//       grid-template-columns: 1fr 1fr 1fr 1fr;
//     }
//   }
// }

.error-simulator-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
  max-width: 300px;
  padding: 15px;
  font-size: 12px;
  color: white;
  background: rgb(0 0 0 / 80%);
  border-radius: 8px;

  h3 {
    margin: 0 0 10px;
    font-size: 14px;
    color: #ff6b6b;
  }

  .button-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 10px;

    .van-button {
      padding: 4px 8px;
      font-size: 11px;
    }
  }

  .info {
    p {
      margin: 0;
      font-size: 11px;
      line-height: 1.4;
      color: #ccc;
    }
  }
}
</style>
