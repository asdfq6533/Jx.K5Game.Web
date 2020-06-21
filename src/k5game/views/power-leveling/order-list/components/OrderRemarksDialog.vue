<template>
  <el-dialog class="my-dialog" title="订单备注" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="订单号" prop="id">
          <el-input v-model="form.id" :readonly="true" />
        </el-form-item>
        <el-form-item label="订单备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
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
  name: 'OrderRemarksDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {},
      rules: {
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      }
    }
  },
  methods: {
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const params = {
            orderId: this.form.id,
            remark: this.form.remark
          }
          powerLevelingApi.AddOrderRemark(params).then(res => {
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
