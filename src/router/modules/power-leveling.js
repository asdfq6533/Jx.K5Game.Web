/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const manageRouter = {
  path: '/power-leveling',
  component: Layout,
  redirect: 'noRedirect',
  name: 'powerLeveling',
  alwaysShow: true,
  meta: {
    title: '代练管理',
    icon: 'guide',
    roles: ['Pages.PowerLeveling']
  },
  children: [
    {
      path: 'product-list',
      component: () => import('@/k5game/views/power-leveling/product-list/Index'),
      name: 'productList',
      meta: { title: '代练产品管理', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    }, {
      path: 'order-list',
      component: () => import('@/k5game/views/power-leveling/order-list/Index'),
      name: 'orderList',
      meta: { title: '代练订单管理', noCache: true, roles: ['Pages.PowerLevelingOrder.OrderList'] }
    }, {
      path: 'apply-text',
      component: () => import('@/k5game/views/power-leveling/pay/ApplyText'),
      name: 'orderApplyText',
      meta: { title: '添加代练订单', noCache: true, roles: ['Pages.PowerLevelingOrder.OrderList'] },
      hidden: true
    }, {
      path: 'power-lever-list',
      component: () => import('@/k5game/views/power-leveling/power-lever-list/Index'),
      name: 'powerLeverList',
      meta: { title: '代练人列表', noCache: true, roles: ['Pages.PowerLevelingOrder.OrderList'] }
    }, {
      path: 'order-log',
      component: () => import('@/k5game/views/power-leveling/order-log/Index'),
      name: 'orderLog',
      meta: { title: '代练日志', noCache: true, roles: ['Pages.PowerLevelingOrder.Log'] }
    }, {
      path: 'order-center',
      component: () => import('@/k5game/views/power-leveling/order-center/Index'),
      name: 'orderCenter',
      meta: { title: '代练市场', noCache: true, roles: ['Pages.PowerLevelingOrder.OutOrderPowerLeveling'] }
    }, {
      path: 'mine',
      component: () => import('@/k5game/views/power-leveling/mine/Index'),
      name: 'mine',
      meta: { title: '我的代练', noCache: true, roles: ['Pages.PowerLevelingOrder.OutOrderPowerLeveling'] }
    }
  ]
}

export default manageRouter
