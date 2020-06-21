const withDrawDataKey = 'withDrawDataKey'
const dataTaskKey = 'dataTaskKey'
const CodeKey = 'CodeKey'
const dataAuditKey = 'dataAuditKey'
const state = {
  code: sessionStorage.getItem(CodeKey),
  taskData: JSON.parse(sessionStorage.getItem(dataTaskKey)),
  withDrawData: JSON.parse(sessionStorage.getItem(withDrawDataKey)),
  taskParams: null,
  taskList: [],
  taskAuditData: JSON.parse(sessionStorage.getItem(dataAuditKey)),
  taskAuditParams: null,
  taskAuditList: [],
  taskDrawParams: null,
  taskDrawList: []
}

const mutations = {
  SET_CODE(state, data) {
    sessionStorage.setItem(CodeKey, data)
    state.code = data
  },
  SET_TASK_DRAW_PARAMS(state, params) {
    state.taskDrawParams = params
  },
  SET_TASK_AUDIT_PARAMS(state, params) {
    state.taskAuditParams = params
  },
  SET_TASK_PARAMS(state, params) {
    state.taskParams = params
  },
  SET_TASK_DRAW_LIST(state, list) {
    state.taskDrawList = list
  },
  SET_TASK_AUDIT_LIST(state, list) {
    state.taskAuditList = list
  },
  SET_TASK_LIST(state, list) {
    state.taskList = list
  },
  SET_TASK_AUDIT_DATA(state, data) {
    sessionStorage.setItem(dataAuditKey, JSON.stringify(data))
    state.taskAuditData = data
  },
  SET_TASK_DATA(state, taskData) {
    sessionStorage.setItem(dataTaskKey, JSON.stringify(taskData))
    state.taskData = taskData
  },
  SET_WITH_DRAW_DATA(state, withDrawData) {
    sessionStorage.setItem(withDrawDataKey, JSON.stringify(withDrawData))
    state.withDrawData = withDrawData
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
