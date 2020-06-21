<template>
  <el-dialog
    class="my-dialog"
    :title="form.id ? '修改标签': '添加标签'"
    :visible.sync="dialogFormVisible"
    @close="handleClose"
  >
    <el-form ref="ruleForm" :rules="rules" :model="form" style="max-width: 800px">
      <el-form-item label="所属游戏" :label-width="formLabelWidth" prop="phoneNumber">
        <el-select v-model="form.gameId" :disabled="!!form.id" placeholder="请选择" @change="gameChange">
          <el-option
            v-for="item in getAllGames"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.gameId" label="父类标签" :label-width="formLabelWidth" prop="phoneNumber">
        <el-select v-model="form.parentId" :disabled="!!form.id" placeholder="请选择" clearable @change="parentChange">
          <el-option
            v-for="item in parentLabelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否批量出售" :label-width="formLabelWidth" prop="isBestStart">
        <el-switch
          v-model="form.isBestStart"
        />
      </el-form-item>
      <el-form-item :label="form.gameId ? '标题名称' : '标签名称'" :label-width="formLabelWidth" prop="packageName">
        <el-input v-model="form.packageName" :placeholder="form.gameId ? '请输入标题名称' :'请输入标签名称'" />
      </el-form-item>
      <el-form-item v-if="form.isBestStart && form.parentId" label="价格" :label-width="formLabelWidth" prop="packagePrice">
        <el-input-number
          v-model="form.packagePrice"
          controls-position="right"
          :min="0"
          :max="100000000"
        />
      </el-form-item>
      <el-form-item label="详情" :label-width="formLabelWidth" prop="packageDetail">
        <el-input v-model="form.packageDetail" type="textarea" placeholder="请输入标签详情" />
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth" prop="memo">
        <el-input v-model="form.memo" type="textarea" placeholder="请输入标签备注" />
      </el-form-item>
      <el-form-item label="排序" :label-width="formLabelWidth" prop="accountPrice">
        <el-input-number
          v-model="form.sort"
          controls-position="right"
          :min="0"
          :max="100000000"
        />
      </el-form-item>
      <el-form-item label="是否启用" :label-width="formLabelWidth" prop="isActive">
        <el-switch
          v-model="form.isActive"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import accountMixin from '@/k5game/mixins/account-mixin'
import * as accountPackage from '@/api/accountPackage'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
export default {
  name: 'OpeningFormDialog',
  mixins: [accountMixin, dialogMixin],
  data() {
    return {
      formLabelWidth: '100px',
      form: {
        isActive: true
      },
      rules: {
        gameId: { required: true, message: '请选择游戏', trigger: 'blur' },
        packageName: { required: true, message: '请输入标签名称', trigger: 'blur' },
        packagePrice: { required: true, message: '请输入标签价格', trigger: 'blur' }
      },
      parentLabelList: []
    }
  },
  watch: {
    isShow(newValue) {
      this.dialogFormVisible = newValue
      if (newValue) {
        this.getAllGames()
      }
    }
  },
  methods: {
    parentChange(val) {
      if (val) {
        this.form.isBestStart = true
      } else {
        this.form.isBestStart = false
      }
    },
    gameChange(val) {
      accountPackage.GetGameLable({ gameId: val }).then(res => {
        const items = res.data.result.items
        this.parentLabelList = items.filter(item => {
          return !item.parentId && item.isBestStart
        })
      })
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.form.id) {
            accountPackage.CreateAccountPackage(this.form).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.$emit('onRefresh')
              }
            })
          } else {
            accountPackage.UpdateAccountPackage(this.form).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.$emit('onRefresh')
              }
            })
          }
        }
      })
    },
    setValues(item) {
      const data = JSON.parse(JSON.stringify(item))
      if (data) {
        this.gameChange(data.gameId)
      }
      this.form = data
    }
  }
}
</script>

<style scoped>

</style>
