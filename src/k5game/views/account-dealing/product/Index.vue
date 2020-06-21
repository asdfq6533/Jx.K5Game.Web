<template>
  <div class="page-content">
    <el-card class="box-card">
      <div class="filter-div">
        <div class="input-group">
          <label>选择日期</label>
          <el-date-picker
            v-model="dateValue"
            style="width: 240px"
            type="daterange"
            range-separator="一"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
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
          <label>账号状态</label>
          <el-select v-model="params.status" placeholder="请选择" style="max-width: 120px">
            <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>账号名称</label>
          <el-input v-model="params.accountName" placeholder="请输入账号名称" class="input-with-select" />
        </div>
        <div class="input-group">
          <label>卖家名称</label>
          <el-input v-model="params.nickName" placeholder="请输入卖家名称" class="input-with-select" />
        </div>
        <div class="input-group">
          <label>标签名称</label>
          <el-input v-model="params.lableName" placeholder="请输入卖家名称" class="input-with-select" />
        </div>
        <div class="input-group">
          <label>账号订单编号</label>
          <el-input v-model="params.saleAccountId" placeholder="请输入账号订单编号" class="input-with-select" />
        </div>
        <div class="input-group">
          <label>游戏账号</label>
          <el-input v-model="params.accountNumber" placeholder="请输入游戏账号" class="input-with-select" />
        </div>
        <div class="input-group">
          <el-button slot="append" style="margin-left: 10px" icon="el-icon-search" @click="searchClick" />
        </div>
      </div>
      <div class="op-div">
        <el-button v-if="roleType !== 1" type="primary" @click="addOrUpdateAccountClick()">添加个人账号</el-button>
        <el-button v-if="roleType !== 1" type="primary" @click="passClick">审核通过</el-button>
        <el-button type="primary" @click="batchSetLabelClick">批量设置标签</el-button>
        <el-button type="primary" @click="isUploadOpeningShow = true">批量上传</el-button>
        <el-button v-if="roleType === 2" type="primary" @click="batchSoldOut">批量下架</el-button>
        <el-button v-if="roleType === 2" type="primary" @click="batchCancelled">批量取消</el-button>
      </div>
      <div>
        <lxy-table
          :table-data="tableData"
          :columns="[
            { slot: 'selection' },
            { prop: 'nickName', label: '卖家', width: '100'},
            { prop: 'accountName', label: '账号名称', width: '200' },
            { prop: 'accountPrice', label: '账号价格', width: '120' },
            { prop: 'discountedPrice', label: '折扣价格', width: '120' },
            { prop: 'accountNumber', label: '游戏账号', width: '130' },
            { prop: 'accountPassWord', label: '游戏密码', width: '130' },
            { prop: 'creationTime', label: '创建时间', type: 'date', width: '120' },
            { prop: 'isIndexRecommend', label: '推荐', type: 'bool' },
            { prop: 'status', label: '账号状态', type: 'custom' },
            { prop: 'cancelTheReason', label: '取消理由' },
            { slot: 'operation' }
          ]"
          :page-obj="pageObj"
          @handleSelectionChange="handleSelectionChange"
        >
          <el-table-column slot="selection" type="selection" />
          <el-table-column slot="operation" label="操作" width="170" fixed="right">
            <template v-slot="scope">
              <el-dropdown trigger="click">
                <el-button type="primary" style="width: 140px">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown" style="width: 140px">
                  <el-dropdown-item @click.native="detailClick(scope.row)">
                    <svg-icon icon-class="search" />
                    <label>查看</label>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="newInnerClick(scope.row)">
                    <svg-icon icon-class="add" />
                    <label>新建内部下单</label>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="updateAccountClick(scope.row)">
                    <svg-icon icon-class="edit" />
                    <label>编辑</label>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status === 1" @click.native="soltOutClick(scope.row)">
                    <svg-icon icon-class="close" />
                    <label>取消上架</label>
                  </el-dropdown-item>
                  <el-dropdown-item v-if="scope.row.status === 0 || false" @click.native="refuseClick(scope.row)">
                    <svg-icon icon-class="close" />
                    <label>审核不通过</label>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </lxy-table>
      </div>
    </el-card>
    <account-form-dialog
      ref="accountForm"
      :is-show="isFormShow"
      @onClose="isFormShow = false"
      @onRefresh="searchClick"
    />
    <account-detail-dialog
      ref="accountDetailDialog"
      :is-show="isDetailShow"
      @onClose="isDetailShow = false"
    />
    <account-audit-dialog
      ref="auditDialog"
      :is-show="isAuditShow"
      @onClose="isAuditShow = false"
      @onRefresh="searchClick"
    />
    <account-label-dialog
      ref="labelDialog"
      :is-show="isLabelShow"
      @onClose="isLabelShow = false"
      @onRefresh="searchClick"
    />
    <batch-opening-upload-dialog
      :is-show="isUploadOpeningShow"
      @onClose="isUploadOpeningShow=false"
      @onRefresh="searchClick"
    />
  </div>
