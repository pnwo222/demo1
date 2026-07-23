export interface ILangArr {
  /** 语言 */
  name?: string
  /** 语言标识 */
  value?: string
  /** 排序 */
  sort?: number
}

/**
 * 百度翻译常用语言对应的字符标识
 * 自动翻译使用【百度翻译API】, 所以需要按下面标识新建json
 * 百度翻译完整语种见 https://fanyi-api.baidu.com/product/113
 * 比如要新增 【韩语】, 请在 @/locales/lang 下新建 kor.json, 然后通过 i18n Ally 插件自动翻译即可
 * 如果要做语言下拉选择框， 可以直接使用 @/hooks/system/useVuei18n/index 中的 useLangList（useLangList 的排序遵循 langArr 的顺序，详见demo）
 *
 * i18n Ally 内置语言见 https://www.hugoooo.com/i18n-ally-flags/
 * 例如：百度翻译中韩语是 kor，i18n Ally是 ko，记得在 【.vscode/setting.json】 中的【i18n-ally.localeCountryMap】中加上"kor": "ko"，这样才会正确显示该国家的图标
 */
export const langArr: ILangArr[] = [
  { name: '中文', value: 'zh' },
  { name: '英语', value: 'en' },
  { name: '粤语', value: 'yue' },
  { name: '文言文', value: 'wyw' },
  { name: '日语', value: 'jp' },
  { name: '韩语', value: 'kor' },
  { name: '法语', value: 'fra' },
  { name: '西班牙语', value: 'spa' },
  { name: '泰语', value: 'th' },
  { name: '阿拉伯语', value: 'ara' },
  { name: '俄语', value: 'ru' },
  { name: '葡萄牙语', value: 'pt' },
  { name: '德语', value: 'de' },
  { name: '意大利语', value: 'it' },
  { name: '希腊语', value: 'el' },
  { name: '荷兰语', value: 'nl' },
  { name: '波兰语', value: 'pl' },
  { name: '保加利亚语', value: 'bul' },
  { name: '爱沙尼亚语', value: 'est' },
  { name: '丹麦语', value: 'dan' },
  { name: '芬兰语', value: 'fin' },
  { name: '捷克语', value: 'cs' },
  { name: '罗马尼亚语', value: 'rom' },
  { name: '斯洛文尼亚语', value: 'slo' },
  { name: '瑞典语', value: 'swe' },
  { name: '匈牙利语', value: 'hu' },
  { name: '繁体中文', value: 'cht' },
  { name: '越南语', value: 'vie' },
]

/** key value { zh: '中文' } */
export const langMap: ILangArr = arrToMap()

export function arrToMap() {
  const langMap: ILangArr = {}
  langArr.forEach((e) => {
    langMap[e.value] = e.name
  })
  return langMap
}
