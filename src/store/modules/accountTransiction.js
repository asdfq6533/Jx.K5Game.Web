
const state = {
  productOrders: null,
  productData: {},
  labelProductData: JSON.parse(sessionStorage.getItem('labelProductData')),
  labelData: {},
  labelList: [],
  labelParams: null,
  productStatus: {},
  productList: [],
  productParams: null
}

const mutations = {
  SET_PRODUCT_ORDERS(state, data) {
    state.productOrders = data
  },
  SET_LABEL_PRODUCT_DATA(state, data) {
    sessionStorage.setItem('labelProductData', JSON.stringify(data))
    state.labelProductData = data
  },
  SET_LABEL_DATA(state, data) {
    state.labelData = data
  },
  SET_PRODUCT_DATA(state, data) {
    state.productData = data
  },
  SET_LABEL_PARAMS(state, data) {
    state.labelParams = data
  },
  SET_LABEL_LIST(state, data) {
    state.labelList = data
  },
  SET_PRODUCT_STATUS(state, data) {
    state.productStatus = data
  },
  SET_PROUCT_LIST(state, list) {
    state.productList = list
  },
  SET_PROUCT_PARAMS(state, list) {
    state.productParams = list
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
