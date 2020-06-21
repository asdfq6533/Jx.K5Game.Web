<template>
  <div class="page-content">
    <el-card>
      <div class="filter-div">
        <div class="input-group">
          <label>开始发货时间</label>
          <el-date-picker
            v-model="params.deliveryStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>结束发货时间</label>
          <el-date-picker
            v-model="params.deliveryEndTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>开始完成时间</label>
          <el-date-picker
            v-model="params.completionStartTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>结束完成时间</label>
          <el-date-picker
            v-model="params.completionEndTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
          />
        </div>
        <div class="input-group">
          <label>游戏</label>
          <el-select v-model="params.gameId" placeholder="请选择" style="max-width: 120px">
            <el-option
              v-for="item in allGames"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>账号名称</label>
          <el-input v-model="params.accountName" placeholder="请输入账号名称" class="input-with-select" />
        </div>
        <div class="input-group">
          <label>订单编号</label>
          <el-input v-model="params.orderId" placeholder="请输入账号名称" class="input-with-select" />
        </div>
        <div class="input-group">
          <el-button slot="append" icon="el-icon-search" @click="searchClick" />
        </div>
      </div>
      <el-tabs v-model="activeName" type="card" style="margin-top: 12px" @tab-click="handleClick">
        <el-tab-pane
          v-for="(item, key) in status"
          :key="key"
          :label="`${item.text}(${item.count || 0})`"
          :name="item.value"
        />
      </el-tabs>
      <div>
        <lxy-table
          :table-data="list"
          :columns="[
            { label: '订单编号', prop: 'id', width: '180' },
            { label: '账号名称', prop: 'saleOrder.accountName', width: '200' },
            { label: '账号价格', prop: 'purchasePrice' },
            { label: '游戏名称', prop: 'saleOrder.gameName', width: '140' },
            { label: '用户名', prop: 'userNickName', width: '140' },
            { slot: 'statusName' },
            { label: '取消原因', prop: 'cancelTheReason', width: '140' },
            { label: '仲裁原因', prop: 'arbitrationReason', width: '140' },
            { label: '反馈信息', prop: 'feedBack', width: '140' },
            { slot: 'placeOrderTime' },
            { slot: 'deliveryTime' },
            { slot: 'cancelTime' },
            { slot: 'completionTime' },
            { slot: 'deletionTime' },
            { slot: 'operation' },
          ]"
          :page-obj="pageObj"
        >
          <el-table-column slot="statusName" label="订单状态">
            <template v-slot="scope">
              <el-tag :type="getColorType(getStatusName(scope.row.status))">{{ getStatusName(scope.row.status) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column slot="placeOrderTime" label="下单时间" width="140px">
            <template v-slot="scope">
              {{ scope.row.placeOrderTime | timeFormatNotUtc }}
            </template>
          </el-table-column>
          <el-table-column v-if="getDeliveryTime" slot="deliveryTime" label="发货时间">
            <template v-slot="scope">
              {{ scope.row.deliveryTime | timeFormatNotUtc }}
            </template>
          </el-table-column>
          <el-table-column v-if="getCancelTime" slot="cancelTime" label="取消时间" width="140">
            <template v-slot="scope">
              {{ scope.row.cancelTime | timeFormat }}
            </template>
          </el-table-column>
          <el-table-column v-if="getCompletionTime" slot="completionTime" label="完成时间" width="140">
            <template v-slot="scope">
              {{ scope.row.completionTime | timeFormat }}
            </template>
          </el-table-column>
          <el-table-column v-if="getDeletionTime" slot="deletionTime" label="删除时间" width="140">
            <template v-slot="scope">
              {{ scope.row.deletionTime | timeFormat }}
            </template>
          </el-table-column>
          <el-table-column slot="operation" label="操作" width="180" fixed="right">
            <template v-slot="scope">
              <el-dropdown trigger="click">
                <el-button type="primary" style="width: 150px">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown" style="width: 150px">
                  <el-dropdown-item @click.native="detailClick(scope.row)">
                    <svg-icon icon-class="search" />
                    <label>查看</label>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="backInnerClick(scope.row)">
                    <svg-icon icon-class="delete" />
                    <label>撤回内部订单</label>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 2"
                    @click.native="toArbitrationOrderClick(scope.row)"
                  >
                    <svg-icon icon-class="hammer2" />
                    <label>转换问题单</label>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 5"
                    @click.native="arbitrationClick(scope.row)"
                  >
                    <svg-icon icon-class="hammer2" />
                    <label>仲裁</label>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 5"
                    @click.native="cancelArbitrationClick(scope.row)"
                  >
                    <svg-icon icon-class="hammer2" />
                    <label>取消仲裁</label>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.status === 1"
                    @click.native="deliverClick(scope.row)"
                  >
                    <svg-icon icon-class="hammer2" />
                    <label>发货</label>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </lxy-table>
      </div>
    </el-card>
    <detail-dialog
      ref="detailDialog"
      :is-show="isDetailShow"
      @onClose="isDetailShow=false"
    />
    <arbitration-dialog
      ref="arbitrationDialog"
      :is-show="isArbitrationShow"
      @onClose="isArbitrationShow=false"
      @onRefresh="searchClick"
    />
    <to-arbitration-order-dialog
      ref="toArbitrationOrderDialog"
      :is-show="isToArbitrationOrderShow"
      @onClose="isToArbitrationOrderShow=false"
      @onRefresh="searchClick"
    />
    <to-normal-purchase-order-dialog
      ref="ToNormalPurchaseOrderDialog"
      :is-show="isToNormalPurchaseOrderShow"
      @onClose="isToNormalPurchaseOrderShow=false"
      @onRefresh="searchClick"
    />
  </div>
</template>
<script>
import * as accountTransactionApi from '@/api/account-transaction'
import config from '@/config'
import orderStatus from '../data/order-status'
import accountMixin from '@/k5game/mixins/account-mixin'
import DetailDialog from './components/DetailDialog'
import ArbitrationDialog from './components/ArbitrationDialog'
import orderStatus2 from '../data/order-status2'
import ToArbitrationOrderDialog from './components/ToArbitrationOrderDialog'
import ToNormalPurchaseOrderDialog from './components/ToNormalPurchaseOrderDialog'
import LxyTable from '@/k5game/components/LxyTable'
const MAXRESULTCOUNT = 10
export default {
  name: 'Index',
  components: { LxyTable, ToNormalPurchaseOrderDialog, ToArbitrationOrderDialog, ArbitrationDialog, DetailDialog },
  mixins: [accountMixin],
  data() {
    return {
      activeName: '',
      orderStatusStr: '',
      list: [],
      status: JSON.parse(JSON.stringify(orderStatus)),
      statusCountObj: {},
      params: {
        accountName: '',
        gameId: null,
        maxAccountPrice: 100000000,
        minAccountPrice: 0,
        status: '',
        active: 2,
        maxResultCount: MAXRESULTCOUNT,
        skipCount: 0,
        orderId: '',
        completionStartTime: '',
        completionEndTime: '',
        deliveryStartTime: '',
        deliveryEndTime: ''
      },
      isDetailShow: false,
      isArbitrationShow: false,
      isToArbitrationOrderShow: false,
      isToNormalPurchaseOrderShow: false,
      pageObj: {
        maxResultCount: MAXRESULTCOUNT,
        totalCount: 0,
        currentPage: 1,
        sizeChange: (page) => {
          this.handleSizeChange(page)
        },
        pageChange: (page) => {
          this.pageChange(page)
        }
      }
    }
  },
  computed: {
    getCancelTime() {
      const orderStatusStr = this.orderStatusStr
      return orderStatusStr !== '已完成' && orderStatusStr !== '已发货' && orderStatusStr !== '待支付'
    },
    getDeliveryTime() {
      const orderStatusStr = this.orderStatusStr
      return orderStatusStr !== '待支付'
    },
    getCompletionTime() {
      const orderStatusStr = this.orderStatusStr
      return orderStatusStr !== '已取消' && orderStatusStr !== '已发货' && orderStatusStr !== '待支付'
    },
    getDeletionTime() {
      const orderStatusStr = this.orderStatusStr
      return orderStatusStr !== '已取消' && orderStatusStr !== '已完成' && orderStatusStr !== '已发货' && orderStatusStr !== '待支付'
    }
  },
  mounted() {
    this.searchClick()
    this.getAllGames(() => {
      this.allGames.unshift({
        name: '全部',
        id: ''
      })
    })
  },
  methods: {
    // 撤回内部订单
    backInnerClick(row) {
      this.$confirm('你确定要撤回订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        accountTransactionApi.BackAccountPackageOrderInside({ id: row.id }).then(res => {
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            })
          }
        })
      }).catch(() => {
      })
    },
    // 切换订单状态
    handleClick(tab, event) {
      console.log(tab.name)
      this.params.status = tab.name
      this.searchClick()
    },
    cancelArbitrationClick(row) {
      this.isToNormalPurchaseOrderShow = true
      this.$refs.ToNormalPurchaseOrderDialog.setValues(row)
    },
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.searchClick()
    },
    getStatusName(val) {
      return orderStatus2[val]
    },
    getColorType(str) {
      switch (str) {
        case '待支付':
          return 'warning'
        case '已完成':
          return ''
        case '问题单':
          return 'danger'
        case '已发货':
          return 'success'
        case '已取消':
          return 'info'
        case '已删除':
          return 'info'
        default:
          return ''
      }
    },
    deliverClick(item) {
      this.$alert('你确定发货吗', {
        confirmButtonText: '确定'
      }).then(() => {
        const params = {
          id: item.id
        }
        accountTransactionApi.UpdatePurchaseAccountTransactionContent(params).then(res => {
          if (res.data.success) {
            this.searchClick()
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          }
        })
      })
    },
    arbitrationClick(item) {
      this.isArbitrationShow = true
      this.$refs.arbitrationDialog.setValues(item)
    },
    detailClick(item) {
      this.isDetailShow = true
      this.$refs.detailDialog.setValues(item)
    },
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    },
    searchClick() {
      this.orderStatusStr = this.params.status
      this.pageObj.currentPage = 1
      this.params.skipCount = 0
      this.getList()
      this.getStatusCount()
    },
    getStatusCount() {
      const params = {
        accountName: this.params.accountName,
        // saleId: this.params.orderId,
        gameId: this.params.gameId,
        minAccountPrice: this.params.minAccountPrice,
        maxAccountPrice: this.params.maxAccountPrice,
        orderId: this.params.orderId,
        completionStartTime: this.params.completionStartTime,
        completionEndTime: this.params.completionEndTime,
        deliveryStartTime: this.params.deliveryStartTime,
        deliveryEndTime: this.params.deliveryEndTime
      }
      accountTransactionApi.GetPurchaseCount(params).then(res => {
        const statusCountObj = res.data.result || {}
        const status = JSON.parse(JSON.stringify(this.status))
        status.map(item => {
          switch (item.text) {
            case '全部':
              item.count = statusCountObj.allCount
              break
            case '待支付':
              item.count = statusCountObj.waitPaymentCount
              break
            case '已发货':
              item.count = statusCountObj.sendedCount
              break
            case '已完成':
              item.count = statusCountObj.finishedCount
              break
            case '问题单':
              item.count = statusCountObj.problemCount
              break
            case '已删除':
              item.count = statusCountObj.deletedCount
              break
            case '已取消':
              item.count = statusCountObj.cancelledCount
              break
          }
        })
        this.status = status
      })
    },
    getList() {
      accountTransactionApi.GetPurchaseAccountTransactions(this.params).then(res => {
        console.log(res)
        this.list = res.data.result.items
        this.pageObj.totalCount = res.data.result.totalCount
      })
    },
    getRealUrl(str) {
      if (str.indexOf('http') !== -1) {
        return str
      } else {
        return config.baseUrl + '/Upload/Downloads/' + str
      }
    },
    toArbitrationOrderClick(row) {
      this.isToArbitrationOrderShow = true
      this.$refs.toArbitrationOrderDialog.setValues(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 20px;
  .screenshot{
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    img{
      width: 100%;
    }
  }
}
</style>
