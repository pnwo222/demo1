<script setup lang='ts'>
// import VrSelect from '../VrSelect/index.vue'
// import { optionsMap } from './cache'
import dayjs from 'dayjs'
// import get from 'lodash-es/get'
import { unref } from 'vue'

defineOptions({
  name: 'OpenApiPicker',
})

const props = defineProps({
  props: {
    type: Object,
    default: () => {},
  },
  value: {
    type: Object,
    default: () => {},
  },
  show: {
    type: Boolean,
    default: false,
  },
  field: {
    type: String,
    default: '',
  },
  api: {
    type: Function,
    default: null,
  },
  type: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['confirm', 'close', 'ready', 'search'])

const selectedValues = ref()
const navType = ref(1)
const reload = ref(true)

watch(() => props.value?.value, (e) => {
  if (e && e[props.field]) {
    if (e[props.field] === '9999-12-31') {
      navType.value = 2
    }
    selectedValues.value = e[props.field].split('-')
  }
  else {
    selectedValues.value = [dayjs().format('YYYY'), dayjs().format('MM'), dayjs().format('DD')]
  }
}, {
  immediate: true,
  deep: true,
})

function confirm() {
  if (navType.value === 2) {
    selectedValues.value = ['9999', '12', '31']
  }
  emit('confirm', {
    selectedValues: selectedValues.value,
  })
  close()
}

function close() {
  emit('close')
}

function longTime() {
  navType.value = 2
}

function shortTime() {
  selectedValues.value = [dayjs().format('YYYY'), dayjs().format('MM'), dayjs().format('DD')]
  navType.value = 1
}

function refresh() {
  reload.value = false
  nextTick(() => {
    reload.value = true
  })
}

defineExpose({
  refresh,
})
</script>

<template>
  <div>
    <div v-if="show" class="date-time-picker relative" :class="[`pick-${type}`]">
      <div class="mask" @click="close" />
      <div class="date-time-picker-card">
        <div class="van-picker__toolbar bg-#fff">
          <button type="button" class="van-picker__cancel van-haptics-feedback" />
          <div class="van-picker__title van-ellipsis">
            {{ props.props.title }}
          </div>
          <button type="button" class="van-picker__confirm van-haptics-feedback" @click="close">
            <van-icon name="cross" color="#333" :size="18" />
          </button>
        </div>

        <div v-if="type === 2" class="options bg-#fff pl-10 flex mb--60 z-10 pb-16 relative">
          <div class="btn mr-16" :class="{ active: navType === 1 }" @click="shortTime">
            非长期有效
          </div>
          <div class="btn" :class="{ active: navType === 2 }" @click="longTime">
            长期
          </div>
        </div>

        <van-date-picker
          v-if="reload"
          v-show="navType === 1"
          v-model="selectedValues"
          :min-date="new Date(new Date().getFullYear() - 30, 0, 1)"
          :max-date="new Date(new Date().getFullYear() + 30, 11, 31)"
          title="选择日期"
          :show-toolbar="false"
          v-bind="unref(props.props)"
          class="pick-date mt--2"
        />
        <div v-show="navType !== 1" class="h-246" />

        <div class="pick-footer bg-#fff pt-20 relative z-10">
          <van-button type="primary" size="large" block round @click="confirm">
            确定
          </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.date-time-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 30000;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;

  &.pick-2 {
    .pick-date {
      margin-top: 20px;
      margin-bottom: -40px;
    }
  }

  .van-picker__toolbar {
    // margin-top: 2px;
    z-index: 100;
    border-radius: 12px 12px 0 0;
  }

  .pick-footer {
    padding-right: 24px;
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
    padding-left: 24px;
    margin-top: -2px;
  }

  .van-picker {
    // border-radius: 12px 12px 0 0;
  }

  .mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 50%);
  }

  .date-time-picker-card {
    @keyframes date-time-picker-card {
      from {
        transform: translate3d(0, 100%, 0);
      }

      to {
        transform: translate3d(0, 0, 0);
      }
    }

    position: relative;
    z-index: 100;
    background: #fff;
    border-radius: 12px 12px 0 0;
    animation: date-time-picker-card .3s ease-in-out;
  }

  .date-confirm {
    position: absolute;
    top: 12px;
    right: 0;
    right: 12px;
    z-index: 101;
    font-size: 14px;
    color: var(--van-blue);
  }

  .options {
    .btn {
      width: 88px;
      height: 36px;
      font-size: 12px;
      font-weight: 400;
      line-height: 36px;
      color: #333;
      text-align: center;
      background: #F2F3F5;
      border-radius: 18px;

      &.active {
        color: #216FF2;
        background: #EAEFFE;
      }
    }
  }
}
</style>
