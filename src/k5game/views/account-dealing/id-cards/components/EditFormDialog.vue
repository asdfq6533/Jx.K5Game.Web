<template>
  <el-dialog
    title="修改"
    :visible.sync="dialogFormVisible"
    @close="handleClose"
  >
    <el-form ref="ruleForm" :rules="rules" :model="form">
      <el-form-item label="手机号" :label-width="formLabelWidth" prop="phoneNumber">
        <el-input v-model="form.phoneNumber" placeholder="请输入手机号" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as accountNameAuthApi from '@/api/accountNameAuth'
export default {
  name: 'EditFormDialog',
  props: {
    isShow: Boolean
  },
  data() {
    const phoneValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
    }
    return {
      formLabelWidth: '100px',
      dialogFormVisible: false,
      form: {},
      rules: {
        phoneNumber: { validator: phoneValidate, trigger: 'blur' }
      }
    }
  },
  watch: {
    isShow(newValue) {
      this.dialogFormVisible = newValue
    }
  },
  methods: {
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          accountNameAuthApi.UpdateAccountNameAuth(this.form).then(res => {
            if (res.data.success) {
              this.$emit('onRefresh')
              this.dialogFormVisible = false
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            }
          })
        }
      })
    },
    setValues(item) {
      const data = JSON.parse(JSON.stringify(item))
      this.form = {
        id: data.id,
        phoneNumber: data.phoneNumber
      }
    },
    handleClose() {
      this.$emit('onClose')
    }
  }
}
</script>

<style scoped>

</style>
