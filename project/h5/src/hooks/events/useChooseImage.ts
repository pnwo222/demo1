import type { Ref } from 'vue'
import Compressor from 'compressorjs'
import { showToast } from 'vant'
import { computed, ref, watch } from 'vue'

export interface ImageFile {
  /** 原始文件 */
  file: File
  /** 压缩后的文件 */
  compressedFile?: File
  /** 预览URL */
  previewUrl: string
  /** 文件大小（字节） */
  size: number
  /** 压缩后文件大小（字节） */
  compressedSize?: number
  /** 文件名 */
  name: string
  /** 文件类型 */
  type: string
  /** 是否正在压缩 */
  compressing?: boolean
  /** 错误信息 */
  error?: string
}

export interface ChooseImageOptions {
  /** 是否支持多选，默认 false */
  multiple?: boolean
  /** 最大选择数量，默认 9 */
  maxCount?: number
  /** 是否启用图片压缩，默认 true */
  enableCompression?: boolean
  /** 压缩质量，0-1，默认 0.8 */
  quality?: number
  /** 最大宽度，默认 1920 */
  maxWidth?: number
  /** 最大高度，默认 1920 */
  maxHeight?: number
  /** 允许的文件类型，默认 ['image/jpeg', 'image/png', 'image/webp'] */
  accept?: string[]
  /** 最大文件大小（MB），默认 10 */
  maxSize?: number
  /** 是否显示预览，默认 true */
  showPreview?: boolean
}

export interface ChooseImageState {
  /** 选中的图片列表 */
  images: ImageFile[]
  /** 是否正在选择图片 */
  choosing: boolean
  /** 是否正在压缩 */
  compressing: boolean
  /** 错误信息 */
  error: string
  /** 是否为空 */
  isEmpty: boolean
  /** 总文件大小（字节） */
  totalSize: number
  /** 压缩后总文件大小（字节） */
  totalCompressedSize: number
}

export interface ChooseImageActions {
  /** 选择图片 */
  chooseImage: () => Promise<void>
  /** 移除图片 */
  removeImage: (index: number) => void
  /** 清空所有图片 */
  clearImages: () => void
  /** 重新压缩图片 */
  recompressImages: () => Promise<void>
  /** 获取文件列表 */
  getFiles: () => File[]
  /** 获取压缩后的文件列表 */
  getCompressedFiles: () => File[]
}

export interface ChooseImageOnAction {
  onBeforeChoose?: () => void
  onChangeFile?: (images: ImageFile[]) => void
}

