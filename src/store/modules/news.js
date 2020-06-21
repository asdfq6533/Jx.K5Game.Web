import * as newApi from '@/api/news'
const state = {
  categoryData: null,
  categoryList: [],
  channelData: null,
  channelList: []
}

const mutations = {
  SET_CATEGORY_DATA(state, data) {
    state.categoryData = data
  },
  SET_CATEGORY_LIST(state, list) {
    state.categoryList = list
  },
  SET_CHANNEL_DATA(state, data) {
    state.channelData = data
  },
  SET_CHANNEL_LIST(state, list) {
    state.channelList = list
  }
}

const actions = {
  getChannelList({ commit }) {
    newApi.GetChannels().then(res => {
      commit('SET_CHANNEL_LIST', res.data.result.items)
    })
  },
  getCategoryList({ commit }, channelId = '') {
    newApi.GetCategories({ channelId: channelId }).then(res => {
      commit('SET_CATEGORY_LIST', res.data.result.items)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
