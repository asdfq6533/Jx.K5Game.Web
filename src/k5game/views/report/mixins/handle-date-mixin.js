import moment from 'moment'
const HandleDateMixin = {
  data() {
    return {
      lineChartData: {
        titles: [],
        data: []
      },
      params: {
        startTime: moment().subtract(6, 'days').toDate(),
        endTime: moment().toDate(),
        showType: '日'
      }
    }
  },
  methods: {
    handleTitles() {
      switch (this.params.showType) {
        case '日':
          this.handleDays()
          break
        case '周':
          this.handleWeeks()
          break
        case '月':
          this.handleMonths()
          break
        case '年':
          this.handleYears()
          break
      }
    },
    handleDays() {
      const startDate = moment(this.params.startTime)
      const endDate = moment(this.params.endTime)
      const mdays = endDate.diff(startDate, 'days')
      for (let i = 0; i < mdays; i++) {
        this.lineChartData.titles.push(moment(JSON.parse(JSON.stringify(this.params.startTime))).add(i, 'days').format('YYYY-MM-DD'))
      }
    },
    handleWeeks() {
      const startDate = moment(this.params.startTime)
      const endDate = moment(this.params.endTime)
      const weeks = Math.ceil(endDate.diff(startDate, 'days') / 7)
      for (let i = 0; i < weeks; i++) {
        this.lineChartData.titles.push(`第${i + 1}周`)
      }
    },
    handleMonths() {
      const startDate = moment(this.params.startTime)
      const endDate = moment(this.params.endTime)
      const months = endDate.diff(startDate, 'months')
      for (let i = 0; i <= months; i++) {
        this.lineChartData.titles.push(moment(JSON.parse(JSON.stringify(this.params.startTime))).add(i, 'months').format('YYYY-M'))
      }
    },
    handleYears() {
      const startDate = moment(this.params.startTime)
      const endDate = moment(this.params.endTime)
      const years = endDate.diff(startDate, 'years')
      for (let i = 0; i <= years; i++) {
        this.lineChartData.titles.push(moment(JSON.parse(JSON.stringify(this.params.startTime))).add(i, 'years').format('YYYY年'))
      }
    }
  }
}
export default HandleDateMixin
