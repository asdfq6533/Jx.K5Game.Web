<template>
  <el-dialog class="my-dialog" :title="form.id ? '修改代练产品': '添加代练产品'" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :rules="rules" :model="form">
        <el-form-item label="标题" prop="productTitle">
          <el-input v-model="form.productTitle" />
        </el-form-item>
        <el-form-item label="代练产品介绍" prop="productAbstract">
          <el-input v-model="form.productAbstract" type="textarea" />
        </el-form-item>
        <el-form-item label="代练产品分组" prop="productGroup">
          <el-input v-model="form.productGroup" />
        </el-form-item>
        <el-form-item label="代练产品价格" prop="productPrice">
          <div style="display: block">
            <el-input-number
              v-model="form.productPrice"
              controls-position="right"
              :min="0"
              :max="100000000"
            />
          </div>
        </el-form-item>
        <el-form-item label="代练活动价格（现价，不输入则原价出售）" prop="activityPrice">
          <el-input v-model="form.activityPrice" style="width:200px" />
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
  name: 'PowerProductFormDialog',
  mixins: [dialogMixin],
  data() {
    return {
      form: {},
      rules: {
        productTitle: { required: true, message: '请输入产品标题', trigger: 'blur' }
      }
    }
  },
  methods: {
    setValues(item, packageId) {
      if (item) {
        console.log(item.activityPrice)
        this.form = item
      } else {
        this.form = {
          packageId: packageId
        }
      }
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.addOrEditProduct()
        }
      })
    },
    addOrEditProduct() {
      powerLevelingApi.AddOrEditProduct(this.form).then(res => {
        if (res.data.success) {
          console.log(this.form.packageId)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('onRefresh', this.form.packageId)
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
