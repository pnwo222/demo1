<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  /** 进度百分比 (0-100) */
  percentage: number
  /** 圆形大小 */
  size?: number
  /** 圆环粗细 */
  strokeWidth?: number
  /** 进度颜色 */
  progressColor?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 起始角度 (0-360) */
  startAngle?: number
  /** 线条端点样式 */
  lineCap?: 'butt' | 'round' | 'square'
  /** 是否显示标签 */
  showLabel?: boolean
  /** 标签文本 */
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  percentage: 0,
  size: 120,
  strokeWidth: 8,
  progressColor: '#409eff',
  backgroundColor: '#e5e9f2',
  startAngle: -90,
  lineCap: 'round',
  showLabel: false,
  label: '进度',
})

// 计算中心点
const center = computed(() => props.size / 2)

// 计算半径
const radius = computed(() => (props.size - props.strokeWidth) / 2)

// 计算圆周长
const circumference = computed(() => 2 * Math.PI * radius.value)

// 计算进度偏移量
const strokeDashoffset = computed(() => {
  const progress = Math.max(0, Math.min(100, props.percentage))
  return circumference.value - (progress / 100) * circumference.value
})
</script>

<template>
  <div class="circle-progress" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg :width="size" :height="size" class="circle-progress-svg">
      <!-- 背景圆环 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="backgroundColor"
        :stroke-width="strokeWidth"
        fill="none"
        class="circle-progress-bg"
      />
      <!-- 进度圆环 -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        :stroke="progressColor"
        :stroke-width="strokeWidth"
        fill="none"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="strokeDashoffset"
        :stroke-linecap="lineCap"
        class="circle-progress-fill"
        :style="{ transform: `rotate(${startAngle}deg)` }"
      />
    </svg>
    <!-- 中心内容 -->
    <div class="circle-progress-content">
      <slot>
        <div class="circle-progress-text">
          <span class="circle-progress-percentage">{{ Math.round(percentage) }}%</span>
          <div v-if="showLabel" class="circle-progress-label">
            {{ label }}
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<style scoped>
.circle-progress {
  position: relative;
  display: inline-block;
}

.circle-progress-svg {
  transform: rotate(-90deg);
  transform-origin: center;
}

.circle-progress-bg {
  opacity: 0.3;
}

.circle-progress-fill {
  transition: stroke-dashoffset 0.3s ease-in-out;
}

.circle-progress-content {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
}

.circle-progress-text {
  text-align: center;
}

.circle-progress-percentage {
  font-size: 24px;
  font-weight: bold;
  line-height: 1;
  color: #333;
}

.circle-progress-label {
  margin-top: 4px;
  font-size: 12px;
  color: #666;
}
</style>
