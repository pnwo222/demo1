<script setup lang='ts'>
import type { PropType } from 'vue'

const props = defineProps({
  data: {
    default: () => {
      return {
        list: [],
        defaultData: [],
      }
    },
    type: Object as PropType<{
      list: {
        title: string
        id: number
        children: {
          title: string
          value: string
        }[]
      }[]
      defaultData: (number | string)[]
    }>,
  },
})

const emit = defineEmits(['confirm', 'close'])

const active = ref(1)
const rightSideRef = ref<HTMLElement>()

const checkdIds = ref<(number | string)[]>([])

watch(() => props.data.defaultData, (newVal) => {
  checkdIds.value = newVal
}, {
  immediate: true,
})

function handleLeftClick(itemId: number) {
  active.value = itemId

  nextTick(() => {
    const targetElement = rightSideRef.value?.querySelector(`[data-id="${itemId}"]`) as HTMLElement
    targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function handleCheck(value: string) {
  if (checkdIds.value.includes(value)) {
    checkdIds.value = checkdIds.value.filter(item => item !== value)
  }
  else {
    checkdIds.value.push(value)
  }
}

function handleConfirm() {
  console.log('confirm')
  emit('confirm', checkdIds.value)
  emit('close')
}

function reset() {
  checkdIds.value = []
}
</script>

<template>
  <div class="filter-box">
    <div class="box flex">
      <div class="left-side">
        <div v-for="item in data.list" :key="item.id" class="each" :class="{ active: active === item.id }" @click="handleLeftClick(item.id)">
          {{ item.title }}
        </div>
      </div>
      <div ref="rightSideRef" class="right-side">
        <div v-for="item in data.list" :key="item.id" class="right-side-item mb-24" :data-id="item.id">
          <h2>{{ item.title }}</h2>
          <div class="item-box mt-12 ml--4">
            <div v-for="child in item.children" :key="child.value" class="item" :class="{ active: checkdIds.includes(child.value) }" @click="handleCheck(child.value)">
              {{ child.title }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer flex items-center justify-between px-10 py-16">
      <van-button type="primary" plain round block class="mr-10! w-134!" @click="reset">
        重置
      </van-button>
      <van-button type="primary" block round @click="handleConfirm">
        确定
      </van-button>
    </div>
  </div>
</template>

<style scoped lang='less'>
  .filter-box {
    width: 100%;

    .box {
      min-height: 320px;
    }

    .left-side {
      width: 84px;
      height: 100%;
      height: 320px;
      background: #F4F8FF;
      flex-shrink: 0;
    }

    .right-side {
      height: 100%;
      height: 320px;
      padding: 10px;
      padding-right: 0;
      padding-left: 10px;
      overflow-y: auto;
      background: #fff;
      flex: 1;

      h2 {
        margin: 0;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        color: #333;
      }

      .item {
        display: inline-block;
        padding: 10px 18px;
        margin: 4px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #333;
        background: #F2F3F5;
        border-radius: 18px;

        &.active {
          font-size: 12px;
          font-weight: 400;
          color: #2D65F9;
          background: #EAEFFE;
        }
      }
    }

    .each {
      height: 44px;
      padding: 12px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: rgb(0 0 0 / 84%);

      &.active {
        color: #2D65F9;
        background: #FFF;
      }
    }
  }
</style>
