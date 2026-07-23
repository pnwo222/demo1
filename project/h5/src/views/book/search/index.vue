<script setup lang='ts'>
import { createApiPicker } from '@/components/OpenApiPicker'
import { typeList } from './data'
import { useSearch } from './hooks'
import History from './modules/history/index.vue'

const { form, search } = useSearch()

const { open } = createApiPicker({
  value: form,
  field: 'type',
  showLabelField: '_type',
  props: {
    title: '检索类型',
    columns: typeList,
  },
})
</script>

<template>
  <div class="search-book">
    <div class="s-card">
      <div class="form flex items-center">
        <div class="select flex items-center" @click="open">
          {{ form._type }}
          <svg-icon class="ml-2" name="down" :size="10" color="#97A0B4" />
        </div>
        <div class="bd" />
        <div class="input flex items-center">
          <svg-icon name="search" :size="16" color="#2D65F9" />
          <input v-model="form.name" type="text" placeholder="请输入检索内容">
        </div>
      </div>
      <div class="bdb" />

      <van-button type="primary" round block :disabled="!form.name" @click="search()">
        检索
      </van-button>
    </div>
    <div class="px-10 mt-24">
      <History @search="search" />
    </div>
  </div>
</template>

<style scoped lang='less'>
  .search-book {
    width: 100%;
    padding-top: 10px;

    .s-card {
      width: 355px;
      height: 150px;
      padding: 18px 14px;
      margin: 0 auto;
      background: #FFF;
      border-radius: 8px;
      box-shadow: 0 4px 4px 0 rgb(114 121 140 / 6%);
    }

    .select {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      color: #333;
    }

    .bd {
      width: 1px;
      height: 18px;
      margin: 0 12px;
      border-right: 1px solid #E7E7E7;
    }

    .input {
      input {
        height: 32px;
        margin-left: 6px;
        font-size: 14px;
        font-weight: 400;
        line-height: 32px;
        color: #333;
        border: none;
        outline: none;

        &::placeholder {
          color: #999;
        }
      }
    }

    .bdb {
      height: 1px;
      margin-top: 18px;
      margin-bottom: 18px;
      border-bottom: 1px solid #E7E7E7;
    }
  }
</style>
