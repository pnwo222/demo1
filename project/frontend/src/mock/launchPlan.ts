export const coreJourney = [
  '浏览商家',
  '选择商品',
  '加入购物车',
  '提交订单',
  '完成支付',
  '商家接单',
  '配送履约'
]

export const launchReadiness = [
  {
    title: '移动端主链路',
    description: '围绕用户点餐、购物车、下单和支付预估搭建 H5 首屏信息结构。',
    status: 'mock-ready'
  },
  {
    title: '角色边界',
    description: '用户、商家、骑手和平台运营的入口先以 mock 状态呈现，等待接口契约接入。',
    status: 'contract-needed'
  },
  {
    title: '高风险规则',
    description: '金额、库存、订单状态和退款流程保留后端校验提示，不在前端写死最终计算。',
    status: 'backend-owned'
  }
]

export const qualityGates = [
  '前端 Typecheck',
  '移动端构建',
  '下单主链路验收',
  '支付与订单状态审查'
]
