import type { IClientModule } from '@/api/index/module/types'

export interface IClientModulExtends extends IClientModule {
  /** 图片和地址 */
  list: {
    image: string
    link: string
  }[]
}
