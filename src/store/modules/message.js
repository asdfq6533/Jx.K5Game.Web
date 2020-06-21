
const state = {
  isChatDialogShow: false,
  connection: '',
  notificationMsg: '',
  showNotify: false
}

const mutations = {
  SET_IS_CHAT_DIALOG_SHOW(state, isChatDialogShow) {
    state.isChatDialogShow = isChatDialogShow
  },
  SET_CONNETION(state, connection) {
    state.connection = connection
  },
  SET_NOTIFICATION_MSG(state, notificationMsg) {
    state.notificationMsg = notificationMsg
  },
  SET_SHOW_NOTIFY(state, showNotify) {
    state.showNotify = showNotify
  }
}

const actions = {
  setIsChatDialogShow({ commit }, isChatDialogShow) {
    commit('SET_IS_CHAT_DIALOG_SHOW', isChatDialogShow)
  },
  setConnection({ commit }, connection) {
    commit('SET_CONNETION', connection)
  },
  setNotificationMsg({ commit }, notificationMsg) {
    commit('SET_NOTIFICATION_MSG', notificationMsg)
  },
  setNotify({ commit }, showNotify) {
    commit('SET_SHOW_NOTIFY', showNotify)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
