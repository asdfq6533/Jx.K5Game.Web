
import Layout from '@/layout'

const newsRouter = {
  path: '/news-manage',
  component: Layout,
  redirect: 'noRedirect',
  name: 'newsManage',
  alwaysShow: true,
  meta: {
    title: '新闻管理',
    icon: 'game',
    roles: ['Pages.Game']
  },
  children: [
    {
      path: 'channel',
      component: () => import('@/k5game/views/news-manage/channel/Index'),
      name: 'newsChannel',
      meta: { title: '频道管理', noCache: true, roles: ['Pages.Game'] }
    },
    {
      path: 'category',
      component: () => import('@/k5game/views/news-manage/category/Index'),
      name: 'newsCategory',
      meta: { title: '分类管理', noCache: true, roles: ['Pages.Game'] }
    },
    {
      path: 'article',
      component: () => import('@/k5game/views/news-manage/article/Index'),
      name: 'newsArticle',
      meta: { title: '文章管理', noCache: true, roles: ['Pages.Game'] }
    },
    {
      path: 'article-create',
      component: () => import('@/k5game/views/news-manage/article-create/Index'),
      name: 'newsArticleCreate',
      hidden: true,
      meta: { title: '创建或编辑文章', noCache: true, roles: ['Pages.Game'] }
    }
  ]
}
export default newsRouter
