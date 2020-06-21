<template>
  <div class="page-content">
    <el-card>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="指派我" name="1">
          <assign-me-list />
        </el-tab-pane>
        <el-tab-pane label="代练市场" name="2">
          <power-market-list />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import PowerMarketList from './components/PowerMarketList'
import AssignMeList from './components/AssignMeList'
export default {
  components: { AssignMeList, PowerMarketList },
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>
<style scoped>

</style>
