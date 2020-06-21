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
          <label>是否成本价</label>
          <el-select v-model="params.hasCostPrice" placeholder="请选择">
            <el-option
              :key="1"
              label="是"
              :value="true"
            />
            <el-option
              :key="2"
              label="否"
              :value="false"
            />
          </el-select>
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
import handleDateMixin from '../mixins/handle-date-mixin'
import * as financeApi from '@/api/finance'
import LineCart from '../components/LineCart'
import moment from 'moment'
export default {
  name: 'Index',
  components: { LineCart },
  mixins: [handleDateMixin],
  data() {
    return {
      lineChartData: {
        titles: [],
        data: []
      },
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
      this.lineChartData.titles = []
      this.lineChartData.data = []
      this.handleTitles()
      financeApi.getProfitFinance(this.params).then(res => {
        const items = res.data.result.items
        const serie1 = {
          name: '销售额',
          row: [],
          color: '#CC3333'
        }
        const serie2 = {
          name: '成本',
          row: [],
          color: '#003366'
        }
        const serie3 = {
          name: '利润',
          row: [],
          color: '#336633'
        }
        const serie4 = {
          name: '销售数量',
          row: [],
          color: '#4AB7BD'
        }
        const titles = this.lineChartData.titles
        titles.map(item2 => {
          let flag = false
          items.some(item => {
            if (item2 === item.time) {
              serie1.row.push(item.saleTotalPrice)
              serie2.row.push(item.costPrice)
              serie3.row.push(item.profit)
              serie4.row.push(item.saleCount)
              flag = true
              return true
            }
          })
          if (!flag) {
            serie1.row.push(0)
            serie2.row.push(0)
            serie3.row.push(0)
            serie4.row.push(0)
          }
        })
        this.lineChartData.data.push(serie1)
        this.lineChartData.data.push(serie2)
        this.lineChartData.data.push(serie3)
        this.lineChartData.data.push(serie4)
      })
    } // 没有判断年
  }
}
</script>

<style scoped>
.container{
  padding: 20px;
}
</style>
