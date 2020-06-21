<template>
  <div>
    <el-tabs v-model="params.taskStatus" type="card">
      <el-tab-pane
        v-for="(prop,key) in taskStatusObj"
        :key="key"
        :label="`${prop}${statusCountObj[key] ? '(' + statusCountObj[key] + ')': '(0)'}`"
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
              v-model="endTime"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
            />
          </el-form-item>
        </div>
        <el-form-item class="seasrch-item">
          <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div style="padding-bottom: 20px;">
      <el-button v-permission="['Pages.TaskCenter.CreateTask']" type="primary" @click="create">添加任务</el-button>
    </div>
    <div>
      <lxy-table
        :table-data="dataList"
        :columns="[
          { label: 'ID', prop: 'id', width: '290px' },
          { slot: 'taskType' },
          { label: '店铺名', prop: 'shopName' },
          { label: '标题', prop: 'taskName' },
          { label: '产品单价', prop: 'unitPrice' },
          { label: '任务奖励', prop: 'kbCommission' },
          { label: '总任务量', prop: 'amount' },
          { slot: 'finishTask' },
          { label: '剩余任务量', prop: 'quantity', width: '100px' },
          { slot: 'taskStatus' },
          { slot: 'edit' },
          { slot: 'operation', width: '150px'}
        ]"
        :page-obj="pageObj"
      >
        <el-table-column
          slot="taskType"
          label="任务类型"
          width="120"
        >
          <template v-slot="scope">
            {{ getTypeStr(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          slot="taskStatus"
          label="任务状态"
          width="120"
        >
          <template v-slot="scope">
            {{ getStatuStr(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          slot="finishTask"
          label="已完成任务量"
          width="120"
        >
          <template v-slot="scope">
            {{ scope.row.amount - scope.row.quantity }}
          </template>
        </el-table-column>
        <el-table-column
          slot="edit"
          label="编辑"
          width="80"
          fixed="right"
        >
          <template v-slot="scope">
            <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
        <el-table-column
          slot="operation"
          label="操作"
          width="150"
          fixed="right"
        >
          <template v-slot="scope">
            <el-button size="small" type="primary" @click="editStatus(scope.row)">
              {{ scope.row.taskStatus !== 1 ? '暂停' : '继续' }}
            </el-button>
            <el-button size="small" type="danger" @click="deleteStatus(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </lxy-table>
    </div>
  </div>
</template>
<script>
import LxyTable from '@/k5game/components/LxyTable'
import * as taskServiceApi from '@/api/task-service'
import taskStatus from '@/k5game/views/task-service/data/taskStatus'
import taskType from '@/k5game/views/task-service/data/taskType'
import moment from 'moment'
export default {
  name: 'TaskList',
  components: { LxyTable },
  data() {
    return {
      startTime: null,
      endTime: null,
      activeName: '0',
      taskTypeObj: taskType,
      taskStatusObj: taskStatus,
      isStatusShow: false,
      statusCountObj: {},
      params: {
        taskStatus: '0',
        taskType: null,
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
    getStatus() {
      return this.params.taskStatus
    }
  },
  watch: {
    startTime(val) {
      if (val) {
        this.params.startTime = moment(val).format('YYYY-MM-DD')
      } else {
        this.params.startTime = null
      }
    },
    endTime(val) {
      if (val) {
        this.params.endTime = moment(val).add(1, 'days').format('YYYY-MM-DD')
      } else {
        this.params.endTime = null
      }
    },
    getStatus() {
      this.search()
    }
  },
  created() {
    // const params = this.$store.state.task.taskParams
    // if (params) {
    //   this.params = JSON.parse(JSON.stringify(params))
    // }
    this.search()
  },
  methods: {
    // 搜索
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      !this.params.taskType && delete this.params.taskType
      this.getList()
      this.getStatusCount()
    },
    getStatusCount() {
      const params = {
        tagType: 0,
        taskType: this.params.taskType,
        taskName: this.params.taskName,
        startTime: this.params.startTime,
        endTime: this.params.endTime
      }
      taskServiceApi.GetCountByStatusAsync(params).then(res => {
        const result = res.data.result
        const obj = {}
        result.map(item => {
          for (const prop2 in taskStatus) {
            if (taskStatus[prop2] === item.statuName) {
              obj[prop2] = item.count
            }
          }
        })
        this.statusCountObj = obj
      })
    },
    getTypeStr(row) {
      return taskType[row.taskType]
    },
    getStatuStr(row) {
      return taskStatus[row.taskStatus]
    },
    // 修改状态
    editStatus(row) {
      const params = {
        id: row.id
      }
      taskServiceApi.EditTaskStatuAsync(params).then(res => {
        if (res.data.success) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getStatusCount()
          this.getList()
        }
      })
    },
    // 创建
    create() {
      this.$store.commit('task/SET_TASK_DATA', null)
      this.$router.push({
        name: 'taskCreate'
      })
    },
    // 编辑
    edit(row) {
      this.$store.commit('task/SET_TASK_DATA', row)
      this.$router.push({
        name: 'taskCreate'
      })
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
      taskServiceApi.GetPagedTasksAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = res.data.result.totalCount
        const items = result.items
        this.dataList = items
        this.$store.commit('task/SET_TASK_LIST', JSON.parse(JSON.stringify(items)))
        this.$store.commit('task/SET_TASK_PARAMS', JSON.parse(JSON.stringify(this.params)))
      })
    },
    // 删除任务
    deleteStatus(row) {
      this.$confirm('你确定要删除任务?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: row.id
        }
        taskServiceApi.DeleteTaskStatuAsync(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.getStatusCount()
            this.getList()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#search-form{
  .group {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .seasrch-item{
      /deep/.el-form-item__content{
        margin-left: 20px !important;
      }
    }
  }
}
</style>
