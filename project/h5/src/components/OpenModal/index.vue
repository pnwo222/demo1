<script setup lang='ts'>
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  content: {
    type: [Object, Function] as unknown as any,
    default: null,
  },
  style: {
    type: Object,
    default: () => {},
  },
  title: {
    type: String,
    default: '',
  },
  closeIcon: {
    type: String,
    default: 'guanbi',
  },
  show: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: () => {},
  },
})

const emit = defineEmits(['close', 'confirm'])

let html = null

const handle = ref<HTMLElement | null>(null)
const OpenModalRef = ref<HTMLElement | null>(null)

if (typeof props.content === 'function') {
  html = defineAsyncComponent(props.content)
}
else {
  html = props.content
}

function close() {
  emit('close')
}

function confirm(v) {
  emit('confirm', v)
}
</script>

<template>
  <div>
    <div v-if="show" ref="OpenModalRef" class="open-modal flex items-end">
      <div class="mask" @click="close" />
      <div class="open-content relative z-100">
        <div ref="handle" class="headers">
          {{ title }}
          <van-icon class="cross" name="cross" :size="18" @click="close" />
        </div>
        <div class="content">
          <slot v-if="!html" />
          <component :is="html" v-else :data="data" @confirm="confirm" @close="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.open-modal {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 50%);
  }

  .open-content {
    @keyframes fadeIn {
      from {
        transform: translate3d(0, 100%, 0);
      }

      to {
        transform: translate3d(0, 0, 0);
      }
    }

    width: 100%;
    // max-height: 450px;
    min-height: 330px;
    background: #fff;
    border-radius: 8px 8px 0 0;
    animation: fadeIn 0.2s ease-in-out;
  }

  .headers {
    position: relative;
    height: 58px;
    font-size: 18px;
    font-weight: 600;
    line-height: 58px;
    color: #333;
    text-align: center;

    .cross {
      position: absolute;
      top: 20px;
      right: 20px;
    }
  }
}
</style>
