<template>
  <el-dialog class="my-dialog" title="修改订单价格" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :rules="rules" :model="form">
        <el-form-item label="订单号" prop="OrderId">
          <el-input v-model="form.OrderId" />
        </el-form-item>
        <el-form-item label="原价格" prop="oldPrice">
          <el-input v-model="form.oldPrice" :readonly="true" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" />
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
  name: 'EditOrderPriceDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {},
      rules: {}
    }
  },
  methods: {
    submitClick() {
      powerLevelingApi.ChangePrice(this.form).then(res => {
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
          OrderId: item.id,
          oldPrice: item.orderAmount,
          price: ''
        }
      } else {
        this.form = {}
      }
    }
  }
}
</script>

<style scoped>

</style>
