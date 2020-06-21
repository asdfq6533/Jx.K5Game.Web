<template>
  <div class="page-content">
    <el-card>
      <div class="filter-div">
        <div class="input-group">
          <label>开始时间</label>
          <el-date-picker
            v-model="params.startDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>结束时间</label>
          <el-date-picker
            v-model="params.endDate"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>下单人</label>
          <el-select v-model="params.orderUserId" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in createList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>打手</label>
          <el-select v-model="params.beaterId" filterable clearable placeholder="请选择">
            <el-option
              v-for="item in beatersList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>订单状态</label>
          <el-select v-model="params.orderStatus" multiple placeholder="请选择" style="width: 400px">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.text"
              :value="item.text"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>来源</label>
          <el-select v-model="params.sources" filterable allow-create clearable placeholder="请选择来源聚道">
            <el-option
              label="5173"
              value="5173"
            />
            <el-option
              label="无极店铺"
              value="无极店铺"
            />
            <el-option
              label="骏网"
              value="骏网"
            />
            <el-option
              label="柒柒"
              value="柒柒"
            />
            <el-option
              label="微信"
              value="微信"
            />
            <el-option
              label="app"
              value="app"
            />
          </el-select>
        </div>
      </div>
      <div class="btns-div">
        <div class="input-group">
          <el-button type="primary" @click="getList">搜索</el-button>
        </div>
        <div class="input-group">
          <el-button type="primary" @click="handleExportExcel">导出Excel</el-button>
        </div>
      </div>
      <div class="order-mess">
        <span>代练总金额：{{ result.allOrderAmount }}元</span>  <span>总佣金：{{ result.allPowerLevelingRewardAmount }}元</span> <span>代练的订单数：{{ result.orderCount }}单</span>
      </div>
      <div style="margin-top: 20px">
        <el-table
          :data="result.daiLianReportList"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="orderId"
            label="订单Id"
            width="160"
          />
          <el-table-column
            prop="gameName"
            label="游戏类型"
            width="100"
          />
          <el-table-column
            prop="taoBaoOrderId"
            label="淘宝订单Id"
            width="180"
          >
            <template v-slot="scope">
              {{ scope.row.taoBaoOrderId || '空' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="sources"
            label="来源聚道"
            width="100"
          >
            <template v-slot="scope">
              {{ scope.row.sources || '空' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderAmount"
            label="支付金额"
            width="100"
          />
          <el-table-column
            prop="powerLevelingReward"
            label="代练佣金"
            width="100"
          />
          <el-table-column
            prop="profit"
            label="利润"
            width="100"
          />
          <el-table-column
            prop="createUserId"
            label="下单人"
            width="120"
          >
            <template v-slot="scope">
              {{ getCreateName(scope.row.createUserId) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="downOrderTime"
            label="下单时间"
            width="120"
          >
            <template v-slot="scope">
              {{ scope.row.downOrderTime|dateFormat }}
            </template>
          </el-table-column>
          <el-table-column
            prop="orderUserId"
            label="接单人"
            width="80"
          >
            <template v-slot="scope">
              {{ getBeaterName(scope.row.createUserId) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="userRemark"
            label="用户备注"
          />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as powerLevelingApi from '@/api/powerLeveling'
import moment from 'moment'
import excelMixin from '@/k5game/mixins/excel-mixin'
export default {
  name: 'Index',
  mixins: [excelMixin],
  data() {
    return {
      beatersList: [],
      createList: [],
      result: {},
      params: {
        startDate: moment().subtract(6, 'days').toDate(),
        endDate: moment().toDate(),
        orderStatus: [],
        beaterId: '',
        sources: ''
      },
      status: [
        { value: 0, text: '待付款' },
        { value: 1, text: '待改价' },
        { value: 2, text: '待发货' },
        { value: 3, text: '代练中' },
        { value: 4, text: '已发货' },
        { value: 5, text: '已取消' },
        { value: 6, text: '已完成' }
      ],
      list: []
    }
  },
  created() {
    this.getRequest()
  },
  methods: {
    handleExportExcel() {
      const tHeader = [
        '订单Id',
        '游戏类型',
        '淘宝订单Id',
        '来源聚道',
        '支付金额',
        '代练佣金',
        '利润',
        '下单人',
        '下单时间',
        '接单人',
        '用户备注'
      ]
      const filterVal = [
        'orderId',
        'gameName',
        'taoBaoOrderId',
        'sources',
        'orderAmount',
        'powerLevelingReward',
        'profit',
        'createUserId',
        'downOrderTime',
        'orderUserId',
        'userRemark'
      ]
      const formatVal = [
        { field: 'downOrderTime', format: 'Date' }
        // { field: 'isEmailConfirmed', format: 'Boolean' },
        // { field: 'isActive', format: 'Boolean' }
      ]
      const list = JSON.parse(JSON.stringify(this.result.daiLianReportList))
      list.map(item => {
        item.createUserId = this.getCreateName(item.createUserId)
        item.orderUserId = this.getBeaterName(item.orderUserId)
      })
      this.excelDownLoadHandle(list, tHeader, filterVal, formatVal, '代练报表')
    },
    getBeaterName(id) {
      let name = ''
      this.beatersList.some(item => {
        if (item.value === id) {
          name = item.label
          return true
        }
      })
      return name
    },
    getCreateName(id) {
      let name = ''
      this.createList.some(item => {
        if (item.value === id) {
          name = item.label
          return true
        }
      })
      return name
    },
    async getRequest() {
      const result1 = await powerLevelingApi.GetBeaters()
      if (result1) {
        this.beatersList = result1.data.result.items
      }
      const result2 = await powerLevelingApi.GetCreateOrderUsers()
      if (result2) {
        this.createList = result2.data.result.items
      }
      this.getList()
    },
    getList() {
      powerLevelingApi.GetDaiLianReportAsync(this.params).then(res => {
        this.result = res.data.result
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-content{
  padding: 20px;
  .order-mess{
    margin-top: 20px;
    padding: 10px 20px;
    background: #f0f9eb;
    color: #67c23a;
    span{
      padding: 0 10px;
    }
    span:first-child{
      color: #E65D6E;
    }
    span:nth-child(2) {
      color: #30B08F;
    }
    span:nth-child(3) {
      color: #409EFF;
    }
  }
  .btns-div{
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    .input-group {
      padding-right: 10px;
    }
  }
}
</style>
