const state = {
  breadListState: [] // 面包屑列表数据
}

const mutations = {
  setBreadList(state, list) {
    state.breadListState = list
  }
}

const actions = {
//   setBreadList({ commit }, list) {
//     commit('SET_LIST', list)
//   }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
