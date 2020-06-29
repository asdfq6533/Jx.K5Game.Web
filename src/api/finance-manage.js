import request from '@/utils/request'
/**
 * 财务管理
 * @param data
 */

/**
 * 代练对账单
 * @param data
 */
// 分页获取代练对账单
export function GetPagedSettlementsAsync(data) {
  return request({
    url: '/api/services/app/settlementService/GetPagedSettlementsAsync',
    method: 'post',
    data
  })
}

// 代练对账单结算核对
export function CheckSettlementAsync(data) {
  return request({
    url: '/api/services/app/settlementService/CheckSettlementAsync',
    method: 'post',
    data
  })
}
