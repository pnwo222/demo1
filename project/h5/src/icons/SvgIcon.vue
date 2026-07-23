<script setup lang="ts">
const props = defineProps({
  /** svg 文件名 */
  name: {
    type: String,
    required: true,
  },
  /** 颜色 */
  color: {
    type: String,
    default: '',
  },
  /** 字体大小 */
  size: {
    type: [String, Number],
    default: '14',
  },
})
const iconName = computed(() => `#icon-${props.name}`)
const svgClass = computed(() => {
  if (props.name)
    return `svg-icon icon-${props.name}`
  return 'svg-icon'
})
</script>

<script lang="ts">
export default {
  name: 'SvgIcon',
}
</script>

<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color, fontSize: px2vw(size) }">
    <use :xlink:href="iconName" />
  </svg>
</template>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentcolor;
  vertical-align: middle;
}
</style>
