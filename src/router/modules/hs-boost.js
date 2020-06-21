import Layout from '@/layout'

const boostRouter = {
  path: '/boost',
  component: Layout,
  redirect: 'noRedirect',
  name: 'boost',
  alwaysShow: true,
  meta: {
    title: '游戏代练管理',
    icon: 'chart',
    isHidden: false,
    roles: ['Admin']
  },
  children: [
    {
      path: 'boost-manage',
      component: () => import('@/k5game/views/hs-boost/boost-manage/Index'),
      name: 'boostManage',
      meta: { title: '游戏代练管理', noCache: true, roles: ['Admin'] }
    }
  ]
}
export default boostRouter
