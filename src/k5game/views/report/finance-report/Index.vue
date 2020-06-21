<template>
  <div class="container">
    <div class="filter-div">
      <div class="input-group">
        <label>订单号</label>
        <el-input
          v-model="params.orderId"
          placeholder="请输入订单号"
        />
      </div>
      <div class="input-group">
        <label>是否结算</label>
        <el-switch
          v-model="params.isAchievePowerLeveling"
          type="switch"
        />
      </div>
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
        <el-button type="primary" @click="searchClick">搜索</el-button>
      </div>
    </div>
    <div style="margin-top: 20px">
      <el-table
        :data="list"
        border
        style="width: 100%"
        :expand-row-keys="expands"
        :row-key="getRowKeys"
      >
        <el-table-column
          prop="orderId"
          label="订单编号"
        />
        <el-table-column
          prop="powerLevelingNickName"
          label="接单人"
        />
        <el-table-column
          prop="putawayUserNickName"
          label="上架人"
        />
        <el-table-column
          prop="taoBao"
          label="淘宝店铺"
          width="100"
        />
        <el-table-column
          prop="payAmount"
          label="付款金额"
        />
        <el-table-column
          prop="fundflow"
          label="资金流向"
        />
        <el-table-column
          prop="gameName"
          label="游戏"
        />
        <!-- <el-table-column
          prop="powerLevelingReward"
          label="powerLevelingReward"
        /> -->
        <el-table-column
          label="代练开始时间"
        >
          <template v-slot="scope">
            {{ scope.row.powerLevelingStartTime | timeFormat }}
          </template>
        </el-table-column>
        <el-table-column
          label="代练结束时间"
        >
          <template v-slot="scope">
            {{ scope.row.powerLevelingStopTime | timeFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="isAchievePowerLeveling"
          label="是否结算"
        >
          <template v-slot="scope">
            <el-switch
              v-model="isAchievePowerLeveling"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="userPhoneNum"
          label="手机号码"
        />
        <!-- <el-table-column
          prop="powerLevelingAntecedentMoney"
          label="powerLevelingAntecedentMoney"
        />
        <el-table-column
          prop="powerLevelingStatus"
          label="powerLevelingStatus"
        />
        <el-table-column
          prop="lastReward"
          label="lastReward"
        /> -->
        <!-- <el-table-column
          label="profitDistributionTime"
        >
          <template v-slot="scope">
            {{ scope.row.profitDistributionTime | timeFormat }}
          </template>
        </el-table-column> -->
      </el-table>
      <el-pagination
        background
        layout="sizes, prev, pager, next, jumper"
        :total="totalCount"
        :current-page="currentPage"
        :page-size="params.maxResultCount"
        @size-change="handleSizeChange"
        @current-change="pageChange"
      />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import * as financeApi from '@/api/finance'
export default {
  name: 'Index',
  data() {
    return {
      list: [],
      gameTypeCountList: [],
      currentPage: 1,
      totalCount: 0,
      expands: [],
      getRowKeys(row) {
        return row.id
      },
      params: {
        startTime: moment().subtract(6, 'days').toDate(),
        endTime: moment().toDate(),
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    searchClick() {
      this.currentPage = 1
      this.params.skipCount = 0
      this.getList()
    },
    getList() {
      financeApi.getFinance(this.params).then(res => {
        this.list = res.data.result.items
        this.totalCount = res.data.result.totalCount
      })
    },
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.searchClick()
    },
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    }
  }
}
</script>

<style scoped>
.container{
  padding: 20px;
}
</style>
