<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules" label-width="150px" label-position="right">
      <el-page-header content="发布任务" style="margin-bottom: 20px" @back="goBack" />
      <div class="formWrap">
        <el-form-item label="手机号：" prop="phoneNum">
          <el-input v-model="form.phoneNum" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邀请链接：" prop="link">
          <el-input v-model="form.link" placeholder="请输入邀请链接" />
        </el-form-item>
        <el-form-item label="下单渠道：" prop="sources">
          <el-select v-model="form.sources" filterable allow-create placeholder="请选择下单渠道" style="width: 100%">
            <el-option
              label="淘宝"
              value="淘宝"
            />
            <el-option
              label="微信"
              value="微信"
            />
            <el-option
              label="补单"
              value="补单"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邀请人数：" prop="linkCount">
          <el-select v-model="form.linkCount" filterable allow-create placeholder="请选择邀请人数" style="width: 100%">
            <el-option
              label="1"
              value="1"
            />
            <el-option
              label="2"
              value="2"
            />
            <el-option
              label="3"
              value="3"
            />
            <el-option
              label="4"
              value="4"
            />
            <el-option
              label="5"
              value="5"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邀请用户等级要求：" prop="linkLevel">
          <el-input v-model="form.linkLevel" placeholder="请输入邀请用户等级要求" readonly />
        </el-form-item>
        <el-form-item label="费用：" prop="totalAmount">
          <el-input v-model="form.totalAmount" placeholder="请输入收款费用" />
        </el-form-item>
      </div>
    </el-form>
    <div class="btn">
      <el-button type="primary" @click="releaseTask">发布任务</el-button>
    </div>
  </div>
</template>
<script>
// import * as daiLianOrder from '@/api/powerLeveling'
// import * as gameInfoApi from '@/api/gameInfo'
// // import FullTag from './FullTag'
import * as murlocSkinApi from '@/api/murloc-skin'
export default {
  name: 'ReleaseTask',
  data() {
    return {
      form: {
        linkLevel: 20
      },
      rules: {
        phoneNum: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入邀请链接', trigger: 'blur' },
          { pattern: /(http|https):\/\/([\w.]+\/?)\S*/, message: '请输入正确的邀请链接,以http或者https开头', trigger: 'blur' }
        ],
        sources: [
          { required: true, message: '请选择下单渠道', trigger: 'blur' }
        ],
        linkCount: [
          { required: true, message: '请选择邀请人数', trigger: 'blur' }
        ],
        linkLevel: [
          { required: true, message: '请输入邀请用户等级要求', trigger: 'blur' }
        ],
        totalAmount: [
          { required: true, message: '请输入费用', trigger: 'blur' },
          { pattern: /^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$/, message: '请输入正确价格，最多保留2位小数', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  methods: {
    goBack() {
      this.$emit('onBack')
    },
    releaseTask() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          murlocSkinApi.CreateOrder(this.form).then(res => {
            if (res.data.success === true) {
              this.$message({
                message: '发布成功',
                type: 'success'
              })
              this.$emit('releaseTask')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-input-number .el-input__inner{
  text-align: left;
}
.formWrap{
  width: 500px;
  margin-top: 20px;
}
.btn{
  width: 500px;
  margin: 50px 0 30px 0;
  text-align: center;
  button{
    width: 260px;
  }
}
</style>
