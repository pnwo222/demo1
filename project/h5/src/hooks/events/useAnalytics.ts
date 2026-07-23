import { TOKEN_KEY } from '@/enums/cacheEnum'
import { encryptByAES } from '@/utils/crypto'
import { useStorage } from '../system/useStorage'

const appId = '202509221357'
const appName = '纺院专区'
const pointURL = 'https://www.hugoooo.com/deploy/send.png'

/**
 * 安全地序列化对象，处理循环引用
 */
function safeStringify(obj: any, space?: number): string {
  const seen = new WeakSet()
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]'
      }
      seen.add(value)
    }
    return value
  }, space)
}

/**
 * 清理错误对象，移除可能导致循环引用的属性
 */
function sanitizeError(error: any): any {
  if (!error || typeof error !== 'object') {
    return error
  }

  // 创建一个新的对象，只包含安全的属性
  const sanitized: any = {}
  // 基本属性
  if (error.message !== undefined) sanitized.message = error.message
  if (error.name !== undefined) sanitized.name = error.name
  if (error.stack !== undefined) sanitized.stack = error.stack
  if (error.code !== undefined) sanitized.code = error.code
  if (error.filename !== undefined) sanitized.filename = error.filename
  if (error.lineno !== undefined) sanitized.lineno = error.lineno
  if (error.colno !== undefined) sanitized.colno = error.colno
  // 自定义属性（排除可能导致循环引用的）
  const excludeKeys = ['originalReason', 'promise', 'target', 'currentTarget', 'srcElement']
  for (const key in error) {
    if (Object.prototype.hasOwnProperty.call(error, key) && !excludeKeys.includes(key)) {
      try {
        // 尝试序列化来检查是否有循环引用
        JSON.stringify(error[key])
        sanitized[key] = error[key]
      }
      catch {
        // 如果有循环引用，则跳过或替换为字符串表示
        sanitized[key] = `[${typeof error[key]}] ${error[key]?.constructor?.name || 'Object'}`
      }
    }
  }

  return sanitized
}

/**
 * 获取页面上下文信息
 */
function getPageContext() {
  if (typeof window === 'undefined') return {}

  return {
    url: window.location.href,
    referrer: document.referrer,
    title: document.title,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    connection: (navigator as any).connection
      ? {
          effectiveType: (navigator as any).connection.effectiveType,
          downlink: (navigator as any).connection.downlink,
          rtt: (navigator as any).connection.rtt,
        }
      : null,
  }
}

/**
 * 获取用户操作上下文
 */
function getUserActionContext() {
  if (typeof window === 'undefined') return {}

  return {
    timestamp: Date.now(),
    performance: {
      navigation: performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming,
      memory: (performance as any).memory
        ? {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
            jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
          }
        : null,
    },
    // 尝试获取最近的操作信息
    lastInteraction: (() => {
      try {
        const entries = performance.getEntriesByType('event')
        const lastEntry = entries[entries.length - 1] as PerformanceEventTiming
        return lastEntry
          ? {
              type: lastEntry.name,
              startTime: lastEntry.startTime,
              duration: lastEntry.duration,
            }
          : null
      }
      catch {
        return null
      }
    })(),
  }
}

/**
 * 解析错误堆栈信息
 */
