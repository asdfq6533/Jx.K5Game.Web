import request from '@/utils/request'

/**
 * 任务列表
 * @param data
 * @constructor
 */
export function GetPagedTasksAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetPagedTasksAsync',
    method: 'post',
    data
  })
}

/**
 * 创建任务
 * @param data
 * @constructor
 */
export function CreateTaskAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/CreateTaskAsync',
    method: 'post',
    data
  })
}

/**
 * 编辑任务
 * @param data
 * @constructor
 */
export function EditTaskAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/EditTaskAsync',
    method: 'post',
    data
  })
}

/**
 * 编辑任务状态
 * @param data
 * @constructor
 */
export function EditTaskStatuAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/EditTaskStatuAsync',
    method: 'post',
    data
  })
}

/**
 * 编辑任务状态
 * @param data
 * @constructor
 */
export function DeleteTaskStatuAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/DeleteTaskStatuAsync',
    method: 'post',
    data
  })
}
/**
 * 审核列表
 * @param data
 * @constructor
 */
export function GetReceivedTasksAllAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetReceivedTasksAllAsync',
    method: 'post',
    data
  })
}

/**
 * 审核材料列表
 * @param data
 * @constructor
 */
export function GetTaskAuditsListAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetTaskAuditsListAsync',
    method: 'post',
    data
  })
}

/**
 * 通过/不通过审核材料
 * @param data
 * @constructor
 */
export function CheckTaskAuditsAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/CheckTaskAuditsAsync',
    method: 'post',
    data
  })
}

/**
 * 继续或作废
 * @param data
 * @constructor
 */
export function CheckTaskPassAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/CheckTaskPassAsync',
    method: 'post',
    data
  })
}

/**
 * 提现申请列表
 * {
  "userName": "string",
  "phoneNumber": "string",
  "sorting": "string",
  "maxResultCount": 0,
  "skipCount": 0
}
 * @param data
 * @constructor
 */
export function GetDrawAssetsAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetDrawAssetsAsync',
    method: 'post',
    data
  })
}
/**
 * 发送验证吗
 * {
  "phoneNumber": "string"
}
 * @param data
 */
export function SendVerificationCodeAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/SendVerificationCodeAsync',
    method: 'post',
    data
  })
}

/**
 * 提现审核
 * {
  "drawId": "string",
  "isPass": true,
  "code": "string",
  "remark": "string"
}
 * @param {*} data
 */
export function CashAuditAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/CashAuditAsync',
    method: 'post',
    data
  })
}

/**
 * 提现明细表
 * {
  "drawId": "string"
}
 * @param {*} data
 */
export function GetDrawDetailedAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetDrawDetailedAsync',
    method: 'post',
    data
  })
}

/**
 * 取状态
 *tagtype 0  1  2  分别对应 任务管理  任务审核管理  刷单金额管理
 * @param {*} data
 */
export function GetCountByStatusAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetCountByStatusAsync',
    method: 'post',
    data
  })
}

/**
 * 清理超时
 * @param {*} data
 */
export function ClearTimeOutTaskAsync(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/ClearTimeOutTaskAsync',
    method: 'post',
    data
  })
}

/**
 * 报表
 * @param {*} data
 */
export function GetReport(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetReport',
    method: 'post',
    data
  })
}

/**
 * 店铺
 * @param {*} data
 */
export function GetReportByShopName(data) {
  return request({
    url: '/api/services/k5game/taskCenterService/GetReportByShopName',
    method: 'post',
    data
  })
}
