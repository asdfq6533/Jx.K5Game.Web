<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="售后单号">
            <el-input v-model="params.id" placeholder="请输入订单编号" clearable />
          </el-form-item>
          <el-form-item label="订单编号">
            <el-input v-model="params.orderId" placeholder="请输入订单编号" clearable />
          </el-form-item>
          <el-form-item label="卖家">
            <el-input v-model="params.salerUserName" placeholder="输入卖家用户名" clearable />
          </el-form-item>
          <el-form-item label="买家">
            <el-input v-model="params.buyerName" placeholder="输入买家用户名" clearable />
          </el-form-item>
          <el-form-item label="售后状态">
            <el-select v-model="status" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="销售模式">
            <el-select v-model="params.salesMode" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="寄售交易"
                value="寄售交易"
              />
              <el-option
                label="自主经营"
                value="自主经营"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="info" icon="el-icon-search" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <ul class="operate">
      <!-- <li>
        <el-button type="primary" class="my-btn-icon">
          导出搜索结果
        </el-button>
      </li> -->
    </ul>
    <lxz-table
      ref="multipleTable"
      :table-data="dataList"
      :columns="[
        { slot: 'selection' },
        { label: '售后单号', prop: 'id' },
        { label: '订单编号', prop: 'orderId' },
        { slot:'status' },
        { slot: 'saleMode' },
        { slot: 'sellerName' },
        { slot: 'userName' },
        { slot: 'creatTime' },
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
        slot="saleMode"
        label="销售模式"
      >
        <template v-slot="scope">
          {{ scope.row.commodityOrderTable.commodityTable.saleMode }}
        </template>
      </el-table-column>
      <el-table-column
        slot="status"
        label="售后状态"
      >
        <template v-slot="scope">
          {{ getStatus(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        slot="userName"
        label="买家"
      >
        <template v-slot="scope">
          {{ scope.row.user.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        slot="sellerName"
        label="卖家"
      >
        <template v-slot="scope">
          {{ scope.row.saller.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        slot="creatTime"
        label="申请时间"
      >
        <template v-slot="scope">
          {{ scope.row.creationTime | timeFormatNotUtc }}
        </template>
      </el-table-column>
      <el-table-column
        slot="operate"
        label="操作"
        fixed="right"
      >
        <template v-slot="scope">
          <div class="icons-operate">
            <a href="javascript:void(0)">
              <p @click="goDtailProduct(scope.row)">查看</p>
            </a>
          </div>
        </template>
      </el-table-column>
    </lxz-table>
  </div>
</template>
<script>
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'Index',
  components: { LxzTable },
  mixins: [listMixin],
  data() {
    return {
      dataList: [],
      pageObj: {},
      multipleSelection: [],
      isDialogShow: false,
      params: {
        id: '',
        orderId: '',
        buyerName: '',
        saleMode: '',
        sorting: 'CreationTime desc',
        maxResultCount: 10,
        skipCount: 0
      },
      creatTime: '',
      form: {},
      rules: {
        result: [
          { required: true, message: '处理说明不能为空', trigger: 'blur' }
        ]
      },
      status: '',
      statusList: [
        {
          id: 0,
          name: '待处理',
          number: 0
        },
        {
          id: 1,
          name: '已处理',
          number: 0
        },
        {
          id: 4,
          name: '已完成',
          number: 0
        },
        {
          id: 3,
          name: '客服介入',
          number: 0
        },
        {
          id: -1,
          name: '已取消',
          number: 0
        },
        {
          id: 2,
          name: '已拒绝',
          number: 0
        },
        {
          id: '',
          name: '全部',
          number: 0
        }
      ]
    }
  },
  computed: {
  },
  watch: {
    status(val) {
      if (val) {
        this.statusList.some(item => {
          if (item.name === val) {
            this.params.status = item.id
          }
        })
      } else {
        this.params.status = ''
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {

  },
  methods: {
    getStatus(item) {
      let status = ''
      this.statusList.some(element => {
        if (item.status === element.id) {
          status = element.name
        }
      })
      return status
    },
    // 搜索
    search() {
      if (this.params.startTime > this.params.endTime) {
        this.$message({
          message: '结束时间不能小于开始时间',
          type: 'error'
        })
      } else {
        this.params.skipCount = 0
        this.pageObj.currentPage = 1
        this.getList()
      }
    },
    // 重置
    reset() {
      this.status = ''
      for (const key in this.params) {
        this.params[key] = null
      }
      this.params.maxResultCount = 10
      this.params.sorting = 'CreationTime desc'
    },
    getList() {
      accountTransactionApi.GetCustomerServiceOrderAysnc(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
      })
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查看商品
    goDtailProduct(row) {
      this.$router.push({
        name: 'AfterSalesDetail',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
