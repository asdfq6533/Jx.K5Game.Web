import request from '@/utils/request'

// 分页获取所有商品
export function login(data) {
  return request({
    url: '/api/TokenAuth',
    method: 'post',
    data
  })
}
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function getUserRoles() {
  return request({
    url: '/api/services/app/role/GetUserRoles',
    method: 'post'
  })
}
