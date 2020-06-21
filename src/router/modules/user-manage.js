
import Layout from '@/layout'

const userRouter = {
  path: '/user-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'userManage',
  alwaysShow: true,
  meta: {
    title: '用户管理',
    icon: 'user',
    roles: ['Pages.Administration.Users.New']
  },
  children: [
    {
      path: 'user-list',
      component: () => import('@/k5game/views/user-manage/user-list/Index'),
      name: 'UserList',
      meta: { title: '用户列表', noCache: true, roles: ['Pages.Administration.Users.New'] }
    },
    {
      path: 'user-detail',
      component: () => import('@/k5game/views/user-manage/user-detail/Index'),
      name: 'UserDetail',
      hidden: true,
      meta: { title: '用户详情', noCache: true, roles: ['Pages.Administration.Users.New'] }
    }
  ]
}
export default userRouter
