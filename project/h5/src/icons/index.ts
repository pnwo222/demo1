import { withInstall } from '@/utils/with-install'
import _SvgIcon from './SvgIcon.vue'

export const SvgIcon = withInstall(_SvgIcon)
export default SvgIcon

declare module 'vue' {
  export interface GlobalComponents {
    SvgIcon: typeof SvgIcon
  }
}
