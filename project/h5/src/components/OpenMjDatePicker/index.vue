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
  field2: {
    type: String,
    default: '',
  },
  api: {
    type: Function,
    default: null,
  },
})

const emit = defineEmits(['confirm', 'close', 'ready', 'search'])

const selectedValues = ref()
const selectedValues2 = ref()
const navType = ref(1)

watch(() => props.value?.value, (e) => {
  if (e && e[props.field]) {
    selectedValues.value = e[props.field].split('-')
  }
  else {
    selectedValues.value = [dayjs().format('YYYY'), dayjs().format('MM'), dayjs().format('DD')]
  }

  if (e && e[props.field2]) {
    selectedValues2.value = e[props.field2].split('-')
  }
  else {
    selectedValues2.value = [dayjs().format('YYYY'), dayjs().format('MM'), dayjs().format('DD')]
  }
}, {
  immediate: true,
  deep: true,
})

function confirm() {
  emit('confirm', {
    selectedValues: selectedValues.value,
    selectedValues2: selectedValues2.value,
  })
  close()
}

function close() {
  emit('close')
}

function setDate(type: number) {
  if (type === 1) {
    const date = dayjs().subtract(7, 'day')
    selectedValues.value = [date.format('YYYY'), date.format('MM'), date.format('DD')]
    selectedValues2.value = [dayjs().format('YYYY'), dayjs().format('MM'), dayjs().format('DD')]
  }
  else if (type === 2) {
    const date = dayjs().subtract(1, 'month')
    selectedValues.value = [date.format('YYYY'), date.format('MM'), date.format('DD')]
    selectedValues2.value = [dayjs().format('YYYY'), dayjs().format('MM'), dayjs().format('DD')]
  }
  else if (type === 3) {
    const date = dayjs().subtract(3, 'month')
    selectedValues.value = [date.format('YYYY'), date.format('MM'), date.format('DD')]
    selectedValues2.value = [dayjs().format('YYYY'), dayjs().format('MM'), dayjs().format('DD')]
  }

  navType.value = type
}
</script>

<template>
  <div>
    <div v-if="show" class="date-time-picker relative pick-2">
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

        <div class="pl-10">
          <div class="color-333 text-14 mb-12">
            记录时间
          </div>
          <div class="options bg-#fff flex z-10 pb-16 relative">
            <div class="btn mr-16" :class="{ active: navType === 1 }" @click="setDate(1)">
              近一周
            </div>
            <div class="btn mr-16" :class="{ active: navType === 2 }" @click="setDate(2)">
              近一月
            </div>
            <div class="btn" :class="{ active: navType === 3 }" @click="setDate(3)">
              近三月
            </div>
          </div>
        </div>

        <div class="pl-10 mb--40">
          <div class="color-333 text-14 mb-12">
            自定义时间
          </div>
          <div class="options bg-#fff flex items-center z-10 pb-16 relative">
            <div class="btn btn2 mr-16" :class="{ active: navType === 4 }" @click="setDate(4)">
              {{ selectedValues.join('-') }}
            </div>
            <span class="color-#ccc">─</span>
            <div class="btn btn2 ml-16" :class="{ active: navType === 5 }" @click="setDate(5)">
              {{ selectedValues2.join('-') }}
            </div>
          </div>
        </div>

        <van-date-picker
          v-if="navType === 4"
          v-model="selectedValues"
          :min-date="new Date(new Date().getFullYear() - 30, 0, 1)"
          :max-date="new Date(new Date().getFullYear() + 30, 11, 31)"
          title="选择日期"
          :show-toolbar="false"
          v-bind="unref(props.props)"
          class="pick-date mt--2"
        />

        <van-date-picker
          v-if="navType === 5"
          v-model="selectedValues2"
          :min-date="new Date(new Date().getFullYear() - 30, 0, 1)"
          :max-date="new Date(new Date().getFullYear() + 30, 11, 31)"
          title="选择日期"
          :show-toolbar="false"
          v-bind="unref(props.props)"
          class="pick-date mt--2"
        />

        <div v-show="[1, 2, 3].includes(navType)" class="h-246" />

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

  &.pick-2, &.pick-3 {
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

      &.btn2 {
        width: 120px;
      }

      &.active {
        color: #216FF2;
        background: #EAEFFE;
      }
    }
  }
}
</style>
