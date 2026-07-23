import type { MockMethod } from 'vite-plugin-mock'
import { Random } from 'mockjs'
import { resultSuccess } from '../_util'

// mock http://mockjs.com/examples.html

/**
 * 强烈建议使用 apifox， 而不是此框架的 mock 方法
 * apifox 创建mock数据，需要与后端配合
 * https://apifox.com/
 */

const baseUrl = '/deploy'

enum Api {
  /** 登录 */
  LOGIN = '/login',
  /** 获取用户信息 */
  INFO = '/user/one/info',
}

const loginData = {
  accessToken: '@natural',
  refreshToken: '@natural',
}

const userInfoData = {
  id: '@guid',
  avatar: Random.image('400x400', '#FF6600', 'mock'),
  signature: Random.image('200x100', '#FF6600', 'mock'),
  openId: '@guid',
  platformId: '@guid',
  account: '@cname',
  name: '@cname',
  nickname: '@cname',
  gender: '@pick(["男", "女"])',
  age: '@integer(18, 60)',
  birthday: '@date("yyyy-MM-dd")',
  nation: '@pick(["汉族", "满族", "蒙古族", "回族", "藏族"])',
  nativePlace: '@province',
  homeAddress: '@county(true)',
  mailingAddress: '@county(true)',
  idCardType: '@pick(["身份证", "护照", "军官证"])',
  idCardNumber: '@string("number", 18)',
  socialCardNumber: '@string("number", 18)',
  cultureLevel: '@pick(["小学", "初中", "高中", "大专", "本科", "硕士", "博士"])',
  politicalOutlook: '@pick(["群众", "共青团员", "中共党员"])',
  college: '@pick(["清华大学", "北京大学", "复旦大学", "上海交通大学"])',
  education: '@pick(["大专", "本科", "硕士", "博士"])',
  eduLength: '@pick(["3年", "4年", "5年"])',
  degree: '@pick(["学士", "硕士", "博士"])',
  phone: /^1[3-9]\d{9}$/,
  email: '@email',
  homeTel: /^0\d{2,3}-\d{7,8}$/,
  officeTel: /^0\d{2,3}-\d{7,8}$/,
  emergencyContact: '@cname',
  emergencyPhone: /^1[3-9]\d{9}$/,
  emergencyAddress: '@county(true)',
  lastLoginIp: '@ip',
  lastLoginAddress: '@city',
  lastLoginTime: '@datetime',
  lastLoginDevice: '@pick(["iPhone", "Android", "Windows", "MacOS"])',
  latestLoginIp: '@ip',
  latestLoginAddress: '@city',
  latestLoginTime: '@datetime',
  latestLoginDevice: '@pick(["iPhone", "Android", "Windows", "MacOS"])',
  userStatus: '@pick(["正常", "禁用"])',
  sortCode: '@integer(1, 100)',
  extJson: '{}',
  identityType: '@pick(["0", "1", "2", "3", "4"])',
  stuNo: '@string("number", 10)',
  stuCollegeName: '@pick(["计算机学院", "机械工程学院", "经济管理学院"])',
  stuCollegeCode: '@string("number", 4)',
  stuMajorName: '@pick(["计算机科学与技术", "软件工程", "人工智能"])',
  stuClassName: '@pick(["计算机1班", "计算机2班", "软件1班"])',
  stuStatus: '@pick(["在读", "休学", "退学"])',
  stuActivatedStatus: '@pick(["已激活", "未激活"])',
  teaNo: '@string("number", 8)',
  teaDeptName: '@pick(["计算机系", "软件工程系", "人工智能系"])',
  teaTitle: '@pick(["教授", "副教授", "讲师", "助教"])',
  teaStatus: '@pick(["在职", "离职", "退休"])',
  teaActivatedStatus: '@pick(["已激活", "未激活"])',
  isHomeCheck: '@pick(["0", "1"])',
  buttonCodeList: ['btn1', 'btn2', 'btn3'],
  mobileButtonCodeList: ['mobileBtn1', 'mobileBtn2'],
  enabled: true,
}

export default [
  {
    url: `${baseUrl}${Api.LOGIN}`,
    timeout: 100,
    method: 'post',
    response: () => {
      return resultSuccess(loginData)
    },
  },
  {
    url: `${baseUrl}${Api.INFO}`,
    timeout: 100,
    method: 'get',
    response: () => {
      return resultSuccess(userInfoData)
    },
  },
] as MockMethod[]
