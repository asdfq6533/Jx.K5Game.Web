<template>
  <el-dialog class="my-dialog" title="查看订单信息" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :model="form">
        <el-form-item label="代练状态" prop="oldPrice">
          <el-input v-model="form.powerLevelingStatusName" :readonly="true" />
        </el-form-item>
        <el-form-item label="代练押金" prop="price">
          <el-input v-model="form.powerLevelingAntecedentMoney" :readonly="true" />
        </el-form-item>
        <el-form-item label="代练佣金" prop="price">
          <el-input v-model="form.powerLevelingReward" :readonly="true" />
        </el-form-item>
        <el-form-item label="代练要求" prop="price">
          <el-input v-model="form.powerLevelingRequirement" type="textarea" :readonly="true" />
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  name: 'OrderInfoDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {}
    }
  },
  methods: {
    setValues(item) {
      this.form = {}
      powerLevelingApi.GetPowerLevelingList({ orderId: item.id }).then(res => {
        const items = res.data.result.items
        if (items.length) {
          this.form = items[0]
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
