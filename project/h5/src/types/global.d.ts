declare global {
  declare type Nullable<T> = T | null
  declare type Recordable<T = any> = Record<string, T>

  declare interface ViteEnv {
    /** 本地运行端口 */
    VITE_PORT?: number
    /** 使用mock */
    VITE_USE_MOCK?: boolean
    /** 发布路径 */
    VITE_PUBLIC_PATH?: string
    /** 代理地址 */
    VITE_PROXY?: [string, string][]
    /** 项目目录，即打包文件夹名 */
    VITE_APP_CODE?: string
    /** 项目标题 */
    VITE_APP_TITLE?: string
    /** 接口地址 */
    VITE_API_BASE_URL?: string
    /** 接口地址前缀 */
    VITE_API_URL_PREFIX?: string
    /** 是否使用旧浏览器 */
    VITE_LEGACY?: boolean
    /** 兼容规则 */
    VITE_LEGACY_BROWSER?: string[]
    /** 是否打开vconsole */
    VITE_USE_VCONSOLE?: boolean
    /** 是否使用 unocss */
    VITE_USE_UNOCSS?: boolean
    /** 压缩方式 */
    VITE_BUILD_COMPRESS?: 'gzip' | 'brotli' | 'none'
    /** 使用压缩时是否删除原始文件，默认为false */
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE?: boolean
    /** px 转 vw 设计稿宽度 */
    VITE_VW_WIDTH?: number
    /** 是否生成依赖分析文件 根目录 stats.html */
    VITE_USE_REPORT?: boolean
    /** 是否启用 i18n 多语言 */
    VITE_USE_I18N?: boolean
  }
}

export {}
