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
          <label>是否采购人</label>
          <el-select v-model="params.hasCreatorUser" placeholder="请选择">
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
          <label>采购人</label>
          <el-input v-model="params.nickName" placeholder="请输入采购人" />
        </div>
        <div class="input-group">
          <label>标签</label>
          <el-input v-model="params.packageName" placeholder="请输入标签" />
        </div>
        <div class="input-group">
          <el-button type="primary" @click="searchClick">搜索</el-button>
        </div>
        <div class="input-group">
          <el-button type="primary" @click="handleExportExcel">导出Excel</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <el-table
          :data="list"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="packageName"
            label="标签"
            width="300"
          />
          <el-table-column label="购入">
            <el-table-column
              prop="sourceChannel"
              label="来源渠道"
            />
            <el-table-column
              v-if="params.hasCreatorUser"
              prop="crateName"
              label="采购人"
            />
            <el-table-column
              prop="allSaleCount"
              label="采购数量"
            />
            <el-table-column
              prop="inventoryPrice"
              label="成本价"
            />
            <el-table-column
              prop="inventoryCount"
              label="库存"
            />
          </el-table-column>
          <el-table-column label="出售">
            <el-table-column
              prop="salePrice"
              label="出售价格"
            />
            <el-table-column
              prop="count"
              label="出售数量"
            />
          </el-table-column>
          <el-table-column
            prop="profit"
            label="利润"
          />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as financeApi from '@/api/finance'
import moment from 'moment'
import excelMixin from '@/k5game/mixins/excel-mixin'
export default {
  name: 'Index',
  mixins: [excelMixin],
  data() {
    return {
      params: {
        startTime: moment().subtract(6, 'days').toDate(),
        endTime: moment().toDate(),
        hasCostPrice: true,
        nickName: '',
        hasCreatorUser: true,
        packageName: ''
      },
      list: []
    }
  },
  created() {
    this.getPurchaseAccountFinance()
  },
  methods: {
    handleExportExcel() {
      const tHeader = [
        '标签',
        '来源聚道',
        '采购人',
        '采购数量',
        '成本价',
        '库存',
        '出售价格',
        '出售数量',
        '利润'
      ]
      const filterVal = [
        'packageName',
        'sourceChannel',
        'crateName',
        'allSaleCount',
        'inventoryPrice',
        'inventoryCount',
        'salePrice',
        'count',
        'profit'
      ]
      const formatVal = [
        // { field: 'creationTime', format: 'Date' },
        // { field: 'isEmailConfirmed', format: 'Boolean' },
        // { field: 'isActive', format: 'Boolean' }
      ]
      const list = JSON.parse(JSON.stringify(this.list))
      this.excelDownLoadHandle(list, tHeader, filterVal, formatVal, '账号交易财务明细表')
    },
    searchClick() {
      this.getPurchaseAccountFinance()
    },
    getPurchaseAccountFinance() {
      financeApi.getPurchaseAccountFinance(this.params).then(res => {
        this.list = res.data.result.items
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
