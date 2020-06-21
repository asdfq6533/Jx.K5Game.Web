<template>
  <div class="page-content">
    <el-card>
      <div>
        <el-tabs v-model="params.status" type="card">
          <el-tab-pane
            v-for="(prop,key) in taskAuditObj"
            :key="key"
            :label="`${prop}${statusCountObj[key] ? '(' + statusCountObj[key] + ')' : '(0)'}`"
            :name="key"
          />
        </el-tabs>
        <el-form id="search-form" ref="form" :model="params" label-width="80px">
          <div class="group">
            <el-form-item label="任务类型">
              <el-select v-model="params.taskType" clearable placeholder="请选择">
                <el-option
                  v-for="(prop,key) in taskTypeObj"
                  :key="key"
                  :label="prop"
                  :value="key"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="params.taskName" />
            </el-form-item>
            <el-form-item label="会员名称">
              <el-input v-model="params.userName" />
            </el-form-item>
            <el-form-item label="会员手机">
              <el-input v-model="params.phoneNum" />
            </el-form-item>
            <div class="input-group">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="startTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                />
              </el-form-item>
            </div>
            <div class="input-group">
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="enddate"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                />
              </el-form-item>
            </div>
            <el-form-item class="seasrch-item">
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button type="primary" @click="cearOveraTime">清理超时</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <lxy-table
        :table-data="dataList"
        :columns="[
          { label: 'ID', prop: 'id', width: '170' },
          { slot: 'taskType' },
          { label: '标题', prop: 'task.taskName', width: '250' },
          { label: '产品单价', prop: 'task.unitPrice' },
          { label: '任务奖励', prop: 'task.kbCommission' },
          { label: '淘宝订单号', prop: 'taobaoOrderId', width: '290' },
          { label: '会员名称', prop: 'userName', width: '100' },
          { label: '会员手机', prop: 'phoneNumber', width: '110' },
          { label: '领取时间', prop: 'creationTime', type: 'timeNotUtc', width: '140' },
          { slot: 'status' },
          { label: '审核人', prop: 'auditUserName', width: '110' },
          { label: '审核时间', prop: 'auditTime', type: 'time', width: '140' },
          { slot: 'auditDetail' }
        ]"
        :page-obj="pageObj"
      >
        <el-table-column
          slot="taskType"
          label="任务类型"
          width="100"
        >
          <template v-slot="scope">
            {{ getTypeStr(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          slot="status"
          label="状态"
          width="80"
        >
          <template v-slot="scope">
            {{ getStatusStr(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          slot="auditDetail"
          label="审核材料"
          width="200"
          fixed="right"
        >
          <template v-slot="scope">
            <el-button size="small" :type="scope.row.status === 0 ? 'danger' : 'primary'" @click="gotoDetail(scope.row)">查看审核</el-button>
          </template>
        </el-table-column>
      </lxy-table>
    </el-card>
  </div>
</template>
<script>
import LxyTable from '@/k5game/components/LxyTable'
import * as taskServiceApi from '@/api/task-service'
import taskType from '@/k5game/views/task-service/data/taskType'
import taskAudit from '@/k5game/views/task-service/data/taskAudit'
import moment from 'moment'
export default {
  name: 'TaskAudit',
  components: { LxyTable },
  data() {
    return {
      startTime: null,
      enddate: null,
      taskAuditObj: taskAudit,
      taskTypeObj: taskType,
      statusCountObj: {},
      params: {
        status: '0',
        taskType: null,
        taskName: '',
        userName: '',
        phoneNum: '',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 10
      },
      dataList: [],
      pageObj: {
        maxResultCount: 10,
        totalCount: 0,
        currentPage: 1,
        sizeChange: (page) => {
          this.handleSizeChange(page)
        },
        pageChange: (page) => {
          this.pageChange(page)
        }
      }
    }
  },
  computed: {
    getAuth() {
      return this.params.status
    }
  },
  watch: {
    startTime(val) {
      if (val) {
        this.params.startTime = moment(val).format('YYYY-MM-DD')
      }
    },
    enddate(val) {
      if (val) {
        this.params.enddate = moment(val).add(1, 'days').format('YYYY-MM-DD')
      }
    },
    getAuth(val) {
      this.search()
    }
  },
  created() {
    this.search()
  },
  methods: {
    // 清理超时
    cearOveraTime() {
      this.$confirm('你确定要清理超时吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        taskServiceApi.ClearTimeOutTaskAsync().then(res => {
          if (res.data.success) {
            this.$message({
              message: '清理超时成功',
              type: 'success'
            })
          }
        })
      })
    },
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      !this.params.taskType && delete this.params.taskType
      this.getList()
      this.getStatusCount()
    },
    getStatusCount() {
      const params = {
        tagType: 1,
        taskType: this.params.taskType,
        taskName: this.params.taskName,
        userName: this.params.userName,
        phoneNum: this.params.phoneNum,
        startTime: this.params.startTime,
        endTime: this.params.enddate
      }
      taskServiceApi.GetCountByStatusAsync(params).then(res => {
        const result = res.data.result
        const obj = {}
        result.map(item => {
          if (item.statuName === '已开始') { obj['0'] = item.count }
          if (item.statuName === '已暂停') { obj['1'] = item.count }
          if (item.statuName === '已完成') { obj['2'] = item.count }
          if (item.statuName === '已取消') { obj['-1'] = item.count }
        })
        this.statusCountObj = obj
      })
    },
    getTypeStr(row) {
      return taskType[row.task.taskType]
    },
    getStatusStr(val) {
      return taskAudit[val]
    },
    // 页面显示数改变
    handleSizeChange(page) {
      this.params.maxResultCount = page
      this.getList()
    },
    // 页码变化
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    },
    // 显示列表
    getList() {
      taskServiceApi.GetReceivedTasksAllAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = res.data.result.totalCount
        const items = JSON.parse(JSON.stringify(result.items))
        items.map(item => {
          if (!item.task) {
            item.task = {}
          }
        })
        this.dataList = items
        this.$store.commit('task/SET_TASK_AUDIT_LIST', items)
        this.$store.commit('task/SET_TASK_AUDIT_PARAMS', JSON.parse(JSON.stringify(this.params)))
      })
    },
    // 查看审核
    gotoDetail(row) {
      this.$store.commit('task/SET_TASK_AUDIT_DATA', row)
      this.$router.push({
        name: 'TaskAuditDetail',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 20px;
}
</style>
