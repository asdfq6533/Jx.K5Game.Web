<template>
  <div class="page-content">
    <el-card>
      <el-form :inline="true" :model="params">
        <el-form-item label="用户名">
          <el-input v-model="params.userName" placeholder="按用户名搜索" @keyup.enter.native="searchClick" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="searchClick">筛选</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="list"
        :expand-row-keys="expands"
        :row-key="getRowKeys"
        border
        class="power-level-table"
        @expand-change="expandChange"
      >
        <el-table-column type="expand">
          <template v-slot="props">
            <el-table
              :key="props.row.id"
              :data="children"
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
                  {{ !scope.row.isInternalGold ? '打手代练': '内部代打' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="powerLevelingStatusName"
                label="代练状态"
              />
              <el-table-column
                prop="gameName"
                label="游戏"
              />
              <el-table-column
                prop="powerLevelingStartTime"
                label="上架时间"
              >
                <template v-slot="scope">
                  {{ scope.row.powerLevelingStartTime|dateFormat }}
                </template>
              </el-table-column>
              <el-table-column
                prop="lastAntecedentMoney"
                label="押金"
              >
                <template v-slot="scope">
                  {{ scope.row.powerLevelingAntecedentMoney }} - {{ scope.row.lastAntecedentMoney }}
                </template>
              </el-table-column>
              <el-table-column
                prop="userName"
                label="佣金"
              >
                <template v-slot="scope">
                  {{ scope.row.powerLevelingReward }} - {{ scope.row.lastReward }}
                </template>
              </el-table-column>
              <el-table-column
                prop="powerLevelingRequirement"
                label="代练要求"
              />
              <el-table-column
                prop="powerLevelerRemark"
                label="代练人备注"
              />
            </el-table>
            <el-pagination
              background
              layout="sizes, prev, pager, next, jumper"
              :total="childTotalCount"
              :page-size="childParams.maxResultCount"
              @size-change="handleSizeChange2"
              @current-change="pageChange2"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
        />
        <el-table-column
          prop="nickName"
          label="昵称"
        />
        <el-table-column
          prop="creationTime"
          label="注册时间"
        >
          <template v-slot="scope">
            {{ scope.row.creationTime | timeFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="availableCoins"
          label="可用虚拟币"
        />
        <el-table-column
          prop="frozenCoins"
          label="冻结虚拟币"
        />
        <el-table-column
          prop="powerLevelingCnt"
          label="代练次数"
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
      expands: [],
      getRowKeys(row) {
        return row.id
      },
      params: {
        userName: '',
        maxResultCount: 10,
        skipCount: 0
      },
      childParams: {
        userId: '',
        maxResultCount: 10,
        skipCount: 0
      },
      childTotalCount: 0,
      list: [],
      children: [],
      currentPage: 1,
      totalCount: 0
    }
  },
  async mounted() {
    // 默认加载所有游戏
    await this.searchClick()
  },
  methods: {
    expandChange(data, expandedRows) {
      const that = this
      if (expandedRows.length) {
        that.expands = []
        if (data) {
          that.expands.push(data.id)// 每次push进去的是每行的ID
          this.childParams.userId = data.id
          this.childParams.skipCount = 0
          this.getChildList()
        }
      } else {
        that.expands = []// 默认不展开
      }
    },
    getChildList() {
      powerLevelingApi.GetPowerLevelingList(this.childParams).then(res => {
        this.children = res.data.result.items
        this.childTotalCount = res.data.result.totalCount
      })
    },
    // 搜索筛选
    async searchClick() {
      this.$route.query.params = JSON.stringify(this.params)
      const res = await powerLevelingApi.GetPowerLeverList(this.params)
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
    // 分页每页长度修改回调
    handleSizeChange2(val) {
      this.childParams.maxResultCount = val
      this.getChildList()
    },
    // 翻页动作回调
    pageChange2(val) {
      this.childParams.skipCount = this.params.maxResultCount * (val - 1)
      this.getChildList()
    }
  }
}
</script>
<style scoped>

</style>
