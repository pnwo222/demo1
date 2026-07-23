<script setup lang='ts'>
defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<template>
  <div class="book-detail">
    <div v-if="data?.title" class="detail-item">
      <span class="label">题名</span>
      <span class="value">{{ data?.title }}</span>
    </div>
    <div v-if="data?.publisher" class="detail-item">
      <span class="label">出版社</span>
      <span class="value">{{ data?.publisher }}</span>
    </div>
    <div v-if="data?.publishYear" class="detail-item">
      <span class="label">出版日期</span>
      <span class="value">{{ data?.publishYear }}</span>
    </div>
    <div v-if="data?.barcode" class="detail-item">
      <span class="label">条号码</span>
      <span class="value">{{ data?.barcode }}</span>
    </div>
    <div v-if="data?.callNos" class="detail-item">
      <span class="label">索书号</span>
      <span class="value">{{ data?.callNos?.join(',') }}</span>
    </div>
    <div v-if="data?.isbn" class="detail-item">
      <span class="label">ISBN</span>
      <span class="value">{{ data?.isbn }}</span>
    </div>
    <div v-if="data?.locationName" class="detail-item">
      <span class="label">馆藏地</span>
      <span class="value">{{ data?.locationName }}</span>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .book-detail {
    width: 100%;
    padding: 8px 24px;

    .detail-item {
      display: flex;
      margin-bottom: 12px;
      font-size: 14px;
      // align-items: center;
      font-weight: 400;
      line-height: 1.4;
      color: #666;

      .label {
        min-width: 80px;
        font-weight: 500;
      }

      .value {
        flex: 1;
        margin-left: 16px;
        color: #333;
      }
    }
  }
</style>
