<template>
  <div class="page-content">
    <el-card>
      <task-list />
    </el-card>
  </div>
</template>
<script>
import TaskList from './components/TaskList'
export default {
  name: 'TaskManage',
  components: { TaskList },
  data() {
    return {
      activeName: '1'
    }
  }
}
</script>
<style lang="scss" scoped>
.container{
  padding: 20px;
}
</style>
