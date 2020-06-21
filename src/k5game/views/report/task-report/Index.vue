<template>
  <div class="page-content">
    <el-card>
      <el-form id="search-form2" ref="form" :model="params" label-width="">
        <div class="group-item">
          <el-form-item>
            <el-date-picker
              v-model="params.startTime"
              type="date"
              placeholder="起始时间"
              style="width:180px"
            />
          </el-form-item>
          <p class="line" />
          <el-form-item>
            <el-date-picker
              v-model="params.endTime"
              type="date"
              placeholder="结束时间"
              style="width:180px"
            />
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import * as taskServiceApi from '@/api/task-service'
import moment from 'moment'
export default {
  name: 'TaskReport',
  data() {
    return {
      shopList: [],
      params: {
        startTime: moment().subtract(6, 'days').toDate(),
        endTime: moment().toDate()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const params = {
        startTime: this.params.startTime,
        endTime: this.params.endTime,
        status: '2',
        taskName: '',
        userName: '',
        phoneNum: '',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 1000
      }
      taskServiceApi.GetReceivedTasksAllAsync(params).then(res => {
        // const items = res.data.result.items
        const totalCount = res.data.result.totalCount
        console.log(totalCount)
        // items.map(item => {
        //   this.shopList.some(obj => {
        //     if (obj.shopName === item.task.shopName) {
        //     }
        //   })
        // })
      })
    }
  }
}
</script>

<style>

</style>
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
</style>
