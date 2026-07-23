import type { UserIdentityType } from './enums'

export interface ILoginParams {
  /** 账号 */
  account: string
  /** 密码 */
  password: string
}

/** 用户信息响应数据类型 */
export interface IUserInfo {
  /** id */
  id: string
  /** 头像，图片base64 */
  avatar: string
  /** 签名，图片base64 */
  signature: string
  /** 三中心用户id */
  threeCentersUserId: string
  /** 五竹数据中台的id */
  platformId: string
  /** 账号 */
  account: string
  /** 姓名 */
  name: string
  /** 昵称 */
  nickname: string
  /** 性别 */
  gender: string
  /** 年龄 */
  age: string
  /** 出生日期 */
  birthday: string
  /** 民族 */
  nation: string
  /** 籍贯 */
  nativePlace: string
  /** 家庭住址 */
  homeAddress: string
  /** 通信地址 */
  mailingAddress: string
  /** 证件类型 */
  idCardType: string
  /** 证件号码 */
  idCardNumber: string
  /** 文化程度 */
  cultureLevel: string
  /** 政治面貌 */
  politicalOutlook: string
  /** 毕业院校 */
  college: string
  /** 学历 */
  education: string
  /** 学制 */
  eduLength: string
  /** 学位 */
  degree: string
  /** 手机 */
  phone: string
  /** 邮箱 */
  email: string
  /** 家庭电话 */
  homeTel: string
  /** 办公电话 */
  officeTel: string
  /** 紧急联系人 */
  emergencyContact: string
  /** 紧急联系人电话 */
  emergencyPhone: string
  /** 紧急联系人地址 */
  emergencyAddress: string
  /** 上次登录ip */
  lastLoginIp: string
  /** 上次登录地点 */
  lastLoginAddress: string
  /** 上次登录时间 */
  lastLoginTime: string
  /** 上次登录设备 */
  lastLoginDevice: string
  /** 最新登录ip */
  latestLoginIp: string
  /** 最新登录地点 */
  latestLoginAddress: string
  /** 最新登录时间 */
  latestLoginTime: string
  /** 最新登录设备 */
  latestLoginDevice: string
  /** 用户状态 */
  userStatus: string
  /** 排序码 */
  sortCode: number
  /** 扩展信息 */
  extJson: string
  /** 人员身份：0.访客；1.新生；2.在校生；3.校友（毕业生）；4.教职工 */
  identityType: string
  /** 学生的学号 */
  stuNo: string
  /** 学生的学院名称 */
  stuCollegeName: string
  /** 学生的学院代码 */
  stuCollegeCode: string
  /** 学生的专业名称 */
  stuMajorName: string
  /** 学生的班级名称 */
  stuClassName: string
  /** 学生的学籍状态 */
  stuStatus: string
  /** 学生的激活状态 */
  stuActivatedStatus: string
  /** 教职工的工号 */
  teaNo: string
  /** 教职工的单位名称 */
  teaDeptName: string
  /** 教职工的职称 */
  teaTitle: string
  /** 教职工的人员状态 */
  teaStatus: string
  /** 教职工的激活状态 */
  teaActivatedStatus: string
  /** 校友的学号 */
  aluNo: string
  /** 校友入学年 */
  aluJoinYear: string
  /** 校友的毕业年 */
  aluGraduateYear: string
  /** 校友的学院 */
  aluCollege: string
  /** 校友的专业 */
  aluMajor: string
  /** 校友的班级 */
  aluClass: string
  /** 校友的组织名称 */
  aluOrgTitle: string
  /** 校友的学历 */
  aluEdu: string
  /** 校友的激活状态 */
  aluActivatedStatus: string
  /** 卡应用状态 */
  aaz502: string
  /** 社会保障号 */
  aac002: string
  /** 行政区划代码 */
  aab301: string
  /** 行政区划代码描述 */
  aab301Desc: string
  /** 卡规范版本 */
  aaz508: string
  /** 开户银行行号 */
  aac080: string
  /** 社保卡金融账户激活状态 */
  kzt: string
  /** 社保卡信息id */
  aaz007: string
  /** 社会保障卡卡号 */
  aaz500: string
  /** 卡识别码 */
  aaz501: string
  /** 是否在首页选过身份，0.没有；1.选过 */
  isHomeCheck: string
  /** 按钮码集合 */
  buttonCodeList: string[]
  /** 移动端按钮码集合 */
  mobileButtonCodeList: string[]
  /** 是否启用 */
  enabled: boolean

  /** 单位名称 */
  companyName: string
  /** 职务 */
  companyPosition: string
  /** 地址 */
  companyAddress: string
}

/** 通用响应结果类型 */
export interface IApiResponse<T = any> {
  /** 状态码 */
  code: number
  /** 提示语 */
  msg: string
  /** 响应数据 */
  data: T
}

/** 获取用户信息响应类型 */
export type IGetUserInfoResponse = IUserInfo

/** 获取用户信息请求参数类型 */
export interface IGetUserInfoParams {
  // 根据API文档，该接口暂无请求参数
}
