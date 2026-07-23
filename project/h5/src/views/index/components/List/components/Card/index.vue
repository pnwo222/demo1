<script setup lang='ts'>
import { formatLatestTime } from '@/utils'

const props = defineProps({
  type: {
    type: String,
    // PLAIN_TEXT 纯文字， ONE_SMALL_PIC 小图一张，ONE_BIG_PIC 大图展示，THREE_SMALL_PIC 小图3张
    default: 'THREE_SMALL_PIC',
  },
  data: {
    type: Object,
    default: () => ({
      title: '',
      time: '',
      org: '',
      img: [],
    }),
  },
})

const formatTime = computed(() => {
  return formatLatestTime(props.data.time)
})
</script>

<template>
  <div v-if="type === 'THREE_SMALL_PIC'" class="card card-3">
    <div class="title ellipsis-2">
      {{ data?.title }}
    </div>
    <div class="wrap-img">
      <div>
        <img :src="data.img?.[0]" alt="img">
      </div>
      <div>
        <img :src="data.img?.[1]" alt="img">
      </div>
      <div>
        <img :src="data.img?.[2]" alt="img">
      </div>
    </div>
    <div class="footer">
      <span>{{ data?.org }}</span>
      <span>{{ formatTime }}</span>
    </div>
  </div>
  <div v-else-if="type === 'ONE_BIG_PIC'" class="card card-2">
    <div class="title ellipsis-2">
      {{ data?.title }}
    </div>
    <div class="wrap-img">
      <img crossorigin="anonymous" :src="data.img?.[0]" alt="img">
    </div>
    <div class="footer">
      <span v-if="data?.org">{{ data?.org }}</span>
      <span>{{ formatTime }}</span>
    </div>
  </div>
  <div v-else-if="type === 'ONE_SMALL_PIC'" class="card">
    <div class="flex justify-between">
      <div class="title ellipsis-2">
        {{ data?.title }}
      </div>
      <div class="wrap-img">
        <img :src="data.img?.[0]" alt="img">
      </div>
    </div>
    <div class="footer">
      <span v-if="data?.org">{{ data?.org }}</span>
      <span class="ml-12">{{ formatTime }}</span>
    </div>
  </div>
  <div v-else-if="type === 'PLAIN_TEXT'" class="card">
    <div class="title ellipsis-2 max-w-100%!">
      {{ data?.title }}
    </div>
    <div class="footer">
      <span v-if="data?.org">{{ data?.org }}</span>
      <span>{{ formatTime }}</span>
    </div>
  </div>
</template>

<style scoped lang='less'>
  @import url('../card.less');
</style>
