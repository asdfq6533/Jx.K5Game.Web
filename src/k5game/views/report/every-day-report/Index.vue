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
        <div v-if="false" class="input-group">
          <label>游戏名</label>
          <el-select v-model="params.GameName" filterable clearable placeholder="全部">
            <el-option
              v-for="item in allGames"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </div>
        <div v-if="false" class="input-group">
          <label>刻度显示方式</label>
          <el-select v-model="params.reportType" placeholder="请选择" style="max-width: 120px">
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
          <el-button type="primary" icon="el-icon-search" @click="searchClick">按条件搜索</el-button>
        </div>
      </div>
      <div class="input-group" style="margin-top: 20px">
        <el-button type="primary" @click="handleExportExcel">导出销售订单详情报表</el-button>
        <el-button type="primary" @click="handleExportExcel2">导出账号采购详情报表</el-button>
      </div>
      <div style="padding-top: 20px">
        <el-tabs v-model="activeName">
          <el-tab-pane label="销售订单详情报表" name="1">
            <el-alert
              class="account"
              :title="`总订单数量： ${count}个, 总利润: ${profit}KB`"
              type="success"
              :closable="false"
            />
            <el-table
              :data="orderList"
              border
              class="power-level-table"
            >
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-table
                    v-if="scope.row.count"
                    border
                    :data="scope.row.dtos"
                    class="power-level-table"
                  >
                    <el-table-column
                      prop="gameName"
                      label="游戏名称"
                    />
                    <el-table-column
                      prop="packageName"
                      label="标签名称"
                      width="300"
                    />
                    <el-table-column
                      prop="count"
                      label="销售数量"
                    />
                    <el-table-column
                      prop="salePrice"
                      label="销售总额"
                    >
                      <template v-slot="scope">
                        {{ scope.row.salePrice }}KB
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="profit"
                      label="销售总利润"
                    >
                      <template v-slot="scope">
                        {{ scope.row.profit }}KB
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                label="日期"
              >
                <template v-slot="scope">
                  {{ scope.row.date | dateFormat }} <span style="color: red">{{ scope.row.dtos.length > 0 ? '*' : '' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="count"
                label="总订单数量"
              />
              <el-table-column
                prop="profit"
                label="销售总利润"
              >
                <template v-slot="scope">
                  {{ scope.row.profit }}KB
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="账号采购详情报表" name="2">
            <el-table
              :data="purchaseList"
              border
              class="power-level-table"
            >
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-table
                    v-if="scope.row.dtos.length > 0"
                    border
                    :data="scope.row.dtos"
                    class="power-level-table"
                  >
                    <el-table-column
                      prop="gameName"
                      label="游戏名称"
                    />
                    <el-table-column
                      prop="packageName"
                      label="标签名称"
                      width="300"
                    />
                    <el-table-column
                      prop="purchaseUnitPrice"
                      label="账号成本"
                    />
                    <el-table-column
                      prop="purchaseCount"
                      label="采购数量"
                    />
                    <el-table-column
                      prop="purchaseUserId"
                      label="采购人"
                    >
                      <template v-slot="scope">
                        {{ getBeaterName(scope.row.purchaseUserId) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                label="日期"
              >
                <template v-slot="scope">
                  {{ scope.row.date | dateFormat }}<span style="color: red">{{ scope.row.dtos.length > 0 ? '*' : '' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="销售订单详情报表" name="3">
            <el-table
              :data="purchaseList2"
              border
              class="power-level-table"
            >
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-table
                    v-if="scope.row.dtos.length > 0"
                    border
                    :data="scope.row.dtos"
                    class="power-level-table"
                  >
                    <el-table-column
                      prop="gameName"
                      label="游戏名称"
                    />
                    <el-table-column
                      prop="packageName"
                      label="标签名称"
                      width="300"
                    />
                    <el-table-column
                      prop="saleAccountTransactionsId"
                      label="账号ID"
                    />
                    <el-table-column
                      prop="purchaseUnitPrice"
                      label="账号成本"
                    />
                    <el-table-column
                      prop="purchaseUserId"
                      label="采购人"
                    >
                      <template v-slot="scope">
                        {{ getBeaterName(scope.row.purchaseUserId) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                label="日期"
              >
                <template v-slot="scope">
                  {{ scope.row.date | dateFormat }}<span style="color: red">{{ scope.row.dtos.length > 0 ? '*' : '' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="销售订单详情报表" name="4">
            <el-table
              :data="orderList2"
              border
              class="power-level-table"
            >
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-table
                    v-if="scope.row.dtos.length"
                    border
                    :data="scope.row.dtos"
                    class="power-level-table"
                  >
                    <el-table-column
                      prop="gameName"
                      label="游戏名称"
                    />
                    <el-table-column
                      prop="packageName"
                      label="标签名称"
                      width="300"
                    />
                    <el-table-column
                      prop="purchaseUnitPrice"
                      label="账号成本"
                      width="300"
                    />
                    <el-table-column
                      prop="saleAccountTransactionsId"
                      label="账号ID"
                    />
                    <el-table-column
                      prop="purchaseUserId"
                      label="采购人"
                    >
                      <template v-slot="scope">
                        {{ getBeaterName(scope.row.purchaseUserId) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column
                prop="date"
                label="日期"
              >
                <template v-slot="scope">
                  {{ scope.row.date | dateFormat }} <span style="color: red">{{ scope.row.dtos.length > 0 ? '*' : '' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as powerLevelingApi from '@/api/powerLeveling'
import * as financeApi from '@/api/finance'
import excelMixin from '@/k5game/mixins/excel-mixin'
import moment from 'moment'
export default {
  name: 'Index',
  mixins: [excelMixin],
  data() {
    return {
      activeName: '1',
      allGames: [],
      params: {
        startDate: moment().subtract(6, 'days').toDate(),
        endDate: moment().toDate()
      },
      purchaseList: [],
      orderList: [],
      purchaseList2: [],
      orderList2: [],
      count: 0,
      profit: 0,
      beatersList: []
    }
  },
  created() {
    this.searchClick()
  },
  methods: {
    // 导出excel
    handleExportExcel() {
      console.log(this.orderList)
      const list = []
      this.orderList.map(item => {
        item.dtos.map(item2 => {
          const obj = {
            date: item.date,
            gameName: item2.gameName,
            packageName: item2.packageName,
            count: item2.count,
            salePrice: item2.salePrice,
            profit: item2.profit
          }
          list.push(obj)
        })
      })
      const tHeader = [
        '日期',
        '游戏名称',
        '标签名称',
        '销售数量',
        '销售总额',
        '销售总利润'
      ]
      const filterVal = [
        'date',
        'gameName',
        'packageName',
        'count',
        'salePrice',
        'profit'
      ]
      const formatVal = [
        { field: 'date', format: 'Date' }
      ]
      this.excelDownLoadHandle(list, tHeader, filterVal, formatVal, '销售订单详情报表')
    },
    // 导出excel
    handleExportExcel2() {
      const list = []
      this.purchaseList.map(item => {
        item.dtos.map(item2 => {
          const obj = {
            date: item2.date,
            gameName: item2.gameName,
            packageName: item2.packageName,
            saleAccountTransactionsId: item2.saleAccountTransactionsId,
            purchaseUnitPrice: item2.purchaseUnitPrice,
            purchaseCount: item2.purchaseCount,
            purchaseUserId: this.getBeaterName(item2.purchaseUserId)
          }
          list.push(obj)
        })
      })
      const tHeader = [
        '日期',
        '游戏名称',
        '标签名称',
        '账号成本',
        '采购数量',
        '采购人'
      ]
      const filterVal = [
        'date',
        'gameName',
        'packageName',
        'purchaseUnitPrice',
        'purchaseCount',
        'purchaseUserId'
      ]
      const formatVal = [
        { field: 'date', format: 'Date' }
      ]
      this.excelDownLoadHandle(list, tHeader, filterVal, formatVal, '账号采购详情报表')
    },
    // 获取打手
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
    async searchClick() {
      const result1 = await powerLevelingApi.GetBeaters()
      if (result1) {
        this.beatersList = result1.data.result.items
      }
      this.getPurchaseReport()
      this.getOrderReport()
      this.getAllPurchaseReport()
      this.getAllOrderReport()
    },
    // 获取报表
    getPurchaseReport() {
      financeApi.GetPurchaseReport(this.params).then(res => {
        this.purchaseList = res.data.result.items
        const list = []
        this.purchaseList.map(item => {
          item.dtos.map(item2 => {
            const obj = {
              date: item.date,
              gameName: item2.gameName,
              packageName: item2.packageName,
              purchaseUnitPrice: item2.purchaseUnitPrice,
              purchaseCount: item2.purchaseCount,
              purchaseUserId: this.getBeaterName(item2.purchaseUserId)
            }
            list.push(obj)
          })
        })
      })
    },
    // 报表2
    getAllPurchaseReport() {
      financeApi.GetAllPurchaseReport(this.params).then(res => {
        this.purchaseList2 = res.data.result.items
        console.log(this.purchaseList2)
        const list = []
        this.purchaseList2.map(item => {
          item.dtos.map(item2 => {
            const obj = {
              date: item.date,
              gameName: item2.gameName,
              packageName: item2.packageName,
              purchaseUnitPrice: item2.purchaseUnitPrice,
              purchaseCount: item2.purchaseCount,
              purchaseUserId: this.getBeaterName(item2.purchaseUserId)
            }
            list.push(obj)
          })
        })
        console.log(this.purchaseList2)
      })
    },
    // 获取报表
    getOrderReport() {
      this.count = 0
      this.profit = 0
      financeApi.GetOrderReport(this.params).then(res => {
        const items = res.data.result.items
        this.orderList = items
        items.map(item => {
          item.count = 0
          item.profit = 0
          item.dtos.map(item2 => {
            this.count += item2.count
            this.profit += item2.profit
            item.count += item2.count
            item.profit += item2.profit
          })
        })
      })
    },
    // 销售订单详情报表2
    getAllOrderReport() {
      financeApi.GetAllPurchaseReport(this.params).then(res => {
        const items = res.data.result.items
        this.orderList2 = items
        console.log(this.orderList2)
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
