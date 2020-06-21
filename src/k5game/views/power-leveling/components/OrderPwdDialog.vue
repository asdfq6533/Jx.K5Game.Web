<template>
  <el-dialog title="查看订单账号密码" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :model="form">
        <el-form-item label="订单号" prop="OrderId">
          <el-input v-model="form.id" :readonly="true" />
        </el-form-item>
        <el-form-item label="代练账号" prop="oldPrice">
          <el-input v-model="form.accountNum" :readonly="true" />
        </el-form-item>
        <el-form-item label="账号密码" prop="price" :readonly="true">
          <el-input v-model="form.accountPwd" />
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  name: 'OrderPwdDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {}
    }
  },
  methods: {
    setValues(id) {
      if (id) {
        this.getPwd(id)
      } else {
        this.form = {}
      }
    },
    getPwd(id) {
      powerLevelingApi.GetPowerLevelingPwd({ id: id }).then(res => {
        this.form = res.data.result
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
