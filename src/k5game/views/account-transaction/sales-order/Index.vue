<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="订单编号">
            <el-input v-model="params.id" placeholder="请输入订单编号" clearable />
          </el-form-item>
          <el-form-item label="卖家">
            <el-input v-model="params.sallerUserName" placeholder="输入卖家用户名" clearable />
          </el-form-item>
          <el-form-item label="买家">
            <el-input v-model="params.buyerUserName" placeholder="输入买家用户名" clearable />
          </el-form-item>
          <el-form-item label="销售模式">
            <el-select v-model="params.saleMode" placeholder="全部" filterable clearable style="maxWidth:185px">
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
          <el-form-item label="订单状态">
            <el-select v-model="status" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                v-for="item in statusList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select v-model="payWay" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                v-for="item in payWays"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              v-model="creatTime"
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
        { label: '订单编号', prop: 'id', width: '200px' },
        { slot: 'status'},
        { label: '商品名称', prop: 'commodityTitle', width: '240px' },
        { label: '销售模式', prop: 'saleMode', width: '100px' },
        { slot: 'sallerUser'},
        { slot: 'buyerUser'},
        { slot: 'orderAmount'},
        { slot: 'payAmount'},
        { slot: 'payWay'},
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
        slot="orderAmount"
        label="订单金额"
        width="100"
      >
        <template v-slot="scope">
          {{ '¥' + scope.row.orderAmount }}
        </template>
      </el-table-column>
      <el-table-column
        slot="payAmount"
        label="实付金额"
        width="100"
      >
        <template v-slot="scope">
          {{ '¥' + scope.row.payAmount }}
        </template>
      </el-table-column>
      <el-table-column
        slot="status"
        label="订单状态"
        width="120"
      >
        <template v-slot="scope">
          {{ getStatus(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        slot="payWay"
        label="支付方式"
        width="120"
      >
        <template v-slot="scope">
          {{ getPayWay(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        slot="sallerUser"
        label="卖家"
        width="120"
      >
        <template v-slot="scope">
          {{ scope.row.sallerUser.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        slot="buyerUser"
        label="买家"
        width="120"
      >
        <template v-slot="scope">
          {{ scope.row.buyerUser.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        slot="label"
        label="标签"
      >
        <template v-slot="scope">
          <div class="label-div">
            <p v-for="(item, key) in scope.row.commodityLabelStr" :key="key">
              {{ item }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        slot="creatTime"
        label="下单时间"
        width="160"
      >
        <template v-slot="scope">
          {{ scope.row.creationTime | timeFormatNotUtc }}
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
import moment from 'moment'
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'AccountProductManage',
  components: { LxzTable },
  mixins: [listMixin],
  data() {
    return {
      multipleSelection: [],
      params: {
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      },
      creatTime: '',
      statusList: [
        {
          id: 0,
          name: '待付款'
        },
        {
          id: 1,
          name: '待发货'
        },
        {
          id: 2,
          name: '待收货'
        },
        {
          id: 3,
          name: '已完成'
        },
        {
          id: -1,
          name: '交易关闭'
        },
        {
          id: '',
          name: '全部'
        }
      ],
      payWays: [
        {
          id: 0,
          name: 'K币支付'
        },
        {
          id: 1,
          name: '支付宝支付'
        },
        {
          id: 2,
          name: '微信支付'
        }
      ],
      payWay: '',
      status: ''
    }
  },
  computed: {
  },
  watch: {
    creatTime(val) {
      if (val) {
        this.params.startTime = moment(val[0]).format('YYYY-MM-DD')
        this.params.endTime = moment(val[1]).add(1, 'days').format('YYYY-MM-DD')
      } else {
        this.params.startTime = ''
        this.params.endTime = ''
      }
    },
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
    },
    payWay(val) {
      if (val) {
        this.payWays.some(item => {
          if (item.name === val) {
            this.params.payWay = item.id
          }
        })
      } else {
        this.params.payWay = ''
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {

  },
  methods: {
    getPayWay(item) {
      let payWay = ''
      this.payWays.some(element => {
        if (item.payWay !== '') {
          if (item.payWay === element.id) {
            payWay = element.name
          }
        }
      })
      return payWay
    },
    getStatus(item) {
      let status = ''
      this.statusList.some(element => {
        if (item.status === element.id) {
          status = element.name
        } else if (item.status === 4) {
          status = '待收货'
        }
      })
      return status
    },
    // 搜索
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      this.getList()
    },
    // 重置
    reset() {
      this.creatTime = ''
      this.status = ''
      this.payWay = ''
      for (const key in this.params) {
        this.params[key] = null
      }
      this.params.maxResultCount = 10
    },
    getList() {
      accountTransactionApi.GetPagedOrdersAsync(this.params).then(res => {
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
        name: 'SalesOrderDetail',
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
