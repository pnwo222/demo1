import type { RemovableRef } from '@vueuse/core'

/* 图片返回结构 */
export interface IUploadResult {
  /**  图片地址 */
  url?: RemovableRef<string>
  /** 接口返回的原始数据 */
  result: RemovableRef<any>
}

/* 配置项 */
export interface IUploadImageSetting {
  /** 接口返回的图片地址路径 x.x.x */
  urlField?: string
  /** 文件上传名 */
  name?: string
  /** 是否压缩 */
  isCompressor?: boolean
  /** 入参 */
  params?: { [key: string]: any }
}

export interface IUseUpload {
  file: File
  setting?: IUploadImageSetting
  /** 请求成功返回 { url, result } */
  onSuccess?: ({ url, result }: { url: string, result?: any }) => void
  /** 失败返回的接口数据 */
  onFail?: (result?: any) => void
  /** 上传进度 */
  onLoading?: (result?: any) => void
}
