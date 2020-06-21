<template>
  <div>
    <el-form :inline="true" :model="params">
      <el-form-item label="操作">
        <el-select v-model="params.Operation" clearable placeholder="按操作筛选" @change="filterOperation">
          <el-option
            v-for="item in operations"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      class="power-level-table"
    >
      <el-table-column
        prop="operation"
        label="操作"
      />
      <el-table-column
        prop="creationTime"
        label="操作时间"
      >
        <template v-slot="scope">
          {{ scope.row.creationTime | timeFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="creatorUserName"
        label="操作人"
      />
      <el-table-column
        prop="table"
        label="操作表"
      />
      <el-table-column
        prop="name"
        label="套餐/产品名称"
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
  </div>
</template>
<script>
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  data() {
    return {
      params: {
        Operation: '',
        PackageName: '',
        maxResultCount: 10,
        skipCount: 0
      },
      operations: [
        '编辑套餐',
        '删除套餐',
        '编辑产品',
        '删除产品'
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
    // 下拉筛选
    filterOperation(val) {
      this.params.Operation = val
      this.searchClick()
    },
    // 搜索筛选
    async searchClick() {
      const res = await powerLevelingApi.GetLogList(this.params)
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
