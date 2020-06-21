<template>
  <el-dialog title="用户信息" :visible.sync="isShow" width="50%" @close="close">
    <el-form v-if="data && data.nickName" ref="ruleForm" label-width="100">
      <el-form-item label="用户名">
        <span>{{ data.nickName }}</span>
      </el-form-item>
      <el-form-item label="用户联系方式">
        <span>{{ data.userContact }}</span>
      </el-form-item>
    </el-form>
    <div v-else>
      空
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import { mapGetters } from 'vuex'
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'UserINfoDialog',
  props: {
    id: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data(val) {
    return {
      isShow: false,
      data: null
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
      const id = this.id
      accountTransactionApi.GetProductUserInfoAsync({ id: id }).then(res => {
        this.data = res.data.result
      })
    },
    close() {
      this.$emit('input', false)
    },
    clearFields() {
      for (const key in this.form) {
        let value = this.form[key]
        if (value instanceof Array) {
          value = []
        } else if (value instanceof Object) {
          value = {}
        } else {
          value = null
        }
        this.form[key] = value
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-form-item{
  display: flex;
  .el-form-item__content{
    flex: 1;
    .el-select{
      width: 100%;
    }
  }
}
/deep/.el-dialog{
  max-width: 600px;
}
</style>
