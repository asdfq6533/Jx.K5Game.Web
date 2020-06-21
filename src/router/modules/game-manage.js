/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const gameManageRouter = {
  path: '/game-manages',
  component: Layout,
  redirect: 'noRedirect',
  name: 'gameManages',
  meta: {
    title: '游戏管理',
    icon: 'game',
    roles: ['Pages.Game']
  },
  children: [
    {
      path: 'game-manage',
      component: () => import('@/k5game/views/game-manage/game-list/Index'),
      name: 'gameManage',
      meta: { title: '游戏信息管理', noCache: true, roles: ['Pages.Game'], breadNumber: 2 }
    },
    {
      path: 'game-manage/add-game',
      component: () => import('@/k5game/views/game-manage/add-game/Index'),
      name: 'addGame',
      hidden: true,
      meta: { title: '新增游戏', noCache: true, roles: ['Pages.Game'], breadNumber: 3 }
    },
    {
      path: 'game-manage/edit-game',
      component: () => import('@/k5game/views/game-manage/edit-game/Index'),
      name: 'editGame',
      hidden: true,
      meta: { title: '编辑游戏', noCache: true, roles: ['Pages.Game'], breadNumber: 3 }
    },
    {
      path: 'game-manage/game-detail',
      component: () => import('@/k5game/views/game-manage/game-detail/Index'),
      name: 'gameDetail',
      hidden: true,
      meta: { title: '查看游戏', noCache: true, roles: ['Pages.Game'], breadNumber: 3 }
    },
    // {
    //   path: 'game-platform-manage',
    //   component: () => import('@/k5game/views/game-manage/game-platform-manage/Index'),
    //   name: 'platformManage',
    //   meta: { title: '游戏平台管理', noCache: true, roles: ['Pages.Commodity'], breadNumber: 3 }
    // },
    {
      path: 'game-type-manage',
      component: () => import('@/k5game/views/game-manage/game-type-manage/Index'),
      name: 'gemaTypeManage',
      meta: { title: '游戏类型管理', noCache: true, roles: ['Pages.Game'], breadNumber: 2 }
    }
  ]
}

export default gameManageRouter
