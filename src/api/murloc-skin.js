import request from '@/utils/request'

// 鱼人皮肤任务列表
export function GetAllFishSkinOrders(data) {
  return request({
    url: '/api/services/k5game/fishSkinService/GetAllFishSkinOrders',
    method: 'post',
    data
  })
}

// 发布任务
export function CreateOrder(data) {
  return request({
    url: '/api/services/k5game/fishSkinService/CreateOrder',
    method: 'post',
    data
  })
}

// 等级刷新
export function GetLevelbyAccountAndSerice(data) {
  return request({
    url: '/api/services/k5game/fishSkinService/GetLevelbyAccountAndSerice',
    method: 'post',
    data
  })
}

// 获取日志
export function GetPagedFishOrderLog(data) {
  return request({
    url: '/api/services/k5game/fishSkinService/GetPagedFishOrderLog',
    method: 'post',
    data
  })
}
