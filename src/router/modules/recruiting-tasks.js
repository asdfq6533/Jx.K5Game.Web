
import Layout from '@/layout'

const taskRouter = {
  path: '/recruiting-tasks',
  component: Layout,
  redirect: 'noRedirect',
  name: 'RecruitingTasks',
  alwaysShow: true,
  meta: {
    title: '招募任务',
    icon: 'task',
    roles: ['Pages.FishSkin']
  },
  children: [
    {
      path: 'task-list',
      component: () => import('@/k5game/views/recruiting-tasks/murloc-skin/Index'),
      name: 'TaskList',
      meta: { title: '鱼人皮肤', noCache: true, roles: ['Pages.FishSkin'], breadNumber: 2 }
    },
    {
      path: 'task-detail',
      component: () => import('@/k5game/views/recruiting-tasks/task-detail/Index'),
      name: 'TaskDetail',
      hidden: true,
      meta: { title: '任务详情', noCache: true, roles: ['Pages.FishSkin'], breadNumber: 3 }
    }
  ]
}
export default taskRouter
