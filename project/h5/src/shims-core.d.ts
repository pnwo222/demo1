/**
 * 此处配置 app.config.globalProperties 上的新增的类型
 */

declare module 'vue' {
  export interface ComponentCustomProperties {
    /** px 转 vw 不需要要带单位 例如 px2vw(14) */
    px2vw: (key: number | string) => string
    /** 引入 /src/assets/* 下的图片和资源  */
    requireImage: (key: string) => string
  }
}

export {}
