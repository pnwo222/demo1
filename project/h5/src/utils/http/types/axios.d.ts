import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'

export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined
export type SuccessMessageMode = 'none' | 'success' | 'error' | undefined

export interface RequestOptions {
  /** 将请求参数拼接到url */
  joinParamsToUrl?: boolean
  /** 格式化请求参数时间 */
  formatDate?: boolean
  /** 是否处理请求结果 */
  isTransformResponse?: boolean
  /** 是否返回本地响应头,需要获取响应头时使用此属性 */
  isReturnNativeResponse?: boolean
  /** Whether to join url */
  joinPrefix?: boolean
  /** 接口地址，如果保留为空，则使用默认值 */
  apiUrl?: string
  /** 请求拼接路径 */
  urlPrefix?: string
  /** 错误消息提示类型 */
  errorMessageMode?: ErrorMessageMode
  /** 成功消息提示类型 */
  successMessageMode?: SuccessMessageMode
  /** 是否添加时间戳 */
  joinTime?: boolean
  /** 忽略重复请求 */
  ignoreCancelToken?: boolean
  /** 重复请求 非严格判断（默认false, 即url和传参都一致） */
  simpleCancel?: boolean
  /** 是否在标头中发送令牌 */
  withToken?: boolean
  /** 返回体中数据层的key， 默认data */
  dataField?: string
  /** 处理请求结果后，返回code,message,data,  默认直接返回data */
  isTransformValidateResponse?: boolean
  /** 超时时间 */
  timeout?: number
  /** 自定义code名， 默认code, 如果接口返回不是code，可做调整 */
  codeField?: string
  /** 判断请求成功的 code 值, 如果需要多个值判断 请使用数组 */
  code?: number | string | (string | number)[]
  /** 错误提示 接口返回的错误信息不统一的情况下可以使用多个 */
  errMsgField?: (e: { [key: string]: any }) => string
  /** 异常处理 */
  responseInterceptorsCatch?: (error: Error) => void
  /** 错误提示弹窗的标题 */
  errTitle?: string
  /** 请求拦截处理  */
  requestInterceptors?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  /** 请求之前处理config */
  beforeRequestHook?: (config: AxiosRequestConfig) => void
  /** post 默认 请求类型 */
  contentType?: string
}

export interface Result<T = any> {
  [key: string]: any
}

// 文件上传参数
export interface UploadFileParams {
  // 其他参数
  data?: Recordable
  // 文件参数接口字段名
  name?: string
  // 文件
  file: File | Blob
  // 文件名
  filename?: string
  [key: string]: any
}
// 文件返回参数
export interface UploadFileCallBack {
  // 成功回调方法
  success?: any
  // 是否返回响应头,需要获取响应头时使用此属性
  isReturnResponse?: boolean
}
