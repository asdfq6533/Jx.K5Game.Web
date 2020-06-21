<template>
  <div class="page-content">
    <el-card style="max-width: 800px;">
      <div>
        <el-page-header content="提现审核" @back="goBack" />
      </div>
      <table class="boss-table" style="width: 100%; margin-top: 20px;">
        <tr>
          <td>会员名字</td>
          <td>会员手机</td>
          <td>未提现金额</td>
        </tr>
        <tr>
          <td>{{ data.userName }}</td>
          <td>{{ data.phoneNumber }}</td>
          <td>{{ data.amount }}</td>
        </tr>
      </table>
      <div class="line" />
      <div class="send-code">
        <el-form id="search-form" ref="mform" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="申请提现金额">
            <span>{{ data.amount }}元</span>
          </el-form-item>
          <el-form-item label="发送验证码">
            <el-button :type="!isTimeShow ? 'primary': ''" :disabled="isTimeShow" @click="endCode">
              {{ codeText }}
            </el-button>
          </el-form-item>
          <el-form-item label="校验验证码" prop="code">
            <el-input v-model="form.code" type="text" placeholder="请输入验证码" />
          </el-form-item>
        </el-form>
        <div class="group" style="padding-top: 20px;">
          <el-button type="primary" @click="pass(true)">确认提交</el-button>
          <el-button type="danger" @click="pass(false)">审核不通过</el-button>
        </div>
      </div>
      <div class="line" />
      <lxy-table
        :table-data="detailList"
        :columns="[
          { label: '领取时间', prop: 'creationTime', type: 'timeNotUtc' },
          { label: '店铺', prop: 'task.shopName' },
          { label: '标题', prop: 'task.taskName' },
          { label: '刷单金额', prop: 'task.unitPrice' },
          { label: '是否提现', prop: 'isDraw', type: 'bool' }
        ]"
      />
    </el-card>
  </div>
</template>
<script>
// const secondKey = 'secondKey'
import * as taskServiceApi from '@/api/task-service'
import commonMixin from '@/k5game/mixins/common-mixin'
import LxyTable from '@/k5game/components/LxyTable'
export default {
  name: 'TaskWithdrawAudit',
  components: { LxyTable },
  mixins: [commonMixin],
  data() {
    return {
      detailList: [],
      oldTime: null,
      data: this.$store.state.task.withDrawData,
      form: {
        drawId: this.$store.state.task.withDrawData.id,
        code: '',
        remark: '',
        isPass: false
      },
      sendCount: 0,
      codeText: '点击发送',
      sureCode: this.$store.state.task.code,
      isTimeShow: false,
      rules: {
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  destroyed() {
    this.stopTime()
  },
  created() {
    this.getDetailList()
  },
  methods: {
    goBack() {
      this.closeSelectedTag('TaskWithdraw')
    },
    stopTime() {
      if (this.timer2) {
        clearInterval(this.timer2)
        this.timer2 = null
        this.codeText = '点击发送'
        this.isTimeShow = false
      }
    },
    startTime() {
      if (!this.timer2) {
        this.isTimeShow = true
        const time1 = new Date(this.oldTime).getTime()
        const time2 = new Date().getTime()
        const sed = Math.round((time2 - time1) / 1000)
        let seconds = 60
        if (sed < 60) {
          seconds = 60 - sed
        }
        let minute = 0
        let second = 0
        if (seconds > 0) {
          minute = parseInt(seconds / 60)
          second = seconds % 60
        }

        this.timer2 = setInterval(() => {
          if (second <= 0) {
            if (minute >= 1) {
              second = 59
              minute = minute - 1
            } else {
              second = 0
              minute = 0
              this.stopTime()
            }
          } else {
            second = second - 1
          }
          if (second === 0 && minute === 0) {
            this.codeText = '点击发送'
            this.isTimeShow = false
          } else {
            this.codeText = second + 's'
          }
        }, 1000)
      }
    },
    pass(flag) {
      let msg = ''
      if (!flag) {
        this.form['isPass'] = false
        this.form.remark = '审核不通过'
        msg = '审核不通过'
        this.$prompt('请输入原因', '审核', {
          inputValue: msg,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '原因不能为空'
        }).then(({ value }) => {
          this.form.remark = value
          this.sendRequest(msg)
        })
      } else {
        this.form['isPass'] = true
        this.form.remark = ''
        msg = '审核通过'
        this.sendRequest(msg)
      }
    },
    sendRequest(msg) {
      this.$refs.mform.validate((valid) => {
        if (valid) {
          taskServiceApi.CashAuditAsync(this.form).then(res => {
            if (res.data.success) {
              this.$message({
                message: msg,
                type: 'success'
              })
              this.$store.commit('task/SET_TASK_DRAW_LIST', [])
              this.closeSelectedTag('TaskWithdraw')
            }
          })
        }
      })
    },
    endCode() {
      const params = {
        drawId: this.data.id,
        phoneNumber: this.data.phoneNumber
      }
      taskServiceApi.SendVerificationCodeAsync(params).then(res => {
        if (res.data.success) {
          const result = res.data.result
          this.oldTime = result.sendTime
          this.$store.commit('task/SET_CODE', this.sureCode)
          this.$message({
            message: '发送成功',
            type: 'success'
          })
          this.startTime()
        }
      })
    },
    // 提现明细表
    getDetailList() {
      const params = {
        userId: this.data.userId
      }
      taskServiceApi.GetDrawDetailedAsync(params).then(res => {
        this.detailList = res.data.result
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.send-code{
  padding-bottom: 20px;
  max-width: 400px;
}
.line {
  margin:  40px 0;
  border-top: 1px solid #DCDFE6;
}
</style>
