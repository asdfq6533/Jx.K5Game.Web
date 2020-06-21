import request from '@/utils/request'

// 用户列表
export function getUsers(data) {
  return request({
    url: '/api/services/k5game/userManagementService/GetUsers',
    method: 'post',
    data
  })
}

// 修改角色
export function UpdateUserRoles(data) {
  return request({
    url: '/api/services/k5game/userManagementService/UpdateUserRoles',
    method: 'post',
    data
  })
}

// 用户详情
export function GetUserDetail(data) {
  return request({
    url: '/api/services/k5game/userManagementService/GetUser',
    method: 'post',
    data
  })
}

// 禁用账户
export function LockUser(data) {
  return request({
    url: '/api/services/k5game/userManagementService/LockUser',
    method: 'post',
    data
  })
}

// 获取角色列表
export function GetRoles(data) {
  return request({
    url: '/api/services/k5game/userManagementService/GetRoles',
    method: 'post',
    data
  })
}
