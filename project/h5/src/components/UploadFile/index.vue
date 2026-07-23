<script setup lang="ts">
import type { UploaderFileListItem } from 'vant'
import type { ImodelValue } from './types'
import { getUrlSuffix } from '@/utils'
import { fileRead } from './hooks/useApi'
import { UploadFileProps } from './types'

const props = defineProps(UploadFileProps)

const emits = defineEmits(['update:modelValue'])

const fileList = ref<UploaderFileListItem[]>([])

let isChange = false

// 外部传入数据更新时，同步更新 fileList
watch(() => props.modelValue, (e: ImodelValue) => {
  if (!e)
    return

  if (isChange)
    return

  const arr = Array.isArray(e) ? e : e.split(props.splitField)
  fileList.value = arr.map((url) => {
    const { fullName } = getUrlSuffix(url)
    return {
      url,
      name: fullName,
    }
  })
}, {
  immediate: true,
})

// 上传图片/删除图片等 更新图片数据
watch(fileList, (e: UploaderFileListItem[]) => {
  isChange = true
  let value: ImodelValue

  if (Array.isArray(props.modelValue))
    value = e && e.filter(e => e.url).map(e => e.url)
  else
    value = e && e.filter(e => e.url).map(e => e.url).join(props.splitField)

  emits('update:modelValue', value)

  nextTick(() => {
    isChange = false
  })
}, {
  deep: true,
})
</script>

<template>
  <van-uploader v-model="fileList" :after-read="fileRead" v-bind="$attrs">
    <template v-for="(_, key) in $slots" #[key]="scoped">
      <slot v-if="key === 'default'" :name="key" />
      <slot v-else :name="key" v-bind="scoped" />
    </template>
  </van-uploader>
</template>

<style lang="less" scoped>
</style>
