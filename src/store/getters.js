const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  roles: state => state.user.roles,
  roleType: state => state.user.roleType,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  isLoading: state => state.app.isLoading,
  breadListState: state => state.breadList.breadListState,
  isChatDialogShow: state => state.message.isChatDialogShow,
  showNotify: state => state.message.showNotify
}
export default getters
