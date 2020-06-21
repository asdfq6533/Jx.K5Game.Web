import request from '@/utils/request'

// 获取所有的游戏
export function GetAllGames(data) {
  return request({
    url: '/api/services/k5game/gameInfo/GetAllGames',
    method: 'post',
    data
  })
}
// 分页获取游戏
export function GetGameName(data) {
  return request({
    url: '/api/services/k5game/gameInfo/GetGameName',
    method: 'post',
    data
  })
}

export function GetGameHotName(data) {
  return request({
    url: '/api/services/k5game/gameInfo/GetGameHotName',
    method: 'post',
    data
  })
}
// 获取游戏服务器
export function GetGameService(data) {
  return request({
    url: '/api/services/k5game/gameInfo/GetServerGrading',
    method: 'post',
    data
  })
}
// 添加/修改游戏
export function AddOrUpateGame(data) {
  return request({
    url: '/api/services/k5game/gameInfo/AddOrUpateGame',
    method: 'post',
    data
  })
}
// 删除游戏
export function DeleteGame(data) {
  return request({
    url: '/api/services/k5game/gameInfo/DeleteGame',
    method: 'post',
    data
  })
}

// 批量删除游戏
export function BatchDeleteGame(data) {
  return request({
    url: '/api/services/k5game/gameInfo/BatchDeleteGame',
    method: 'post',
    data
  })
}
// 添加游戏服务器/修改分组
export function AddOrUpdateGameServer(data) {
  return request({
    url: '/api/services/k5game/gameInfo/AddOrUpdateGameServer',
    method: 'post',
    data
  })
}

// 获取代练类型/获取游戏下的产品名称
export function GetAllPackageByGameId(data) {
  return request({
    url: '/api/services/k5game/gameInfo/GetAllPackageByGameId',
    method: 'post',
    data
  })
}
// 获取服务器
export function GetServerGrading(data) {
  return request({
    url: '/api/services/k5game/gameInfo/GetServerGrading',
    method: 'post',
    data
  })
}
// 获取游戏区服树
export function GetRegionTree(data) {
  return request({
    url: '/api/services/k5game/appGameInfo/GetRegionTree',
    method: 'post',
    data
  })
}
// 禁用游戏服务器
export function ActiveGameServer(data) {
  return request({
    url: '/api/services/k5game/gameInfo/ActiveGameServer',
    method: 'post',
    data
  })
}
// 删除游戏服务器
export function DeleteGameServer(data) {
  return request({
    url: '/api/services/k5game/gameInfo/DeleteGameServer',
    method: 'post',
    data
  })
}

// 批量删除游戏服务器
export function BatchDeleteGameServer(data) {
  return request({
    url: '/api/services/k5game/gameInfo/BatchDeleteGameServer',
    method: 'post',
    data
  })
}
export function GetRegionTree2(data) {
  return request({
    url: '/api/services/k5game/gameInfo/GetRegionTree',
    method: 'post',
    data
  })
}

// 获取游戏类型
export function GetCategories(data) {
  return request({
    url: '/api/services/k5game/gameCategory/GetCategories',
    method: 'post',
    data
  })
}

// 删除游戏类型
export function DeleteCategory(data) {
  return request({
    url: '/api/services/k5game/gameCategory/DeleteCategory',
    method: 'post',
    data
  })
}

// 批量删除游戏类型
export function DeleteCategories(data) {
  return request({
    url: '/api/services/k5game/gameCategory/DeleteCategories',
    method: 'post',
    data
  })
}
// 创建游戏类型
export function CreateCategory(data) {
  return request({
    url: '/api/services/k5game/gameCategory/CreateCategory',
    method: 'post',
    data
  })
}
// 修改游戏类型
export function UpdateCategory(data) {
  return request({
    url: '/api/services/k5game/gameCategory/UpdateCategory',
    method: 'post',
    data
  })
}
// 获取游戏平台
export function GetPlatforms(data) {
  return request({
    url: '/api/services/k5game/gameCategory/GetPlatforms',
    method: 'post',
    data
  })
}

// 删除游戏平台
export function DeletePlatform(data) {
  return request({
    url: '/api/services/k5game/gameCategory/DeletePlatform',
    method: 'post',
    data
  })
}
// 创建游戏平台
export function CreatePlatform(data) {
  return request({
    url: '/api/services/k5game/gameCategory/CreatePlatform',
    method: 'post',
    data
  })
}
// 修改游戏平台
export function UpdatePlatform(data) {
  return request({
    url: '/api/services/k5game/gameCategory/UpdatePlatform',
    method: 'post',
    data
  })
}
/**
 * 查询代练套餐，参数在data对象中
 * @param GameId 游戏ID
 * @param PackageName 套餐名称
 * @returns {"id":57,"gameId":2,"gameName":"炉石传说","packageName":"达拉然大劫案冒险","packageAbstract":"","packagePic":"c0afa35f-dc63-40bd-b149-b162479ab256.png","isOpen":true}
 */

export function GetPowerLevelingPackageList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/GetPowerLevelingPackageList',
    method: 'post',
    data
  })
}
