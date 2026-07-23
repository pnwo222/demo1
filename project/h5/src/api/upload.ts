import type { AxiosProgressEvent } from 'axios'
import type { UploadFileParams } from '@/utils/http/types/axios'
import { defHttp } from '@/utils/http'

export function uploadApi(
  data: UploadFileParams,
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile({
    url: '/client/c/file/uploadLocalReturnUrl',
    onUploadProgress,
    timeout: 60 * 1000,
  }, data, {
    isTransformValidateResponse: true,
    ignoreCancelToken: true,
  })
}
