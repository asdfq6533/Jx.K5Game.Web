<template>
  <el-dialog
    class="my-dialog"
    title="审核不通过"
    :visible.sync="dialogFormVisible"
    @close="handleClose"
  >
    <el-form ref="ruleForm" :model="form">
      <el-form-item label="订单号" :label-width="formLabelWidth" prop="accountName">
        <el-input v-model="form.id" placeholder="请输入订单号" :readonly="true" />
      </el-form-item>
      <el-form-item label="取消原因" :label-width="formLabelWidth" prop="accountName">
        <el-input v-model="form.cancelTheReason" placeholder="请输入取消原因" />
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
  name: 'AccountAuditDialog',
  mixins: [dialogMixin],
  data() {
    return {
      isBatch: false,
      form: {},
      formLabelWidth: '100px'
    }
  },
  methods: {
    setValue(item, isThrough, cancelTheReason) {
      this.form = {
        id: item.id,
        isThrough: isThrough,
        cancelTheReason: cancelTheReason
      }
    },
    submitClick() {
      if (!this.form.isThrough) {
        const params = {
          order: [
            this.form
          ]
        }
        accountTransactionApi.UpdateAccountTransactionStatus(params).then(res => {
          if (res.data.success) {
            this.$emit('onRefresh')
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.close()
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
