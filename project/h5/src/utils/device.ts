export interface IDevice {
  /** 浏览器内核 */
  browser: string
  /** 内核版本 */
  browserVersion: string
  /** 操作系统 */
  os: string
  /** 操作系统 版本 */
  osVersion: string
  /** 设备类型 */
  deviceModel: string
  /** 操作系统语言 */
  language: string
  /** 分辨率 */
  resolution: string
  /** 是否竖屏 */
  isPortrait: boolean
}

export const ua = navigator.userAgent
export const userAgent = ua.toLowerCase()

/** 浏览器内核 */
export function detectBrowser() {
  let browser = 'unknown'
  if (userAgent.includes('chrome')) {
    browser = 'Chrome'
  }
  else if (userAgent.includes('firefox')) {
    browser = 'Firefox'
  }
  else if (userAgent.includes('safari')) {
    browser = 'Safari'
  }
  else if (userAgent.includes('msie') || userAgent.includes('trident/')) {
    browser = 'IE'
  }
  else if (userAgent.includes('edge')) {
    browser = 'Edge'
  }
  return browser.toLowerCase()
}

/** 浏览器内核内核版本 */
export function getBrowserVersion(browser: string) {
  let version = ''
  switch (browser) {
    case 'chrome':
      {
        const chromeVersion = userAgent.match(/chrome\/([\d.]+)/)
        if (chromeVersion && chromeVersion.length > 1) {
          version = chromeVersion[1]
        }
      }
      break
    case 'firefox':
      {
        const firefoxVersion = userAgent.match(/firefox\/([\d.]+)/)
        if (firefoxVersion && firefoxVersion.length > 1) {
          version = firefoxVersion[1]
        }
      }
      break
    case 'safari':
      {
        const safariVersion = userAgent.match(/version\/([\d.]+)/)
        if (safariVersion && safariVersion.length > 1) {
          version = safariVersion[1]
        }
      }
      break
    case 'ie':
      {
        const ieVersion = userAgent.match(/msie\s([\d.]+)/)
        if (ieVersion && ieVersion.length > 1) {
          version = ieVersion[1]
        }
      }
      break
    case 'edge':
      {
        const edgeVersion = userAgent.match(/edge\/([\d.]+)/)
        if (edgeVersion && edgeVersion.length > 1) {
          version = edgeVersion[1]
        }
      }
      break
    default:
      break
  }
  return version
}

/** 操作系统 */
export function detectOS() {
  let os = 'unknown'
  if (userAgent.includes('windows')) {
    os = 'windows'
  }
  else if (userAgent.includes('macintosh')) {
    os = 'mac'
  }
  else if (userAgent.includes('iphone')) {
    os = 'ios'
  }
  else if (userAgent.includes('android')) {
    os = 'android'
  }
  return os
}

/** 判断移动端 */
export function isMobileDevice() {
  const os = detectOS()
  return os === 'ios' || os === 'android'
}

/** 判断PC端 */
export function isPcDevice() {
  const os = detectOS()
  return os === 'windows' || os === 'mac'
}

/** 设备类型 */
export function getDeviceModel(os) {
  let model = ''
  switch (os) {
    case 'windows':
      // 不支持获取Windows设备型号
      break
    case 'mac':
      // 不支持获取Mac设备型号
      break
    case 'ios':
      {
        const iosModel = userAgent.match(/(iphone|ipad)/)
        if (iosModel && iosModel.length > 0) {
          model = iosModel[0]
        }
      }
      break
    case 'android':
      {
        const androidModel = userAgent.match(/android\s[^\s;]+;\s([^)]+)\)/)
        if (androidModel && androidModel.length > 1) {
          model = androidModel[1]
        }
      }
      break
    default:
      break
  }
  return model
}

/** 操作系统 版本 */
export function getOSVersion(os: string) {
  let version = ''
  switch (os) {
    case 'windows':
      {
        const winVersion = userAgent.match(/windows\snt\s([\d.]+)/)
        if (winVersion && winVersion.length > 1) {
          version = winVersion[1]
        }
      }
      break
    case 'mac':
      {
        const macVersion = userAgent.match(/mac\sos\sx\s([\d_]+)/)
        if (macVersion && macVersion.length > 1) {
          version = macVersion[1].replace(/_/g, '.')
        }
      }
      break
    case 'ios':
      {
        const iosVersion = userAgent.match(/iphone\sos\s([\d_]+)/)
        if (iosVersion && iosVersion.length > 1) {
          version = iosVersion[1].replace(/_/g, '.')
        }
      }
      break
    case 'android':
      {
        const androidVersion = userAgent.match(/android\s([\d.]+)/)
        if (androidVersion && androidVersion.length > 1) {
          version = androidVersion[1]
        }
      }
      break
    default:
      break
  }
  return version
}

/** 是竖屏 */
export function getOrientation() {
  const portrait = window.matchMedia('(orientation: portrait)')
  return portrait.matches
}

/** 当前设备信息 */
export function getDevice(): IDevice {
  const browser = detectBrowser()
  const browserVersion = getBrowserVersion(browser)

  const os = detectOS()
  const osVersion = getOSVersion(os)
  const deviceModel = getDeviceModel(os)
  const language = navigator.language
  const resolution = `${window.screen.width * window.devicePixelRatio} * ${window.screen.height * window.devicePixelRatio}`
  const isPortrait = getOrientation()

  return {
    browser,
    browserVersion,
    os,
    osVersion,
    deviceModel,
    language,
    resolution,
    isPortrait,
  }
}
