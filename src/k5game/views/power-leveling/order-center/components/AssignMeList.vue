<template>
  <div>
    <el-form :inline="true" :model="params">
      <el-form-item label="所属游戏">
        <el-select v-model="params.gameName" filterable clearable placeholder="全部">
          <el-option
            v-for="item in allGames"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="代练状态">
        <el-select v-model="params.status" placeholder="按操作筛选">
          <el-option
            v-for="item in statusData"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="list"
      border
      class="power-level-table"
    >
      <el-table-column
        prop="orderId"
        label="订单号"
      />
      <el-table-column
        prop="isInternalGold"
        label="代练方"
      >
        <template v-slot="scope">
          {{ scope.row.isInternalGold === true ? '内部代练' : '打手代练' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="gameName"
        label="游戏名称"
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
        prop="powerLevelingAntecedentMoney"
        label="代练押金(K币)"
      />
      <el-table-column
        prop="powerLevelingReward"
        label="代练押金(K币)"
      />
      <el-table-column
        prop="powerLevelingRequirement"
        label="代练要求"
      />
      <el-table-column
        label="操作"
      >
        <template v-slot="scope">
          <a
            class="my-icon"
            @click="acceptOrder(scope.row)"
          >
            <el-tooltip class="item" effect="dark" content="接单" placement="top" :open-delay="1000">
              <svg-icon icon-class="accept-order" style="font-size: 25px" />
            </el-tooltip>
          </a>
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
</template>

<script>
import * as powerLevelingApi from '@/api/powerLeveling'
import accountMixins from '@/k5game/mixins/account-mixin'
export default {
  name: 'AssignMeList',
  mixins: [accountMixins],
  data() {
    return {
      statusData: [
        { label: '已下架', value: '已下架' },
        { label: '上架中', value: '上架中' },
        { label: '代练中', value: '代练中' },
        { label: '尚未审核', value: '尚未审核' },
        { label: '审核通过', value: '审核通过' },
        { label: '审核失败', value: '审核失败' },
        { label: '已发货未结算', value: '已发货未结算' },
        { label: '订单完成', value: '订单完成' }
      ],
      params: {
        status: '上架中',
        gameName: '',
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      },
      list: [],
      currentPage: 1,
      totalCount: 0
    }
  },
  created() {
    this.searchClick()
    this.getAllGames()
  },
  methods: {
    acceptOrder(row) {
      this.$confirm('你确定要接单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.StartPowerLeveling({ id: row.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.searchClick()
          }
        })
      })
    },
    searchClick() {
      this.currentPage = 1
      this.params.skipCount = 0
      this.getList()
    },
    getList() {
      powerLevelingApi.GetAssignOrders(this.params).then(res => {
        this.list = res.data.result.items
        this.totalCount = res.data.result.totalCount
      })
    },
    // 分页每页长度修改回调
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.getList()
    },
    // 翻页动作回调
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    }
  }
}
</script>

<style scoped>

</style>
