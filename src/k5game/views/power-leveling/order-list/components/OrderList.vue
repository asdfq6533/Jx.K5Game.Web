<template>
  <div class="power-level-container">
    <el-form :inline="true" :model="params">
      <el-form-item label="订单号">
        <el-input v-model="params.OrderId" placeholder="按订单号搜索" @keyup.enter.native="searchClick" />
      </el-form-item>
      <el-form-item label="代练账号">
        <el-input v-model="params.AccountNum" placeholder="按代练账号搜索" @keyup.enter.native="searchClick" />
      </el-form-item>
      <el-form-item label="下单人用户名">
        <el-input v-model="params.UserName" style="width: 160px" placeholder="按下单人用户名搜索" @keyup.enter.native="searchClick" />
      </el-form-item>
      <el-form-item label="来源渠道">
        <el-select v-model="params.sources" style="width: 160px" clearable placeholder="全部">
          <el-option
            label="5173"
            value="5173"
          />
          <el-option
            label="无极店铺"
            value="无极店铺"
          />
          <el-option
            label="骏网"
            value="骏网"
          />
          <el-option
            label="柒柒"
            value="柒柒"
          />
          <el-option
            label="微信"
            value="微信"
          />
          <el-option
            label="千鹰"
            value="千鹰"
          />
          <el-option
            label="见中"
            value="见中"
          />
          <el-option
            label="匠心"
            value="匠心"
          />
          <el-option
            label="app"
            value="app"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否问题单">
        <el-select v-model="params.IsAbnormal" style="width: 160px" clearable placeholder="全部">
          <el-option
            v-for="item in isAbnormalFlags"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="false" label="代练状态">
        <el-select v-model="params.powerLevelingStatus" clearable placeholder="全部">
          <el-option
            v-for="(item, key) in powerLevelingStatus"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="挂机友谊赛">
        <el-select v-model="params.挂机友谊赛" style="width: 160px" clearable placeholder="全部">
          <el-option
            v-for="(item, key) in guaJiStatus"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="炉石状态">
        <el-select v-model="params.lushiStatus" style="width: 160px" clearable placeholder="全部">
          <el-option
            v-for="(item, key) in lushiStatus"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <!-- 是否待验证、佣金结算接口是废的，因此不画了 -->
      <el-form-item label="所属游戏">
        <el-select v-model="params.GameName" style="width: 160px" filterable clearable placeholder="全部" @change="getPackageList" @clear="clearGeme">
          <el-option
            v-for="item in allGames"
            :key="item.id"
            :label="item.name"
            :value="item.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="代练类型">
        <el-select v-model="params.PackageName" style="width: 160px" filterable clearable placeholder="请先选择游戏" :disabled="!params.GameName?true:false">
          <el-option
            v-for="item in PackageNames"
            :key="item.id"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="是否公示">
        <el-select v-model="isPublic" style="width: 160px" filterable clearable placeholder="全部">
          <el-option
            label="已公示"
            value="true"
          />
          <el-option
            label="未公示"
            value="false"
          />
        </el-select>
      </el-form-item> -->
      <!-- 起始时间 -->
      <el-form-item label="起始时间">
        <el-date-picker
          v-model="params.StartDate"
          style="width: 160px"
          type="date"
          placeholder="选择日期"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="params.EndDate"
          style="width: 160px"
          type="date"
          placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">按条件搜索</el-button>
      </el-form-item>
    </el-form>
    <div style="padding-bottom: 20px">
      <el-button type="primary" icon="el-icon-plus" @click="addClick">添加订单</el-button>
      <el-button type="primary" @click="wechatPutIntClick">微信充值</el-button>
      <el-button type="primary" @click="aliPayPutIntoClick">支付宝充值</el-button>
      <el-button type="primary" @click="friendlyPutIntoClick">友谊赛充值</el-button>
      <el-button type="primary" @click="clearAllFinishedOrders">清理完成单</el-button>
    </div>
    <!-- <el-alert
      class="account"
      :title="`我的可用虚拟币：${myAsset.availableCoins} 我的可用友谊赛：${myAsset.availableFriendlyMatchs} 友谊赛价格：${myAsset.friendlyMatchPrice}KB/场`"
      type="success"
      :closable="false"
    /> -->
    <el-alert class="account" type="success" :closable="false">
      <template slot="title">
        <span>我的可用虚拟币：{{ myAsset.availableCoins }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>我的可用友谊赛：{{ myAsset.availableFriendlyMatchs }} &nbsp;&nbsp;&nbsp;&nbsp;</span>
        <span>友谊赛价格：{{ myAsset.friendlyMatchPrice }} KB/场</span>
      </template>
    </el-alert>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane
        v-for="(val, key) in tabList"
        :key="key"
        :name="val.OrderStatus + ''"
        :label="`${val.title}（${val.count}）`"
      />
    </el-tabs>
    <el-table
      :data="list"
      border
      class="power-level-table"
      :expand-row-keys="expands"
      :row-key="getRowKeys"
      @expand-change="expandChange"
    >
      <el-table-column v-if="activeName === '3'" type="expand">
        <template v-slot="scope">
          <el-table
            v-if="scope.row.orderStatusName === '代练中'"
            :data="daiLianInfolist"
            border
            class="power-level-table"
          >
            <el-table-column
              prop="isInternalGold"
              label="代练方"
            >
              <template v-slot="scope">
                {{ scope.row.isInternalGold === true ? '内部代练' : '打手代练' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingStatus"
              label="代练状态"
            >
              <template v-slot="scope">
                {{ getPowerLevelingStatusName(scope.row.powerLevelingStatus) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingUserId"
              label="代练者"
            >
              <template v-slot="scope">
                {{ getBeaterName(scope.row.powerLevelingUserId) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingStartTime"
              label="开始时间"
              width="140"
            >
              <template v-slot="scope">
                {{ scope.row.powerLevelingStartTime|timeFormat }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingStopTime"
              label="结束时间"
              width="140"
            >
              <template v-slot="scope">
                {{ scope.row.powerLevelingStopTime|timeFormat }}
              </template>
            </el-table-column>
            <el-table-column
              prop="powerLevelingAntecedentMoney"
              label="代练押金(K币)"
              width="140"
            />
            <el-table-column
              prop="powerLevelingReward"
              label="代练佣金(K币)"
              width="140"
            />
            <el-table-column
              prop="powerLevelingRequirement"
              label="代练要求"
            />
            <el-table-column
              prop=""
              label="操作"
              width="160"
            >
              <template v-slot="scope">
                <div class="my-icon-group">
                  <el-tooltip class="item" effect="dark" content="审核完成" placement="top">
                    <a class="my-icon" @click="passClick(scope.row)">
                      <svg-icon icon-class="info" />
                    </a>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="终止代练" placement="top">
                    <a class="my-icon" @click="stopClick(scope.row)">
                      <svg-icon icon-class="stop" />
                    </a>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="暂停代练" placement="top">
                    <a class="my-icon" @click="stop2Click(scope.row)">
                      <svg-icon icon-class="stop2" />
                    </a>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="remarkCnt"
        label="备注"
      >
        <template v-slot="scope">
          <div
            class="my-icon-group"
          >
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :open-delay="1000">
              <a class="my-icon" @click="remarksClick(scope.row)"><svg-icon icon-class="edit" /></a>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" :open-delay="1000">
              <a @click="remarksListClick(scope.row)"><el-tag>{{ scope.row.remarkCnt }}</el-tag></a>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="是否问题单"
        label="是否问题单"
        width="100"
      >
        <template v-slot="scope">
          <el-tag :type="scope.row.isAbnormal ? 'danger' : ''">
            {{ scope.row.isAbnormal ? "是": "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="订单号"
        width="160"
      />
      <el-table-column
        prop="productTitle"
        label="产品标题"
        width="200"
      />
      <el-table-column
        prop="userName"
        label="下单人"
        width="120"
      />
      <el-table-column
        v-show="false"
        prop="isInternalGold"
        label="是否内部代练"
      />
      <el-table-column
        prop="userRemark"
        label="用户备注"
        width="160"
      />
      <el-table-column
        prop="downOrderTime"
        label="下单时间"
        width="140"
      >
        <template v-slot="scope">
          {{ scope.row.downOrderTime | timeFormatNotUtc }}
        </template>
      </el-table-column>
      <el-table-column
        prop="phoneNum"
        label="联系电话"
        width="120"
      />
      <el-table-column
        prop="gameName"
        label="代练游戏"
      />
      <el-table-column
        prop="packageName"
        label="代练类型"
      />
      <el-table-column
        prop="accountNum"
        label="代练账号"
        width="280"
      />
      <el-table-column
        prop="count"
        label="订单数量"
      />
      <el-table-column
        prop="orderAmount"
        label="订单总金额"
        width="120"
      />
      <el-table-column
        prop="lastReadTime"
        label="上一次读取时间"
        width="140"
      >
        <template v-slot="scope">
          {{ scope.row.lastReadTime|timeFormat }}
        </template>
      </el-table-column>
      <el-table-column
        prop="指定打手"
        label="指定打手"
      />
      <el-table-column
        prop="sources"
        label="来源"
      />
      <el-table-column
        prop="isPublic"
        label="公示状态"
      >
        <template v-slot="scope">
          {{ scope.row.isPublic ?'已公示':'未公示' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="powerLevelingStatusName"
        label="代练状态"
      >
        <template v-slot="scope">
          <div style="padding-bottom: 10px">
            <el-tag :type="scope.row.powerLevelingStatus === null ? 'danger' : ''">
              {{ scope.row.powerLevelingStatus !== null ? getPowerLevelingStatusName(scope.row.powerLevelingStatus) : '未上架' }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="炉石状态"
        label="炉石状态"
      >
        <template v-slot="scope">
          <div v-if="scope.row.炉石状态" style="padding-bottom: 10px">
            <el-tag>
              {{ scope.row.炉石状态 }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="activeName !=='1'"
        label="操作"
        width="170"
        fixed="right"
      >
        <template v-slot="scope">
          <el-dropdown trigger="click">
            <el-button type="primary" style="width: 140px">
              操作<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown" style="width: 140px">
              <el-dropdown-item
                @click.native="orderDetailClick(scope.row)"
              >
                <svg-icon icon-class="search" />
                <label>订单详情</label>
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="assignClick(scope.row)"
              >
                <svg-icon icon-class="search" />
                <label>指派打手</label>
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="resetAssignClick(scope.row)"
              >
                <svg-icon icon-class="search" />
                <label>重置打手</label>
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="resetTimeClick(scope.row)"
              >
                <svg-icon icon-class="edit" />
                <label>重置时间</label>
              </el-dropdown-item>
              <el-dropdown-item
                @click.native="updatePwdClick(scope.row)"
              >
                <svg-icon icon-class="edit" />
                <label>修改信息</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.orderStatusName === '代练中'"
                @click.native="passClick(scope.row)"
              >
                <svg-icon icon-class="info" />
                <label>审核完成</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.orderStatusName === '代练中'"
                @click.native="stopClick(scope.row)"
              >
                <svg-icon icon-class="stop" />
                <label>终止代练</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.orderStatusName === '代练中'"
                @click.native="stop2Click(scope.row)"
              >
                <svg-icon icon-class="stop2" />
                <label>暂停代练</label>
              </el-dropdown-item>
              <!-- <el-dropdown-item
                v-if="scope.row.orderStatusName !== '待付款' && scope.row.orderStatusName !== '待改价' && scope.row.orderStatusName !== '已取消'"
                @click.native="searchPwdOrder(scope.row)"
              >
                <svg-icon icon-class="lock" />
                <label>查看密码</label>
              </el-dropdown-item> -->
              <el-dropdown-item
                v-if="scope.row.orderStatusName !== '待付款' && scope.row.orderStatusName !== '待改价' && scope.row.orderStatusName !== '已取消'"
                @click.native="infoOrder(scope.row)"
              >
                <svg-icon icon-class="search" />
                <label>查看信息</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.orderStatusName === '已完成' || scope.row.orderStatusName === '已取消'"
                @click.native="deleteOrder(scope.row)"
              >
                <svg-icon icon-class="close" />
                <label>删除订单</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.orderStatusName === '待付款'"
                @click.native="editOrderPrice(scope.row)"
              >
                <svg-icon icon-class="edit" />
                <label>编辑订单</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.orderStatusName === '待发货' && !scope.row.powerLevelingStatusName"
                @click.native="editOrderAccount(scope.row)"
              >
                <svg-icon icon-class="edit" />
                <label>修改账号信息</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="(scope.row.orderStatusName === '代练中' || scope.row.orderStatusName === '待发货') && scope.row.powerLevelingStatusName==='上架中'"
                @click.native="soldOut(scope.row)"
              >
                <svg-icon icon-class="arrow-down" />
                <label>下架</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-else-if="scope.row.orderStatusName === '代练中' || scope.row.orderStatusName === '待发货'"
                @click.native="putaway(scope.row)"
              >
                <svg-icon icon-class="arrow-up" />
                <label>上架</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.powerLevelingStatusName==='上架中' && scope.row.orderStatusName === '待发货' && scope.row.isPublic === false"
                @click.native="publicity(scope.row)"
              >
                <svg-icon icon-class="arrow-up2" />
                <label>公示</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="scope.row.powerLevelingStatusName==='上架中' && scope.row.orderStatusName === '待发货' && scope.row.isPublic === true"
                @click.native="cancelPublicity(scope.row)"
              >
                <svg-icon icon-class="arrow-down2" />
                <label>取消公示</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="(scope.row.orderStatusName === '待发货' || scope.row.orderStatusName === '待付款') && !scope.row.powerLevelingStatusName"
                @click.native="cancelOrder(scope.row)"
              >
                <svg-icon icon-class="close" />
                <label>取消订单</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-if="(activeName === '2' || activeName === '3') && !scope.row.isAbnormal"
                @click.native="setQuestionOrder(scope.row)"
              >
                <svg-icon icon-class="info" />
                <label>置为问题单</label>
              </el-dropdown-item>
              <el-dropdown-item
                v-else-if="activeName === '2' || activeName === '3'"
                @click.native="setQuestionOrder(scope.row)"
              >
                <svg-icon icon-class="info" />
                <label>取消问题单</label>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="sizes, prev, pager, next, jumper"
      :total="totalCount"
      :current-page.sync="currentPage"
      :page-size="params.maxResultCount"
      @size-change="handleSizeChange"
      @current-change="pageChange"
    />
    <edit-order-price-dialog
      ref="editOrderPriceForm"
      :is-show="isEditOrderPriceShow"
      @onClose="isEditOrderPriceShow=false"
      @onRefresh="searchClick"
    />
    <order-pwd-dialog
      ref="orderPwdDialog"
      :is-show="isOrderPwdShow"
      @onClose="isOrderPwdShow=false"
      @onRefresh="searchClick"
    />
    <order-info-dialog
      ref="orderInfoDialog"
      :is-show="isOrderInfoShow"
      @onClose="isOrderInfoShow=false"
      @onRefresh="searchClick"
    />
    <put-into-dialog
      ref="putInfoDialog"
      :is-show="isPutIntoShow"
      @onClose="isPutIntoShow=false"
      @onRefresh="getMyAsset"
    />
    <cancel-order-dialog
      ref="cancelOrderDialog"
      :is-show="isCancelOrderShow"
      @onClose="isCancelOrderShow=false"
      @onRefresh="searchClick"
    />
    <order-remarks-dialog
      ref="orderRemarksDialog"
      :is-show="isOrderRemarksShow"
      @onClose="isOrderRemarksShow=false"
      @onRefresh="searchClick"
    />
    <order-remarks-list-dialog
      ref="orderRemarksListDialog"
      :is-show="isOrderRemarksListShow"
      @onClose="isOrderRemarksListShow=false"
      @onRefresh="searchClick"
    />
    <putaway-order-dialog
      ref="putAwayOrder"
      :is-show="isPutAwayOrderShow"
      @onClose="isPutAwayOrderShow=false"
      @onRefresh="searchClick"
    />
    <edit-order-account-dialog
      ref="editOrderAccount"
      :is-show="isEditOrderAccountShow"
      @onClose="isEditOrderAccountShow=false"
      @onRefresh="searchClick"
    />
    <dai-lian-info-dialog
      ref="daiLianInfo"
      :is-show="isDaiLianInfoShow"
      @onClose="isDaiLianInfoShow=false"
      @onRefresh="searchClick"
    />
    <assign-dialog
      ref="assignDialog"
      :is-show="isAssignDialogShow"
      @onClose="isAssignDialogShow=false"
      @onRefresh="searchClick"
    />
    <update-pwd-dialog
      ref="updatePwdDialog"
      :is-show="isUpdatePwdDialogShow"
      @onClose="isUpdatePwdDialogShow=false"
      @onRefresh="searchClick"
    />
  </div>
</template>
<script>
import * as gameInfoApi from '@/api/gameInfo'
import * as powerLevelingApi from '@/api/powerLeveling'
import k5Utils from '@/utils/k5Utils'
import EditOrderPriceDialog from './EditOrderPriceDialog'
import OrderPwdDialog from '../../components/OrderPwdDialog'
import OrderInfoDialog from './OrderInfoDialog'
import PutIntoDialog from './PutIntoDialog'
import CancelOrderDialog from './CancelOrderDialog'
import OrderRemarksDialog from './OrderRemarksDialog'
import OrderRemarksListDialog from './OrderRemarksListDialog'
import PutawayOrderDialog from './PutawayOrderDialog'
import EditOrderAccountDialog from './EditOrderAccountDialog'
import DaiLianInfoDialog from './DaiLianInfoDialog'
import lushiStatus from '../../data/LushiStatus'
import GuaJiStatus from '../../data/GuaJiStatus'
import powerStatus from '../../data/PowerStatus'
import AssignDialog from './AssignDialog'
import UpdatePwdDialog from './UpdatePwdDialog'
export default {
  components: { UpdatePwdDialog, AssignDialog, DaiLianInfoDialog, EditOrderAccountDialog, PutawayOrderDialog, OrderRemarksListDialog, OrderRemarksDialog, CancelOrderDialog, PutIntoDialog, OrderInfoDialog, OrderPwdDialog, EditOrderPriceDialog },
  data() {
    return {
      beatersList: [],
      guaJiStatus: GuaJiStatus,
      lushiStatus: lushiStatus,
      powerLevelingStatus: powerStatus,
      daiLianInfolist: [],
      expands: [],
      getRowKeys(row) {
        return row.id
      },
      isUpdatePwdDialogShow: false,
      isAssignDialogShow: false,
      isDaiLianInfoShow: false,
      isEditOrderAccountShow: false,
      isPutAwayOrderShow: false,
      isOrderRemarksListShow: false,
      isCancelOrderShow: false,
      isEditOrderPriceShow: false,
      isOrderPwdShow: false,
      isOrderInfoShow: false,
      isPutIntoShow: false,
      isOrderRemarksShow: false,
      activeName: '',
      params: {
        AccountNum: '', // 账号名称
        OrderId: '', // 订单Id
        UserName: '', // 用户名
        GameName: '', // 游戏名称
        maxResultCount: 10,
        IsAbnormal: '', // 是否问题单
        OrderStatus: 0, // 订单状态
        skipCount: 0,
        StartDate: k5Utils.defaultStartDate(), // 开始时间
        EndDate: k5Utils.defaultEndDate(), // 结算时间
        sorting: 'remarkCnt DESC'
      },
      dataList: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: [],
        6: [],
        5: []
      },
      tabList: {
        waitPayCnt:
          {
            title: '待付款',
            OrderStatus: 0,
            count: 0
          },
        waiChangePriceCnt: {
          title: '待改价',
          OrderStatus: 1,
          count: 0
        },
        waitSendCnt: {
          title: '待发货',
          OrderStatus: 2,
          count: 0
        },
        powerLevelingCnt: {
          title: '代练中',
          OrderStatus: 3,
          count: 0
        },
        achieveSendCnt: {
          title: '已发货',
          OrderStatus: 4,
          count: 0
        },
        tradingOverCnt: {
          title: '已完成',
          OrderStatus: 6,
          count: 0
        },
        cancelCnt: {
          title: '已取消',
          OrderStatus: 5,
          count: 0
        }
      },
      allGames: [],
      isAbnormalFlags: [{
        value: false,
        label: '非问题单'
      }, {
        value: true,
        label: '问题单'
      }
      ],
      list: [], // Table表格数据
      myAsset: {
        availableCoins: '',
        availableFriendlyMatchs: '',
        friendlyMatchPrice: ''
      }, // 用户账户余额等信息

      currentPage: 1,
      totalCount: 0,
      PackageNames: [],
      isPublic: ''
    }
  },
  async mounted() {
    // 获取账号余额等信息
    this.getMyAsset()
    // 默认加载所有游戏
    await this.getAllGames()
    await this.getBeaters()
    await this.requestOrder()
    this.acceptNotification()
  },
  destroyed() {
    this.bus.$off('orderRefresh')
  },
  methods: {
    clearGeme() {
      this.params.PackageName = ''
    },
    getPackageList() {
      if (!this.params.GameName) {
        return
      }
      this.PackageNames = []
      // eslint-disable-next-line no-unused-vars
      let id = ''
      for (let i = 0; i < this.allGames.length; i++) {
        if (this.params.GameName === this.allGames[i].name) {
          id = this.allGames[i].id
        }
      }
      gameInfoApi.GetAllPackageByGameId({ id: id }).then(res => {
        if (res.data.success) {
          this.PackageNames = res.data.result
        }
      })
    },
    // 清理完成单
    clearAllFinishedOrders() {
      this.$confirm('你确定要清理完成单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.ClearIsAchievePowerLeveling(this.params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },
    acceptNotification() {
      // const that = this
      this.bus.$on('orderRefresh', () => {
        this.requestOrder()
      })
    },
    // 重置读取时间
    resetTimeClick(row) {
      const params = {
        orderId: row.id
      }
      this.$confirm('你确定要重置时间？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.ResetDatetime(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },
    // 更新账号密码
    updatePwdClick(row) {
      this.isUpdatePwdDialogShow = true
      this.$refs.updatePwdDialog.setValues(row.id)
    },
    // 重置打手
    resetAssignClick(row) {
      this.$confirm('你确定要重置打手？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.ReSetDaShou({ orderId: row.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },
    // 指派打手
    assignClick(row) {
      this.isAssignDialogShow = true
      this.$refs.assignDialog.setValues(row.id)
    },
    getPowerLevelingStatusName(name) {
      return powerStatus[name + '']
    },
    expandChange(data, expandedRows) {
      const that = this
      if (expandedRows.length) {
        that.expands = []
        if (data) {
          that.expands.push(data.id)// 每次push进去的是每行的ID
          // this.getChildList()
          if (data.orderStatusName === '代练中') {
            powerLevelingApi.GetPowerLevelingList({ orderId: data.id }).then(res => {
              this.daiLianInfolist = res.data.result.items
            })
          }
        }
      } else {
        that.expands = []// 默认不展开
      }
    },
    orderDetailClick(row) {
      this.$emit('onOrderDetail', row)
    },
    getOrderCount() {
      powerLevelingApi.GetOrderCount(this.params).then(res => {
        const result = res.data.result
        result.map(item => {
          this.tabList[item.name].count = item.count
        })
      })
    },
    editOrderAccount(row) {
      this.isEditOrderAccountShow = true
      this.$refs.editOrderAccount.setValues(row)
    },
    putaway(row) {
      this.isPutAwayOrderShow = true
      this.$refs.putAwayOrder.setValues(row)
    },
    setQuestionOrder(row) {
      this.$confirm(row.isAbnormal ? '你确定要设置问题单吗?' : '你确定要取消问题单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.ChangeIsAbnormal({ id: row.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },
    wechatPutIntClick() {
      this.isPutIntoShow = true
      this.$refs.putInfoDialog.setValues('wechat')
    },
    aliPayPutIntoClick() {
      this.isPutIntoShow = true
      this.$refs.putInfoDialog.setValues('aliPay')
    },
    friendlyPutIntoClick() {
      this.isPutIntoShow = true
      this.$refs.putInfoDialog.setValues('friendly')
    },
    remarksListClick(item) {
      this.isOrderRemarksListShow = true
      this.$refs.orderRemarksListDialog.setValues(item)
    },
    cancelOrder(item) {
      this.isCancelOrderShow = true
      this.$refs.cancelOrderDialog.setValues(item)
    },
    remarksClick(item) {
      this.isOrderRemarksShow = true
      this.$refs.orderRemarksDialog.setValues(item)
    },
    soldOut(item) {
      this.$confirm('你确定要下架?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.SoldoutOrder({ id: item.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },
    infoOrder(item) {
      this.isOrderInfoShow = true
      this.$refs.orderInfoDialog.setValues(item)
    },
    searchPwdOrder(item) {
      this.isOrderPwdShow = true
      this.$refs.orderPwdDialog.setValues(item.id)
    },
    editOrderPrice(item) {
      this.isEditOrderPriceShow = true
      this.$refs.editOrderPriceForm.setValues(item)
    },
    deleteOrder(item) {
      this.$confirm('你确定要删除订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.UserDeleteOrder({ orderId: item.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },
    // 当图片名称拼成绝对路径url
    getRealUrl(url) {
      return k5Utils.getNewUrl(url)
    },
    // 搜索筛选
    async requestOrder() {
      this.list = []
      const res = await powerLevelingApi.GetOrderList(this.params)
      this.list = res.data.result.items
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].userRemark) {
          const count = this.list[i].userRemark.split(':')[1]
          const userRemark = this.list[i].userRemark.split(' ')[0]
          this.$set(this.list[i], 'count', count)
          this.$set(this.list[i], 'userRemark', userRemark)
        } else {
          this.$set(this.list[i], 'count', '1')
          this.$set(this.list[i], 'userRemark', '')
        }
        if (!this.list[i].sources) {
          this.$set(this.list[i], 'sources', 'K5电竞')
        }
      }
      this.totalCount = res.data.result.totalCount
      this.getOrderCount()
    },
    // 添加订单跳转
    addClick() {
      this.$emit('onAdd')
    },
    // 分页每页长度修改回调
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.requestOrder()
    },
    // 翻页动作回调
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.requestOrder()
    },
    // 获取所有游戏
    async getAllGames() {
      const res = await gameInfoApi.GetAllGames({ gamePlatform: '' })
      this.allGames = res.data.result.items
    },
    searchClick() {
      if (!this.params.StartDate || !this.params.EndDate) {
        this.$message.error('请选择查询时间')
        return false
      }
      if (this.isPublic) {
        this.params.isPublic = this.isPublic === 'true'
      }
      this.params.skipCount = 0
      this.currentPage = 1
      this.requestOrder()
    },
    // 切换订单状态
    handleClick(tab, event) {
      this.params.OrderStatus = tab.name
      this.params.skipCount = 0
      this.currentPage = 1
      this.requestOrder()
    },
    // 获取用户账户余额等信息
    getMyAsset() {
      powerLevelingApi.GetMyAsset().then(res => {
        this.myAsset = res.data.result
      })
    },
    // 停止代练
    stopClick(row) {
      this.$prompt('备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: '确定结束代练'
      }).then(({ value }) => {
        console.log(row)
        // eslint-disable-next-line no-unused-vars
        const params = {
          powerLevelingId: row.levelingTabledDto.id,
          isAchieve: true,
          remark: value
        }
        powerLevelingApi.ConfirmAchievePowerLeveling(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },

    // 停止代练
    stop2Click(row) {
      this.$confirm('你确定要停止代练?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          powerLevelingId: row.levelingTabledDto.id
        }
        powerLevelingApi.StopPowerLeveling(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {})
    },
    // 审核
    passClick(row) {
      this.isDaiLianInfoShow = true
      this.$refs.daiLianInfo.setValues(row.id)
    },
    // 打手名称
    async getBeaters() {
      const result1 = await powerLevelingApi.GetBeaters()
      if (result1) {
        this.beatersList = result1.data.result.items
      }
    },
    getBeaterName(id) {
      let name = ''
      this.beatersList.some(item => {
        if (item.value === id) {
          name = item.label
          return true
        }
      })
      return name
    },
    // 公示
    publicity(row) {
      this.$confirm('是否公示该代练订单?公示后该订单在代练市场可见。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          orderId: row.id
        }
        powerLevelingApi.UpdateDaiLianOrderIsPublic(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '操作失败'
        // })
      })
    },
    // 取消公示
    cancelPublicity(row) {
      this.$confirm('是否取消公示该代练订单?取消后该订单在代练市场不可见。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          orderId: row.id
        }
        powerLevelingApi.UpdateDaiLianOrderIsPublic(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.requestOrder()
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '操作失败'
        // })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ul.el-dropdown-menu{
    li {
      padding: 4px 10px;
      font-size: 16px;
    }
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
