import Layout from '@/layout'

const reportRouter = {
  path: '/report',
  component: Layout,
  redirect: 'noRedirect',
  name: 'report',
  alwaysShow: true,
  meta: {
    title: '报表管理',
    icon: 'chart',
    roles: ['Pages.PowerLeveling']
  },
  children: [
    // {
    //   path: 'orders',
    //   component: () => import('@/k5game/views/report/order-report/Index'),
    //   name: 'orderReport',
    //   meta: { title: '订单报表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    // },
    // {
    //   path: 'user-account',
    //   component: () => import('@/k5game/views/report/user-account-report/Index'),
    //   name: 'userAccountReport',
    //   meta: { title: '用户信息报表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    // },
    // {
    //   path: 'finance',
    //   component: () => import('@/k5game/views/report/finance-report/Index'),
    //   name: 'financeReport',
    //   meta: { title: '代练报表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    // },
    {
      path: 'transaction-finance',
      component: () => import('@/k5game/views/report/transaction-finance-report/Index'),
      name: 'transactionFinanceReport',
      meta: { title: '账号交易财务明细表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    },
    {
      path: 'profit-finance-report',
      component: () => import('@/k5game/views/report/profit-finance-report/Index'),
      name: 'profitFinanceReport',
      meta: { title: '销售利润表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    },
    {
      path: 'dailian-report',
      component: () => import('@/k5game/views/report/dailian-report/Index'),
      name: 'dailianReport',
      meta: { title: '代练报表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    },
    {
      path: 'every-day-report',
      component: () => import('@/k5game/views/report/every-day-report/Index'),
      name: 'everyDayReport',
      meta: { title: '账号交易每日报表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    }
  ]
}

export default reportRouter
