/**
 * 组件统一配置项
 */

import type { IUploadImageSetting } from '@/hooks/system/useUpload/types'

/**
 * 图片上传组件 接口全局配置
 */
export const uploadImageSetting: IUploadImageSetting = {
  /** 接口返回的图片地址路径 x.x.x */
  urlField: 'data.url',

  /** 文件上传名 */
  name: 'file',

  /** 开启图片压缩， 图片有效 */
  isCompressor: true,

  /** 自定义入参 */
  params: {
    source: 'app',
  },
}
