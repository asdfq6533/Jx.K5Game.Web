import request from '@/utils/request'

export function GetAccountNameAuth(data) {
  return request({
    url: '/api/services/k5game/accountNameAuth/GetAccountNameAuth',
    method: 'post',
    data
  })
}

export function VolumeActivation(data) {
  return request({
    url: '/api/services/k5game/accountNameAuth/VolumeActivation',
    method: 'post',
    data
  })
}

export function UpdateAccountNameAuth(data) {
  return request({
    url: '/api/services/k5game/accountNameAuth/UpdateAccountNameAuth',
    method: 'post',
    data
  })
}

export function ActivateAccountNameAuth(data) {
  return request({
    url: '/api/services/k5game/accountNameAuth/ActivateAccountNameAuth',
    method: 'post',
    data
  })
}
