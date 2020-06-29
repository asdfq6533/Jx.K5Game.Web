<template>
  <div class="page-content">
    <div class="orderDetail">
      <order-detail title="售后信息">
        <div class="group">
          <div class="group-item">
            <label>售后单号：</label>
            <p style="color:red">R201809092323234</p>
          </div>
          <div class="group-item">
            <label>订单编号：</label>
            <p>DD201809092323234</p>
          </div>
          <div class="group-item">
            <label>售后状态：</label>
            <p style="color:red">已完成</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>卖家：</label>
            <p>K5电竞</p>
          </div>
          <div class="group-item">
            <label>卖家手机号：</label>
            <p>15012341234</p>
          </div>
          <div class="group-item">
            <label>卖家微信号：</label>
            <p>15012341234</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>卖家QQ：</label>
            <p>2412238455</p>
          </div>
          <div class="group-item">
            <label>买家：</label>
            <p>丹青</p>
          </div>
          <div class="group-item">
            <label>买家手机：</label>
            <p>13359998653</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>买家微信：</label>
            <p>2412238455</p>
          </div>
          <div class="group-item">
            <label>买家QQ：</label>
            <p>丹青</p>
          </div>
          <div class="group-item">
            <label>申请时间：</label>
            <p>2019-01-01 12:23:23</p>
          </div>
        </div>
      </order-detail>
      <order-detail title="商品信息">
        <div class="group">
          <div class="group-item">
            <label>商品名称：</label>
            <p>34级-多个英雄-带6300英雄-好名字</p>
          </div>
          <div class="group-item">
            <label>游戏名称：</label>
            <p>王者荣耀</p>
          </div>
          <div class="group-item">
            <label>商品价格：</label>
            <p style="color:red">¥116.00</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>销售模式：</label>
            <p>寄售交易</p>
          </div>
          <div class="group-item">
            <label>游戏账号：</label>
            <p>abcd1234</p>
          </div>
          <div class="group-item">
            <label>游戏密码：</label>
            <p>1234567</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>绑定手机：</label>
            <p>1111</p>
          </div>
          <div class="group-item">
            <label>绑定邮箱：</label>
            <p>caijingdan@163.com</p>
          </div>
          <div class="group-item">
            <label>邮箱密码：</label>
            <p>1234567</p>
          </div>
        </div>
      </order-detail>
      <div class="complaintBtn">
        <el-button>拒绝处理</el-button>
        <el-button type="primary">同意处理</el-button>
      </div>
      <order-detail title="处理流程">
        <div class="timeLine">
          <el-timeline>
            <el-timeline-item>
              <p>操作时间：2020-04-05 12:10:09</p>
              <p>退款成功</p>
            </el-timeline-item>
            <el-timeline-item>
              <p>操作时间：2020-04-05 12:10:09</p>
              <p>k5电竞平台 同意申诉请求</p>
              <p>退您￥55.00元，将退回支付渠道</p>
            </el-timeline-item>
            <el-timeline-item>
              <p>操作时间：2020-04-05 12:10:09</p>
              <p>k5 拒绝售后申请</p>
              <p>拒绝理由：跟卖家沟通，卖家已提供密码，可登陆</p>
            </el-timeline-item>
          </el-timeline>
        </div>
      </order-detail>
    </div>
  </div>
</template>

<script>
import OrderDetail from '@/k5game/components/OrderDetail'
import productMixin from '../mixins/productMixin'
import productScrollMixin from '../mixins/productScrollMixin'
import config from '@/config'
export default {
  name: 'AccountProductDetail',
  components: { OrderDetail },
  mixins: [productMixin, productScrollMixin],
  data() {
    return {
      activeName: this.$route.query.activeName,
      rightKey: 0
    }
  },
  computed: {
    getGameName() {
      const list = this.$store.state.game.list
      let gameName = ''
      list.some(item => {
        if (item.id === this.dataInfo.gameId) {
          gameName = item.name
          return true
        }
      })
      return gameName
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
    .timeLine{
      margin-top: 10px;
      ul{
        padding: 0;
      }
      .el-timeline-item__node{
        border: 2px solid #108ee9;
        background: #fff;
      }
    }
  }
  }

  .complaintBtn{
    margin-bottom: 10px;
    button{
      margin-right: 10px;
    }
  }
}

</style>
