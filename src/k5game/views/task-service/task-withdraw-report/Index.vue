<template>
  <div class="page-content">
    <el-card>
      <el-form id="search-form2" ref="form" label-width="">
        <div class="group-item">
          <el-form-item>
            <el-date-picker
              v-model="startTime"
              type="date"
              placeholder="起始时间"
              style="width:180px"
            />
          </el-form-item>
          <p class="line" />
          <el-form-item>
            <el-date-picker
              v-model="endTime"
              type="date"
              placeholder="结束时间"
              style="width:180px"
            />
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <lxy-table
        row-key="id"
        :table-data="groupList"
        :expand-all="true"
        :tree-props="{children: 'shopData' }"
        :columns="[
          { label: '日期', prop: 'time', width: '160px'},
          { label: '访客量', prop: 'vistCount'},
          { label: '已接受任务', prop: 'reveivedCount'},
          { label: '已完成任务', prop: 'compeleteCount'},
          { label: '刷单金额(本金)', prop: 'totalMoney'},
          { label: '提现金额(本金返还)', prop: 'drawMoney'}
        ]"
      />
      <el-alert
        style="margin-top:20px"
        :title="`累积总汇：访客量：${sumObj.vistCount}，已接受任务：${sumObj.reveivedCount}，
        已完成任务：${sumObj.compeleteCount}，刷单金额：${sumObj.totalMoney}，提现金额：${sumObj.drawMoney}`"
        type="warning"
      />
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'
import LxyTable from '@/k5game/components/LxyTable'
import reportMixin from '../mixins/reportMixin'
// import * as taskServiceApi from '@/api/task-service'
export default {
  name: 'TaskWithdrawReport',
  components: { LxyTable },
  mixins: [reportMixin],
  data() {
    return {
      groupList: [],
      startTime: moment().subtract(6, 'days').format('YYYY-MM-DD'),
      endTime: moment().format('YYYY-MM-DD'),
      sumObj: {}
    }
  },
  created() {
    this.search()
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.group-item{
  display: flex;
  align-items: center;
  margin-right: 20px;
    /deep/.el-form-item{
    margin-right: 0 !important;
  }
  .line{
    margin: 0 5px 20px 5px;
    width: 10px;
    height: 1px;
    background: #DCDFE6;
  }
}
.search-item{
  margin-left: 10px;
}
</style>
