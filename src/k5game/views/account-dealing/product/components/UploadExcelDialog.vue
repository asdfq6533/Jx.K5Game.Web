<template>
  <el-dialog class="my-dialog" title="批量上传" :visible.sync="dialogFormVisible" @close="handleClose">
    <div class="upload-mess">
      <label>上传账号</label>
      <a :href="url">请先下载Excel模板在进行批量上传</a>
    </div>
    <el-upload
      class="upload-demo"
      :action="uploadUrl"
      :on-change="handleChange"
      name="filePath"
      accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible=false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import config from '@/config'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
export default {
  name: 'UploadExcelDialog',
  mixins: [dialogMixin],
  props: {
    isShow: Boolean
  },
  data() {
    return {
      account: {},
      url: config.baseUrl + '/Assets/Excel/账号上传模板.xlsx',
      uploadUrl: config.baseUrl + '/api/services/k5game/accountTransaction/CreateAccountTransactions'
    }
  },
  methods: {
    handleChange(file, fileList) {
      console.log(file)
    },
    submitClick() {}
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
