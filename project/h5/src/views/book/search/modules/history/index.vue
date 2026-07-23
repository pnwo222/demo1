<script setup lang='ts'>
import { showConfirmDialog } from 'vant'
import { useHistory } from './hooks'

const emit = defineEmits(['search'])

const { list, hasHistory, clear } = useHistory()

function clearConfirm() {
  showConfirmDialog({
    title: '提示',
    message: '确定要清空检索历史吗？',
  }).then(() => {
    clear()
  }).catch(() => {
    console.log('取消')
  })
}
</script>

<template>
  <div class="his">
    <div v-if="hasHistory" class="header flex items-center justify-between">
      检索历史
      <svg-icon name="delete" :size="20" color="#4E5969" @click="clearConfirm" />
    </div>
    <div class="list">
      <div v-for="item in list" :key="item.value" class="item" @click="emit('search', item.value, item.type)">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .his {
    width: 100%;

    .header {
      font-size: 15px;
      font-weight: 500;
      line-height: 21px;
      color: #333;
    }

    .list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 16px;

      .item {
        padding: 5px 16px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        background: #FFF;
        border-radius: 4px;
        gap: 8px;
      }
    }
  }
</style>
