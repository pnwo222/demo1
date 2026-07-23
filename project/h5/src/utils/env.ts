/**
 * @description: Development mode
 */
export const devMode = 'development'

/**
 * @description: Production mode
 */
export const prodMode = 'production'

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE
}

/** 开发环境 */
export function isDevMode(): boolean {
  return import.meta.env.DEV
}

/** 测试环境 */
export function isTestMode(): boolean {
  return import.meta.env.PROD && import.meta.env.MODE === 'test'
}

/** 预发环境 */
export function isPreMode(): boolean {
  return import.meta.env.PROD && import.meta.env.MODE === 'pre'
}
/** 生产环境 */
export function isProdMode(): boolean {
  return import.meta.env.PROD && import.meta.env.MODE === 'production'
}
