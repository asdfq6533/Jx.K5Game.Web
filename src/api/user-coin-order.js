import request from '@/utils/request'

/**
 * 友谊赛充值
 * @param data
 * @constructor
 */
export function CreateMatchRechargeOrder(data) {
  return request({
    url: '/api/services/k5game/userCoinOrder/CreateMatchRechargeOrder',
    method: 'post',
    data
  })
}

/**
 * 微信支付宝充值
 * @param data
 * @constructor
 */
export function CreateRechargeOrderDashboard(data) {
  return request({
    url: '/api/services/k5game/userCoinOrder/CreateRechargeOrderDashboard',
    method: 'post',
    data
  })
}

/**
 * 创建二维码支付
 * @param data
 * @constructor
 */
export function Create(data) {
  return request({
    url: '/api/services/k5game/payment/Create',
    method: 'post',
    data
  })
}
