<template>
  <el-dialog class="my-dialog" title="批量上传批量出售" :visible.sync="dialogFormVisible" @close="handleClose">
    <div v-if="roleType !== 1" class="upload-mess">
      <label>账号模板</label>
      <a :href="url">请先下载Excel模板在进行批量上传</a>
    </div>
    <div class="upload-mess">
      <label>商家模板</label>
      <a :href="url2">请先下载Excel模板在进行批量上传</a>
    </div>
    <el-upload
      ref="upload"
      :limit="1"
      class="upload-demo"
      :action="uploadUrl"
      :on-success="handleSuccess"
      name="filePath"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import config from '@/config'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as accountTransactionApi from '@/api/account-transaction'
import { mapGetters } from 'vuex'
export default {
  name: 'BatchOpeningUploadDialog',
  mixins: [dialogMixin],
  props: {
    isShow: Boolean
  },
  data() {
    return {
      account: {},
      url: config.baseUrl + '/Assets/Excel/账号上传模板.xlsx',
      url2: config.baseUrl + '/Assets/Excel/开局号商家模板.xlsx',
      uploadUrl: config.baseUrl + config.uploadExcel,
      fileName: ''
    }
  },
  computed: {
    ...mapGetters(['roleType'])
  },
  watch: {
    isShow(newValue) {
      this.dialogFormVisible = newValue
      if (newValue) {
        this.$refs.upload && this.$refs.upload.clearFiles()
      }
    }
  },
  methods: {
    handleSuccess(res, file) {
      this.fileName = res.result.fileName
    },
    submitClick() {
      if (this.fileName) {
        const params = {
          filePath: this.fileName,
          role: ''
        }
        accountTransactionApi.CreateAccountTransactions(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.fileName = ''
            this.$emit('onRefresh')
            this.dialogFormVisible = false
          }
        })
      } else {
        this.$message({
          message: '请上传文件',
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables";
  .upload-mess{
    margin-bottom: 20px;
    label {
      font-size: 16px;
    }
    a{
      font-size: 16px;
      color: $light-blue;
    }
  }
</style>
