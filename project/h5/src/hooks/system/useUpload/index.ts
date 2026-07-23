import type { IUploadResult, IUseUpload } from './types'
import { get } from 'lodash-es'
import { uploadApi } from '@/api/upload'
import { uploadImageSetting } from '@/setting/componentSetting'
import { compressor } from '@/utils'

/**
 * 上传文件*
 * @param file 文件
 * @param setting 图片上传配置
 * @param onSuccess 成功回调
 * @param onFail 失败回调
 * @param onLoading 上传进度
 * @returns *url, result* 有url表示上传成功，result 接口返回的原始信息
 */
export function useUpload({ file, setting, onSuccess, onFail, onLoading }: IUseUpload): IUploadResult {
  const url = ref()
  const result = ref()

  const { urlField, name, params, isCompressor } = { ...uploadImageSetting, ...(setting || {}) } || {}
  const URL_FIELD = urlField || 'data.url'
  const NAME = name || 'file'
  const PARAMS = params || {}

  if (isCompressor && file.type && file.type.match(/image\/*/)) {
    compressor(file).then((res: File | Blob) => {
      upload(res)
    })
  }
  else {
    upload(file)
  }

  function upload(file: File | Blob) {
    uploadApi({
      file,
      name: NAME,
      data: PARAMS,
    }, (e) => {
      onLoading(e)
    }).then((res) => {
      url.value = get(res, URL_FIELD)
      result.value = res.data
      onSuccess({
        url: url.value,
        result: res.data,
      })
    }).catch((err) => {
      result.value = err
      onFail(err)
    })
  }

  return {
    url,
    result,
  }
}
