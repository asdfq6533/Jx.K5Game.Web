import * as gameInfoApi from '@/api/gameInfo'

const state = {
  list: []
}

const mutations = {
  SET_LIST(state, list) {
    state.list = list
  }
}

const actions = {
  getList({ commit }) {
    gameInfoApi.GetAllGames({ gamePlatform: '' }).then(res => {
      commit('SET_LIST', res.data.result.items)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
