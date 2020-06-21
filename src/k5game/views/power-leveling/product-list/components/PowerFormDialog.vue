<template>
  <el-dialog class="my-dialog" :title="form.id ? '修改代练套餐': '添加代练套餐'" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-form ref="ruleForm" :rules="rules" :model="form">
        <el-form-item label="代练游戏" prop="gameId">
          <el-select v-model="form.gameId" style="max-width: 400px" placeholder="请选择游戏">
            <el-option
              v-for="(item,key) in allGames"
              :key="key"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="代练名称" prop="packageName">
          <el-input v-model="form.packageName" />
        </el-form-item>
        <el-form-item label="代练套餐介绍" prop="productTitle">
          <el-input v-model="form.packageAbstract" type="textarea" />
        </el-form-item>
        <el-form-item label="代练套餐图片" prop="packagePic">
          <div>
            <el-upload
              class="avatar-uploader"
              :action="`${baseUrl}/File/UploadPicture`"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.packagePic" :src="getRealPicUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
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
import accountMixin from '@/k5game/mixins/account-mixin'
import uploadImgMixin from '@/k5game/mixins/upload-img-mixin'
import config from '@/config'
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  name: 'PowerFormDialog',
  mixins: [dialogMixin, accountMixin, uploadImgMixin],
  data() {
    return {
      baseUrl: config.baseUrl,
      allGames: [],
      form: {
        packagePic: ''
      },
      rules: {
        gameId: { required: true, message: '请选择游戏', trigger: 'blur' },
        packageName: { required: true, message: '请输入代练套餐名称', trigger: 'blur' },
        packagePic: { required: true, message: '请上传图片', trigger: 'blur' }
      },
      loading: ''
    }
  },
  computed: {
    getRealPicUrl() {
      return config.baseUrl + config.pictureUrl + this.form.packagePic
    }
  },
  mounted() {
    this.getAllGames()
  },
  methods: {
    setValues(item) {
      if (item) {
        this.form = item
      }
    },
    uploadSuccess(response, file, fileList) {
      console.log(response.result.fileName)
      this.$store.dispatch('app/setIsLoading', false)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.form.packagePic = response.result.fileName
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          powerLevelingApi.AddOrEditPackage(this.form).then(res => {
            if (res.data.success) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              this.$emit('onRefresh')
              this.close()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar{
  width: 150px;
}
</style>
