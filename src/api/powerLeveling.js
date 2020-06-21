import request from '@/utils/request'

/**
 * 查看日志，参数在data对象中
 * @param maxResultCount 每页长度
 * @param skipCount 跳过条数
 * @returns items 数组
 * {
 * "id": "88961ff0-053a-46ab-b773-00c6fa7b18eb",
 * "creationTime": "2019-07-08T09:57:50.187Z",
 * "creatorUserId": 3986,
 * "creatorUserName": "admin1",
 * "operation": "编辑套餐",
 * "table": "代练套餐表",
 * "packageOrProductId": 53,
 * "name": "金头代练模式",
 * "remark": "编辑代练套餐'金头代练模式'"
 * }
 */

export function GetLogList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/GetLogList',
    method: 'post',
    data
  })
}

/**
 * 代练订单管理，参数在data对象中
 * @param AccountNum: '', // 账号名称
 * @param OrderId: '', // 订单Id
 * @param UserName: '', // 用户名
 * @param GameName: '', // 游戏名称
 * @param IsAbnormal: '', // 是否问题单
 * @param OrderStatus: 0, // 订单状态
 * @param StartDate: '', // 开始时间
 * @param EndDate: '' // 结算时间
 * @param maxResultCount 每页长度
 * @param skipCount 跳过条数
 * @param sorting 排序
 * @returns items 数组 {"id":"H190927174726SECZ","userId":10281,"userName":"13133602757","downOrderTime":"2019-09-27T09:47:26.877Z","cancelOrderTime":null,"cancelOrderReason":null,"payWay":-1,"payWayName":"未付款","payTime":null,"checkAccountTime":null,"powerLevelingTime":null,"powerLeveledTime":null,"tradingOverTime":null,"orderStatus":0,"orderStatusName":"待付款","accountNum":"","userRemark":null,"phoneNum":"13133602757","checkAccountUserId":null,"checkAccountUserName":"13133602757","isTrueAccount":null,"powerLevelingNum":0,"lastAchievePowerLevelingUserId":null,"lastAchievePowerLevelingUserName":null,"isAchievePowerLeveling":false,"gameName":"炉石传说","packageName":"休闲金币套餐","productTitle":"友谊赛+金币=6900金一个月","productGroup":"友谊赛+金币代练套餐","orderAmount":58.00,"antecedentMoney":0.0,"orderReward":0.0,"powerLevelingStatus":null,"powerLevelingStatusName":null,"isProfitDistribution":false,"orderRemarkCnt":0,"remarkCnt":0,"taoBaoRemark":null,"isAbnormal":false,"orderRefund":null}
 * @returns totalCount 总条数
 */

export function GetOrderList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetOrderList',
    method: 'post',
    data
  })
}

/**
 * 代练订单管理-个人账户信息，参数在data对象中
 * @returns Object {"id":3687,"userId":3986,"availableCoins":4471.5526,"frozenCoins":13151173235.00,"hideCoins":false,"totalPoints":0.00,"availablePoints":0.00,"frozenPoints":0.00,"hidePoints":false,"availableFriendlyMatchs":189589,"frozenFriendlyMatchs":13850,"hideFriendlyMatchs":false,"availableTB":0,"frozenTB":0,"hideTB":false,"friendlyMatchPrice":1.00,"priorityRanking":99999,"friendlyMatchsLimit":10000,"isDeleted":false,"deleterUserId":null,"deletionTime":null,"lastModificationTime":"2019-09-26T08:51:49.437Z","lastModifierUserId":3986,"creationTime":"2017-10-08T08:11:58.197Z","creatorUserId":3986}
 */

export function GetMyAsset(data) {
  return request({
    url: '/api/services/k5game/giftCoin/GetMyAsset',
    method: 'post',
    data
  })
}

/**
 * 代练人列表，参数在data对象中
 * @returns Object {"id":19199,"userName":"luowei","nickName":"十三猪","creationTime":"2019-09-29T06:55:09.547Z","availableCoins":0.0000,"frozenCoins":0.00,"powerLevelingCnt":19}
 */

export function GetPowerLeverList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetPowerLeverList',
    method: 'post',
    data
  })
}

/**
 * 代练日志，参数在data对象中
 * @returns Object {"id":19199,"userName":"luowei","nickName":"十三猪","creationTime":"2019-09-29T06:55:09.547Z","availableCoins":0.0000,"frozenCoins":0.00,"powerLevelingCnt":19}
 */

