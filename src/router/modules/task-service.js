
import Layout from '@/layout'

const taskServiceRouter = {
  path: '/task-service',
  component: Layout,
  redirect: 'noRedirect',
  name: 'systemManage',
  alwaysShow: true,
  meta: {
    title: '积分任务',
    icon: 'vip',
    roles: ['Pages.TaskCenter']
  },
  children: [
    {
      path: 'task-manage',
      component: () => import('@/k5game/views/task-service/task-manage/Index'),
      name: 'TaskManage',
      meta: { title: '任务管理', noCache: false, roles: ['Pages.TaskCenter'] }
    },
    {
      path: 'task-create',
      component: () => import('@/k5game/views/task-service/task-create/Index'),
      name: 'taskCreate',
      hidden: true,
      meta: { title: '创建/编辑任务', noCache: true, roles: ['Pages.TaskCenter.CreateTask'] }
    },
    {
      path: 'task-audit',
      component: () => import('@/k5game/views/task-service/task-audit-manage/Index'),
      name: 'TaskAudit',
      meta: { title: '任务审核管理', noCache: false, roles: ['Pages.TaskCenter.TaskAudit'] }
    },
    {
      path: 'task-audit-detail',
      component: () => import('@/k5game/views/task-service/task-audit-detail/Index'),
      name: 'TaskAuditDetail',
      hidden: true,
      meta: { title: '查看审核', noCache: true, roles: ['Pages.TaskCenter.TaskAudit'] }
    },
    {
      path: 'task-withdraw',
      component: () => import('@/k5game/views/task-service/task-withdraw-manage/Index'),
      name: 'TaskWithdraw',
      meta: { title: '刷单金额管理', noCache: false, roles: ['Pages.TaskCenter.DrawAudit'] }
    },
    {
      path: 'task-withdraw/record',
      hidden: true,
      component: () => import('@/k5game/views/task-service/task-withdraw-record/Index'),
      name: 'TaskWithdrawRecord',
      meta: { title: '提现记录', noCache: true, roles: ['Pages.TaskCenter.DrawAudit'] }
    },
    {
      path: 'task-withdraw/audit',
      hidden: true,
      component: () => import('@/k5game/views/task-service/task-withdraw-audit/Index'),
      name: 'TaskWithdrawAudit',
      meta: { title: '提现审核', noCache: true, roles: ['Pages.TaskCenter.DrawAudit'] }
    },
    {
      path: 'task-report',
      component: () => import('@/k5game/views/task-service/task-report/Index'),
      name: 'TaskReport',
      meta: { title: '任务报表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    },
    {
      path: 'task-withdraw-report',
      component: () => import('@/k5game/views/task-service/task-withdraw-report/Index'),
      name: 'TaskWithdrawReport',
      meta: { title: '提现报表', noCache: true, roles: ['Pages.PowerLevelingProduct'] }
    }
  ]
}

export default taskServiceRouter
