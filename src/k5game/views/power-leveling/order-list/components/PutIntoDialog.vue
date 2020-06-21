<template>
  <el-dialog class="my-dialog" title="充值" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :model="form">
        <el-form-item :label="type === 'friendly'? '充值场次' :'充值金额'" prop="oldPrice">
          <el-input v-if="type === 'friendly'" v-model="form.count" style="max-width: 600px" />
          <el-input v-if="type === 'wechat' || type === 'aliPay'" v-model="form.amount" style="max-width: 600px" />
        </el-form-item>
      </el-form>
    </div>
    <div v-if="pic">
      <p>支付价格：{{ form.amount }}元 获得虚拟币:{{ form.amount }}K币</p>
      <img :src="pic" class="qrcode">
      <p>{{ type === 'wechat' ? '微信': '支付宝' }}扫码支付完成后请刷新页面</p>
    </div>
    <div v-if="aliPayHtml">
      <iframe id="body___Frame" scrolling="auto" frameborder="0" align="middle" :v-html="aliPayHtml" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as userCoinOrderApi from '@/api/user-coin-order'
export default {
  name: 'PutIntoDialog',
  mixins: [dialogMixin],
  data() {
    return {
      type: '',
      form: {},
      pic: '',
      aliPayHtml: ''
    }
  },
  methods: {
    close() {
      this.dialogFormVisible = false
    },
    submitClick() {
      switch (this.type) {
        case 'wechat':
          this.putIntoWechat()
          break
        case 'aliPay':
          this.putIntoAliPay()
          break
        case 'friendly':
          this.putIntoFriendly()
          break
      }
    },
    setValues(type) {
      this.form = {}
      this.type = type
      this.pic = ''
    },
    putIntoWechat() {
      userCoinOrderApi.CreateRechargeOrderDashboard(this.form).then(res => {
        const result = res.data.result
        const params = {
          orderId: result.rechargeOrderId,
          paymentMethod: '微信二维码'
        }
        userCoinOrderApi.Create(params).then(res => {
          this.pic = res.data.result
        })
      })
    },
    putIntoFriendly() {
      userCoinOrderApi.CreateMatchRechargeOrder(this.form).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('onRefresh')
          this.close()
        }
      })
    },
    putIntoAliPay() {
      userCoinOrderApi.CreateRechargeOrderDashboard(this.form).then(res => {
        const result = res.data.result
        const params = {
          orderId: result.rechargeOrderId,
          paymentMethod: '支付宝网站'
        }
        userCoinOrderApi.Create(params).then(res => {
          const formData = res.data.result
          const routerData = this.$router.resolve({ name: 'orderApplyText', query: { htmls: formData }})
          window.open(routerData.href, '_blank')
          // const formData = res.data.result
          // this.aliPayHtml = formData.slice(0, 5) + ' target="AlipayHtmlHide"' + formData.slice(5)
          // setTimeout(() => {
          //   window.document.querySelector('#body___Frame').contentDocument.forms.alipaysubmit.submit()
          // }, 300)
          // $("#AlipayHtmlHide").html(resultWindow)
          // const div = document.createElement('div')
          // div.innerHTML = formData
          // document.body.append(div)
          // document.forms.alipaysubmit.submit()
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.qrcode{
  width: 150px;
}
/deep/.el-dialog{
  max-width: 800px;
}
</style>
