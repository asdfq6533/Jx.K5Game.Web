import request from '@/utils/request'
/**
 * 账户交易
 * @param data
 */

// 分页获取所有商品
export function GetPagedCommoditiesAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/GetPagedCommoditiesAsync',
    method: 'post',
    data
  })
}
// 获取当前登录人的商品
export function GetCurrentPagedCommoditiesAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/GetCurrentPagedCommoditiesAsync',
    method: 'post',
    data
  })
}
// 获取商品详情
export function GetCommodityDetailsAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/GetCommodityDetailsAsync',
    method: 'post',
    data
  })
}
// 添加一个商品
export function CreateCommodityAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/CreateCommodityAsync',
    method: 'post',
    data
  })
}
// 编辑一个商品
export function UpdateCommodityAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/UpdateCommodityAsync',
    method: 'post',
    data
  })
}
// 删除商品
export function DeleteCommodityAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/DeleteCommodityAsync',
    method: 'post',
    data
  })
}
// 审核商品
export function ExamineCommodityAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/ExamineCommodityAsync',
    method: 'post',
    data
  })
}
// 上架商品
export function UpperShelfCommodityAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/UpperShelfCommodityAsync',
    method: 'post',
    data
  })
}
// 下架商品
export function LowerShelfCommodityAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityService/LowerShelfCommodityAsync',
    method: 'post',
    data
  })
}
// 分页获取订单
export function GetPagedOrdersAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/GetPagedOrdersAsync',
    method: 'post',
    data
  })
}
// 获取当前登录人的订单
export function GetCurrentPagedOrdersAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/GetCurrentPagedOrdersAsync',
    method: 'post',
    data
  })
}
// 获取订单详情
export function GetOrderDetailsAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/GetOrderDetailsAsync',
    method: 'post',
    data
  })
}
// 创建订单
export function CreateOrderAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/CreateOrderAsync',
    method: 'post',
    data
  })
}
// (客服)修改订单
export function ArbitrationResult(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/EditOrderAsync',
    method: 'post',
    data
  })
}

// 取消订单
export function CancelOrderAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/CancelOrderAsync',
    method: 'post',
    data
  })
}

// 支付订单
export function PayOrderAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/PayOrderAsync',
    method: 'post',
    data
  })
}

// 申请退款
export function ApplyForRefundAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/ApplyForRefundAsync',
    method: 'post',
    data
  })
}
// 确认收货
export function ConfirmReceiptAsy(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/ConfirmReceiptAsy',
    method: 'post',
    data
  })
}
// 发货
export function DeliverGoodsAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/DeliverGoodsAsync',
    method: 'post',
    data
  })
}

// 获取订单日志
export function GetOrderLogAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodityOrderService/GetOrderLogAsync',
    method: 'post',
    data
  })
}

// 获取商品标签
export function GetPagedCommodityLabelAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodifyLabelService/GetPagedCommodityLabelAsync',
    method: 'post',
    data
  })
}

// 添加商品标签
export function CreateCommodityLabelAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodifyLabelService/CreateCommodityLabelAsync',
    method: 'post',
    data
  })
}

// 删除商品标签
export function DeleteCommodityLabelAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodifyLabelService/DeleteCommodityLabelAsync',
    method: 'post',
    data
  })
}

// 编辑商品标签
export function EditCommodityLabelAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodifyLabelService/EditCommodityLabelAsync',
    method: 'post',
    data
  })
}

// 商品标签详情
export function GetCommodityLabelAsync(data) {
  return request({
    url: '/api/services/k5gamePro/commodifyLabelService/GetCommodityLabelAsync',
    method: 'post',
    data
  })
}
// 售后订单
export function GetCustomerServiceOrderAysnc(data) {
  return request({
    url: '/api/services/k5gamePro/customerService/GetCustomerServiceOrderAysnc',
    method: 'post',
    data
  })
}

// 售后详情

export function GetCustomerServiceOrderDetailsAysnc(data) {
  return request({
    url: '/api/services/k5gamePro/customerService/GetCustomerServiceOrderDetailsAysnc',
    method: 'post',
    data
  })
}

// 处理售后
export function HandelCustomerServiceOrderAysnc(data) {
  return request({
    url: '/api/services/k5gamePro/customerService/HandelCustomerServiceOrderAysnc',
    method: 'post',
    data
  })
}

// 申述订单
export function GetProblemOrderAysnc(data) {
  return request({
    url: '/api/services/k5gamePro/customerService/GetProblemOrderAysnc',
    method: 'post',
    data
  })
}

// 客服处理申诉订单
export function SolveTroubleOrderAsync(data) {
  return request({
    url: '/api/services/k5gamePro/customerService/SolveTroubleOrderAsync',
    method: 'post',
    data
  })
}
