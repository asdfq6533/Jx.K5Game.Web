import request from '@/utils/request'

/**
 *获取频道
 * @param {*} data
 */
export function GetChannels(data) {
  return request({
    url: '/api/services/k5game/news/GetChannels',
    method: 'post',
    data
  })
}

/**
 *创建频道
 * @param {*} data
 */
export function CreateChannel(data) {
  return request({
    url: '/api/services/k5game/news/CreateChannel',
    method: 'post',
    data
  })
}

/**
 *删除频道
 * @param {*} data
 */
export function DeleteChannel(data) {
  return request({
    url: '/api/services/k5game/news/DeleteChannel',
    method: 'post',
    data
  })
}

/**
 *更新频道
 * @param {*} data
 */
export function UpdateChannel(data) {
  return request({
    url: '/api/services/k5game/news/UpdateChannel',
    method: 'post',
    data
  })
}

/**
 *获取分类
 * @param {*} data
 */
export function GetCategories(data) {
  return request({
    url: '/api/services/k5game/news/GetCategories',
    method: 'post',
    data
  })
}

/**
 *删除分类
 * @param {*} data
 */
export function DeleteCategory(data) {
  return request({
    url: '/api/services/k5game/news/DeleteCategory',
    method: 'post',
    data
  })
}

/**
 *创建分类
 * @param {*} data
 */
export function CreateCategory(data) {
  return request({
    url: '/api/services/k5game/news/CreateCategory',
    method: 'post',
    data
  })
}

/**
 *更新分类
 * @param {*} data
 */
export function UpdateCategory(data) {
  return request({
    url: '/api/services/k5game/news/UpdateCategory',
    method: 'post',
    data
  })
}

/**
 *文章列表
 * @param {*} data
 */
export function GetArticles(data) {
  return request({
    url: '/api/services/k5game/news/GetArticles',
    method: 'post',
    data
  })
}

/**
 *创建或编辑文章
 * @param {*} data
 */
export function CreateOrEditArticle(data) {
  return request({
    url: '/api/services/k5game/news/CreateOrEditArticle',
    method: 'post',
    data
  })
}

/**
 *获取文章
 * @param {*} data
 */
export function GetArticleForEdit(data) {
  return request({
    url: '/api/services/k5game/news/GetArticleForEdit',
    method: 'post',
    data
  })
}

/**
 *删除文章
 * @param {*} data
 */
export function DeleteArticle(data) {
  return request({
    url: '/api/services/k5game/news/DeleteArticle',
    method: 'post',
    data
  })
}
