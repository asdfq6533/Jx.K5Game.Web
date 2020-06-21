<template>
  <el-dialog title="产品详情" :visible.sync="dialogFormVisible" @close="handleClose">
    <div class="package-div">
      <label>游戏标签</label>
      <ul class="account-package">
        <li v-for="(item, key) in packageDto" :key="key">
          <p>{{ item.accountPackageName }}</p>
        </li>
      </ul>
    </div>
    <ul class="text-ul">
      <li>
        <label>游戏名</label>
        <el-input :value="account.gameName" readonly />
      </li>
      <li>
        <label>订单号</label>
        <el-input :value="account.id" readonly />
      </li>
      <li>
        <label>卖方昵称</label>
        <el-input :value="account.nickName" readonly />
      </li>
      <li>
        <label>卖方ID</label>
        <el-input :value="account.userId" readonly />
      </li>
      <li>
        <label>账号名</label>
        <el-input :value="account.accountName" readonly />
      </li>
      <li>
        <label>游戏账号</label>
        <el-input :value="account.accountNumber" readonly />
      </li>
      <li>
        <label>账号价格</label>
        <el-input :value="account.accountPrice" readonly />
      </li>
      <li v-if="roleType === 2">
        <label>成本价格</label>
        <el-input :value="account.costPrice" readonly />
      </li>
      <li>
        <label>折扣价</label>
        <el-input :value="account.discountedPrice" readonly />
      </li>
      <li>
        <label>游戏密码</label>
        <el-input :value="account.accountPassWord" readonly />
      </li>
      <li>
        <label>账号保密信息</label>
        <el-input :value="account.accountTheLock" readonly />
      </li>
    </ul>
    <ul class="text-ul2">
      <li><label>身份验证：</label>{{ account.authentication ? '是' : '否' }}</li>
      <li><label>邮箱验证：</label>{{ account.phoenValidation ? '是' : '否' }}</li>
      <li><label>手机验证：</label>{{ account.emailVaildation ? '是' : '否' }}</li>
    </ul>
    <ul class="text-ul">
      <li>
        <label>角色名</label>
        <el-input :value="account.roleName" readonly />
      </li>
      <li>
        <label>游戏区服</label>
        <el-input :value="account.gameArea" readonly />
      </li>
      <li>
        <label>联系方式</label>
        <el-input :value="account.contact" readonly />
      </li>
      <li>
        <label>在线时间</label>
        <el-input :value="account.onlineTime " readonly />
      </li>
      <li v-if="false">
        <label>上架周期</label>
        <el-input :value="account.accountOnCycle " readonly />
      </li>
    </ul>
    <div class="text-div description">
      <label>商家描述</label>
      <el-input type="textarea" :value="account.description" readonly />
    </div>
    <div class="text-div">
      <label>图片</label>
      <ul class="screenshots">
        <li v-for="(item, key) in account.screenshots" :key="key" class="box-img-center">
          <img :src="getRealPictureUrl(item.url)" alt="">
        </li>
      </ul>
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
import { mapGetters } from 'vuex'
export default {
  name: 'AccountDetailDialog',
  mixins: [dialogMixin],
  data() {
    return {
      account: {},
      packageDto: {}
    }
  },
  computed: {
    ...mapGetters(['roleType'])
  },
  methods: {
    getRealPictureUrl(url) {
      return config.baseUrl + config.pictureUrl + url
    },
    setValue(item) {
      accountTransactionApi.GetSaleAccountTransactionsdetailsManagement({ id: item.id }).then(res => {
        this.account = res.data.result.saleAccount
        this.packageDto = res.data.result.packageDto
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";
.package-div{
  padding: 0;
  display: flex;
  align-items: center;
  margin-left: 40px;
  ul {
    padding: 0;
    margin: 0 0 0 20px ;
    li{
      padding: 0 5px;
      line-height: 0;
      border: 1px solid $menuActiveText;
    }
  }
}
.account-package{
  display: flex;
  flex-wrap: wrap;
  & > li{
    margin-right: 10px;
    list-style-type: none;
  }
}
.text-ul{
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  & > li{
    width: 48%;
    list-style-type: none;
    display: flex;
    align-items: center;
    line-height: 0;
    margin: 10px 10px 0 0;
    label{
      width: 120px;
      line-height: normal;
    }
    p {
      margin-left: 10px;
    }
  }
}
.text-div{
  padding: 0 0 0 40px;
  display: flex;
  margin-top: 10px;
  label{
    width: 100px;
  }
}
.text-ul2{
  display: flex;
  & > li{
    margin-right: 20px;
    list-style-type: none;
  }
}
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
</style>
