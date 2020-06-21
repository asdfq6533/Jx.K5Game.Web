<template>
  <el-dialog class="my-dialog" title="取消订单" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="订单号" prop="id">
          <el-input v-model="form.id" :readonly="true" />
        </el-form-item>
        <el-form-item label="下单人" prop="checkAccountUserName">
          <el-input v-model="form.checkAccountUserName" :readonly="true" />
        </el-form-item>
        <el-form-item label="已消耗kb" prop="spendKb">
          <div style="width: 100%;">
            <el-input-number v-model="form.spendKb" controls-position="right" :min="0" />
          </div>
        </el-form-item>
        <el-form-item label="取消原因" prop="cancelOrderReason">
          <el-input v-model="form.cancelOrderReason" type="textarea" />
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
export default {
  name: 'CancelOrderDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {},
      rules: {
        cancelOrderReason: [{ required: true, message: '请输入原因', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            orderId: this.form.id,
            spendKb: this.form.spendKb,
            cancelOrderReason: this.form.cancelOrderReason
          }
          powerLevelingApi.CancelOrder(params).then(res => {
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
    setValues(item) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      if (item) {
        this.form = JSON.parse(JSON.stringify(item))
      } else {
        this.form = {}
      }
    }
  }
}
</script>

<style scoped>

</style>
