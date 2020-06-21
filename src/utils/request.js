import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import configuration from '@/config'

// let isToken = false
// create an axios instance
axios.defaults.motamoUrl = configuration.matomoUrl
axios.defaults.baseURL = configuration.baseUrl

let requestCount = 0
function openLoading() {
  store.dispatch('app/setIsLoading', true)
  requestCount++
}
function closeLoading() {
  requestCount--
  if (requestCount <= 0) {
    store.dispatch('app/setIsLoading', false)
  }
}

const service = axios.create({
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    openLoading()
    return config
  },
  error => {
    // do something with request error
    closeLoading()
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    closeLoading()
    if (response.status !== 200) {
      const error = response.data.error
      Message({
        message: error.details ? error.details : error.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(response.data.error.message || 'Error'))
    } else {
      if (response.data && response.data.error) {
        const error = response.data.error
        Message({
          message: error.details ? error.details : error.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(response.data.error.message || 'Error'))
      } else {
        return response
      }
    }
  },
  error => {
    closeLoading()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default (config, item = 'base') => {
  let url = config.url
  switch (item) {
    case 'matomo':
      url = service.defaults.motamoUrl + url
      break
    default:
      if (store && store.getters.token) {
        if (!config.headers) {
          config.headers = {}
        }
        config.headers['Authorization'] = `Bearer ${getToken()}`
      }
      url = service.defaults.baseURL + url
  }
  config.url = url
  return service(config)
}
