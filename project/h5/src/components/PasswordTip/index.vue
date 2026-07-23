<script setup lang="ts">
import { computed, watch } from 'vue'
import { getPwdConditions } from '@/utils'

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
})

const emits = defineEmits(['update:validate'])

const status = computed(() => {
  const status = getPwdConditions(props.value)
  if (status >= 3 && props.value.length >= 8) {
    return {
      color: '#83C64E',
      textColor: '#333333',
      text: '安全性良好！建议定期更换密码以保持账户安全。',
      week: 100,
      medium: 100,
      strong: 100,
    }
  }
  else if (status >= 2) {
    return {
      color: '#FFBC55',
      textColor: '#333333',
      text: '密码强度中等，建议修改',
      week: 100,
      medium: 100,
      strong: 0,
    }
  }
  else {
    return {
      color: '#DB372E',
      textColor: '#DB372E',
      text: '密码强度较弱，建议修改',
      week: 100,
      medium: 0,
      strong: 0,
    }
  }
})

watch(() => status.value, (val) => {
  if (val.strong === 100) {
    emits('update:validate', true)
  }
  else {
    emits('update:validate', false)
  }
})
</script>

<template>
  <div class="PasswordTip">
    <h2 :style="{ color: status?.textColor }">
      {{ status?.text }}
    </h2>
    <div class="w-100% flex items-center justify-between">
      <div class="w-100% mr-3">
        <div class="line-bg">
          <div class="line" :style="{ width: `${status?.week}%`, background: status?.color }" />
        </div>
        <p>弱</p>
      </div>
      <div class="w-100% mr-3">
        <div class="line-bg">
          <div class="line" :style="{ width: `${status?.medium}%`, background: status?.color }" />
        </div>
        <p>中等</p>
      </div>
      <div class="w-100%">
        <div class="line-bg">
          <div class="line" :style="{ width: `${status?.strong}%`, background: status?.color }" />
        </div>
        <p>强</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.PasswordTip {
  width: 100%;
  margin-top: 4px;
  margin-bottom: 12px;

  .line-bg {
    width: 100%;
    height: 6px;
    overflow: hidden;
    background: #D8D8D8;
    border-radius: 20px;

    .line {
      height: 6px;
      border-radius: 20px;
      transition: width 0.3s ease-in-out;
    }
  }

  p {
    margin-top: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: rgb(0 0 0 / 45%);
    text-align: center;
  }

  h2 {
    margin-bottom: 7px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #DA342B;
  }
}
</style>
