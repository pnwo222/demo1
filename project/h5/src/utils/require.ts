/** 引入资源 */
export function requireImage(url: string): string {
  return new URL(`/src/assets/${url}`, import.meta.url).href
}
