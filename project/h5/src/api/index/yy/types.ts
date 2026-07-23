/** 访客预约记录类型 */
export interface IVisitRecord {
  /** 申请记录主键 */
  id: string
  /** 来访人姓名 */
  visitorName: string
  /** 身份证号 */
  idCard: string
  /** 手机号 */
  phoneNumber: string
  /** 被访人姓名 */
  intervieweeName: string
  /** 被访人工号 */
  intervieweeCode: string
  /** 来访单位 */
  visitUnit: string
  /** 拜访部门 */
  visitDept: string
  /** 部门编码 */
  visitDeptCode: string
  /** 拜访事由 */
  visitFor: string
  /** 拜访事由说明 */
  visitForExplain: string
  /** 开始时间（yyyy-MM-dd） */
  startTime: string
  /** 结束时间（yyyy-MM-dd） */
  endTime: string
  /** 车牌号 */
  plateNumber: string
  /** 预计入校时间（HH:mm:ss） */
  estimateArrivalTime: string
  /** 实际入校时间（yyyy-MM-dd HH:mm:ss） */
  admissionTime: string
  /** 本人承诺 1:是 2:否 */
  selfPromise: string | boolean
  /** 是否有相关症状 1=否,2=是 */
  symptom: string
  /** 审核进度 */
  auditProgress: string
  /** 审核状态 */
  auditStatus: string
}

/** 访客申请参数类型 */
export interface IVisitApplyParams {
  /** 来访人姓名 */
  visitorName: string
  /** 身份证号 */
  idCard: string
  /** 手机号 */
  phoneNumber: string
  /** 被访人姓名 */
  intervieweeName: string
  /** 被访人工号 */
  intervieweeCode: string
  /** 来访单位 */
  visitUnit: string
  /** 拜访部门 */
  visitDept: string
  /** 部门编码 */
  visitDeptCode: string
  /** 拜访事由 */
  visitFor: string
  /** 拜访事由说明 */
  visitForExplain: string
  /** 开始时间（yyyy-MM-dd） */
  startTime: string
  /** 结束时间（yyyy-MM-dd） */
  endTime: string
  /** 车牌号 */
  plateNumber?: string
  /** 预计入校时间（HH:mm:ss） */
  estimateArrivalTime: string
  /** 本人承诺 1:是 2:否 */
  selfPromise: string
  /** 是否有相关症状 1=否,2=是 */
  symptom: string
}

/** 部门信息类型 */
export interface IDepartment {
  /** 部门编码 */
  code: string
  /** 部门名称 */
  name: string
}

/** 访客记录列表响应类型 */
export interface IVisitPageResponse {
  /** 记录列表 */
  records: IVisitRecord[]
  /** 总数量 */
  total: number
  /** 当前页码 */
  current: number
  /** 每页大小 */
  size: number
}
