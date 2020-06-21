/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const accountDealingRouter = {
  path: '/account-dealing',
  component: Layout,
  redirect: 'noRedirect',
  name: 'accountDealing',
  meta: {
    title: '账号交易管理',
    icon: 'jiaoyi',
    roles: ['Pages.NewAccountTransaction.Account']
  },
  children: [
    {
      path: 'product',
      component: () => import('@/k5game/views/account-dealing/product/Index'),
      name: 'accountProduct',
      meta: { title: '账号交易产品', noCache: true, roles: ['Pages.NewAccountTransaction.Account'] }
    },
    {
      path: 'orders',
      component: () => import('@/k5game/views/account-dealing/orders/Index'),
      name: 'accountOrders',
      meta: { title: '账号交易订单', noCache: true, roles: ['Pages.PurchaseAccountTransaction.GetPurOrderList'] }
    },
    {
      path: 'id-cards',
      component: () => import('@/k5game/views/account-dealing/id-cards/Index'),
      name: 'idCard',
      meta: { title: '实名管理', noCache: true, roles: ['Admin'] }
    },
    {
      path: 'opening-account',
      component: () => import('@/k5game/views/account-dealing/opening-account/Index'),
      name: 'openingAccount',
      meta: { title: '账号标签管理', noCache: true, roles: ['Pages.AccountPackage'] }
    }
  ]
}

export default accountDealingRouter
