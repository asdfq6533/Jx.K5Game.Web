<template>
  <el-dialog title="销售订单" :visible.sync="dialogFormVisible" @close="handleClose">
    <div v-if="order.saleOrder">
      <ul class="text-ul">
        <li>
          <label>订单号</label>
          <el-input :value="order.id" readonly />
        </li>
        <li>
          <label>游戏名</label>
          <el-input :value="order.saleOrder.gameName" readonly />
        </li>
        <li>
          <label>卖方ID</label>
          <el-input :value="order.saleOrder.userId" readonly />
        </li>
        <li>
          <label>卖方昵称</label>
          <el-input :value="order.saleOrder.nickName" readonly />
        </li>
        <li>
          <label>卖方电话</label>
          <el-input :value="order.saleOrder.contact" readonly />
        </li>
        <li>
          <label>买方ID</label>
          <el-input :value="order.userId" readonly />
        </li>
        <li>
          <label>买方昵称</label>
          <el-input :value="order.nickName" readonly />
        </li>
        <li>
          <label>买方电话</label>
          <el-input :value="order.userContact" readonly />
        </li>
        <li>
          <label>账号名</label>
          <el-input :value="order.saleOrder.accountName" readonly />
        </li>
        <li>
          <label>账号价格</label>
          <el-input :value="order.purchasePrice" readonly />
        </li>
        <li>
          <label>游戏账号</label>
          <el-input :value="order.saleOrder.accountNumber" readonly />
        </li>
        <li>
          <label>游戏密码</label>
          <el-input :value="order.saleOrder.accountPassWord" readonly />
        </li>
        <li>
          <label>账号密保信息</label>
          <el-input :value="order.saleOrder.accountTheLock" readonly />
        </li>
      </ul>
      <ul class="text-ul2">
        <li><label>身份验证：</label>{{ order.saleOrder.authentication ? '是' : '否' }}</li>
        <li><label>邮箱验证：</label>{{ order.saleOrder.phoenValidation ? '是' : '否' }}</li>
        <li><label>手机验证：</label>{{ order.saleOrder.emailVaildation ? '是' : '否' }}</li>
      </ul>
      <ul class="text-ul">
        <li>
          <label>角色名</label>
          <el-input :value="order.saleOrder.roleName" readonly />
        </li>
        <li>
          <label>游戏区服</label>
          <el-input :value="order.saleOrder.gameArea" readonly />
        </li>
        <li>
          <label>联系方式</label>
          <el-input :value="order.saleOrder.contact" readonly />
        </li>
        <li>
          <label>在线时间</label>
          <el-input :value="order.saleOrder.onlineTime|timeFormat" readonly />
        </li>
      </ul>
      <div class="input-group">
        <label>商家描述</label>
        <el-input :value="order.saleOrder.description" readonly />
      </div>
      <div class="input-group">
        <label>退款金额</label>
        <el-input :value="order.saleOrder.theRefundAmount" readonly />
      </div>
      <div class="input-group img-group">
        <label>截图图片</label>
        <ul class="screenshots">
          <li v-for="(item, key) in order.saleOrder.screenshots" :key="key" class="box-img-center">
            <img :src="getRealPictureUrl(item.url)" alt="">
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as accountTransactionApi from '@/api/account-transaction'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import config from '@/config'
export default {
  name: 'DetailDialog',
  mixins: [dialogMixin],
  data() {
    return {
      order: {}
    }
  },
  methods: {
    getRealPictureUrl(url) {
      return config.baseUrl + config.pictureUrl + url
    },
    setValues(item) {
      accountTransactionApi.GetPurchaseAccountTransactiondetails({ id: item.id }).then(res => {
        this.order = res.data.result
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.text-ul{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  li{
    width: 48%;
    list-style-type: none;
    display: flex;
    align-items: center;
    margin: 10px 10px 0 0;
    label{
      width: 120px;
    }
    p {
      margin-left: 10px;
    }
  }
}
.text-ul2{
  display: flex;
  li{
    margin-right: 20px;
    list-style-type: none;
  }
}
.input-group{
  display: flex;
  align-items: center;
  padding: 0 15px 0 40px;
  margin-bottom: 20px;
  label{
    width: 85px;
  }
}

.img-group{
  align-items: flex-start;
  .screenshots{
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    li {
      list-style-type: none;
      width: 100px;
      height: 100px;
      margin: 0 20px 20px 0;
      img{
        max-width: 100%;
      }
    }
  }
}

</style>
