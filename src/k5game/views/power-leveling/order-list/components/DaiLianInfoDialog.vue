<template>
  <div>
    <el-dialog class="my-dialog" title="代练审核" :visible.sync="dialogFormVisible" @close="handleClose">
      <el-form ref="ruleForm" :model="form">
        <el-form-item label="订单号" prop="accountNum">
          <el-input :readonly="true" :value="form.powerLevelingId" />
        </el-form-item>
        <el-form-item label="是否完成" prop="taoBaoOrderId">
          <el-switch v-model="form.isAchieve" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="submitClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  name: 'DaiLianInfoDialog',
  mixins: [dialogMixin],
  data() {
    return {
      list: [],
      form: {
        powerLevelingId: '',
        isAchieve: true
      }
    }
  },
  methods: {
    submitClick() {
      powerLevelingApi.CheckIsAchievePowerLeveling(this.form).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('onRefresh')
          this.handleClose()
        }
      })
    },
    setValues(row) {
      this.form = {
        powerLevelingId: row,
        isAchieve: true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-dialog {
    /deep/ .el-dialog {
      max-width: 1100px;
    }
  }
</style>
