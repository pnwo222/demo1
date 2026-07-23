<script setup lang='ts'>
import get from 'lodash-es/get'
import { showToast } from 'vant'
import { unref } from 'vue'
// import VrSelect from '../VrSelect/index.vue'
import { optionsMap } from './cache'

// if (props.value?.value) {
//   selectedValues.value = [props.value.value[props.field]]
// } else {
//   selectedValues.value = [props.value[props.field]]
// }

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
  resultField: {
    type: String,
    default: '',
  },
  labelField: {
    type: String,
    default: '',
  },
  valueField: {
    type: String,
    default: '',
  },
  formatData: {
    type: Function,
    default: null,
  },
  showSearch: {
    type: Boolean,
    default: false,
  },
  searchKeyField: {
    type: String,
    default: 'name',
  },
  showLabelField: {
    type: String,
    default: '',
  },
  filter: {
    type: Boolean,
    default: false,
  },
  autoFetch: {
    type: Boolean,
    default: true,
  },
  emptyText: {
    type: String,
    default: '',
  },
  requiredSearchKeyword: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['confirm', 'close', 'ready', 'search'])

const keyword = ref('')

const columns = ref()
const selectedValues = ref()

watch(() => props.value?.value, (e) => {
  if (e) {
    selectedValues.value = [e[props.field]]
  }
}, {
  immediate: true,
  deep: true,
})

function confirm(v) {
  emit('confirm', {
    ...v,
  })
  close()
}

function close() {
  emit('close')
}

function formatResData(res) {
  let d = []

  if (props.formatData) {
    d = props.formatData(res)
  }
  else {
    d = (props.resultField ? get(res, props.resultField) : res)?.map((e) => {
      return {
        ...e,
        text: get(e, props.labelField),
        value: get(e, props.valueField),
      }
    })
  }

  return d
}

if (props.api && props.autoFetch) {
  if (optionsMap.get(props.field)) {
    columns.value = optionsMap.get(props.field)
    emit('ready', columns.value)
  }
  else {
    props.api({
      size: 30,
    }).then((res) => {
      columns.value = formatResData(res)
      optionsMap.set(props.field, columns.value)
      emit('ready', columns.value)
    })
  }
}

const searchLoading = ref(false)
const isSearched = ref(false)

function search() {
  if (!props.filter) {
    // if (props.requiredSearchKeyword) {
    //   if (!keyword.value) {
    //     showToast('请输入搜索关键字')
    //     return
    //   }
    // }
    isSearched.value = true
    const s = setTimeout(() => {
      searchLoading.value = true
    }, 300)
    props.api && props.api({
      [props.searchKeyField]: keyword.value,
      size: 100,
    }).then((res) => {
      columns.value = formatResData(res)
    }).finally(() => {
      searchLoading.value = false
      clearTimeout(s)
    })
  }

  emit('search', keyword.value)
}

watch(() => props.props?.columns, (e) => {
  if (e?.value) {
    columns.value = e.value
  }
  else if (e) {
    columns.value = e
  }

  if (props.showLabelField && columns.value) {
    console.log('[watch]', props.showLabelField, columns.value)
    // eslint-disable-next-line
    props.value.value[props.showLabelField] = columns.value.find(e => e.value == props.value.value[props.field])?.text || ''
  }
}, {
  deep: true,
  immediate: true,
})

const columnsFormat = computed(() => {
  if (props.filter) {
    return columns.value.filter(e => e.text.includes(keyword.value))
  }
  return columns.value
})

defineExpose({
  columns,
})
</script>

<template>
  <div>
    <div v-if="show" class="date-time-picker relative">
      <div class="mask" @click="close" />
      <div class="date-time-picker-card">
        <div v-if="!columnsFormat?.length && emptyText && !isSearched" class="empty-data">
          {{ props.emptyText }}
        </div>
        <van-picker
          v-model="selectedValues"
          v-bind="unref(props.props)"
          :columns="columnsFormat"
          @confirm="confirm"
          @cancel="close"
        >
          <template #columns-top>
            <van-search v-if="showSearch" v-model="keyword" shape="round" show-action placeholder="请输入搜索关键词" @blur="search">
              <template #action>
                <div class="flex items-center" @click="search">
                  <van-loading v-if="searchLoading" size="16" color="#1989fa" /> <span v-else class="text-#000">搜索</span>
                </div>
              </template>
            </van-search>
          </template>
        </van-picker>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.date-time-picker {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1900;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 100%;
  height: 100%;

  .van-picker {
    border-radius: 12px 12px 0 0;
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

  .empty-data {
    position: absolute;
    top: 50%;
    z-index: 999;
    width: 100%;
    font-size: 14px;
    color: #ccc;
    text-align: center;
  }
}
</style>
