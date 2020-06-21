import request from '@/utils/request'

/**
 *访客统计
 * @param {*} data
 */
export function get(data) {
  return request({
    url: '/index.php?idSite=3&format=json&token_auth=34a7f8af7b2a8a8ed85d3d63de2d44af',
    method: 'get',
    params: data
  }, 'matomo')
}
