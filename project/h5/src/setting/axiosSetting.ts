import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import type { RequestOptions } from '@/utils/http/types/axios'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { ContentTypeEnum } from '@/enums/httpEnum'
import { useStorage } from '@/hooks/system/useStorage'
import { useUserStoreWithOut } from '@/store/modules/user'
// import { encryptByHmacSHA256 } from '@/utils/crypto'

/**
 * axios 全局请求配置
 * 如果配置无法满足业务需求，请在 @utils/http/axios/index 中修改
 * 以下配置可在指定接口中单独配置
 */
export const axiosSetting: RequestOptions = {
  // 接口地址
  apiUrl: import.meta.env.VITE_USE_MOCK === 'true' ? '' : import.meta.env.VITE_API_BASE_URL,

  // 接口拼接地址 前缀
  urlPrefix: import.meta.env.VITE_API_URL_PREFIX,

  // post 默认请求类型
  contentType: ContentTypeEnum.JSON,

  // code 名
  // 比如接口返回格式是 { rsCode: 200, data: {}, message: '' }
  // 则 codeField 为 'rsCode'
  // codeField: 'code',

  // 判断请求成功的 code 值, 如果需要多个值判断 请使用数组
  code: 200,

  // 接口返回的 data 自定义值
  // 比如接口返回格式是 { code: 200, result: {}, message: '' }
  // 则 dataField 为 'result'
  // dataField: 'data',

  // 异常提示，具体看接口返回的message
  errMsgField: data => (data && (data.error || data.message || data.msg)),

  // 异常处理
  responseInterceptorsCatch(error: AxiosError) {
    const userStore = useUserStoreWithOut()
    // response, code, message, config
    const { response } = error || {}
    // 登录过期， 具体根据业务自行判断
    if (response.status === 401) {
      userStore.loginOut()
    }
  },

  // 请求之前处理config，可全局 对参数加密或添加统一参数
  // beforeRequestHook(config: InternalAxiosRequestConfig) {
  // // data | params
  // config.data && (config.data.source = 'APP')
  // config.params && (config.params.source = 'APP')
  // },

  // 请求头全局自定义参数 请在这里统一添加
  requestInterceptors(config: InternalAxiosRequestConfig) {
    // config.headers.Authorization = useStorage.ls.get(TOKEN_KEY)
    config.headers.Token = useStorage.ls.get(TOKEN_KEY, null, `${useStorage.ls.get('openId')}_`)
    config.headers.timeStamp = new Date().getTime()

    config.headers.DeviceId = 'APP'

    // console.log('[config]', config)

    // 添加验签
    // Object.assign(config.headers, encryptByHmacSHA256())

    return config
  },

  // 是否携带 自定义 headers 参数
  // 设为false, 则 headers.Authorization 等自定义参数 不再携带
  // withToken: true,

  // 超时时间 默认10秒
  // timeout: 10 * 1000,

  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  // isReturnNativeResponse: false,

  // 需要对返回数据进行处理
  // false 则不进行 code 校验，直接返回接口数据，使用场景：导出文件
  // isTransformResponse: true,

  // 处理请求结果后，是否返回 { code, message, data}, 默认直接返回data
  // isTransformValidateResponse: false,

  // post请求的时候添加参数到url
  // joinParamsToUrl: false,

  // 格式化提交参数时间
  // formatDate: true,

  // 消息提示类型
  // errorMessageMode: 'message',

  //  是否加入时间戳
  // joinTime: true,

  // 是否忽略重复请求
  // ignoreCancelToken: false,
}