export function GetOrderLogList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetOrderLogList',
    method: 'post',
    data
  })
}

/**
 * 代练市场
 * @returns Object {"id":7900,"isInternalGold":true,"userPhoneNum":"15002334748","gameName":"炉石传说","creationTime":"2019-02-26T08:26:52.087Z","powerLevelingRequirement":"雷雨濛    黄金卡背代打加报名","powerLevelingAntecedentMoney":0.00,"powerLevelingReward":4500.00,"orderId":"H180925112939K5UL"}
 */

export function GetInSelfPowerLevelingList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetInSelfPowerLevelingList',
    method: 'post',
    data
  })
}

/**
 * 代练人列表，参数在data对象中
 * @params PowerLevleingStatus 状态
 * @returns Object {"id":23243,"isInternalGold":true,"powerLevelingUserId":3986,"powerLevelingUserName":null,"userPhoneNum":"1","gameName":"炉石传说","powerLevelingStartTime":"2019-09-25T07:24:16.507Z","powerLevelingStopTime":null,"powerLevelingRequirement":"1","powerLevelingAntecedentMoney":1.00,"powerLevelingReward":1.00,"powerLevelingStatus":1,"powerLevelingStatusName":"代练中","checkPowerLevelingUserId":null,"checkPowerLevelingUserName":null,"checkPowerLevelingTime":null,"isAchievePowerLeveling":false,"powerLevelerRemark":null,"isForcedStop":false,"profitDistributionUserId":null,"profitDistributionUserName":null,"lastAntecedentMoney":0.00,"lastReward":0.00,"orderId":"H190925152257QFD9"}
 */

export function GetMyPowerLevelingList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetMyPowerLevelingList',
    method: 'post',
    data
  })
}

/**
 * 个人账户信息，参数在data对象中
 * @returns Object {"availableCoins":35473.5526,"frozenCoins":13151173235.00,"successCnt":1138,"failCnt":72}
 */

export function GetMyAssetInfo(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetMyAssetInfo',
    method: 'post',
    data
  })
}

/**
  *（新）获取代练套餐列表
 * @returns Object
 * {
  "gameId": 0,
  "packageName": "string"
}
 */
export function GetPowerLevelingPackageList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetPowerLevelingPackageList',
    method: 'post',
    data
  })
}

export function GetPowerLevelingProductList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/GetPowerLevelingProductList',
    method: 'post',
    data
  })
}

/**
 * 添加编辑产品
 * @param data
 * @constructor
 */
export function AddOrEditProduct(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/AddOrEditProduct',
    method: 'post',
    data
  })
}

/**
 * 删除代练产品
 * @param data
 * @constructor
 */
export function DeleteProduct(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/DeleteProduct',
    method: 'post',
    data
  })
}

/**
 * 添加编辑代练套餐
 * @param data
 * @constructor
 */
export function AddOrEditPackage(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/AddOrEditPackage',
    method: 'post',
    data
  })
}

/**
 * 删除代练套餐
 * @param data
 * @constructor
 */
export function DeletePackage(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/DeletePackage',
    method: 'post',
    data
  })
}

/**
 * 改变订单价格
 * @param data
 * @constructor
 */
export function ChangePrice(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/ChangePrice',
    method: 'post',
    data
  })
}

/**
 * 代练
 * @param data
 * @constructor
 */
export function CreateDaiLianOrder(data) {
  return request({
    url: '/api/services/app/daiLianOrder/CreateDaiLianOrder',
    method: 'post',
    data
  })
}

/**
 * 查看订单账号密码
 * @param data
 * @constructor
 */
export function GetPowerLevelingPwd(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetPowerLevelingPwd',
    method: 'post',
    data
  })
}

/**
 * 获取代练信息
 * @param data
 * @constructor
 */
export function GetPowerLevelingList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetPowerLevelingList',
    method: 'post',
    data
  })
}

/**
 * 删除代练订单
 * @param data
 * @constructor
 */
export function UserDeleteOrder(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/UserDeleteOrder',
    method: 'post',
    data
  })
}

/**
 * 下架代练
 * @param data
 * @constructor
 */
export function SoldoutOrder(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/SoldoutOrder',
    method: 'post',
    data
  })
}

/**
 * 所有打手信息
 * @param data
 * @constructor
 */
