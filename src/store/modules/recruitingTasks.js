
const state = {
  murlocSkinDetail: {}
}

const mutations = {
  SET_DETAIL(state, murlocSkinDetail) {
    state.murlocSkinDetail = murlocSkinDetail
  }
}

const actions = {
  setDetail({ commit }, data) {
    commit('SET_DETAIL', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
