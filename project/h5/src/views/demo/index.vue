<script setup lang="ts">
import FeedbackDemo from './components/FeedbackDemo.vue'
import FormDemo from './components/FormDemo.vue'
import FoundationDemo from './components/FoundationDemo.vue'
import NativeCapabilityDemo from './components/NativeCapabilityDemo.vue'
import PickerDemo from './components/PickerDemo.vue'

const activeTab = ref(0)
const tabs = ['基础', '表单', '选择器', '反馈', '设备能力']
const sectionIds = ['foundation', 'form', 'picker', 'feedback', 'native']

function scrollToSection(index: number) {
  activeTab.value = index
  document.getElementById(sectionIds[index])?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <div class="demo-page">
    <header class="demo-hero">
      <div class="demo-hero__mark">
        H5
      </div>
      <div>
        <h1>移动端组件演示</h1>
        <p>Vue 3 · Vite · Vant · 项目封装组件</p>
      </div>
    </header>

    <van-tabs
      v-model:active="activeTab"
      sticky
      shrink
      @click-tab="({ name }) => scrollToSection(Number(name))"
    >
      <van-tab v-for="tab in tabs" :key="tab" :title="tab" />
    </van-tabs>

    <main>
      <div id="foundation" class="section-anchor">
        <FoundationDemo />
      </div>
      <div id="form" class="section-anchor">
        <FormDemo />
      </div>
      <div id="picker" class="section-anchor">
        <PickerDemo />
      </div>
      <div id="feedback" class="section-anchor">
        <FeedbackDemo />
      </div>
      <div id="native" class="section-anchor">
        <NativeCapabilityDemo />
      </div>
    </main>

    <footer class="demo-footer">
      当前页面不装载业务路由，也不执行登录或权限认证。
    </footer>
  </div>
</template>

<style scoped lang="less">
.demo-page {
  min-height: 100vh;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
  background: #f7f8fa;
}

.demo-hero {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 20px 16px 16px;
  color: #fff;
  background: #163a76;

  &__mark {
    display: grid;
    width: 44px;
    height: 44px;
    font-size: 15px;
    font-weight: 700;
    background: #2d65f0;
    border: 1px solid rgb(255 255 255 / 35%);
    border-radius: 8px;
    place-items: center;
  }

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    color: #fff;
  }

  p {
    margin-top: 2px;
    font-size: 12px;
    line-height: 18px;
    color: rgb(255 255 255 / 72%);
  }
}

.section-anchor {
  scroll-margin-top: 52px;
}

.demo-footer {
  padding: 8px 16px 20px;
  font-size: 12px;
  line-height: 18px;
  color: #969799;
  text-align: center;
}
</style>
