<template>
  <div class="page-content">
    <el-card>
      <el-form :inline="true" :model="params">
        <el-form-item label="操作">
          <el-select v-model="params.Operation" clearable placeholder="按操作筛选">
            <el-option
              v-for="item in operations"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号">
          <el-input v-model="params.DownOrderId" placeholder="按订单号搜索" @keyup.enter.native="searchClick" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="params.OperaterUserName" placeholder="按操作人搜索" @keyup.enter.native="searchClick" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchClick">按条件搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        border
        class="power-level-table"
      >
        <el-table-column
          prop="operationName"
          label="操作"
        />
        <el-table-column
          prop="creationTime"
          label="操作时间"
        >
          <template v-slot="scope">
            {{ scope.row.creationTime | timeFormatNotUtc }}
          </template>
        </el-table-column>
        <el-table-column
          prop="creatorUserName"
          label="操作人"
        />
        <el-table-column
          prop="downOrderId"
          label="订单号"
        />
        <el-table-column
          prop="remark"
          label="备注"
        />
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
    </el-card>
  </div>
</template>
<script>
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  data() {
    return {
      params: {
        Operation: '', // 具体操作
        DownOrderId: '', // 订单号
        OperaterUserName: '', // 创建人
        maxResultCount: 10,
        skipCount: 0
      },
      operations: [
        { label: '添加订单', value: 0 },
        { label: '修改账号', value: 1 },
        { label: '确认改价', value: 2 },
        { label: '确认付款', value: 3 },
        { label: '取消订单', value: 4 },
        { label: '验号通过', value: 5 },
        { label: '验号失败', value: 6 },
        { label: '上架代练', value: 7 },
        { label: '下架代练', value: 8 },
        { label: '开始代练', value: 9 },
        { label: '查看密码', value: 10 },
        { label: '添加备注', value: 11 },
        { label: '结束代练', value: 12 },
        { label: '验单通过', value: 13 },
        { label: '验单失败', value: 14 },
        { label: '订单签收', value: 15 },
        { label: '删除订单', value: 16 },
        { label: '利润分配', value: 17 },
        { label: '强制结束并验单通过', value: 18 },
        { label: '强制结束并验单失败', value: 19 },
        { label: '置为问题单', value: 20 },
        { label: '取消问题单', value: 21 }
      ],
      list: [],
      currentPage: 1,
      totalCount: 0
    }
  },
  async mounted() {
    // 默认加载所有游戏
    await this.searchClick()
  },
  methods: {
    // 搜索筛选
    async searchClick() {
      const res = await powerLevelingApi.GetOrderLogList(this.params)
      this.list = res.data.result.items
      this.totalCount = res.data.result.totalCount
    },
    // 分页每页长度修改回调
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.searchClick()
    },
    // 翻页动作回调
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.searchClick()
    }
  }
}
</script>
<style scoped>

</style>
