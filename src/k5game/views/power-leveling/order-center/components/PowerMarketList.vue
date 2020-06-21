<template>
  <div>
    <el-form :inline="true" :model="params">
      <el-form-item label="所属游戏">
        <el-select v-model="params.GameName" filterable clearable placeholder="全部">
          <el-option
            v-for="item in allGames"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作">
        <el-select v-model="params.IsInternalGold" clearable placeholder="按操作筛选">
          <el-option
            v-for="item in internals"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="订单号">
        <el-input v-model="params.OrderId" placeholder="按订单号搜索" @keyup.enter.native="searchClick" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">筛选</el-button>
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
          {{ scope.row.creationTime | timeFormatNotUtc }}
        </template>
      </el-table-column>
      <el-table-column
        prop="powerLevelingAntecedentMoney"
        label="代练押金(K币)"
      />
      <el-table-column
        prop="powerLevelingReward"
        label="代练佣金(K币)"
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
import * as gameInfoApi from '@/api/gameInfo'
export default {
  name: 'PowerMarketList',
  data() {
    return {
      params: {
        GameName: '', // 游戏名称
        IsInternalGold: '', // 是否内部
        maxResultCount: 10,
        OrderId: '',
        skipCount: 0,
        sorting: 'creationTime desc'
      },
      allGames: [],
      internals: [{
        label: '内部代练',
        value: true
      }, {
        label: '打手代练',
        value: false
      }],
      list: [],
      currentPage: 1,
      totalCount: 0
    }
  },
  async mounted() {
    // 默认加载所有游戏
    await this.getAllGames()
    await this.searchClick()
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
    // 搜索筛选
    async searchClick() {
      const res = await powerLevelingApi.GetInSelfPowerLevelingList(this.params)
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
    },
    // 获取所有游戏
    async getAllGames() {
      const res = await gameInfoApi.GetAllGames({ gamePlatform: '' })
      this.allGames = res.data.result.items
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables.scss';
.my-icon{
  color: $light-blue;
}
</style>
