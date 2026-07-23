import type { UploaderFileListItem } from 'vant'
import type { PropType } from 'vue'

/** modelValue 类型 UploaderFileListItem[] | string[] | string  */
export type ImodelValue = UploaderFileListItem[] | string[] | string

export const UploadFileProps = {
  /** 图片路径 或 图片路径构成的数组  */
  modelValue: {
    type: [String, Array] as PropType<ImodelValue>,
  },
  /** 图片路径是字符串的情况下的分隔字符，默认英文逗号 */
  splitField: {
    type: String as PropType<string>,
    default: ',',
  },
}
