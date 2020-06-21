<template>
  <el-dialog title="仲裁订单" :visible.sync="dialogFormVisible" @close="handleClose">
    <el-form ref="ruleForm" :rules="rules" :model="form">
      <el-form-item label="订单编号" :label-width="formLabelWidth" prop="Id">
        <el-input v-model="form.Id" :readonly="true" />
      </el-form-item>
      <el-form-item label="订单总价" :label-width="formLabelWidth" prop="PurchaserCoin">
        <el-input v-model="totalPrice" :readonly="true" />
      </el-form-item>
      <el-form-item label="买方获利" :label-width="formLabelWidth" prop="PurchaserCoin">
        <el-input-number v-model="form.PurchaserCoin" controls-position="right" :min="0" :max="1000000000" />
      </el-form-item>
      <el-form-item label="卖方获利" :label-width="formLabelWidth" prop="PurchaserCoin">
        <el-input-number v-model="form.SellerCoin" controls-position="right" :min="0" :max="1000000000" />
      </el-form-item>
      <el-form-item label="系统账户获利" :label-width="formLabelWidth" prop="PurchaserCoin">
        <el-input-number v-model="form.SystemGetCoin" controls-position="right" :min="0" :max="1000000000" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as accountTransactionApi from '@/api/account-transaction'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
export default {
  name: 'ArbitrationDialog',
  mixins: [dialogMixin],
  data() {
    return {
      formLabelWidth: '100px',
      form: {
        PurchaserCoin: '',
        SellerCoin: '',
        SystemGetCoin: ''
      },
      rules: {},
      totalPrice: 0
    }
  },
  methods: {
    submitClick() {
      this.dialogFormVisible = false
      accountTransactionApi.Arbitration(this.form).then(res => {
        if (res.data.success) {
          this.$emit('onRefresh')
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    setValues(item) {
      this.form.Id = item.id
      this.totalPrice = item.purchasePrice
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
