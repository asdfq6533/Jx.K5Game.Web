<template>
  <el-dialog class="my-dialog" title="转换问题单" :visible.sync="dialogFormVisible" @close="handleClose">
    <el-form ref="ruleForm" :model="form">
      <el-form-item label="订单号" :label-width="formLabelWidth" prop="accountName">
        <el-input v-model="form.id" placeholder="请输入订单号" :readonly="true" />
      </el-form-item>
      <el-form-item label="取消原因" :label-width="formLabelWidth" prop="accountName">
        <el-input v-model="form.arbitrationReason" placeholder="请输入取消原因" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'ToArbitrationOrderDialog',
  mixins: [dialogMixin],
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        id: '',
        arbitrationReason: ''
      }
    }
  },
  methods: {
    submitClick() {
      accountTransactionApi.ToArbitrationOrder(this.form).then(res => {
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
      if (item) {
        this.form.id = item.id
      }
    }
  }
}
</script>

<style scoped>

</style>
