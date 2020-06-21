<template>
  <div class="page-content">
    <el-card>
      <div>
        <el-form id="search-form" ref="form" :model="params" label-width="80px">
          <div class="group">
            <el-form-item label="会员名称">
              <el-input v-model="params.userName" />
            </el-form-item>
            <el-form-item label="会员手机">
              <el-input v-model="params.phoneNum" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="params.status" clearable placeholder="请选择">
                <el-option
                  v-for="(prop,key) in taskDrawObj"
                  :key="key"
                  :label="prop"
                  :value="key"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="seasrch-item">
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <lxy-table
        :table-data="dataList"
        :columns="[
          { label: 'ID', prop: 'id', width: '290' },
          { label: '会员名称', prop: 'userName', width: '100' },
          { label: '会员手机', prop: 'phoneNumber', width: '110' },
          { label: '刷单金额', prop: 'amount' },
          { slot: 'withdrawStatus' },
          { slot: 'operation' },
          { slot: 'detail' }
        ]"
        :page-obj="pageObj"
      >
        <el-table-column
          slot="withdrawStatus"
          label="审核状态"
          width="200"
        >
          <template v-slot="scope">
            {{ withdrawStatusStr(scope.row.withdrawStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          slot="operation"
          fixed="right"
          label="操作"
          width="80"
        >
          <template v-slot="scope">
            <el-button
              type="primary"
              size="mini"
              :disabled="scope.row.withdrawStatus === 1 || scope.row.withdrawStatus === -1"
              @click="withdraw(scope.row)"
            >审核</el-button>
          </template>
        </el-table-column>
        <el-table-column
          slot="detail"
          label="提现记录"
          width="105"
          fixed="right"
        >
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="record(scope.row)">查看记录</el-button>
          </template>
        </el-table-column>
      </lxy-table>
    </el-card>
  </div>
</template>
<script>
import LxyTable from '@/k5game/components/LxyTable'
import * as taskServiceApi from '@/api/task-service'
import taskDraw from '@/k5game/views/task-service/data/taskDraw'
export default {
  name: 'TaskWithdraw',
  components: { LxyTable },
  data() {
    return {
      taskDrawObj: taskDraw,
      params: {
        status: '0',
        skipCount: 0,
        maxResultCount: 10
      },
      dataList: [],
      pageObj: {
        phoneNum: null,
        sorting: null,
        maxResultCount: 10,
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
  created() {
    this.search()
  },
  methods: {
    withdrawStatusStr(str) {
      return this.taskDrawObj[str]
    },
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      this.getList()
    },
    handleSizeChange(page) {
      this.params.maxResultCount = page
      this.getList()
    },
    // 页码变化
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    },
    getList() {
      taskServiceApi.GetDrawAssetsAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = res.data.result.totalCount
        const items = JSON.parse(JSON.stringify(result.items))
        this.$store.commit('task/SET_TASK_DRAW_LIST', items)
        this.$store.commit('task/SET_TASK_DRAW_PARAMS', JSON.parse(JSON.stringify(this.params)))
        this.dataList = items
      })
    },
    // 提现
    withdraw(row) {
      this.$store.commit('task/SET_WITH_DRAW_DATA', row)
      this.$router.push({
        name: 'TaskWithdrawAudit'
      })
    },
    // 查看
    record(row) {
      this.$store.commit('task/SET_WITH_DRAW_DATA', row)
      this.$router.push({
        name: 'TaskWithdrawAudit'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 20px;
}
</style>
