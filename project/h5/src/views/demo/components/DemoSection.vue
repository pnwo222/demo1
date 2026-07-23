<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <section class="demo-section">
    <header class="demo-section__header">
      <h2>{{ title }}</h2>
      <p v-if="description">
        {{ description }}
      </p>
    </header>
    <div class="demo-section__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="less">
.demo-section {
  margin: 12px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #ebedf0;
  border-radius: 8px;

  &__header {
    padding: 16px 16px 12px;
    border-bottom: 1px solid #f2f3f5;

    h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
      color: #202020;
    }

    p {
      margin-top: 4px;
      font-size: 12px;
      line-height: 18px;
      color: #969799;
    }
  }

  &__body {
    padding: 16px;
  }
}
</style>
