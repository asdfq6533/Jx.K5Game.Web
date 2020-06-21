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
          @expand-change="expandChange"
        >
          <el-table-column type="expand">
            <template v-slot="props">
              <div :key="props.row.id">
                <el-table
                  :data="gameTypeCountList"
                  border
                  style="max-width: 600px"
                >
                  <el-table-column
                    prop="labelName"
                    label="名称"
                    width="300"
                  />
                  <el-table-column
                    prop="count"
                    label="个数"
                  />
                </el-table>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="订单号"
            width="180"
          />
          <el-table-column
            prop="accountName"
            label="账号名"
            width="180"
          />
          <el-table-column
            prop="purchasePrice"
            label="购买价格"
            width="100"
          />
          <el-table-column
            prop="userId"
            label="买方编号"
            width="180"
          />
          <el-table-column
            prop="nickName"
            label="买方昵称"
            width="180"
          />
          <el-table-column
            prop="buyUserInfo.phoneNumber"
            label="买方手机号"
            width="180"
          />
          <el-table-column
            prop="saleUserInfo.id"
            label="卖方编号"
            width="180"
          />
          <el-table-column
            prop="saleUserInfo.nickName"
            label="卖方昵称"
            width="180"
          />
          <el-table-column
            prop="saleUserInfo.phoneNumber"
            label="卖方手机号"
            width="180"
          />
          <el-table-column
            prop="statusName"
            label="订单状态"
          >
            <template v-slot="scope">
              <el-tag :type="getColorType(scope.row.statusName)">{{ scope.row.statusName }}</el-tag>
            </template>
          </el-table-column>
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
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import * as accountTransactionApi from '@/api/account-transaction'
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
    expandChange(data, expandedRows) {
      if (expandedRows.length) {
        this.expands = []
        if (data) {
          this.expands.push(data.id)// 每次push进去的是每行的ID
          // this.getList()
          this.getGametypeCount(data.userId, data.gameId)
        }
      } else {
        this.expands = []// 默认不展开
      }
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
    searchClick() {
      this.currentPage = 1
      this.params.skipCount = 0
      this.getList()
    },
    getList() {
      accountTransactionApi.GetSaleAccountDetailsInfo(this.params).then(res => {
        this.list = res.data.result.items
        this.totalCount = res.data.result.totalCount
      })
    },
    getGametypeCount(userId, gameId) {
      const params = {
        id: userId,
        gameId: gameId
      }
      accountTransactionApi.GetGametypeCount(params).then(res => {
        this.gameTypeCountList = res.data.result
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