function parseErrorStack(stack: string | undefined) {
  if (!stack) return null

  try {
    const lines = stack.split('\n')
    const firstLine = lines[0] || ''
    const stackLines = lines.slice(1).map((line) => {
      // eslint-disable-next-line
      const match = line.match(/at\s+([^(]+)\s+\(([^:]+):(\d+):(\d+)\)/)
      if (match) {
        return {
          function: match[1],
          file: match[2],
          line: Number.parseInt(match[3]),
          column: Number.parseInt(match[4]),
        }
      }
      return { raw: line.trim() }
    })

    return {
      message: firstLine,
      stack: stackLines,
    }
  }
  catch {
    return { raw: stack }
  }
}

/**
 * 发送异常埋点数据
 * @param error 异常对象
 * @param baseUrl 埋点服务器地址，默认
 * @param additionalInfo 额外的错误信息
 */
export async function sendErrorAnalytics(
  error: Error | string | any,
  baseUrl: string = pointURL,
  additionalInfo: Record<string, any> = {},
): Promise<void> {
  try {
    // 安全地提取错误信息
    let message: string
    let stack: string | undefined
    let errorType: string = 'unknown'
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'

    if (error instanceof Error) {
      message = error.message
      stack = error.stack
      errorType = error.constructor.name

      // 根据错误类型判断严重程度
      if (error.name === 'TypeError' || error.name === 'ReferenceError') {
        severity = 'high'
      }
      else if (error.name === 'SyntaxError') {
        severity = 'critical'
      }
      else if (error.name === 'NetworkError' || error.name === 'TimeoutError') {
        severity = 'medium'
      }
    }
    else if (typeof error === 'string') {
      message = error
      errorType = 'StringError'
    }
    else if (error && typeof error === 'object') {
      // 处理对象类型的错误
      if (error.message) {
        message = String(error.message)
      }
      else if (error.toString && error.toString() !== '[object Object]') {
        message = error.toString()
      }
      else {
        // 尝试序列化对象，如果失败则使用默认信息
        try {
          message = JSON.stringify(error)
        }
        catch {
          message = `未知错误对象: ${error.constructor?.name || 'Object'}`
        }
      }
      stack = error.stack
      errorType = error.constructor?.name || 'ObjectError'
    }
    else {
      message = String(error)
      errorType = 'PrimitiveError'
    }

    // 解析堆栈信息
    const parsedStack = parseErrorStack(stack)

    // 获取页面和用户上下文
    const pageContext = getPageContext()
    const userActionContext = getUserActionContext()

    // 构建异常数据
    const errorData = {
      appId,
      appName,
      token: useStorage.ls.get(TOKEN_KEY, null, `${useStorage.ls.get('openId')}_`) || '',
      type: 'error',
      errorType,
      severity,
      message,
      stack,
      parsedStack,
      timestamp: Date.now(),
      // pageContext,
      // userActionContext,
      additionalInfo: sanitizeError(additionalInfo),
      // 兼容性字段
      url: pageContext.url,
      userAgent: pageContext.userAgent,
    }

    // 将异常数据转换为JSON字符串，使用安全的序列化方法
    const errorJson = safeStringify(errorData)

    // 使用AES加密参数
    const encryptedParams = encryptByAES(errorJson)

    // 构建请求URL
    const url = `${baseUrl}?params=${encodeURIComponent(encryptedParams)}`

    // 创建图片请求发送埋点
    const img = new Image()
    img.src = url
  }
  catch (err) {
    console.error('异常埋点发送失败:', err)
  }
}

/**
 * 初始化全局异常监听
 * @param baseUrl 埋点服务器地址，默认
 */
export function initErrorTracking(baseUrl: string = pointURL): void {
  console.log('[Error Tracking] 初始化错误追踪系统', { baseUrl })

  // 监听 JavaScript 运行时错误
  window.addEventListener('error', (event) => {
    console.error('[JavaScript Error]', event)

    if (event.target === window) {
      // JavaScript 运行时错误

      // 构建详细的错误信息
      const errorInfo = {
        eventType: 'javascript_error',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        message: event.message,
        isTrusted: event.isTrusted,
        bubbles: event.bubbles,
        cancelable: event.cancelable,
        defaultPrevented: event.defaultPrevented,
        eventPhase: event.eventPhase,
        timeStamp: event.timeStamp,
        type: event.type,
      }

      // 创建增强的错误对象
      const enhancedError = event.error || new Error(event.message)
      if (enhancedError instanceof Error) {
        // 添加额外的错误信息
        ;(enhancedError as any).filename = event.filename
        ;(enhancedError as any).lineno = event.lineno
        ;(enhancedError as any).colno = event.colno
      }

      sendErrorAnalytics(enhancedError, baseUrl, errorInfo)
    }
    else {
      // 资源加载错误
      console.log('[资源加载错误 error]', event)
      const target = event.target as HTMLElement
      let errorMessage = '资源加载失败'
      let resourceType = 'unknown'
      let resourceUrl = ''

      if (target) {
        // 获取更详细的错误信息
        if (target.tagName) {
          errorMessage += `: ${target.tagName.toLowerCase()}`
          resourceType = target.tagName.toLowerCase()
        }

        // 检查是否是图片元素
        if (target instanceof HTMLImageElement && target.src) {
          errorMessage += ` (src: ${target.src})`
          resourceUrl = target.src
        }
        // 检查是否是链接元素
        else if (target instanceof HTMLAnchorElement && target.href) {
          errorMessage += ` (href: ${target.href})`
          resourceUrl = target.href
        }
        // 检查是否是脚本元素
        else if (target instanceof HTMLScriptElement && target.src) {
          errorMessage += ` (src: ${target.src})`
          resourceUrl = target.src
        }
        // 检查是否是样式表元素
        else if (target instanceof HTMLLinkElement && target.href) {
          errorMessage += ` (href: ${target.href})`
          resourceUrl = target.href
        }

        if (target.id) {
          errorMessage += ` (id: ${target.id})`
        }
        if (target.className) {
          errorMessage += ` (class: ${target.className})`
        }
      }

      // 构建资源加载错误的详细信息
      const resourceErrorInfo = {
        eventType: 'resource_load_error',
        resourceType,
        resourceUrl,
        targetTagName: target?.tagName,
        targetId: target?.id,
        targetClassName: target?.className,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        isTrusted: event.isTrusted,
        timeStamp: event.timeStamp,
      }

      const resourceError = new Error(errorMessage)
      ;(resourceError as any).resourceError = true
      ;(resourceError as any).resourceType = resourceType
      ;(resourceError as any).resourceUrl = resourceUrl

      sendErrorAnalytics(resourceError, baseUrl, resourceErrorInfo)
    }
  }, true)

  // 监听未处理的 Promise 拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.log('[unhandledrejection]', event)

    // 构建详细的 Promise 拒绝信息
    const rejectionInfo = {
      eventType: 'unhandled_rejection',
      reason: event.reason,
      promise: event.promise,
      isTrusted: event.isTrusted,
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      defaultPrevented: event.defaultPrevented,
      eventPhase: event.eventPhase,
      timeStamp: event.timeStamp,
      type: event.type,
      // Promise 状态信息
      promiseState: (() => {
        try {
          // 尝试获取 Promise 的状态信息
          if (event.promise && typeof event.promise === 'object') {
            return {
              constructor: event.promise.constructor.name,
              // 注意：无法直接获取 Promise 的内部状态，但可以记录一些基本信息
              hasThen: typeof event.promise.then === 'function',
              hasCatch: typeof event.promise.catch === 'function',
            }
          }
        }
        catch {
          // 忽略获取状态时的错误
        }
        return null
      })(),
    }

    // 创建增强的错误对象
    let enhancedError: Error
    if (event.reason instanceof Error) {
      enhancedError = event.reason
    }
    else if (typeof event.reason === 'string') {
      enhancedError = new Error(`Promise rejected: ${event.reason}`)
    }
    else if (event.reason && typeof event.reason === 'object') {
      try {
        enhancedError = new Error(`Promise rejected: ${JSON.stringify(event.reason)}`)
      }
      catch {
        enhancedError = new Error(`Promise rejected: ${String(event.reason)}`)
      }
    }
    else {
      enhancedError = new Error(`Promise rejected: ${String(event.reason)}`)
    }

    // 添加 Promise 相关信息到错误对象
    ;(enhancedError as any).promiseRejection = true
    ;(enhancedError as any).originalReason = sanitizeError(event.reason)

    sendErrorAnalytics(enhancedError, baseUrl, rejectionInfo)
  })
}

// 默认导出
export default sendErrorAnalytics
