<template>
  <div class="page-content">
    <el-card>
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <div class="group">
          <div>
            <el-page-header :content="!form.id ? '创建任务' : '修改任务'" @back="goBack" />
          </div>
          <div class="group-item">
            <el-form-item label="任务标题" prop="taskName">
              <el-input v-model="form.taskName" placeholder="请输入任务标题" :disabled="!!form.id" />
            </el-form-item>
            <el-form-item label="店铺名" prop="shopName">
              <el-input v-model="form.shopName" placeholder="请输入店铺名" :disabled="!!form.id" />
            </el-form-item>
          </div>
          <el-form-item label="任务类型" prop="taskType">
            <div>
              <el-button
                v-for="(prop,key) in taskTypeObj"
                :key="key"
                :type="(form.taskType + '') === key ? 'primary' : ''"
                @click="typeClick(key)"
              >
                {{ prop }}
              </el-button>
            </div>
          </el-form-item>
          <div class="group-item">
            <el-form-item label="刷单金额" prop="unitPrice">
              <el-input-number v-model="form.unitPrice" placeholder="请输入刷单金额" :disabled="!!form.id" :min="0" controls-position="right" />
            </el-form-item>
            <el-form-item label="淘口令" prop="taskMsg">
              <el-input v-model="form.taskMsg" type="textarea" placeholder="请输入淘口令" />
            </el-form-item>
          </div>
          <div class="group-item">
            <el-form-item label="任务奖励" prop="kbCommission">
              <el-input-number v-model="form.kbCommission" placeholder="请输入任务奖励" :disabled="!!form.id" :min="0" controls-position="right" />
            </el-form-item>
            <el-form-item label="任务量" prop="amount">
              <el-input-number v-model="form.amount" placeholder="请输入任务量" :min="0" controls-position="right" @blur="amoutBlur" />
            </el-form-item>
            <el-form-item v-if="form.id" label="剩余任务量" prop="amount">
              <el-input v-model="form.quantity" type="number" placeholder="请输入任务量" :disabled="!!form.id" />
            </el-form-item>
          </div>
          <div>
            <label class="item_label">任务时间</label>
          </div>
          <div class="group-item date">
            <el-form-item style="margin-right: 0;" prop="startTime">
              <el-date-picker
                v-model="form.startTime"
                type="datetime"
                placeholder="选择开始时间"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <p style="padding: 0 12px 15px 12px; color: #606266;">
              一
            </p>
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="form.endTime"
                type="datetime"
                placeholder="选择结束时间"
                :picker-options="pickerOptions2"
              />
            </el-form-item>
          </div>
          <el-form-item label="任务CD(单选)" prop="taskCD">
            <el-radio-group v-model="form.taskCD" :disabled="!!form.id">
              <el-radio :label="1">1天领取一次</el-radio>
              <el-radio :label="14">14天领取一次</el-radio>
              <el-radio :label="30">30天领取一次</el-radio>
              <el-radio disabled :label="0">每个用户不限次</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="刷单材料证明(全选)" prop="auditConditionList">
            <el-checkbox-group v-model="form.auditConditionList" :disabled="!!form.id">
              <div class="checkbox-list">
                <el-checkbox label="搜索页面截图">搜索页面截图 (找到宝贝)</el-checkbox>
                <el-checkbox label="浏览其他宝贝详情页" />
                <el-checkbox label="跟客服聊天截图" />
                <el-checkbox label="宝贝付款截图" />
                <el-checkbox label="收货后追评截图" />
              </div>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="详细需求" prop="description">
            <tinymce v-model="form.description" :height="300" />
          </el-form-item>
        </div>
        <div>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import Tinymce from '@/components/Tinymce/index'
