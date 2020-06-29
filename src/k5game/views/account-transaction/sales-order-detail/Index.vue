<template>
  <div class="page-content">
    <div class="orderDetail">
      <order-detail title="订单信息">
        <div class="group">
          <div class="group-item">
            <label>订单编号：</label>
            <p style="color:red">{{ detail.id }}</p>
          </div>
          <div class="group-item">
            <label>订单金额：</label>
            <p style="color:red">{{ '¥' + detail.amount }}</p>
          </div>
          <div class="group-item">
            <label>实付金额：</label>
            <p style="color:red">{{ detail.payAmount?'¥' + detail.payAmount:'' }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>订单状态：</label>
            <p style="color:#108EE9">{{ getStaus }}<span v-if="detail.remark" style="color:#333;">({{ detail.remark }})</span></p>
          </div>
          <div class="group-item">
            <label>支付方式：</label>
            <p>{{ getPayWay }}</p>
          </div>
          <div class="group-item">
            <label>下单时间：</label>
            <p>{{ detail.downOrderTime | timeFormat }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>付款时间：</label>
            <p>{{ detail.payTime | timeFormat }}</p>
          </div>
        </div>
      </order-detail>
      <order-detail title="买家信息">
        <div class="group">
          <div class="group-item">
            <label>买家：</label>
            <p>{{ user.nickName }}</p>
          </div>
          <div class="group-item">
            <label>买家手机：</label>
            <p>{{ user.phoneNumber }}</p>
          </div>
        </div>
      </order-detail>
      <order-detail title="卖家信息">
        <div class="group">
          <div class="group-item">
            <label>卖家：</label>
            <p>{{ sallerUser.nickName }}</p>
          </div>
          <div class="group-item">
            <label>卖家手机号：</label>
            <p>{{ sallerUser.phoneNumber }}</p>
          </div>
          <div class="group-item">
            <label>卖家微信号：</label>
            <p>{{ sallerUser.wx }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>卖家QQ：</label>
            <p>{{ sallerUser.qq }}</p>
          </div>
        </div>
      </order-detail>
      <order-detail title="商品信息">
        <div class="group">
          <div class="group-item">
            <label>商品名称：</label>
            <p>{{ productInfo.title }}</p>
          </div>
          <div class="group-item">
            <label>游戏名称：</label>
            <p>{{ getGameName }}</p>
          </div>
          <div class="group-item">
            <label>游戏区服：</label>
            <p>{{ platform }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>销售模式：</label>
            <p>{{ productInfo.saleMode }}</p>
          </div>
          <div class="group-item">
            <label>游戏账号：</label>
            <p>{{ sensInfo.account }}</p>
          </div>
          <div class="group-item">
            <label>游戏密码：</label>
            <p>{{ sensInfo.password }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>手机绑定：</label>
            <p>{{ saleAccountTable.isBindPhone?'是':'否' }}</p>
          </div>
          <div v-if="saleAccountTable.isBindPhone" class="group-item">
            <label>绑定手机：</label>
            <p>{{ sensInfo.bindPhone }}</p>
          </div>
          <div class="group-item">
            <label>邮箱绑定：</label>
            <p>{{ sensInfo.isBindEmail?'是':'否' }}</p>
          </div>
          <div v-if="sensInfo.isBindEmail" class="group-item">
            <label>绑定邮箱：</label>
            <p>{{ sensInfo.bindEmail }}</p>
          </div>
          <div v-if="sensInfo.isBindEmail" class="group-item">
            <label>邮箱密码：</label>
            <p>{{ sensInfo.emailPassword }}</p>
          </div>
          <div class="group-item">
            <label>密保设置：</label>
            <p>{{ sensInfo.encryptedForm?'是':'否' }}</p>
          </div>
        </div>
        <div v-for="(item, index) in sensInfo.encryptedForm" :key="index" class="group">
          <div class="group-item">
            <label>密保问题{{ index + 1 }}：</label>
            <p>{{ item.questionVal }}</p>
          </div>
          <div class="group-item">
            <label>密保答案{{ index + 1 }}：</label>
            <p>{{ item.answerVal }}</p>
          </div>
        </div>
      </order-detail>
    </div>
  </div>
</template>

<script>
import OrderDetail from '@/k5game/components/OrderDetail'
import * as accountTransactionApi from '@/api/account-transaction'
import config from '@/config'
export default {
  name: 'AccountProductDetail',
  components: { OrderDetail },
  data() {
    return {
      detail: '',
      user: '',
      sensInfo: '',
      baseInfo: '',
      productInfo: '',
      sallerUser: '',
      status: [
        {
          id: 0,
          name: '待付款'
        },
        {
          id: 1,
          name: '待发货'
        },
        {
          id: 2,
          name: '待收货'
        },
        {
          id: 3,
          name: '已完成'
        },
        {
          id: -1,
          name: '交易关闭'
        },
        {
          id: '',
          name: '全部'
        }
      ],
      payWay: [
        {
          id: 0,
          name: 'K币支付'
        },
        {
          id: 1,
          name: '支付宝支付'
        },
        {
          id: 2,
          name: '微信支付'
        }
      ],
      platform: '',
      saleAccountTable: ''
    }
  },
  computed: {
    getGameName() {
      const list = this.$store.state.game.list
      let gameName = ''
      list.some(item => {
        if (item.id === this.productInfo.gameId) {
          gameName = item.name
          return true
        }
      })
      return gameName
    },
    getStaus() {
      let status = ''
      this.status.some(item => {
        if (item.id === this.detail.status) {
          status = item.name
        } else if (this.detail.status === 4) {
          status = '待收货'
        }
      })
      return status
    },
    getPayWay() {
      let payWay = ''
      this.payWay.some(item => {
        if (item.id === this.detail.payWay) {
          payWay = item.name
          return true
        }
      })
      return payWay
    }
  },
  created() {
    this.getProductDetail()
  },
  mounted() {
    if (this.$store.state.game.list.length === 0) {
      this.$store.dispatch('game/getList')
    }
  },
  methods: {
    getPicUrl(val) {
      return config.baseUrl + val
    },
    getProductDetail() {
      accountTransactionApi.GetOrderDetailsAsync({ id: this.$route.query.id }).then(res => {
        if (res.data.success) {
          this.detail = res.data.result
          this.productInfo = this.detail.commodityTable
          this.sallerUser = this.detail.commodityTable.sallerUser
          this.saleAccountTable = this.detail.saleAccountTable
          if (this.detail.saleAccountTable.sensInfo) {
            this.sensInfo = JSON.parse(this.detail.saleAccountTable.sensInfo)
          }
          if (this.detail.saleAccountTable.baseInfo && this.detail.saleAccountTable.baseInfo !== 'string') {
            this.baseInfo = JSON.parse(this.detail.saleAccountTable.baseInfo)
            this.platform = this.baseInfo.platform
          }
          this.user = this.detail.user
        }
      })
    }
  }
}
</script>

<style lang="scss" >
@import '~@/styles/variables';
.page-content{
  background: #fff;
  p{
    margin: 0;
    padding: 0;
  }
  .orderDetail{
    .container{
    margin-bottom: 40px;
    .group{
      display: flex;
      height: 30px;
      align-items: center;
      flex-wrap: wrap;
      label{
          font-weight: normal;
          color: #7d7d7d;
          width: 110px;
          text-align: right;
          display: block;
        }
      .group-item{
        color: #303133;
        display: flex;
        width: 30%;
        padding: 5px 0;
        flex-shrink: 0;
        p{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex: 1;
        }
      }
      .imgTip{
        color:rgb(153, 153, 153);
        font-size: 12px;
        line-height: 24px;
      }
      .auditStatus{
        color:red
      }
    }
    .group:nth-of-type(odd){
      background:#f2f2f2
    }
  }
  }

}

</style>
