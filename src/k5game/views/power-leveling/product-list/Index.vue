<template>
  <div class="page-content">
    <el-card>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane name="packageList" label="代练套餐">
          <PowerLevelingPackageList />
        </el-tab-pane>
        <el-tab-pane name="logList" label="日志查看">
          <LogList />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import PowerLevelingPackageList from './components/PowerLevelingPackageList'
import LogList from './components/LogList'
export default {
  name: 'Index',
  components: { PowerLevelingPackageList, LogList },
  data() {
    return {
      activeName: 'packageList'
    }
  }
}
</script>