import commonMixin from '@/k5game/mixins/common-mixin'
import * as taskServiceApi from '@/api/task-service'
import taskType from '@/k5game/views/task-service/data/taskType'
export default {
  name: 'TaskCreate',
  components: { Tinymce },
  mixins: [commonMixin],
  data() {
    return {
      taskTypeObj: taskType,
      form: {
        taskType: '0',
        auditConditions: '',
        auditConditionList: []
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务标题', trigger: 'blur' }
        ],
        shopName: [
          { required: true, message: '请输入店铺名', trigger: 'change' }
        ],
        unitPrice: [
          { required: true, message: '请输入刷单金额', trigger: 'change' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确价格，最多保留2位小数', trigger: 'change' }
        ],
        kbCommission: [
          { required: true, message: '请输入任务奖励', trigger: 'change' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确价格，最多保留2位小数', trigger: 'change' }
        ],
        amount: [
          { required: true, message: '请输入任务量', trigger: 'change' },
          { pattern: /^[0-9]*[1-9][0-9]*$/, message: '请输入正整数', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        taskCD: [
          { required: true, message: '请选择任务CD(单选)', trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入详细需求', trigger: 'change' }
        ],
        auditConditionList: [
          { required: true, message: '请选择刷单材料证明(全选)', trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      pickerOptions2: {
        disabledDate: (time) => {
          return time.getTime() < Date.now()
        }
      }
    }
  },
  computed: {
    getAuditConditions() {
      return this.form.auditConditionList
    }
  },
  watch: {
    getAuditConditions(val) {
      if (val) {
        this.form.auditConditions = val.join(',')
      }
    }
  },
  mounted() {
    const data = this.$store.state.task.taskData
    data && (this.form = JSON.parse(JSON.stringify(data)))
    this.form.auditConditions && (this.form.auditConditionList = this.form.auditConditions.split(','))
  },
  methods: {
    // 返回
    goBack() {
      this.closeSelectedTag('TaskManage')
    },
    amoutBlur() {
      const data = this.$store.state.task.taskData
      if (this.form.amount && data) {
        const oldAmount = data.amount
        const amount = this.form.amount
        console.log(amount, oldAmount)
        if ((amount - oldAmount) > 0) {
          this.form.quantity = data.quantity + (amount - oldAmount)
        } else {
          this.form.quantity = data.quantity
          this.form.amount = oldAmount
        }
      }
    },
    typeClick(val) {
      if (!this.form.id) {
        this.form.taskType = val
      }
    },
    save() {
      console.log(this.form)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const start = moment(this.form.startTime)
          const end = moment(this.form.endTime)
          const now = moment(new Date()).millisecond(0).second(0).minute(0).hour(0)
          console.log(now)
          if (start < now) {
            this.$message({
              message: '开始时间不能早于今天',
              type: 'error'
            })
          } else if (start >= end) {
            this.$message({
              message: '结束日期不能比开始日期小或两者不能相等',
              type: 'error'
            })
          } else if (end.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            this.$message({
              message: '结束日期不能等于今天',
              type: 'error'
            })
          } else {
            const params = JSON.parse(JSON.stringify(this.form))
            console.log(this.form)
            params.startTime = moment(params.startTime).format('YYYY-MM-DD HH:MM:SS')
            params.endTime = moment(params.endTime).format('YYYY-MM-DD HH:MM:SS')
            console.log(params)
            if (this.form.id) {
              taskServiceApi.EditTaskAsync(params).then(res => {
                if (res.data.success) {
                  this.$message({
                    message: '编辑成功',
                    type: 'success'
                  })
                  this.$store.commit('task/SET_TASK_LIST', [])
                  this.closeSelectedTag('TaskManage')
                }
              })
            } else {
              taskServiceApi.CreateTaskAsync(params).then(res => {
                if (res.data.success) {
                  this.$message({
                    message: '创建成功',
                    type: 'success'
                  })
                  this.$store.commit('task/SET_TASK_LIST', [])
                  this.closeSelectedTag('TaskManage')
                }
              })
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.page-content{
  padding: 20px;
  .item_label{
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
  }
  .group-item {
    display: flex;
    .el-form-item{
      margin-right: 40px;
    }
    .el-form-item:last-child {
      margin-right: 0;
    }
  }
  .group-item.date{
    align-items: center;
  }
  .el-form-item{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .checkbox-list{
    display: flex;
    flex-wrap: wrap;
    max-width: 600px;
  }
}
</style>
