<template>
  <el-dialog class="my-dialog" title="修改订单账号信息" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :rules="rules" :model="form">
        <el-form-item label="订单号" prop="orderId">
          <el-input v-model="form.orderId" :readonly="true" />
        </el-form-item>
        <el-form-item label="代练账号" prop="accountNum">
          <el-input v-model="form.accountNum" />
        </el-form-item>
        <el-form-item label="账号密码" prop="accountPwd">
          <el-input v-model="form.accountPwd" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitClick">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  name: 'EditOrderAccountDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    submitClick() {
      powerLevelingApi.UpdateAccountPwd(this.form).then(res => {
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
    setValues(item) {
      if (item) {
        this.form = {
          orderId: item.id,
          accountNum: item.accountNum,
          accountPwd: item.accountPwd
        }
        this.getOrderPwd(item.id)
      } else {
        this.form = {}
      }
    },
    getOrderPwd(id) {
      powerLevelingApi.GetPowerLevelingPwd({ id: id }).then(res => {
        const result = res.data.result
        this.form.accountNum = result.accountNum
        this.form.accountPwd = result.accountPwd
        this.form.safetyLock = res.safetyLock
      })
    }
  }
}
</script>

<style scoped>

</style>