export function GetBeaters(data) {
  return request({
    url: '/api/services/app/daiLianOrder/GetBeaters',
    method: 'post',
    data
  })
}

export function GetAssignOrders(data) {
  return request({
    url: '/api/services/app/daiLianOrder/GetAssignOrders',
    method: 'post',
    data
  })
}

/**
 * 取消订单
 * @param data
 * @constructor
 */
export function CancelOrder(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/CancelOrder',
    method: 'post',
    data
  })
}

/**
 * 添加备注
 * @param data
 * @constructor
 */
export function AddOrderRemark(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/AddOrderRemark',
    method: 'post',
    data
  })
}

/**
 * 备注列表
 * @param data
 * @constructor
 */
export function GetOrderRemarkList(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetOrderRemarkList',
    method: 'post',
    data
  })
}

/**
 * 完成订单
 * @param data
 * @constructor
 */
export function confirmAchievePowerLeveling(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/ConfirmAchievePowerLeveling',
    method: 'post',
    data
  })
}

/**
 * 接单
 * @param data
 * @constructor
 */
export function StartPowerLeveling(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/StartPowerLeveling',
    method: 'post',
    data
  })
}

/**
 * 设置问题单
 * @param data
 * @constructor
 */
export function ChangeIsAbnormal(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/ChangeIsAbnormal',
    method: 'post',
    data
  })
}

/**
 * 上架
 * @param data
 * @constructor
 */
export function PutawayAppOrder(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/PutawayAppOrder',
    method: 'post',
    data
  })
}

/**
 * 更新账号信息
 * @param data
 * @constructor
 */
export function UpdateAccountPwd(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/UpdateAccountPwd',
    method: 'post',
    data
  })
}

/**
 * 获取订单个数
 * @param data
 * @constructor
 */
export function GetOrderCount(data) {
  return request({
    url: '/api/services/app/daiLianOrder/GetOrderCount',
    method: 'post',
    data
  })
}

/**
 * 代练报表
 * @param data
 * @constructor
 */
export function GetDaiLianReportAsync(data) {
  return request({
    url: '/api/services/app/daiLianReport/GetDaiLianReportAsync',
    method: 'post',
    data
  })
}

export function GetCreateOrderUsers(data) {
  return request({
    url: '/api/services/app/daiLianOrder/GetCreateOrderUsers',
    method: 'post',
    data
  })
}

export function GetOrderDetails(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/GetOrderDetails',
    method: 'post',
    data
  })
}

export function CheckIsAchievePowerLeveling(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/CheckIsAchievePowerLeveling',
    method: 'post',
    data
  })
}
export function ConfirmAchievePowerLeveling(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/ConfirmAchievePowerLeveling',
    method: 'post',
    data
  })
}

export function GetHSDLOperationListAsync(data) {
  return request({
    url: '/api/services/k5game/hSDLOperation/GetHSDLOperationListAsync',
    method: 'post',
    data
  })
}

export function SetDaShou(data) {
  return request({
    url: '/api/services/app/daiLianOrder/SetDaShou',
    method: 'post',
    data
  })
}

export function ResetDatetime(data) {
  return request({
    url: '/api/services/app/daiLianOrder/ResetDatetime',
    method: 'post',
    data
  })
}

/**
 * 清理完成单
 * @param data
 * @constructor
 */
export function ClearIsAchievePowerLeveling(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/ClearIsAchievePowerLeveling',
    method: 'post',
    data
  })
}

/**
 * 重置打手
 * @param data
 * @constructor
 */
export function ReSetDaShou(data) {
  return request({
    url: '/api/services/app/daiLianOrder/ReSetDaShou',
    method: 'post',
    data
  })
}

/**
 * 停止代练
 * @param data
 * @constructor
 */
export function StopPowerLeveling(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingOrder/StopPowerLeveling',
    method: 'post',
    data
  })
}

/**
 * 修改公示状态
 * @param data
 * @constructor
 */
export function UpdateDaiLianOrderIsPublic(data) {
  return request({
    url: '/api/services/app/daiLianOrder/UpdateDaiLianOrderIsPublic',
    method: 'post',
    data
  })
}

/**
 * k5app展示
 * @param data
 *
 */
export function OpenOrClosePackage(data) {
  return request({
    url: '/api/services/app/hearthStonePowerLevelingProduct/OpenOrClosePackage',
    method: 'post',
    data
  })
}
