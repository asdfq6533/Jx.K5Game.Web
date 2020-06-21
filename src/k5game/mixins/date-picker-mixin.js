import moment from 'moment'
const datePickerMixin = {
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = moment().toDate()
            const start = moment().subtract(7, 'day').toDate()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = moment().toDate()
            const start = moment().subtract(1, 'months').toDate()
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = moment().toDate()
            const start = moment().subtract(3, 'months').toDate()
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  }
}
export default datePickerMixin
