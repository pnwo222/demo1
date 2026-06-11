<script setup lang="ts">
import { coreJourney, launchReadiness, qualityGates } from './mock/launchPlan'
</script>

<template>
  <main class="app-shell">
    <section class="phone-frame">
      <header class="hero">
        <p class="eyebrow">Food Delivery H5</p>
        <h1>外卖平台工程骨架</h1>
        <p>基于需求文档维护前端 mock 数据，在后端接口接入前展示主链路、角色边界和质量门禁。</p>
      </header>

      <section class="panel">
        <h2>核心点餐链路</h2>
        <ol class="journey-list">
          <li v-for="item in coreJourney" :key="item">{{ item }}</li>
        </ol>
      </section>

      <section class="readiness-list" aria-label="上线准备状态">
        <article v-for="item in launchReadiness" :key="item.title" class="readiness-item">
          <div>
            <h2>{{ item.title }}</h2>
            <p>{{ item.description }}</p>
          </div>
          <span>{{ item.status }}</span>
        </article>
      </section>

      <section class="panel compact">
        <h2>提交前门禁</h2>
        <ul>
          <li v-for="item in qualityGates" :key="item">{{ item }}</li>
        </ul>
      </section>
    </section>
  </main>
</template>
