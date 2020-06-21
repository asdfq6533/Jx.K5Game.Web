<template>
  <div class="power-level-container">
    <el-page-header content="订单详情" style="margin-bottom: 20px" @back="goBack" />
    <div style="margin-top: 20px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="用户管理" name="1">
          <table class="boss-table" style="max-width: 1100px; width: 100%;margin-top: 20px;">
            <tr>
              <td>订单id</td>
              <td>{{ order.id }}</td>
              <td>游戏名</td>
              <td>{{ order.gameName || '空' }}</td>
            </tr>
            <tr>
              <td>代练账号</td>
              <td>{{ order.accountNum }}</td>
              <td>账号密码</td>
              <td>{{ order.accountPwd || '空' }}</td>
            </tr>
            <tr>
              <td>订单取消原因</td>
              <td>{{ order.cancelOrderReason || '空' }}</td>
              <td>订单取消时间</td>
              <td>{{ order.cancelOrderTime|timeFormatNotUtc }}</td>
            </tr>
            <tr>
              <td>订单取消用户id</td>
              <td>{{ order.cancelOrderUserId || '空' }}</td>
              <td>账号密码</td>
              <td>{{ order.accountPwd || '空' }}</td>
            </tr>
            <tr>
              <td>验号时间</td>
              <td>{{ order.checkAccountTime|timeFormatNotUtc }}</td>
              <td>验号用户id</td>
              <td>{{ order.checkAccountUserId || '空' }}</td>
            </tr>
            <tr>
              <td>下单时间</td>
              <td>{{ order.downOrderTime|timeFormatNotUtc }}</td>
              <td>订单是否异常</td>
              <td>{{ order.isAbnormal ? '是':'否' }}</td>
            </tr>
            <tr>
              <td>是否完成代练</td>
              <td>{{ order.isAchievePowerLeveling ? '是':'否' }}</td>
              <td>是否短信通知</td>
              <td>{{ order.isReceiveSMS ? '是':'否' }}</td>
            </tr>
            <tr>
              <td>是否完成利润分配</td>
              <td>{{ order.isProfitDistribution ? '是':'否' }}</td>
              <td>是否利润分配</td>
              <td>{{ order.isProfit ? '是':'否' }}</td>
            </tr>
            <tr>
              <td>账号信息是否属实</td>
              <td>{{ order.isTrueAccount ? '是':'否' }}</td>
              <td>最终完成代练人</td>
              <td>{{ order.lastAchievePowerLevelingUserId || '空' }}</td>
            </tr>
            <tr>
              <td>订单总金额</td>
              <td>{{ order.orderAmount }}</td>
              <td>订单退款金额</td>
              <td>{{ order.orderRefund }}</td>
            </tr>
            <tr>
              <td> 订单备注数量</td>
              <td>{{ order.orderRemarkCnt }}</td>
              <td>订单状态 </td>
              <td>{{ getStatusName(order.orderStatus) }}</td>
            </tr>
            <tr>
              <td>套餐名称</td>
              <td>{{ order.packageName }}</td>
              <td>付款时间</td>
              <td>{{ order.payTime|timeFormatNotUtc }}</td>
            </tr>
            <tr>
              <td>付款方式</td>
              <td>{{ getPayName }}</td>
              <td>联系电话</td>
              <td>{{ order.phoneNum }}</td>
            </tr>
            <tr>
              <td>代练完成时间</td>
              <td>{{ order.powerLeveledTime|timeFormatNotUtc }}</td>
              <td>订单代练次数</td>
              <td>{{ order.powerLevelingCnt }}</td>
            </tr>
            <tr>
              <td>代练开始时间</td>
              <td>{{ order.PowerLevelingTime|timeFormatNotUtc }}</td>
              <td>产品分组</td>
              <td>{{ order.productGroup }}</td>
            </tr>
            <tr>
              <td>代练产品Id</td>
              <td>{{ order.PowerLevelingTime|timeFormatNotUtc }}</td>
              <td>产品标题</td>
              <td>{{ order.productTitle }}</td>
            </tr>
            <tr>
              <td>备注数量</td>
              <td>{{ order.remarkCnt }}</td>
              <td>来源渠道</td>
              <td>{{ order.sources }}</td>
            </tr>
            <tr>
              <td>淘宝订单Id</td>
              <td>{{ order.taoBaoOrderId }}</td>
              <td>淘宝店铺备注</td>
              <td>{{ order.taoBaoRemark }}</td>
            </tr>
            <tr>
              <td>交易完成时间</td>
              <td>{{ order.tradingOverTime|timeFormatNotUtc }}</td>
              <td>下单人ID</td>
              <td>{{ order.userId }}</td>
            </tr>
            <tr>
              <td>累计完成订单</td>
              <td>{{ order.累计完成订单 }}</td>
              <td>用户备注</td>
              <td>{{ order.userRemark }}</td>
            </tr>
            <tr>
              <td>代练状态</td>
              <td colspan="3">{{ getPowerLevelingStatusName(order.powerLevelingStatus) || '空' }}</td>
            </tr>
          </table>
        </el-tab-pane>
        <el-tab-pane label="代练日志" name="2">
          <el-table
            v-if="order.logDtos"
            :data="order.logDtos.items"
            style="max-width: 1100px;margin-top: 20px;"
            border
            class="power-level-table"
          >
            <el-table-column
              v-if="false"
              prop="downOrderId"
              label="订单号"
            />
            <el-table-column
              prop="createUserName"
              label="操作用户"
            />
            <el-table-column
              prop="creationTime"
              label="创建日期"
            >
              <template v-slot="scope">
                {{ scope.row.creationTime|timeFormatNotUtc }}
              </template>
            </el-table-column>
            <el-table-column
              prop="operation"
              label="操作"
            >
              <template v-slot="scope">
                {{ getOperationStatusName(scope.row.operation) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
            />
          </el-table>
          <el-pagination
            v-if="order.logDtos"
            background
            :total="order.logDtos.totalCount"
            :current-page="currentPage"
            :page-size="params.maxResultCount"
            @size-change="handleSizeChange"
            @current-change="pageChange"
          />
        </el-tab-pane>
        <el-tab-pane label="订单状态" name="3">
          <el-table
            :data="order.orderRemark"
            style="max-width: 1100px;margin-top: 20px;"
            border
            class="power-level-table"
          >
            <el-table-column
              prop="orderId"
              label="订单号"
            />
            <el-table-column
              prop="orderStatus"
              label="订单状态"
            >
              <template v-slot="scope">
                {{ getStatusName(scope.row.orderStatus) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="orderRemark"
              label="备注"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="代练订单日志" name="4">
          <el-table
            :data="order.orderPowerLeveling"
            style="margin-top: 20px;"
            border
            class="power-level-table"
          >
            <el-table-column
              prop="assignBeaterId"
              label="指派打手"
            />
            <el-table-column
              prop="checkPowerLevelingTime"
              width="160"
              label="代练验证时间"
            >
              <template v-slot="scope">
                {{ scope.row.checkPowerLevelingTime|timeFormatNotUtc }}
              </template>
            </el-table-column>
            <el-table-column
              prop="checkPowerLevelingUserId"
              width="150"
              label="代练是否完成验证人"
            />
            <el-table-column
              prop="isAchievePowerLeveling"
              label="代练是否完成"
              width="120"
            >
              <template v-slot="scope">
                {{ scope.row.isAchievePowerLeveling ? '是': '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="isForcedStop"
              label="是否客服强制终止代练"
              width="180"
            >
              <template v-slot="scope">
                {{ scope.row.isAchievePowerLeveling ? '是': '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="isInternalGold"
              label="是否内部金币代练"
              width="140"
            >
              <template v-slot="scope">
                {{ scope.row.isInternalGold ? '是': '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="lastAntecedentMoney"
              label="最终返还押金"
              width="130"
            />
            <el-table-column
              prop="lastReward"
              label="最终获得佣金"
              width="120"
            />
            <el-table-column
              prop="lastReward"
              label="代练人备注"
              width="120"
            />
            <el-table-column
              prop="powerLevelingAntecedentMoney"
              label="代练押金"
            />
            <el-table-column
              prop="powerLevelingRequirement"
              label="代练要求"
              width="160"
            />
            <el-table-column
              prop="powerLevelingReward"
              label="代练佣金"
            />
            <el-table-column
              prop="powerLevelingStartTime"
              label="代练开始时间"
              width="160"
            >
              <template v-slot="scope">
                {{ scope.row.powerLevelingStartTime|timeFormatNotUtc }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingStatus"
              label="代练状态"
              width="140"
            >
              <template v-slot="scope">
                {{ getPowerLevelingStatusName(scope.row.powerLevelingStatus) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingStartTime"
              label="代练结束时间"
              width="160"
            >
              <template v-slot="scope">
                {{ scope.row.powerLevelingStopTime|timeFormatNotUtc }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingUserId"
              label="接单打手用户id"
              width="150"
            />
            <el-table-column
              prop="profitDistributionTime"
              label="利润分配时间"
              width="160"
            >
              <template v-slot="scope">
                {{ scope.row.profitDistributionUserId }}
              </template>
            </el-table-column>
            <el-table-column
              prop="profitDistributionUserId"
              label="利润分配人"
              width="150"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="代练操作日志" name="5">
          <div v-if="order.hsdlAccLog" style="margin-top: 20px">
            <el-table
              :data="order.hsdlAccLog.items"
              style="max-width: 1100px;margin-top: 20px;"
              border
              class="power-level-table"
            >
              <el-table-column
                prop="动作"
                label="动作"
              >
                <template v-slot="scope">
                  {{ scope.row.动作 || '空' }}
                </template>
              </el-table-column>
              <el-table-column
                prop="备注"
                label="备注"
              />
              <el-table-column
                prop="操作时间"
                label="操作时间"
              >
                <template v-slot="scope">
                  {{ scope.row.操作时间|timeFormatNotUtc }}
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              background
              :total="order.hsdlAccLog.totalCount"
              :current-page="currentPage"
              :page-size="params.maxResultCount"
              @size-change="handleSizeChange"
              @current-change="pageChange"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="代练具体信息" name="6">
          <div class="el-row">
            <div class="el-col-6">
              <table v-if="order.jsonOrderCanUpdate" class="boss-table">
                <template v-for="(item, key) in order.jsonOrderCanUpdate">
                  <tr :key="key">
                    <td width="100">{{ key }}</td>
                    <td>{{ item }}</td>
                  </tr>
                </template>
              </table>
            </div>
            <div class="el-col-6" style="padding-left: 20px">
              <table v-if="order.jsonOrderOnlyRead" class="boss-table">
                <template v-for="(item, key) in order.jsonOrderOnlyRead">
                  <tr :key="key">
                    <td width="100">{{ key }}</td>
                    <td>{{ item }}</td>
                  </tr>
                </template>
              </table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import * as powerLevelingApi from '@/api/powerLeveling'
import orderStatus2 from '../../data/OrderStatus2'
import payStatus from '../../data/PayStatus'
import powerStatus from '../../data/PowerStatus'
import operationStatus from '../../data/OperationStatus'
export default {
  name: 'OrderDetail',
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      activeName: '1',
      order: {},
      currentPage: 1,
      params: {
        id: '',
        maxResultCount: 10,
        skipCount: 0
      }
    }
  },
  computed: {
    getPayName() {
      return payStatus[this.order.payWay]
    }
  },
  created() {
    this.getOrderDetails()
  },
  methods: {
    // 分页每页长度修改回调
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.getOrderDetails()
    },
    // 翻页动作回调
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getOrderDetails()
    },
    getOperationStatusName(name) {
      return operationStatus[name + '']
    },
    getStatusName(name) {
      return orderStatus2[name + '']
    },
    getPowerLevelingStatusName(name) {
      return powerStatus[name + '']
    },
    getOrderDetails() {
      this.params.id = this.orderId
      powerLevelingApi.GetOrderDetails(this.params).then(res => {
        const result = res.data.result
        if (result.jsonOrderCanUpdate) {
          result.jsonOrderCanUpdate = JSON.parse(result.jsonOrderCanUpdate)
        }

        if (result.jsonOrderOnlyRead) {
          result.jsonOrderOnlyRead = JSON.parse(result.jsonOrderOnlyRead)
        }
        this.order = result
      })
    },
    goBack() {
      this.$emit('onBack')
    }
  }
}
</script>

<style lang="scss" scoped>
.boss-table{
  tr td:nth-child(1){
    background: #f5f7fa !important;
    color: #909399;
  }
}
</style>
