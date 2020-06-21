<template>
  <div class="page-content">
    <el-card class="my-card">
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="150px" label-position="right">
        <div class="formWrap">
          <el-form-item label="标签名称：" prop="name" clearable>
            <el-input v-model="form.name" placeholder="请输入标签名称" />
          </el-form-item>
          <el-form-item label="游戏名称：" prop="gameId">
            <el-select v-model="gameName" placeholder="请选择游戏" filterable clearable style="width: 100%">
              <el-option
                v-for="item in getAllGames"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用：" prop="isEnable">
            <el-radio-group v-model="form.isEnable">
              <el-radio label="true">启用</el-radio>
              <el-radio label="false">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
      <div class="btn">
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'Index',
  data() {
    return {
      detail: '',
      gameName: '',
      form: {
        isEnable: true,
        id: '',
        gameId: '',
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        gameId: [
          { required: true, message: '请选择游戏', trigger: 'blur' }
        ],
        isEnable: [
          { required: true, message: '请选择是否启用', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getAllGames() {
      return this.$store.state.game.list
    }
  },
  watch: {
    gameName(val) {
      if (val) {
        this.getAllGames.some(item => {
          if (item.name === val) {
            this.form.gameId = item.id
          }
        })
      }
    }
  },
  created() {
    this.getDetail()
  },
  mounted() {
    if (this.getAllGames.length === 0) {
      this.$store.dispatch('game/getList')
    }
  },
  methods: {
    submit() {
      console.log(this.form)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          accountTransactionApi.EditCommodityLabelAsync(this.form).then(res => {
            if (res.data.success) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.go(-1)
              }, 2000)
            }
          })
        }
      })
    },
    getDetail() {
      accountTransactionApi.GetCommodityLabelAsync({ id: this.$route.query.id }).then(res => {
        if (res.data.success) {
          const detail = res.data.result
          this.getAllGames.some(item => {
            if (detail.gameId === item.id) {
              this.gameName = item.name
            }
          })
          this.form.isEnable = detail.isEnable ? 'true' : 'false'
          this.form.id = detail.id
          this.form.name = detail.name
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
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
