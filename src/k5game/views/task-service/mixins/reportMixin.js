import moment from 'moment'
import * as taskServiceApi from '@/api/task-service'
import * as matomoApi from '@/api/matomo'
import * as utils from '@/utils/index.js'
export default {
  data() {
    return {
      sumObj: {
        reveivedCount: 0,
        compeleteCount: 0,
        totalMoney: 0,
        drawMoney: 0
      },
      groupList: [],
      startTime: moment().subtract(6, 'days').format('YYYY-MM-DD'),
      endTime: moment().add(1, 'days').format('YYYY-MM-DD')
    }
  },
  methods: {
    search() {
      if (!this.startTime || !this.endTime) {
        this.$message({
          message: '日期不能为空',
          type: 'error'
        })
        return
      }
      this.groupList = []
      this.handleTime()
      this.getVisitList()
      // this.getReport()
      this.getShopReport()
    },
    // 处理日期
    handleTime() {
      const days = moment(this.endTime).diff(moment(this.startTime), 'days')
      for (let i = 0; i < days; i++) {
        const time = moment(this.startTime).add(i, 'days').format('YYYY-MM-DD')
        this.groupList.push({
          id: utils.uuid(),
          time: time
        })
      }
    },
    // 1.日期.2.进入任务中心的用户量。3.已领取的任务量。4.已完成的任务量。5.店铺详细（字段：1店铺.2.已领取的任务量.3.已完成的任务量
    getVisitList() {
      const startTime = moment(this.startTime).format('YYYY-MM-DD')
      const endTime = moment(this.endTime).format('YYYY-MM-DD')
      const params = {
        'module': 'API',
        'method': 'Events.getActionFromCategoryId',
        'secondaryDimension': 'eventAction',
        'idSubtable': '1',
        'showtitle': '1',
        'period': 'day',
        'date': `${startTime},${endTime}`
      }
      matomoApi.get(params).then((response) => {
        const data = response.data
        if (data instanceof Array) {
          const obj = {}
          obj[moment().format('YYYY-MM-DD')] = data
          this.handleData(obj)
        } else {
          this.handleData(data)
        }
      }).catch(() => {
      })
    },
    handleData(data) {
      const list = JSON.parse(JSON.stringify(this.groupList))
      if (this.sumObj.vistCount === undefined || this.sumObj.vistCount === null) {
        this.sumObj.vistCount = 0
      }
      list.map(item => {
        for (const prop in data) {
          if (item.time === prop) {
            const list1 = data[prop]
            let obj = {}
            list1.some(item => {
              if (item.label === '任务大厅') {
                obj = item
                return true
              }
            })
            item.vistCount = obj.nb_uniq_visitors || 0
            this.sumObj.vistCount += item.vistCount
            break
          }
        }
      })
      this.groupList = list
    },
    getReport() {
      const params = {
        startTime: moment(this.startTime).format('YYYY-MM-DD'),
        endTime: moment(this.endTime).add(1, 'days').format('YYYY-MM-DD')
      }
      taskServiceApi.GetReport(params).then(res => {
        const list = JSON.parse(JSON.stringify(this.groupList))
        list.map(obj => {
          const items = res.data.result
          items.some(item => {
            item.time = moment(item.date).format('YYYY-MM-DD')
            if (item.time === obj.time) {
              obj.reveivedCount = item.reveivedCount
              obj.compeleteCount = item.compeleteCount
              obj.totalMoney = item.totalMoney
              obj.drawMoney = item.drawMoney
              this.sumObj.reveivedCount = utils.floatObj().add(this.sumObj.reveivedCount, item.reveivedCount)
              this.sumObj.compeleteCount = utils.floatObj().add(this.sumObj.compeleteCount, item.compeleteCount)
              this.sumObj.totalMoney = utils.floatObj().add(this.sumObj.totalMoney, item.totalMoney)
              this.sumObj.drawMoney = utils.floatObj().add(this.sumObj.drawMoney, item.drawMoney)
              return true
            }
          })
        })
        this.groupList = list
      })
    },
    getShopReport() {
      const params = {
        startTime: moment(this.startTime).format('YYYY-MM-DD'),
        endTime: moment(this.endTime).add(1, 'days').format('YYYY-MM-DD')
      }
      taskServiceApi.GetReportByShopName(params).then(res => {
        const items = res.data.result
        const list = JSON.parse(JSON.stringify(this.groupList))
        list.map(obj => {
          items.some(item => {
            item.time = moment(item.date).format('YYYY-MM-DD')
            if (obj.time === item.time) {
              obj.shopData = item.list
              item.list.map((shop, key) => {
                shop.id = utils.uuid()
                shop.time = shop.shopName
              })
              return true
            }
          })
        })
        this.groupList = list
      })
    }
  }
}
