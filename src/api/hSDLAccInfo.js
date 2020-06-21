import request from '@/utils/request'

export function GetPagedHSDLAccInfosAsync(data) {
  return request({
    url: '/api/services/k5game/hSDLAccInfo/GetPagedHSDLAccInfosAsync',
    method: 'post',
    data
  })
}

export function UpdatePowerLeveling(data) {
  return request({
    url: '/api/services/k5game/hSDLAccInfo/UpdatePowerLeveling',
    method: 'post',
    data
  })
}

// 清理完成单
// export function HsAccountClearAll(data) {
//   return request({
//     url: '/api/services/k5game/hSDLAccInfo/HsAccountClearAll',
//     method: 'post',
//     data
//   })
// }

