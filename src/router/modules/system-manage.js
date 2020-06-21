/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const manageRouter = {
  path: '/system-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'systemManage',
  alwaysShow: true,
  meta: {
    title: '系统管理',
    icon: 'component',
    roles: ['Pages.FilesImportRecordLog']
  },
  children: [
    {
      path: 'files-import-record',
      component: () => import('@/k5game/views/system-manage/files-import-record/Index'),
      name: 'filesImportRecord',
      meta: { title: 'Excel导入记录', noCache: true, roles: ['Pages.FilesImportRecordLog'] }
    }
  ]
}

export default manageRouter
