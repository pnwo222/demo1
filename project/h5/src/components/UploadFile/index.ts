import { withInstall } from '@/utils/with-install'
import _UploadFile from './index.vue'

export const UploadFile = withInstall(_UploadFile)
export default UploadFile

declare module 'vue' {
  export interface GlobalComponents {
    UploadFile: typeof UploadFile
  }
}
