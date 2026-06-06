<script setup lang="ts">
const milestones = [
  '商家浏览',
  '商品购物车',
  '订单预览',
  '支付履约'
]
</script>

<template>
  <main class="app-shell">
    <section class="phone-frame">
      <header class="hero">
        <p class="eyebrow">Food Delivery H5</p>
        <h1>外卖平台工程骨架</h1>
        <p>当前阶段仅完成 Vue 3 H5 工程落位，业务页面按 Feature Slice 后续实现。</p>
      </header>

      <section class="panel">
        <h2>下一批前端任务</h2>
        <ul>
          <li v-for="item in milestones" :key="item">{{ item }}</li>
        </ul>
      </section>
    </section>
  </main>
</template>
