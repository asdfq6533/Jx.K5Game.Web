<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="订单编号">
            <el-input v-model="params.orderId" placeholder="输入订单编号" clearable />
          </el-form-item>
          <el-form-item label="结算单号">
            <el-input v-model="params.id" placeholder="输入结算单号" clearable />
          </el-form-item>
          <el-form-item label="订单来源">
            <el-select v-model="params.source" style="width: 160px" clearable placeholder="全部">
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
                label="千鹰"
                value="千鹰"
              />
              <el-option
                label="见中"
                value="见中"
              />
              <el-option
                label="匠心"
                value="匠心"
              />
              <el-option
                label="app"
                value="app"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="商家">
            <el-input v-model="params.salerNickName" placeholder="输入商家名称" clearable />
          </el-form-item>
          <el-form-item label="用户">
            <el-input v-model="params.buyerNickName" placeholder="输入用户名称" clearable />
          </el-form-item>
          <el-form-item label="打手">
            <el-input v-model="params.beaterNickName" placeholder="输入打手名称" clearable />
          </el-form-item>
          <el-form-item label="是否结算">
            <el-select v-model="params.isCheck" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="是"
                value="true"
              />
              <el-option
                label="否"
                value="false"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生成时间">
            <el-date-picker
              v-model="downOrderTime"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="结算时间">
            <el-date-picker
              v-model="checkTime"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="info" icon="el-icon-search" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <ul class="operate">
      <li>
        <el-button type="success" class="my-btn-icon" @click="batchCheckSettlement">
          批量结算核对
        </el-button>
      </li>
      <li>
        <el-button type="primary" class="my-btn-icon" @click="exportChoice">
          导出勾选项
        </el-button>
      </li>
      <li>
        <el-button type="primary" class="my-btn-icon" @click="exportAll">
          导出搜索结果
        </el-button>
      </li>
    </ul>
    <lxz-table
      ref="multipleTable"
      :table-data="dataList"
      :columns="[
        { slot: 'selection' },
        { label: '订单编号', prop: 'orderId', width: '180px' },
        { label: '结算单号', prop: 'id',width:'180px'},
        { label: '订单来源', prop: 'source',width:'130px'},
        { label: '商家', prop: 'saller',width:'130px'},
        { label: '用户', prop: 'buyer',width:'130px'},
        { label: '打手', prop: 'beater.nickName',width:'130px'},

        { slot: 'orderAmount' },
        { label: '代练佣金', prop: 'powerLevelingReward'},
        { label: '备注', prop: 'remark',width:'150px'},
        { slot: 'downOrderTime' },
        { slot: 'checkTime' },
        { slot: 'operate'}
      ]"
      :page-obj="pageObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column
        slot="selection"
        type="selection"
        width="45"
      />
      <el-table-column
        slot="beater"
        label="打手"
        width="120"
      >
        <template v-slot="scope">
          {{ scope.row.beater.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        slot="orderAmount"
        label="订单金额"
      >
        <template v-slot="scope">
          {{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column
        slot="downOrderTime"
        label="生成时间"
        width="160"
      >
        <template v-slot="scope">
          {{ scope.row.downOrderTime | timeFormatNotUtc }}
        </template>
      </el-table-column>
      <el-table-column
        slot="checkTime"
        label="结算时间"
        width="160"
      >
        <template v-slot="scope">
          {{ scope.row.checkTime | timeFormatNotUtc }}
        </template>
      </el-table-column>
      <el-table-column
        slot="operate"
        label="操作"
        width="160"
        fixed="right"
      >
        <template v-slot="scope">
          <div class="icons-operate">
            <!-- <a href="javascript:void(0)">
              <p @click="goDetail(scope.row)">查看</p>
            </a> -->
            <a v-if="!scope.row.isCheck" href="javascript:void(0)">
              <p @click="CheckSettlement(scope.row)">结算核对</p>
            </a>
          </div>
        </template>
      </el-table-column>
    </lxz-table>
    <tips-dialog
      v-model="isDialogShow"
      :title="title"
      @onRefresh="search"
      @submit="submit"
    >
      <div>
        <p class="tips">{{ message }}</p>
      </div>
    </tips-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import TipsDialog from '@/k5game/components/TipsDialog'
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as financeManageApi from '@/api/finance-manage'
// eslint-disable-next-line no-unused-vars
import config from '@/config'
export default {
  name: 'AccountProductManage',
  components: { LxzTable, TipsDialog },
  mixins: [listMixin],
  data() {
    return {
      tHeader: ['订单编号', '结算核对', '订单来源', '商家', '用户', '打手', '订单金额', '代练佣金', '备注', '生成时间', '结算时间'],
      tValue: ['orderId', 'id', 'source', 'saller', 'buyer', 'beaterNickName', 'price', 'powerLevelingReward', 'remark', 'downOrderTime', 'checkTime'],
      ids: [],
      multipleSelection: [],
      isDialogShow: false,
      title: '',
      creatTime: '',
      message: '',
      params: {
        maxResultCount: 10,
        skipCount: 0
      },
      downOrderTime: '',
      checkTime: '',
      isExportAll: false
    }
  },
  computed: {
  },
  watch: {
    downOrderTime(val) {
      if (val) {
        this.params.orderStartTime = moment(val[0]).format('YYYY-MM-DD')
        this.params.orderEndTime = moment(val[1]).add(1, 'days').format('YYYY-MM-DD')
      } else {
        this.params.orderStartTime = ''
        this.params.orderEndTime = ''
      }
    },
    checkTime(val) {
      if (val) {
        this.params.startTime = moment(val[0]).format('YYYY-MM-DD')
        this.params.endTime = moment(val[1]).add(1, 'days').format('YYYY-MM-DD')
      } else {
        this.params.startTime = ''
        this.params.endTime = ''
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {
  },
  methods: {
    // 搜索
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      this.getList()
    },
    submit() {
      this.lowerShelfCommodity(this.id)
    },
    // 重置
    reset() {
      for (const key in this.params) {
        this.params[key] = null
      }
      this.params.maxResultCount = 10
    },
    getList() {
      financeManageApi.GetPagedSettlementsAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
        this.dataList.some(item => {
          this.$set(item, 'price', item.orderAmount.toFixed(2))
          this.$set(item, 'powerLevelingReward', item.powerLevelingReward.toFixed(2))
          this.$set(item, 'beaterNickName', item.beater.nickName)
        })
      })
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查看商品
    goDetail(row) {
      this.$router.push({
        name: 'specialOrderList'
      })
    },
    // 单个结算核对按钮
    CheckSettlement(item) {
      this.ids = []
      this.ids.push(item.id)
      this.SettlementCheck()
    },
    // 批量结算核对按钮
    batchCheckSettlement() {
      this.ids = []
      if (!this.multipleSelection.length) {
        this.$message({
          message: '请勾选操作项',
          type: 'error'
        })
        return
      }
      this.multipleSelection.some(item => {
        this.ids.push(item.id)
      })
      this.SettlementCheck()
    },
    // 结算核对
    SettlementCheck() {
      financeManageApi.CheckSettlementAsync({ ids: this.ids }).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.search()
        }
      })
    },
    // 导出勾选项
    exportChoice() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: '请勾选操作项',
          type: 'error'
        })
        return
      }
      this.list = this.multipleSelection
      this.handleDownload()
    },
    // 导出搜索结果
    exportAll() {
      this.params.maxResultCount = this.pageObj.totalCount
      this.params.skipCount = 0
      financeManageApi.GetPagedSettlementsAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
        this.dataList.some(item => {
          this.$set(item, 'price', item.orderAmount.toFixed(2))
          this.$set(item, 'powerLevelingReward', item.powerLevelingReward.toFixed(2))
          this.$set(item, 'beaterNickName', item.beater.nickName)
        })
        this.list = this.dataList
        this.handleDownload()
      })
    },
    handleDownload() {
      import('@/api/Export2Excel').then(excel => {
        const data = this.formatJson(this.tValue, this.list)
        // console.log(data)
        excel.export_json_to_excel({
          header: this.tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.isExportAll = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'checkTime') {
          return v[j] ? moment(v[j]).format('YYYY-MM-DD HH:mm') : ''
        }
        if (j === 'downOrderTime') {
          return v[j] ? moment(v[j]).format('YYYY-MM-DD HH:mm') : ''
        }
        return v[j]
      }))
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
