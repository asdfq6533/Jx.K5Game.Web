import { login, getInfo, getUserRoles } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import * as permissionApi from '@/api/permission'
import md5 from 'js-md5'
const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  roleType: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLE_TYPE: (state, roleType) => {
    state.roleType = roleType
  }
}

const actions = {
  getUserRoles({ commit }) {
    return new Promise((resolve, reject) => {
      getUserRoles().then(res => {
        const items = res.data.result.items
        let type = 0
        items.some(item => {
          if (item === 'Admin') {
            type = 2
            return true
          } else if (item === '账号交易商家') {
            type = 1
          }
        })
        commit('SET_ROLE_TYPE', type)
        console.log(items)
        resolve(items)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getUserPermissions({ commit }) {
    return new Promise((resolve, reject) => {
      permissionApi.GetUserPermissions().then(res => {
        resolve(res.data.result.grantedPermissionNames)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getAllPermissions({ commit }) {
    return new Promise((resolve, reject) => {
      permissionApi.GetAllPermissions().then(res => {
        resolve(res.data.result.items)
      }).catch(error => {
        reject(error)
      })
    })
  },
  getCurrentLoginInformations({ commit }) {
    return new Promise((resolve, reject) => {
      permissionApi.GetCurrentLoginInformations().then(res => {
        resolve(res.data.result)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password, type } = userInfo
    return new Promise((resolve, reject) => {
      login({ usernameOrEmailAddress: username.trim(), password: type === 1 ? md5(password) : password }).then(response => {
        // debugger
        const { data } = response
        // const userString = decodeURIComponent(escape(window.atob(data.result.jwt.split('.')[1])))
        // console.log(userString)
        // // const user = JSON.parse(userString)
        commit('SET_TOKEN', data.result)
        setToken(data.result.ticket)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  setRole({ commit }, roles) {
    commit('SET_ROLES', roles)
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }

        const { roles, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduction)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    commit('SET_TOKEN', '')
    commit('SET_ROLES', [])
    removeToken()
    resetRouter()
    // return new Promise((resolve, reject) => {
    //   logout(state.token).then(() => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     removeToken()
    //     resetRouter()
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
