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
          { label: '日期', prop: 'time'},
          { label: '访客量', prop: 'vistCount'},
          { label: '已接受任务', prop: 'reveivedCount'},
          { label: '已完成任务', prop: 'compeleteCount'}
        ]"
      />
    </el-card>
  </div>
</template>

<script>
import LxyTable from '@/k5game/components/LxyTable'
import reportMixin from '../mixins/reportMixin'
export default {
  name: 'TaskReport',
  components: { LxyTable },
  mixins: [reportMixin],
  created() {
    this.search()
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
