<template>
  <div>
    <el-dialog class="my-dialog" title="指派打手" :visible.sync="dialogFormVisible" @close="handleClose">
      <div>
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item label="新账号" prop="accountNum">
            <el-input v-model="form.accountNum" />
          </el-form-item>
          <el-form-item label="新密码" prop="accountPwd">
            <el-input v-model="form.accountPwd" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="submitClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
export default {
  name: 'ResetTimeDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    setValues(row) {
      this.form = {
        orderId: ''
      }
    },
    submitClick() {
    }
  }
}
</script>

<style scoped>

</style>
