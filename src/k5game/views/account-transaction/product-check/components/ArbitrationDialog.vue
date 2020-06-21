<template>
  <el-dialog title="仲裁订单" :visible.sync="isShow" @close="close">
    <el-form v-if="getOrdersData" ref="ruleForm" :rules="rules" :model="form">
      <div style="max-width: 600px">
        <el-form-item label="订单编号" :label-width="formLabelWidth">
          <span>{{ getOrdersData.id }}</span>
        </el-form-item>
        <el-form-item label="订单金额" :label-width="formLabelWidth">
          <span>{{ getOrdersData.payAmount }}</span>
        </el-form-item>
        <el-form-item label="仲裁原因" :label-width="formLabelWidth">
          <span>{{ getOrdersData.arbitrationReason }}</span>
        </el-form-item>
        <el-form-item label="处理结果" :label-width="formLabelWidth" prop="memo">
          <el-input v-model="form.memo" type="textarea" />
        </el-form-item>
        <el-form-item label="金额分配" :label-width="formLabelWidth">
          <span>{{ userInfo.price || 0 }}</span>
        </el-form-item>
      </div>
      <div style="max-width: 600px">
        <div>
          <el-form-item label="平台商" :label-width="formLabelWidth" prop="systemKB">
            <el-input v-model="form.systemKB" type="number" />
          </el-form-item>
          <el-form-item label="卖家" :label-width="formLabelWidth" prop="bizKB">
            <el-input v-model="form.bizKB" type="number" />
          </el-form-item>
          <el-form-item label="买家" :label-width="formLabelWidth" prop="userKB">
            <el-input v-model="form.userKB" type="number" />
          </el-form-item>
        </div>
        <div class="group">
          <el-form-item label="用户名称" :label-width="formLabelWidth">
            <span>{{ userInfo.nickName }}</span>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <span>{{ userInfo.userContact }}</span>
          </el-form-item>
        </div>
        <div class="group">
          <el-form-item label="商家名称" :label-width="formLabelWidth">
            <span>{{ userInfo.bizNickName }}</span>
          </el-form-item>
          <el-form-item label="联系方式" :label-width="formLabelWidth">
            <span>{{ userInfo.bizPhoneNumber || '空' }}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'ArbitrationDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShow: false,
      formLabelWidth: '100px',
      userInfo: {},
      form: {
      },
      rules: {
        memo: [
          { required: true, message: '请输入处理结果', trigger: 'blur' }
        ],
        systemKB: [
          { required: true, message: '请输入平台商', trigger: 'blur' }
        ],
        bizKB: [
          { required: true, message: '请输入卖家', trigger: 'blur' }
        ],
        userKB: [
          { required: true, message: '请输入买家', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getOrdersData() {
      return this.$store.state.accountTransiction.productOrders
    }
  },
  watch: {
    value(val) {
      this.isShow = val
      if (val) {
        this.getUserInfo()
      }
    }
  },
  methods: {
    getUserInfo() {
      accountTransactionApi.GetProductUserInfoAsync({ id: this.getOrdersData.id }).then(res => {
        this.userInfo = res.data.result
      })
    },
    close() {
      this.$emit('input', false)
    },
    submitClick() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.form.id = this.getOrdersData.id
          accountTransactionApi.SolveTroubleOrderAsync(this.form).then(res => {
            if (res.data.success) {
              this.$message.success('处理仲裁成功')
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
.group {
  display: flex;
  .el-form-item:first-child{
    width: 300px;
  }
}
</style>
