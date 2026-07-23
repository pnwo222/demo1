import Compressor from 'compressorjs'

/**
 * 图片压缩配置接口
 */
interface CompressOptions {
  quality?: number
  maxWidth?: number
  maxHeight?: number
  mimeType?: string
  convertSize?: number
}

/**
 * 压缩图片
 * @param file 原始图片文件
 * @param options 压缩选项
 * @returns Promise<File> 压缩后的文件
 */
export function compressImage(file: File, options: CompressOptions = {}): Promise<File> {
  const {
    quality = 0.8,
    maxWidth = 1920,
    maxHeight = 1080,
    mimeType = 'image/jpeg',
    convertSize = 1024 * 1024, // 1MB
  } = options

  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality,
      maxWidth,
      maxHeight,
      mimeType,
      convertSize,
      success: (result) => {
        resolve(result as File)
      },
      error: (err) => {
        reject(err)
      },
    })
  })
}

/**
 * 将文件转换为 Base64
 * @param file 文件
 * @returns Promise<string> Base64字符串
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 将 Base64 转换为文件
 * @param base64 Base64字符串
 * @param filename 文件名
 * @param mimeType MIME类型
 * @returns File 文件对象
 */
export function base64ToFile(base64: string, filename: string, mimeType = 'image/jpeg'): File {
  const arr = base64.split(',')
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }

  return new File([u8arr], filename, { type: mimeType })
}

/**
 * 获取图片尺寸
 * @param file 图片文件
 * @returns Promise<{width: number, height: number}> 图片尺寸
 */
export function getImageDimensions(file: File): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

/**
 * 验证图片文件
 * @param file 文件
 * @param maxSize 最大文件大小（字节）
 * @returns {valid: boolean, message: string} 验证结果
 */
export function validateImageFile(file: File, maxSize = 10 * 1024 * 1024): { valid: boolean, message: string } {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: '不支持的文件格式，请上传 JPG、PNG 或 WebP 格式的图片',
    }
  }

  // 检查文件大小
  if (file.size > maxSize) {
    return {
      valid: false,
      message: `文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`,
    }
  }

  return {
    valid: true,
    message: '文件验证通过',
  }
}

/**
 * 创建图片预览URL
 * @param file 文件
 * @returns string 预览URL
 */
export function createImagePreview(file: File): string {
  return URL.createObjectURL(file)
}

/**
 * 释放图片预览URL
 * @param url 预览URL
 */
export function revokeImagePreview(url: string): void {
  URL.revokeObjectURL(url)
}

/**
 * 身份证图片处理工具类
 */
export class IdCardImageProcessor {
  /**
   * 处理身份证照片
   * @param file 原始图片文件
   * @returns Promise<File> 处理后的文件
   */
  static async process(file: File): Promise<File> {
    // 验证文件
    const validation = validateImageFile(file)
    if (!validation.valid) {
      throw new Error(validation.message)
    }

    // 压缩图片
    const compressedFile = await compressImage(file, {
      quality: 0.85,
      maxWidth: 1280,
      maxHeight: 720,
      mimeType: 'image/jpeg',
    })

    return compressedFile
  }

  /**
   * 批量处理身份证照片
   * @param files 文件数组
   * @returns Promise<File[]> 处理后的文件数组
   */
  static async processBatch(files: File[]): Promise<File[]> {
    const promises = files.map(file => this.process(file))
    return Promise.all(promises)
  }
}
