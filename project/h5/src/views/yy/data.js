export const reason = [
  {
    text: '培训',
    value: 1,
  },
  {
    text: '施工',
    value: 2,
  },
  {
    text: '访客',
    value: 3,
  },
  {
    text: '考试',
    value: 5,
  },
  {
    text: '比赛',
    value: 6,
  },
  {
    text: '会议',
    value: 7,
  },
  {
    text: '维修/维保',
    value: 8,
  },
  {
    text: '其他',
    value: 4,
  },
]

export const reasonMap = reason.reduce((acc, item) => {
  acc[item.value] = item.text
  return acc
}, {})

export const auditStatus = [
  {
    text: '通过',
    value: 1,
  },
  {
    text: '待被访人审核',
    value: 2,
  },
  {
    text: '待部门领导审核',
    value: 3,
  },
  {
    text: '不通过',
    value: 4,
  },
]

export const auditStatusMap = auditStatus.reduce((acc, item) => {
  acc[item.value] = item.text
  return acc
}, {})
