import request from '@/utils/request'

export function getFinance(data) {
  return request({
    url: '/api/services/k5game/appFinance/GetFinance',
    method: 'post',
    data
  })
}

/**
 * 财务报表
 * @param data
 */
export function getPurchaseAccountFinance(data) {
  return request({
    url: '/api/services/k5game/appFinance/GetPurchaseAccountFinance',
    method: 'post',
    data
  })
}

/**
 * 利润报表
 * @param data
 */
export function getProfitFinance(data) {
  return request({
    url: '/api/services/k5game/appFinance/GetProfitFinance',
    method: 'post',
    data
  })
}

/**
 * 账号交易每日报表
 * @param data
 */
export function getAccountTransReport(data) {
  return request({
    url: '/api/services/k5game/appFinance/GetAccountTransReport',
    method: 'post',
    data
  })
}

/**
 * 销售订单详情报表
 * @param data
 * @constructor
 */
export function GetOrderReport(data) {
  return request({
    url: '/api/services/k5game/appFinance/GetOrderReport',
    method: 'post',
    data
  })
}

/**
 * 账号采购详情报表
 * @param data
 * @constructor
 */
export function GetPurchaseReport(data) {
  return request({
    url: '/api/services/k5game/appFinance/GetPurchaseReport',
    method: 'post',
    data
  })
}

/**
 * 销售订单详情报表
 * @param data
 * @constructor
 */
export function GetAllPurchaseReport(data) {
  return request({
    url: '/api/services/k5game/appFinance/GetAllPurchaseReport',
    method: 'post',
    data
  })
}
