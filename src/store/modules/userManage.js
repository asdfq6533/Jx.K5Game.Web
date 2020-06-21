import * as userManageApi from '@/api/user-manage'
const state = {
  userList: []
}

const mutations = {
  SET_USER_LIST(state, userList) {
    state.userList = userList
  }
}

const actions = {
  getList({ commit }) {
    userManageApi.getUsers().then(res => {
      commit('SET_USER_LIST', res.data.result.items)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