export function useChooseImage(
  options: ChooseImageOptions = {},
  onAction: ChooseImageOnAction,
): [Ref<ChooseImageState>, ChooseImageActions] {
  const {
    multiple = false,
    maxCount = 9,
    enableCompression = true,
    quality = 0.8,
    maxWidth = 3000,
    maxHeight = 3000,
    accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxSize = 100,
    showPreview = true,
  } = options

  // 状态管理
  const state = ref<ChooseImageState>({
    images: [],
    choosing: false,
    compressing: false,
    error: '',
    isEmpty: true,
    totalSize: 0,
    totalCompressedSize: 0,
  })

  // 计算属性
  const isEmpty = computed(() => state.value.images.length === 0)
  const totalSize = computed(() =>
    state.value.images.reduce((sum, img) => sum + img.size, 0),
  )
  const totalCompressedSize = computed(() =>
    state.value.images.reduce((sum, img) => sum + (img.compressedSize || img.size), 0),
  )

  // 创建预览URL
  const createPreviewUrl = (file: File): string => {
    if (!showPreview) return ''
    return URL.createObjectURL(file)
  }

  // 创建隐藏的文件输入框
  const createFileInput = (): HTMLInputElement => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept.join(',')
    input.multiple = multiple
    input.style.display = 'none'
    return input
  }

  // 验证文件
  const validateFile = (file: File): string | null => {
    // 检查文件类型
    if (!accept.includes(file.type)) {
      return `不支持的文件类型: ${file.type}`
    }

    // 检查文件大小
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > maxSize) {
      return `文件大小不能超过 ${maxSize}MB`
    }

    return null
  }

  // 压缩图片
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      if (!enableCompression) {
        resolve(file)
        return
      }

      console.log('[file]', `${file.size / 1024 / 1024} m`)

      new Compressor(file, {
        quality,
        maxWidth,
        maxHeight,
        success: (compressedFile: any) => {
          console.log('[compressedFile]', compressedFile, `${compressedFile.size / 1024 / 1024} m`)
          resolve(compressedFile)
        },
        error: (err) => {
          reject(err)
        },
      })
    })
  }

  // 处理选择的文件
  const processFiles = async (files: FileList): Promise<void> => {
    const fileArray = Array.from(files)

    // 检查数量限制
    if (multiple && state.value.images.length + fileArray.length > maxCount) {
      state.value.error = `最多只能选择 ${maxCount} 张图片`
      showToast(state.value.error)
      return
    }

    // 验证文件
    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        state.value.error = error
        showToast(error)
        return
      }
    }

    // 清空错误信息
    state.value.error = ''

    onAction?.onBeforeChoose?.()

    const s = setTimeout(async () => {
      clearTimeout(s)
      // 处理每个文件
      for (const file of fileArray) {
        const imageFile: ImageFile = {
          file,
          previewUrl: createPreviewUrl(file),
          size: file.size,
          name: file.name,
          type: file.type,
          compressing: enableCompression,
        }

        if (maxCount === 1) {
          state.value.images = [imageFile]
        }
        else {
          state.value.images.push(imageFile)
        }

        // 压缩图片
        if (enableCompression) {
          try {
            state.value.compressing = true
            const compressedFile = await compressImage(file)
            imageFile.compressedFile = compressedFile
            imageFile.compressedSize = compressedFile.size
            imageFile.compressing = false
          }
          catch (error) {
            imageFile.error = '图片压缩失败'
            imageFile.compressing = false
            imageFile.compressedFile = file
            imageFile.compressedSize = file.size
            imageFile.compressing = false
          }
        }
      }

      state.value.compressing = false
      state.value.isEmpty = state.value.images.length === 0
      state.value.totalSize = totalSize.value
      state.value.totalCompressedSize = totalCompressedSize.value

      onAction?.onChangeFile?.(state.value.images)
    }, 600)
  }

  // 选择图片
  const chooseImage = async (): Promise<void> => {
    try {
      state.value.choosing = true
      state.value.error = ''

      const input = createFileInput()
      document.body.appendChild(input)

      input.onchange = async (event) => {
        const target = event.target as HTMLInputElement
        if (target.files && target.files.length > 0) {
          await processFiles(target.files)
        }
        document.body.removeChild(input)
      }

      input.click()
    }
    catch (error) {
      state.value.error = '选择图片失败'
      showToast(state.value.error)
    }
    finally {
      state.value.choosing = false
    }
  }

  // 移除图片
  const removeImage = (index: number): void => {
    const image = state.value.images[index]
    if (image && image.previewUrl) {
      URL.revokeObjectURL(image.previewUrl)
    }
    state.value.images.splice(index, 1)
    state.value.isEmpty = state.value.images.length === 0
    state.value.totalSize = totalSize.value
    state.value.totalCompressedSize = totalCompressedSize.value
  }

  // 清空所有图片
  const clearImages = (): void => {
    // 释放预览URL
    state.value.images.forEach((image) => {
      if (image.previewUrl) {
        URL.revokeObjectURL(image.previewUrl)
      }
    })

    state.value.images = []
    state.value.isEmpty = true
    state.value.totalSize = 0
    state.value.totalCompressedSize = 0
    state.value.error = ''
  }

  // 重新压缩图片
  const recompressImages = async (): Promise<void> => {
    if (!enableCompression) return

    state.value.compressing = true
    state.value.error = ''

    for (const image of state.value.images) {
      try {
        image.compressing = true
        const compressedFile = await compressImage(image.file)
        image.compressedFile = compressedFile
        image.compressedSize = compressedFile.size
        image.compressing = false
      }
      catch (error) {
        image.error = '图片压缩失败'
        image.compressing = false
      }
    }

    state.value.compressing = false
    state.value.totalCompressedSize = totalCompressedSize.value
  }

  // 获取文件列表
  const getFiles = (): File[] => {
    return state.value.images.map(img => img.file)
  }

  // 获取压缩后的文件列表
  const getCompressedFiles = (): File[] => {
    return state.value.images.map(img => img.compressedFile || img.file)
  }

  // 更新计算属性
  const updateComputed = () => {
    state.value.isEmpty = isEmpty.value
    state.value.totalSize = totalSize.value
    state.value.totalCompressedSize = totalCompressedSize.value
  }

  // 监听状态变化
  const unwatch = watch(state, updateComputed, { deep: true })

  // 清理函数
  const cleanup = () => {
    unwatch()
    clearImages()
  }

  return [
    state,
    {
      chooseImage,
      removeImage,
      clearImages,
      recompressImages,
      getFiles,
      getCompressedFiles,
    },
  ]
}

