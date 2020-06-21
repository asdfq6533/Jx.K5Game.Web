import config from '@/config'
import moment from 'moment'
class K5Utils {
  static uuid() {
    const s = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    return s.join('')
  }

  static getParentToListWithId(data2, nodeId2) {
    let arrRes = []
    if (data2.length === 0) {
      if (nodeId2) {
        arrRes.unshift(data2)
      }
      return arrRes
    }
    const rev = (data, nodeId) => {
      for (let i = 0, length = data.length; i < length; i++) {
        const node = data[i]
        if (node.value === nodeId) {
          arrRes.unshift(node)
          rev(data2, node.parentId)
          break
        } else {
          if (node.children) {
            rev(node.children, nodeId)
          }
        }
      }
      return arrRes
    }
    arrRes = rev(data2, nodeId2)
    const ids = []
    arrRes.map(item => {
      ids.push(item.value)
    })
    return ids
  }

  static getRealUrl(str) {
    if (str.indexOf('http') !== -1) {
      return str
    } else {
      return config.baseUrl + config.pictureUrl + str
    }
  }

  static getNewUrl(str) {
    if (str.indexOf('http') !== -1) {
      return str
    } else {
      return config.baseUrl + config.pictureUrl + str
    }
  }

  // 默认起始时间，即3天前的凌晨0点
  static defaultStartDate() {
    return moment().subtract('days', 6).startOf('days').toISOString()
  }

  // 默认结束时间，即当天23点59分59秒
  static defaultEndDate() {
    return moment().add('days', 1).startOf('days').subtract('seconds', 1).toISOString()
  }
}

export default K5Utils
