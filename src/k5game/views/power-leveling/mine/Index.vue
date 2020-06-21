<template>
  <div class="page-content">
    <el-card>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane v-for="(item, index) in tabList" :key="index" :name="item.status + ''" :label="item.title" />
      </el-tabs>
      <!-- <el-alert
        class="account"
        :title="`可用虚拟币：${myAsset.availableCoins}   冻结虚拟币：${myAsset.frozenCoins}   代练完成场次：${myAsset.successCnt}   代练失败场次：${myAsset.failCnt}`"
        type="success"
        :closable="false"
      /> -->
      <el-alert class="account" type="success" :closable="false">
        <template slot="title">
          <span>可用虚拟币：{{ myAsset.availableCoins }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>冻结虚拟币：{{ myAsset.frozenCoins }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>代练完成场次：{{ myAsset.successCnt }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>代练失败场次：{{ myAsset.failCnt }}</span>
        </template>
      </el-alert>
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
          prop="gameName"
          label="代练游戏"
        />
        <el-table-column
          prop="powerLevelingStartTime"
          label="代练开始时间"
        >
          <template v-slot="scope">
            {{ scope.row.powerLevelingStartTime | timeFormatNotUtc }}
          </template>
        </el-table-column>
        <el-table-column
          prop="powerLevelingAntecedentMoney"
          label="押金"
        />
        <el-table-column
          prop="powerLevelingReward"
          label="佣金"
        />
        <el-table-column
          prop="userPhoneNum"
          label="用户联系电话"
        />
        <el-table-column
          prop="powerLevelingRequirement"
          label="代练要求"
        />
        <el-table-column
          v-if="activeName==='1'"
          label="操作"
        >
          <template v-slot="scope">
            <div class="my-icon-group">
              <a
                class="my-icon"
                @click="orderPwdClick(scope.row)"
              >
                <el-tooltip class="item" effect="dark" content="查看当前账号密码" placement="top" :open-delay="1000">
                  <svg-icon icon-class="lock" />
                </el-tooltip>
              </a>
              <a
                class="my-icon"
                @click="finishOrder(scope.row)"
              >
                <el-tooltip class="item" effect="dark" content="完成订单" placement="top" :open-delay="1000">
                  <svg-icon icon-class="skill" />
                </el-tooltip>
              </a>
            </div>
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
    </el-card>
    <order-pwd-dialog
      ref="orderPwdDialog"
      :is-show="isOrderPwdShow"
      @onClose="isOrderPwdShow=false"
      @onRefresh="searchClick"
    />
    <finish-order
      ref="finishOrder"
      :is-show="isFinishOrderShow"
      @onClose="isFinishOrderShow=false"
    />
  </div>
</template>
<script>
import * as powerLevelingApi from '@/api/powerLeveling'
import OrderPwdDialog from '../components/OrderPwdDialog'
import FinishOrder from './FinishOrder'
export default {
  components: { FinishOrder, OrderPwdDialog },
  data() {
    return {
      isFinishOrderShow: false,
      isOrderPwdShow: false,
      params: {
        PowerLevleingStatus: 1,
        maxResultCount: 10,
        skipCount: 0
      },
      tabList: [{
        title: '代练中订单',
        status: 1,
        count: 0
      }, {
        title: '待审核订单',
        status: 2,
        count: 0
      }, {
        title: '审核通过订单',
        status: 3,
        count: 0
      }, {
        title: '审核失败订单',
        status: 4,
        count: 0
      }, {
        title: '未结算订单',
        status: 5,
        count: 0
      }, {
        title: '已完成订单',
        status: 6,
        count: 0
      }],
      activeName: '1', // 默认当前的tab的名称，即
      list: [],
      myAsset: {
        availableCoins: '',
        frozenCoins: '',
        successCnt: '',
        failCnt: ''
      }, // 用户账户信息
      currentPage: 1,
      totalCount: 0
    }
  },
  mounted() {
    // 默认加载所有游戏
    this.searchClick()
    // 获取用户账户信息
    this.getMyAssetInfo()
  },
  methods: {
    finishOrder(row) {
      this.isFinishOrderShow = true
      this.$refs.finishOrder.setValues(row)
    },
    orderPwdClick(row) {
      this.isOrderPwdShow = true
      this.$refs.orderPwdDialog.setValues(row.orderId)
    },
    // 搜索筛选
    async searchClick() {
      const res = await powerLevelingApi.GetMyPowerLevelingList(this.params)
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
    // 切换订单状态
    handleClick(tab, event) {
      this.params.PowerLevleingStatus = tab.name
      this.searchClick()
    },
    // 获取用户账户信息
    getMyAssetInfo() {
      powerLevelingApi.GetMyAssetInfo().then(res => {
        this.myAsset = res.data.result
      })
    }
  }
}
</script>
<style scoped>

</style>
