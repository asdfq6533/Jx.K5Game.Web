import Layout from '@/layout'

const financeManageRouter = {
  path: '/finance-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'financeManage',
  meta: {
    title: '财务管理',
    icon: 'finance',
    roles: ['Pages.Game']
  },
  children: [
    {
      path: 'friendly-statement',
      component: () => import('@/k5game/views/finance-manage/friendly-statement/Index'),
      name: 'friendlyStatement',
      meta: { title: '友谊对账单', noCache: true, roles: ['Pages.Game'], breadNumber: 2 }
    },
    {
      path: 'account-statement',
      component: () => import('@/k5game/views/finance-manage/account-statement/Index'),
      name: 'accountStatement',
      meta: { title: '账号对账单', noCache: true, roles: ['Pages.Game'], breadNumber: 2 }
    },
    {
      path: 'special-statement',
      component: () => import('@/k5game/views/finance-manage/special-statement/Index'),
      name: 'specialStatement',
      meta: { title: '代练对账单', noCache: true, roles: ['Pages.Game'], breadNumber: 2 }
    },
    {
      path: 'special-statement/special-order-list',
      component: () => import('@/k5game/views/finance-manage/special-order-list/Index'),
      name: 'specialOrderList',
      hidden: true,
      meta: { title: '代练订单列表页', noCache: true, roles: ['Pages.Game'], breadNumber: 3 }
    },
    {
      path: 'hiredman-statement',
      component: () => import('@/k5game/views/finance-manage/hiredman-statement/Index'),
      name: 'hiredmanStatement',
      meta: { title: '打手对账单', noCache: true, roles: ['Pages.Game'], breadNumber: 2 }
    },
    {
      path: 'recharge-statement',
      component: () => import('@/k5game/views/finance-manage/recharge-statement/Index'),
      name: 'rechargeStatement',
      meta: { title: '充值对账单', noCache: true, roles: ['Pages.Commodity'], breadNumber: 2 }
    },
    {
      path: 'taskWithdraw-statement',
      component: () => import('@/k5game/views/finance-manage/taskWithdraw-statement/Index'),
      name: 'taskWithdrawStatement',
      meta: { title: '刷单对账单', noCache: true, roles: ['Pages.Game'], breadNumber: 2 }
    }
  ]
}

export default financeManageRouter
