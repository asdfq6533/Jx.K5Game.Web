/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const accountDealingRouter = {
  path: '/account-transaction',
  component: Layout,
  redirect: 'noRedirect',
  name: 'accountTransaction',
  meta: {
    title: '账号交易管理',
    icon: 'jiaoyi',
    roles: ['Pages.AccountTransaction']
  },
  children: [
    {
      path: 'product',
      component: () => import('@/k5game/views/account-transaction/product-manage/Index'),
      name: 'AccountProductManage',
      meta: { title: '商品列表', noCache: true, roles: ['Pages.Commodity'], breadNumber: 2 }
    },
    {
      path: 'product/detail',
      component: () => import('@/k5game/views/account-transaction/product-detail/Index'),
      name: 'AccountProductDetail',
      hidden: true,
      meta: { title: '商品详情', noCache: true, roles: ['Pages.Commodity'], breadNumber: 3 }
    },
    // {
    //   path: 'product-check',
    //   component: () => import('@/k5game/views/account-transaction/product-check/Index'),
    //   name: 'AccountProductOrders',
    //   meta: { title: '商品审核', noCache: true, roles: ['Pages.AccountTransaction.Order'], breadNumber: 2 }
    // },
    // {
    //   path: 'product-check/detail',
    //   component: () => import('@/k5game/views/account-transaction/check-detail/Index'),
    //   name: 'ProductCheckDetail',
    //   hidden: true,
    //   meta: { title: '审核详情', noCache: true, roles: ['Pages.AccountTransaction.Product'], breadNumber: 3 }
    // },
    {
      path: 'sale-order',
      component: () => import('@/k5game/views/account-transaction/sales-order/Index'),
      name: 'SalesOrder',
      meta: { title: '销售订单', noCache: false, roles: ['Pages.CommodityOrder'], breadNumber: 2 }
    },
    {
      path: 'sale-order/detail',
      component: () => import('@/k5game/views/account-transaction/sales-order-detail/Index'),
      name: 'SalesOrderDetail',
      hidden: true,
      meta: { title: '销售订单详情', noCache: true, roles: ['Pages.CommodityOrder.Detail'], breadNumber: 3 }
    },
    {
      path: 'after-sales-order',
      component: () => import('@/k5game/views/account-transaction/after-sales-order/Index'),
      name: 'AfterSalesOrder',
      meta: { title: '售后订单', noCache: false, roles: ['Pages.CustomerService'], breadNumber: 2 }
    },
    {
      path: 'after-sales-order/detail',
      component: () => import('@/k5game/views/account-transaction/after-sales-detail/Index'),
      name: 'AfterSalesDetail',
      hidden: true,
      meta: { title: '售后详情', noCache: false, roles: ['Pages.CustomerService'], breadNumber: 3 }
    },
    {
      path: 'complaint-order',
      component: () => import('@/k5game/views/account-transaction/complaint-order/Index'),
      name: 'ComplaintOrder',
      meta: { title: '申诉订单', noCache: false, roles: ['Pages.CustomerService'], breadNumber: 2 }
    },
    {
      path: 'label-manage',
      component: () => import('@/k5game/views/account-transaction/label-manage/Index'),
      name: 'LabelManage',
      meta: { title: '标签管理', noCache: false, roles: ['Pages.Commodity.Label'], breadNumber: 2 }
    },
    {
      path: 'edit-label',
      component: () => import('@/k5game/views/account-transaction/edit-label/Index'),
      name: 'editLabel',
      hidden: true,
      meta: { title: '编辑标签', noCache: false, roles: ['Pages.Commodity.Label'], breadNumber: 3 }
    },
    {
      path: 'add-label',
      component: () => import('@/k5game/views/account-transaction/add-label/Index'),
      name: 'addLabel',
      hidden: true,
      meta: { title: '新增标签', noCache: false, roles: ['Pages.Commodity.Label'], breadNumber: 3 }
    }
  ]
}

export default accountDealingRouter
