<template>
  <el-dialog class="my-dialog" title="上架代练" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" :readonly="true" />
        </el-form-item>
        <el-form-item label="用户付款" prop="orderAmount">
          <el-input v-model="form.orderAmount" :readonly="true" />
        </el-form-item>
        <el-form-item label="代练押金" prop="powerLevelingAntecedentMoney">
          <el-input-number v-model="form.powerLevelingAntecedentMoney" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="代练佣金" prop="powerLevelingReward">
          <el-input-number v-model="form.powerLevelingReward" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="发布到内部" prop="isInternalGold">
          <el-switch
            v-model="form.isInternalGold"
          />
        </el-form-item>
        <el-form-item label="代练要求" prop="PowerLevelingRequirement">
          <el-input v-model="form.PowerLevelingRequirement" type="textarea" />
        </el-form-item>
        <el-form-item label="代练需求信息" prop="jsonOrderOnlyRead" style="min-width: 400px">
          <full-tag
            ref="fullTag3"
            :tag-list="fullTagList"
            @onUpdate="fullCanUpdate"
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as powerLevelingApi from '@/api/powerLeveling'
import FullTag from './FullTag'

const luShiList = [
  {
    text: '代练金币',
    disabled: true
  },
  {
    text: '友谊赛场次',
    disabled: true
  },
  {
    text: '代练时间段',
    // type: 'Select',
    disabled: true
    // data: [
    //   { label: '0-6', value: '0-6' },
    //   { label: '6-12', value: '6-12' },
    //   { label: '12-18', value: '12-18' },
    //   { label: '18-24', value: '18-24' }
    // ]
  },
  {
    text: '金币单价',
    disabled: true
  }
]
export default {
  name: 'PutawayOrderDialog',
  components: { FullTag },
  mixins: [dialogMixin],
  data() {
    return {
      fullTagList: luShiList,
      form: {
        isInternalGold: false,
        jsonOrderOnlyRead: '{}',
        PowerLevelingRequirement: ''
      },
      rules: {
        PowerLevelingRequirement: [{ required: true, message: '请输入代练要求', trigger: 'blur' }]
        // powerLevelingRequirement: [{ required: true, message: '请输入代练佣金', trigger: 'blur' }]
      }
    }
  },
  watch: {
    isShow(newValue) {
      this.dialogFormVisible = newValue
      if (newValue) {
        setTimeout(() => {
          const obj = {}
          luShiList.map(item => {
            obj[item.text] = ''
          })
          this.$refs.fullTag3.setValues(JSON.stringify(obj))
        }, 200)
      }
    }
  },
  methods: {
    fullCanUpdate(fullObj) {
      const fullString = JSON.stringify(fullObj).toString()
      this.form.jsonOrderOnlyRead = fullString
    },
    submitClick() {
      if (this.validatePrice()) {
        return
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          powerLevelingApi.PutawayAppOrder(this.form).then(res => {
            if (res.data.success) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('onRefresh')
              this.close()
            }
          })
        }
      })
    },
    // 验证代练金币乘以金币单价不能超过支付金额
    validatePrice() {
      const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
      const obj = JSON.parse(this.form.jsonOrderOnlyRead)
      const coin1 = obj['代练金币'] || 0
      const coin2 = obj['金币单价'] || 0

      if (coin1 && coin2 && this.form.payAmount) {
        if (!priceReg.test(coin1) && !priceReg.test(coin2)) {
          this.$message({
            message: '代练金币或金币单价必须是数字',
            type: 'error'
          })
          return false
        } else if (this.form.payAmount < (Number(coin1) * Number(coin2))) {
          this.$message({
            message: '代练金币乘以金币单价不能超过支付金额',
            type: 'error'
          })
          return false
        }
      }
    },
    setValues(item) {
      if (item) {
        const order = JSON.parse(JSON.stringify(item))
        this.form.orderId = order.id
        this.form.orderAmount = order.orderAmount
        this.form.PowerLevelingRequirement = order.productTitle
        // this.form.isInternalGold = order.isInternalGold
        // this.form.powerLevelingAntecedentMoney,
        // this.form.powerLevelingReward,
        // this.form.powerLevelingRequirement,
        // this.form.isInternalGold
      } else {
        this.form = {}
      }
      //  this.form.isInternalGold = true
    }
  }
}
</script>

<style scoped>

</style>