/**
 * 使用示例：
 *
 * ```vue
 * <template>
 *   <div>
 *     <!-- 选择图片按钮 -->
 *     <van-button @click="chooseImage" :loading="state.choosing">
 *       选择图片
 *     </van-button>
 *
 *     <!-- 错误信息 -->
 *     <van-toast v-if="state.error" type="fail" :message="state.error" />
 *
 *     <!-- 图片预览 -->
 *     <div class="image-preview">
 *       <div
 *         v-for="(image, index) in state.images"
 *         :key="index"
 *         class="image-item"
 *       >
 *         <img :src="image.previewUrl" :alt="image.name" />
 *         <div class="image-info">
 *           <span>{{ image.name }}</span>
 *           <span>{{ (image.size / 1024 / 1024).toFixed(2) }}MB</span>
 *           <span v-if="image.compressedSize">
 *             压缩后: {{ (image.compressedSize / 1024 / 1024).toFixed(2) }}MB
 *           </span>
 *         </div>
 *         <van-button
 *           size="small"
 *           type="danger"
 *           @click="removeImage(index)"
 *         >
 *           删除
 *         </van-button>
 *       </div>
 *     </div>
 *
 *     <!-- 操作按钮 -->
 *     <div class="actions">
 *       <van-button @click="clearImages">清空</van-button>
 *       <van-button @click="recompressImages" :loading="state.compressing">
 *         重新压缩
 *       </van-button>
 *       <van-button @click="uploadImages">上传</van-button>
 *     </div>
 *   </div>
 * </template>
 *
 * <script setup lang="ts">
 * import { useChooseImage } from '@/hooks/events/useChooseImage'
 *
 * // 基本使用
 * const [state, actions] = useChooseImage()
 *
 * // 或者使用配置选项
 * const [state, actions] = useChooseImage({
 *   multiple: true,           // 支持多选
 *   maxCount: 5,              // 最多选择5张
 *   enableCompression: true,  // 启用压缩
 *   quality: 0.8,             // 压缩质量
 *   maxWidth: 1920,           // 最大宽度
 *   maxHeight: 1920,          // 最大高度
 *   maxSize: 5,               // 最大文件大小5MB
 *   accept: ['image/jpeg', 'image/png'] // 只允许jpg和png
 * })
 *
 * const { chooseImage, removeImage, clearImages, recompressImages, getFiles } = actions
 *
 * // 上传图片
 * const uploadImages = async () => {
 *   const files = getFiles() // 获取原始文件
 *   // const compressedFiles = getCompressedFiles() // 获取压缩后的文件
 *
 *   // 这里可以调用上传API
 *   console.log('准备上传的文件:', files)
 * }
 * </script>
 *
 * <style scoped>
 * .image-preview {
 *   display: grid;
 *   grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
 *   gap: 16px;
 *   margin: 16px 0;
 * }
 *
 * .image-item {
 *   border: 1px solid #eee;
 *   border-radius: 8px;
 *   padding: 8px;
 * }
 *
 * .image-item img {
 *   width: 100%;
 *   height: 150px;
 *   object-fit: cover;
 *   border-radius: 4px;
 * }
 *
 * .image-info {
 *   margin: 8px 0;
 *   font-size: 12px;
 *   color: #666;
 * }
 *
 * .actions {
 *   display: flex;
 *   gap: 8px;
 *   margin-top: 16px;
 * }
 * </style>
 * ```
 */
