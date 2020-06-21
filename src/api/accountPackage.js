
import request from '@/utils/request'

export function GetGameLable(data) {
  data['isManage'] = true
  return request({
    url: '/api/services/k5game/accountPackage/GetGameLable',
    method: 'post',
    data
  })
}

export function GetAccountPackage(data) {
  return request({
    url: '/api/services/k5game/accountPackage/GetAccountPackage',
    method: 'post',
    data
  })
}

export function CreateAccountPackage(data) {
  return request({
    url: '/api/services/k5game/accountPackage/CreateAccountPackage',
    method: 'post',
    data
  })
}

export function UpdateAccountPackage(data) {
  return request({
    url: '/api/services/k5game/accountPackage/UpdateAccountPackage',
    method: 'post',
    data
  })
}

export function DeleteAccountPackage(data) {
  return request({
    url: '/api/services/k5game/accountPackage/DeleteAccountPackage',
    method: 'post',
    data
  })
}

/**
 *激活
 * @param {*} data
 */
export function EnableLabelAsync(data) {
  return request({
    url: '/api/services/k5game/accountPackage/EnableLabelAsync',
    method: 'post',
    data
  })
}
