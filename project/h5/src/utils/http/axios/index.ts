import type { AxiosResponse } from 'axios'
import type { RequestOptions, Result } from '../types/axios'
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform'
import axios from 'axios'
import { clone } from 'lodash-es'
import { showDialog, showNotify } from 'vant'
import { ContentTypeEnum, RequestEnum, ResultEnum } from '@/enums/httpEnum'
import { axiosSetting } from '@/setting/axiosSetting'
import { deepMerge, setObjToUrlParams } from '@/utils'
import { isString } from '@/utils/is'
import { VAxios } from './Axios'
import { checkStatus } from './checkStatus'
import { formatRequestDate, joinTimestamp } from './helper'

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理响应数据。如果数据不是预期格式，可直接抛出错误
   */
  transformResponseHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformResponse, isReturnNativeResponse, codeField, dataField, isTransformValidateResponse, errMsgField } = options

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse)
      return res

    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse)
      return res.data

    // 错误的时候返回
    const { data: resDATA } = res
    if (!resDATA) {
      // return '[HTTP] Request has no return value';
      const error = new Error('Request has no return value')
      error.name = 'HttpError'
      error.cause = { code: 'NO_DATA', data: resDATA }
      throw error
    }
    //  这里 code，result，message为后台统一的字段
    const { [codeField]: code, [dataField]: result } = resDATA

    const CODE = options.code || 200
    const hasSuccessCode = Array.isArray(CODE) ? CODE.includes(code) : code === CODE

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = resDATA && Reflect.has(resDATA, codeField) && hasSuccessCode
    if (hasSuccess)
      return isTransformValidateResponse ? resDATA : result

    // 在此处根据自己项目的实际情况对不同的code执行不同的操作
    // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
    let timeoutMsg = '请求失败'
    switch (code) {
      // case ResultEnum.TIMEOUT:
      //   timeoutMsg = '请求超时'
      //   break
      default:
        timeoutMsg = errMsgField(resDATA)
    }

    // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
    if (options.errorMessageMode === 'modal') {
      showDialog({
        title: '错误提示',
        message: timeoutMsg,
      }).then(() => {
        // on close
      })
    }
    else if (options.errorMessageMode === 'message') {
      showNotify({
        type: 'danger',
        message: timeoutMsg,
      })
    }

    // 创建包含详细信息的错误对象
    const error = new Error(timeoutMsg || '请求失败')
    error.name = 'HttpError'
    error.cause = {
      code,
      data: resDATA,
    }
    throw error
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix, beforeRequestHook } = options

    if (joinPrefix)
      config.url = `${urlPrefix}${config.url}`

    if (apiUrl && isString(apiUrl))
      config.url = `${apiUrl}${config.url}`

    // 自定义处理数据
    beforeRequestHook && beforeRequestHook(config)

    const params = config.params || {}
    const data = config.data || false
    formatDate && data && !isString(data) && formatRequestDate(data)
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false))
      }
      else {
        // 兼容restful风格
        config.url = `${config.url + params}${joinTimestamp(joinTime, true)}`
        config.params = undefined
      }
    }
    else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params)
        if (
          Reflect.has(config, 'data')
          && config.data
          && (Object.keys(config.data).length > 0 || config.data instanceof FormData)
        ) {
          config.data = data
          config.params = params
        }
        else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params
          config.params = undefined
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          )
        }
      }
      else {
        // 兼容restful风格
        config.url = config.url + params
        config.params = undefined
      }
    }
    return config
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    const { requestInterceptors } = (config as Recordable)?.requestOptions
    if (requestInterceptors && (config as Recordable)?.requestOptions?.withToken !== false) {
      return requestInterceptors(config, options)
    }
    return config
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (_, error: any) => {
    const { response, code, message, config } = error || {}
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none'
    // console.log('[config?.requestOptions]', config?.requestOptions)
    const { errMsgField, responseInterceptorsCatch } = config?.requestOptions || {}

    const msg: string = response?.data?.error?.message ?? ''
    const err: string = error?.toString?.() ?? ''
    let errMessage = ''

    responseInterceptorsCatch && responseInterceptorsCatch(error)

    if (axios.isCancel(error))
      return Promise.reject(error)

    try {
      if (code === 'ECONNABORTED' && message.includes('timeout'))
        errMessage = '请求超时'

      if (err?.includes('Network Error'))
        errMessage = '网络错误'

      if (response && response.data) {
        errMessage = errMsgField(response.data)
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          showDialog({
            title: '错误提示',
            message: errMessage,
          }).then(() => {
            // on close
          })
        }
        else if (errorMessageMode === 'message') {
          showNotify({
            type: 'danger',
            message: errMessage,
          })
        }

        return Promise.reject(error)
      }
    }
    catch (error) {
      throw new Error(error as unknown as string)
    }

    checkStatus(error?.response?.status, msg, errorMessageMode)

    // 添加自动重试机制 保险起见 只针对GET请求
    // const retryRequest = new AxiosRetry()
    // const { isOpenRetry } = config.requestOptions.retryRequest
    // config.method?.toUpperCase() === RequestEnum.GET
    //   && isOpenRetry
    //   && retryRequest.retry(axiosInstance, error)
    return Promise.reject(error)
  },
}

/**
 * get, post, put, delete
 */
export function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    // 深度合并
    deepMerge(
      {
        timeout: axiosSetting.timeout || 10 * 1000,
        headers: { 'Content-Type': axiosSetting.contentType || ContentTypeEnum.JSON },
        // 数据处理方式
        transform: clone(transform),
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // 处理请求结果后，返回code,message,data, 默认直接返回data
          isTransformValidateResponse: false,
          // 接口返回的 data 自定义值
          dataField: 'data',
          codeField: 'code',
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: import.meta.env.VITE_API_BASE_URL,
          // 接口拼接地址
          urlPrefix: '',
          //  是否加入时间戳
          joinTime: true,
          /** 忽略重复请求 */
          ignoreCancelToken: false,
          /** 重复请求 非严格判断 */
          simpleCancel: false,
          // 是否携带token
          withToken: true,
          // retryRequest: {
          //   isOpenRetry: true,
          //   count: 5,
          //   waitTime: 100,
          // },

          ...axiosSetting,
        },
      },
      opt || {},
    ),
  )
}

// export const defHttp = createAxios()

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
