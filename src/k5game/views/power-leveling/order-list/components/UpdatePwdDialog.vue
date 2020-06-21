<template>
  <div>
    <el-dialog class="my-dialog" title="修改账号密码" :visible.sync="dialogFormVisible" @close="handleClose">
      <div>
        <el-form ref="ruleForm" :model="form" :rules="rules">
          <el-form-item label="新账号" prop="accountNum">
            <el-input v-model="form.accountNum" />
          </el-form-item>
          <el-form-item label="新密码" prop="accountPwd">
            <el-input v-model="form.accountPwd" />
          </el-form-item>
          <el-form-item label="代练押金" prop="powerLevelingAntecedentMoney">
            <el-input v-model="form.powerLevelingAntecedentMoney" />
          </el-form-item>
          <el-form-item label="代练佣金" prop="powerLevelingReward">
            <el-input v-model="form.powerLevelingReward" />
          </el-form-item>
          <el-form-item label="时间阶段" prop="dlStartTime">
            <el-select v-model="time" placeholder="请选择开始阶段">
              <el-option
                v-for="item in data"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="st值" prop="st">
            <el-input v-model="form.st" />
          </el-form-item>
          <el-form-item label="代练要求" prop="powerLevelingRequirement">
            <el-input v-model="form.powerLevelingRequirement" type="textarea" />
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
import * as hSDLAccInfoApi from '@/api/hSDLAccInfo'
export default {
  name: 'UpdatePwdDialog',
  mixins: [dialogMixin],
  data() {
    const validatePass2 = (rule, value, callback) => {
      if (!/((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/.test(value)) {
        callback(new Error('请输入正确数字'))
      } else {
        callback()
      }
    }
    return {
      time: '',
      data: [
        { label: '0-6', value: '0-6' },
        { label: '6-12', value: '6-12' },
        { label: '12-18', value: '12-18' },
        { label: '18-24', value: '18-24' }
      ],
      form: {},
      rules: {
        powerLevelingReward: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        powerLevelingAntecedentMoney: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    time(newValue) {
      if (newValue) {
        const list = newValue.split('-')
        this.form.dlStartTime = list[0]
        this.form.dlEndTime = list[1]
      }
    }
  },
  methods: {
    setValues(id) {
      this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
      this.form = {
        st: '',
        orderId: id,
        accountNum: '',
        accountPwd: '',
        dlStartTime: '',
        dlEndTime: '',
        powerLevelingRequirement: '',
        powerLevelingReward: null,
        powerLevelingAntecedentMoney: null
      }
    },
    submitClick() {
      console.log(this.form)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          hSDLAccInfoApi.UpdatePowerLeveling(this.form).then(res => {
            this.$message({
              message: '更新账号密码成功',
              type: 'success'
            })
            if (res.data.success) {
              this.$emit('onRefresh')
              this.handleClose()
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