</template>

<script>
import datePickerMixin from '@/k5game/mixins/date-picker-mixin'
import * as accountTransactionApi from '@/api/account-transaction'
import statusJson from '../data/product-status'
import config from '@/config'
import moment from 'moment'
import AccountFormDialog from './components/AccountFormDialog'
import accountMixin from '@/k5game/mixins/account-mixin'
import AccountDetailDialog from './components/AccountDetailDialog'
import AccountAuditDialog from './components/AccountAuditDialog'
import AccountLabelDialog from './components/AccountLabelDialog'
import BatchOpeningUploadDialog from './components/BatchOpeningUploadDialog'
import listMixin from '@/k5game/mixins/list-mixin'
import { mapGetters } from 'vuex'
import LxyTable from '@/k5game/components/LxyTable'
const MAXRESULTCOUNT = 10
export default {
  name: 'Index',
  components: { LxyTable, BatchOpeningUploadDialog, AccountLabelDialog, AccountAuditDialog, AccountDetailDialog, AccountFormDialog },
  mixins: [datePickerMixin, accountMixin, listMixin],
  data() {
    return {
      isFormShow: false,
      isDetailShow: false,
      isAuditShow: false,
      isUploadExcelShow: false,
      isLabelShow: false,
      isUploadOpeningShow: false,
      dateValue: [],
      selectedList: [],
      params: {
        startDate: '',
        endDate: '',
        gameId: '',
        serviceId: '',
        serverGroup: '',
        accountType: '',
        accountName: '',
        accountNumber: '',
        status: '',
        saleAccountId: '',
        sorting: '',
        maxResultCount: MAXRESULTCOUNT,
        skipCount: 0
      },
      status: JSON.parse(JSON.stringify(statusJson)),
      tableData: [],
      baseUrl: config.baseUrl,
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
    ...mapGetters(['roleType'])
  },
  watch: {
    dateValue(newValue) {
      if (newValue && newValue.length) {
        this.params.startDate = moment(newValue[0]).format('YYYY-MM-DD')
        this.params.endDate = moment(newValue[1]).format('YYYY-MM-DD')
      } else {
        this.params.startDate = ''
        this.params.endDate = ''
      }
    }
  },
  mounted() {
    this.getAllGames(() => {
      this.allGames.unshift({
        name: '全部',
        id: ''
      })
    })
    this.getSaleAccountTransactionsManag()
  },
  methods: {
    // 新建内部下单
    newInnerClick(row) {
      console.log(row)

      this.$confirm('是否新建内部下单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        accountTransactionApi.CreateAccountPackageOrderInside({ id: row.id }).then(res => {
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
    getColorType(str) {
      switch (str) {
        case '已完成':
          return 'success'
        case '待审核':
          return 'danger'
        case '已发货':
          return ''
        case '已取消':
          return 'info'
        case '销售中':
          return 'warning'
        default:
          return ''
      }
    },
    batchCancelled() {
      if (this.selectedList.length === 0) {
        this.$message({
          message: '请选择产品',
          type: 'error'
        })
      } else {
        this.$prompt('请输入原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: '审核不通过'
        }).then(({ value }) => {
          const arr = []
          this.selectedList.map(item => {
            arr.push({
              id: item
            })
          })
          const params = {
            accountIdList: arr,
            cancelReason: value
          }
          accountTransactionApi.BatchCancelled(params).then(res => {
            if (res.data.success) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.searchClick()
            }
          })
        }).catch(() => {})
      }
    },
    batchSoldOut() {
      if (this.selectedList.length === 0) {
        this.$message({
          message: '请选择产品',
          type: 'error'
        })
      } else {
        this.$prompt('请输入原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: '取消上架'
        }).then(({ value }) => {
          const arr = []
          this.selectedList.map(item => {
            arr.push({
              id: item
            })
          })
          const params = {
            accountIdList: arr,
            cancelReason: value
          }
          accountTransactionApi.SoldOut(params).then(res => {
            if (res.data.success) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.searchClick()
            }
          })
        }).catch(() => {})
      }
    },
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.searchClick()
    },
    batchSetLabelClick() {
      if (this.selectedList.length === 0) {
        this.$message({
          message: '请选择产品',
          type: 'error'
        })
      } else {
        this.isLabelShow = true
        this.$refs.labelDialog.setValues(this.selectedList)
      }
    },
    passClick() {
      if (this.selectedList.length === 0) {
        this.$message({
          message: '请选择产品',
          type: 'error'
        })
      } else {
        const orders = []
        this.selectedList.map(item => {
          orders.push({
            id: item,
            isThrough: true,
            cancelTheReason: '审核通过'
          })
        })
        const params = {
          order: orders
        }

        this.$alert('你确定审核吗', {
          confirmButtonText: '确定'
        }).then(() => {
          accountTransactionApi.UpdateAccountTransactionStatus(params).then(res => {
            if (res.data.success) {
              this.searchClick()
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          })
        })
      }
    },
    handleSelectionChange(val) {
      this.tableData.map((item) => {
        this.selectedList.some((id, key) => {
          if (item.id === id) {
            this.selectedList.splice(key, 1)
            return true
          }
        })
      })
      val.map((item) => {
        this.selectedList.push(item.id)
      })
    },
    handleCallOrderChecked() {
      const selectedData = []
      this.selectedList.map((id) => {
        this.tableData.some((row) => {
          if (row.id === id) {
            selectedData.push(row)
            return true
          }
        })
      })
      this.$nextTick(() => {
        selectedData.map((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      })
    },
    soltOutClick(item) {
      this.isAuditShow = true
      this.$refs.auditDialog.setValue(item, false, '取消上架')
    },
    refuseClick(item) {
      this.isAuditShow = true
      this.$refs.auditDialog.setValue(item, false, '取消审核')
    },
    detailClick(item) {
      this.isDetailShow = true
      this.$refs.accountDetailDialog.setValue(item)
    },
    updateAccountClick(item) {
      this.isFormShow = true
      this.$refs.accountForm.setValue(item)
    },
    addOrUpdateAccountClick() {
      this.isFormShow = true
      this.$refs.accountForm.setValue()
    },
    searchClick() {
      this.pageObj.currentPage = 1
      this.params.skipCount = 0
      this.selectedList = []
      this.getSaleAccountTransactionsManag()
    },
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getSaleAccountTransactionsManag()
    },
    getSaleAccountTransactionsManag() {
      accountTransactionApi.GetSaleAccountTransactionsManag(this.params).then(res => {
        this.pageObj.totalCount = res.data.result.totalCount
        this.tableData = res.data.result.items
        this.handleCallOrderChecked()
      })
    },
    getStatus(num) {
      switch (num) {
        case -1:
          return '已取消'
        case 0:
          return '待审核'
        case 1:
          return '销售中'
        case 2:
          return '编辑中'
        case 3:
          return '待发货'
        case 4:
          return '已完成'
        case 6:
          return '已发货'
      }
    },
    getRealUrl(str) {
      if (str.indexOf('http') !== -1) {
        return str
      } else {
        return config.baseUrl + config.pictureUrl + str
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.op-div{
  margin-top: 20px;
  .el-button{
    margin-bottom: 10px;
  }
}
</style>

