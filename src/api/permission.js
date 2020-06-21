import request from '@/utils/request'
export function GetAllPermissions(data) {
  return request({
    url: '/api/services/app/permission/GetAllPermissions',
    method: 'post',
    data
  })
}

export function GetUserPermissions(data) {
  return request({
    url: '/api/services/app/permission/GetUserPermissions',
    method: 'post',
    data
  })
}

// 获取当前登陆人的信息
export function GetCurrentLoginInformations() {
  return request({
    url: '/api/services/k5game/profile/GetCurrentLoginInformations',
    method: 'post'
  })
}
