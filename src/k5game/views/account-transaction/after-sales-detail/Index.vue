<template>
  <div class="page-content">
    <div class="orderDetail">
      <order-detail title="售后信息">
        <div class="group">
          <div class="group-item">
            <label>售后单号：</label>
            <p style="color:red">{{ detail.id }}</p>
          </div>
          <div class="group-item">
            <label>订单编号：</label>
            <p>{{ detail.orderId }}</p>
          </div>
          <div class="group-item">
            <label>售后状态：</label>
            <p style="color:red">{{ detail.orderStatus }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>卖家：</label>
            <p>{{ saller.nickName }}</p>
          </div>
          <div class="group-item">
            <label>卖家手机号：</label>
            <p>{{ saller.phoneNumber }}</p>
          </div>
          <div class="group-item">
            <label>卖家微信号：</label>
            <p>{{ saller.wx }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>卖家QQ：</label>
            <p>{{ saller.qq }}</p>
          </div>
          <div class="group-item">
            <label>买家：</label>
            <p>{{ user.nickName }}</p>
          </div>
          <div class="group-item">
            <label>买家手机：</label>
            <p>{{ orderInfo.userContact }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>买家微信：</label>
            <p>{{ orderInfo.wechat }}</p>
          </div>
          <div class="group-item">
            <label>买家QQ：</label>
            <p>{{ orderInfo.qq }}</p>
          </div>
          <div class="group-item">
            <label>申请时间：</label>
            <p>{{ detail.creationTime | timeFormatNotUtc }}</p>
          </div>
        </div>
      </order-detail>
      <order-detail title="商品信息">
        <div class="group">
          <div class="group-item">
            <label>商品名称：</label>
            <p>{{ commodityTable.title }}</p>
          </div>
          <div class="group-item">
            <label>游戏名称：</label>
            <p>{{ getGameName }}</p>
          </div>
          <div class="group-item">
            <label>商品价格：</label>
            <p style="color:red">{{ '¥' + commodityTable.price }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>销售模式：</label>
            <p>{{ commodityTable.saleMode }}</p>
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
          <div v-if="saleAccountTable.isBindPhone" class="group-item">
            <label>绑定手机：</label>
            <p>{{ sensInfo.bindPhone }}</p>
          </div>
          <div v-if="saleAccountTable.isBindEmail" class="group-item">
            <label>绑定邮箱：</label>
            <p>{{ sensInfo.bindEmail }}</p>
          </div>
          <!-- <div class="group-item">
            <label>邮箱密码：</label>
            <p>1234567</p>
          </div> -->
        </div>
      </order-detail>
      <div v-if="detail.status === 3" class="complaintBtn">
        <el-button @click="refuse">拒绝处理</el-button>
        <el-button type="primary" @click="agree">同意处理</el-button>
      </div>
      <order-detail title="处理流程">
        <div class="timeLine">
          <el-timeline>
            <el-timeline-item v-for="item in logList" :key="item.id">
              <li>操作时间：{{ item.creationTime | timeFormatNotUtc }}</li>
              <li>{{ item.option }}</li>
              <li v-if="item.IsAgreed">{{ item.IsAgreed + '：' + item.result }}</li>
              <li>{{ item.remark }}</li>
              <li v-if="item.imgPath && item.imgPath.length">
                <p>申请图片：</p>
                <div class="imgList">
                  <el-image
                    v-for="(it,index) in item.imgPath"
                    :key="index"
                    :src="it"
                    :preview-src-list="item.imgPath"
                  />
                  <!-- <img v-for="(it,index) in item.imgPath" :key="index" :src="imgBase + it" alt=""> -->
                  <!-- <img src="@/assets/images/K5game.png" alt=""> -->
                </div>
              </li>
            </el-timeline-item>
          </el-timeline>
        </div>
      </order-detail>
    </div>
    <tips-dialog
      v-model="isDialogShow"
      :title="title"
      @onRefresh="getProductDetail"
      @submit="submit"
    >
      <div>
        <el-form ref="form" :model="form">
          <div v-if="title === '处理说明'">
            <el-form-item>
              <span class="star">* </span> <label> 订单金额</label>
              <p>{{ '￥' + commodityOrderTable.amount }}</p>
            </el-form-item>
            <el-form-item>
              <span class="star">*</span> <label> 买家</label>
              <el-input v-model="form.userKB" placeholder="输入给买家分配的金额" />
            </el-form-item>
            <el-form-item>
              <span class="star">* </span><label> 卖家</label>
              <el-input v-model="form.bizKB" placeholder="输入给卖家分配的金额" />
            </el-form-item>
            <el-form-item>
              <span class="star">* </span><label> 平台</label>
              <el-input v-model="form.systemKB" placeholder="输入给平台分配的金额" />
            </el-form-item>
          </div>
          <el-form-item v-else>
            <el-input
              v-model.trim="form.result"
              type="textarea"
              :autosize="{ minRows: 2}"
              placeholder="请输入处理说明，最多100字"
              maxlength="100"
            />
          </el-form-item>
        </el-form>
      </div>
    </tips-dialog>
  </div>
</template>

<script>
import OrderDetail from '@/k5game/components/OrderDetail'
import * as accountTransactionApi from '@/api/account-transaction'
import TipsDialog from '@/k5game/components/TipsDialog'
import config from '@/config'
export default {
  name: 'Index',
  components: { OrderDetail, TipsDialog },
  data() {
    return {
      orderInfo: '',
      isDialogShow: false,
      commodityOrderTable: '',
      title: '',
      form: {
        id: '',
        bizKB: '',
        userKB: '',
        systemKB: '',
        isAgree: true,
        result: ''
      },
      detail: '',
      user: '',
      commodityTable: '',
      saleAccountTable: '',
      sensInfo: '',
      status: [
        {
          id: -1,
          name: '已取消'
        },
        {
          id: 0,
          name: '待处理'
        },
        {
          id: 1,
          name: '已处理'
        },
        {
          id: 2,
          name: '已拒绝'
        },
        {
          id: 3,
          name: '客服介入(待处理)'
        },
        {
          id: 4,
          name: '已完成'
        },
        {
          id: '',
          name: '全部'
        }
      ],
      logList: [],
      saller: '',
      imgBase: ''
    }
  },
  computed: {
    getGameName() {
      const list = this.$store.state.game.list
      let gameName = ''
      list.some(item => {
        if (item.id === this.saleAccountTable.gameId) {
          gameName = item.name
          return true
        }
      })
      return gameName
    }
  },
  created() {
    this.getProductDetail()
    this.imgBase = config.baseUrl + config.pictureUrl
  },
  mounted() {
    if (this.$store.state.game.list.length === 0) {
      this.$store.dispatch('game/getList')
    }
  },
  methods: {
    getProductDetail() {
      // 订单详情
      accountTransactionApi.GetCustomerServiceOrderDetailsAysnc({ id: this.$route.query.id }).then(res => {
        // eslint-disable-next-line no-empty
        if (res.data.success) {
          this.detail = res.data.result
          this.orderInfo = JSON.parse(this.detail.commodityOrderTable.orderInfo)
          this.commodityOrderTable = this.detail.commodityOrderTable
          this.commodityTable = this.detail.commodityOrderTable.commodityTable
          this.saleAccountTable = this.detail.commodityOrderTable.saleAccountTable
          this.user = this.detail.user
          this.sensInfo = JSON.parse(this.saleAccountTable.sensInfo)
          this.saller = this.detail.saller
          this.status.some(item => {
            if (this.detail.status === item.id) {
              this.$set(this.detail, 'orderStatus', item.name)
            }
          })
          this.getlogs()
        }
      })
    },
    getlogs() {
      // 日志列表
      accountTransactionApi.GetOrderLogAsync({ id: this.detail.orderId }).then(res => {
        // eslint-disable-next-line no-empty
        if (res.data.success) {
          this.logList = res.data.result
          this.logList.some(item => {
            if (item.remark.indexOf('{') > -1) {
              const json = JSON.parse(item.remark)
              console.log(json)
              const img = []
              if (json.Image1) {
                img.push(this.imgBase + json.Image1)
              }
              if (json.Image2) {
                img.push(this.imgBase + json.Image2)
              }
              if (json.Image3) {
                img.push(this.imgBase + json.Image3)
              }
              if (json.IsAgreed) {
                const IsAgreed = json.IsAgreed === 'False' ? '卖家已拒绝售后处理' : '卖家已同意售后处理'
                console.log(IsAgreed)
                this.$set(item, 'IsAgreed', IsAgreed)
              }
              if (json.Result) {
                const result = json.Result
                this.$set(item, 'result', result)
              }
              this.$set(item, 'remark', json.Remark || json.remark)
              this.$set(item, 'imgPath', img)
            }
          })
        }
      })
    },
    agree() {
      this.title = '处理说明'
      this.isDialogShow = true
      this.form.id = this.detail.id
      this.form.isAgree = true
    },
    refuse() {
      this.title = '拒绝处理说明'
      this.form.id = this.detail.id
      this.isDialogShow = true
      this.form.isAgree = false
      this.form.bizKB = 0
      this.form.userKB = 0
      this.form.systemKB = 0
    },
    submit(value) {
      console.log(this.form)
      if (this.title === '处理说明') {
        const reg = /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/
        if (!this.form.userKB) {
          this.$message.error('请输入给买家分配的金额')
          return
        }
        if (!reg.test(this.form.userKB)) {
          this.$message.error('给买家分配的金额请输入大于0的数字，最多保留两位小数')
          return
        }
        if (!this.form.bizKB) {
          this.$message.error('请输入给卖家分配的金额')
          return
        }
        if (!reg.test(this.form.bizKB)) {
          this.$message.error('给卖家分配的金额请输入大于0的数字，最多保留两位小数')
          return
        }
        if (!this.form.systemKB) {
          this.$message.error('请输入给平台分配的金额')
          return
        }
        if (!reg.test(this.form.systemKB)) {
          this.$message.error('给平台分配的金额请输入大于0的数字，最多保留两位小数')
          return
        }
        console.log(this.form.bizKB, this.form.userKB, this.form.systemKB, this.commodityOrderTable.amount)
        if (Number(this.form.bizKB) + Number(this.form.userKB) + Number(this.form.systemKB) !== Number(this.commodityOrderTable.amount)) {
          this.$message.error('分配的金额总数应等于订单金额')
          return
        }
      } else if (this.title === '拒绝处理说明') {
        if (!this.form.result) {
          this.$message.error('处理说明不能为空')
          return
        }
      }
      // this.form.bizKB = Number(this.form.bizKB)
      // this.form.userKB = Number(this.form.userKB)
      // this.form.systemKB = Number(this.form.systemKB)
      accountTransactionApi.SolveTroubleOrderAsync(this.form).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.isDialogShow = false
          this.getProductDetail()
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
.el-form-item__content{
  display: flex;
  .star{
    margin-right: 5px;
    color: red;
  }
  p{
    padding-left: 5px;
    color: red;
  }
  label{
    width: 60px;
    margin-right: 15px;
    height: 35px;
    line-height: 35px;
    text-align: justify;
    flex-shrink: 0;
  }
  label:after {
    content: " ";
    display: inline-block;
    width: 100%;
}
}
.imgList{
  .el-image{
    .el-image__inner{
      height: 60px;
      width: 80px;
      margin-right: 10px;
    }
  }
}
</style>
