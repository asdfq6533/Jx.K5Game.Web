<template>
  <el-dialog title="取消仲裁" :visible.sync="dialogFormVisible" @close="handleClose">
    <el-form ref="ruleForm" :model="form" style="max-width: 800px">
      <el-form-item label="订单号" :label-width="formLabelWidth" prop="id">
        <el-input v-model="form.id" placeholder="请输入订单号" :readonly="true" />
      </el-form-item>
      <el-form-item label="取消原因" :label-width="formLabelWidth" prop="reason">
        <el-input v-model="form.reason" type="textarea" placeholder="请输入取消原因" />
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
  name: 'ToNormalPurchaseOrderDialog',
  mixins: [dialogMixin],
  data() {
    return {
      formLabelWidth: '120px',
      form: {
        id: '',
        reason: ''
      }
    }
  },
  methods: {
    submitClick() {
      accountTransactionApi.ToNormalPurchaseOrder(this.form).then(res => {
        if (res.data.success) {
          this.dialogFormVisible = false
          this.$emit('onRefresh')
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    setValues(item) {
      console.log(item)
      this.form = {
        id: '',
        reason: ''
      }
      if (item) {
        this.form.id = item.id
        this.form.reason = item.feedBack
      }
    }
  }
}
</script>

<style scoped>

</style>
