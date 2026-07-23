/**
 * des: 代码发布配置
 * @param {
 *
 * global 全局配置
 *   - name 项目名称
 *   - code 项目编码
 *   - remark 项目介绍
 *   - plantForm 客户端类型，1 全部，2 PC端，3 移动端 默认1
 *
 * test 测试环境配置
 *   - name,code,remark 不配置默认读取 global
 *   - apiURL 接口地址
 *   - versionManagement 是否开启版本管理，只对测试环境生效。不开启版本管理的情况下，autoDeploy会强制为ture，即自动发布
 *   - autoDeploy 测试环境可以自动发布；线上只会传包，需要运维发布
 *
 * pre 预发环境配置
 *   - name,code,remark 不配置默认读取 global
 *   - apiURL 接口地址
 *
 * pro 生产环境配置
 *   - name,code,remark 不配置默认读取 global
 *   - apiURL 接口地址
 * }
 */

module.exports = {
  global: {
    name: '一卡通-纺院专区',
    code: 'zfit',
    remark: '一卡通-纺院专区 h5',
    plantForm: 2,
  },
  test: {
    apiURL: 'http://192.168.18.126:8799/deploy',
    ws: 'http://192.168.18.126/ws',
    versionManagement: false,
    autoDeploy: true,
  },
  // 预发布环境，很多时候和正式环境是同一个服务器，创建一个新的项目编码即可
  pre: {
    apiURL: '',
  },
  pro: {
    // name: '',
    // code: '',
    // remark: '',
    apiURL: '',
  },
}
