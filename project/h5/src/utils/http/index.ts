import { createAxios } from '@/utils/http/axios'

/**
 * axios请求
 * get, post, put, delete, uploadFile
 */
export const defHttp = createAxios()

// 其他接口请求
export const hugoHttp = createAxios({
  requestOptions: {
    apiUrl: 'https://www.hugoooo.com',
    requestInterceptors: (config) => {
      return config
    },
  },
})
