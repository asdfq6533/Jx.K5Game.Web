<template>
  <div class="page-content">
    <el-card>
      <div class="filter-div">
        <div class="input-group">
          <label>开始时间</label>
          <el-date-picker
            v-model="params.startTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>结束时间</label>
          <el-date-picker
            v-model="params.endTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>刻度显示方式</label>
          <el-select v-model="params.showType" placeholder="请选择" style="max-width: 120px">
            <el-option
              label="日"
              value="日"
            />
            <el-option
              label="周"
              value="周"
            />
            <el-option
              label="月"
              value="月"
            />
            <el-option
              label="年"
              value="年"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>订单状态</label>
          <el-select v-model="selectStatus" multiple placeholder="请选择" style="width: 500px">
            <el-option
              v-for="item in status"
              :key="item.text"
              :label="item.text"
              :value="item.text"
            />
          </el-select>
        </div>
        <div class="input-group">
          <el-button type="primary" @click="getAll">搜索</el-button>
        </div>
      </div>
      <div>
        <line-cart :chart-data="lineChartData" />
      </div>
    </el-card>
  </div>
</template>

<script>
import * as accountTransactionApi from '@/api/account-transaction'
import handleDateMixin from '../mixins/handle-date-mixin'
import moment from 'moment'
import LineCart from '../components/LineCart'
export default {
  name: 'OrderReport',
  components: { LineCart },
  mixins: [handleDateMixin],
  data() {
    return {
      lineChartData: {
        titles: [],
        data: []
      },
      selectStatus: ['待支付', '已发货', '已完成', '问题单', '已删除', '已取消'],
      status: [
        {
          text: '待支付',
          color: '#409EFF'
        },
        {
          text: '已发货',
          color: '#3c763d'
        },
        {
          text: '已完成',
          color: '#30B08F'
        },
        {
          text: '问题单',
          color: '#C03639'
        },
        {
          text: '已删除',
          color: '#304156'
        },
        {
          text: '已取消',
          color: '#001528'
        }
      ],
      params: {
        startTime: moment().subtract(6, 'days').toDate(),
        endTime: moment().toDate(),
        status: '', // 订单状态
        showType: '日'
      }
    }
  },
  created() {
    this.getAll()
  },
  methods: {
    getAll() {
      if (!this.params.startTime || !this.params.endTime) {
        this.$message({
          message: '请选择日期',
          type: 'error'
        })
        return false
      }
      if (!this.selectStatus || this.selectStatus.length === 0) {
        this.$message({
          message: '请选择订单状态',
          type: 'error'
        })
        return false
      }

      this.lineChartData.titles = []
      this.lineChartData.data = []
      this.handleTitles()

      this.selectStatus.map(item => {
        this.status.some(item2 => {
          if (item === item2.text) {
            this.getSatusImage(item2.text, item2.color)
            return true
          }
        })
      })
      console.log(this.lineChartData)
    },
    getSatusImage(status, color) {
      const params = JSON.parse(JSON.stringify(this.params))
      params.status = status
      params.endTime = moment(params.endTime).add(1, 'days').toDate()
      accountTransactionApi.GetSatusImage(params).then(res => {
        const result = res.data.result
        const serie = {
          name: status,
          row: [],
          color: color
        }
        const titles = this.lineChartData.titles
        titles.map(item2 => {
          let flag = false
          result.some(item => {
            if (item2 === item.time) {
              serie.row.push(item.count)
              flag = true
              return true
            }
          })
          if (!flag) {
            serie.row.push(0)
          }
        })
        this.lineChartData.data.push(serie)
      })
    }
  }
}
</script>

<style scoped>
.container{
  padding: 20px;
}
</style>
