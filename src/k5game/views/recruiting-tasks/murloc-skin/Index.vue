<template>
  <div class="page-content">
    <el-card>
      <task-list v-if=" currrentKey === 1 " @addTask="addTask" />
      <release-task v-if=" currrentKey === 2 " @onBack="back" @releaseTask="releaseTask" />
    </el-card>
  </div>
</template>
<script>

import TaskList from './components/TaskList'
import ReleaseTask from './components/ReleaseTask'

export default {
  name: 'Index',
  components: { TaskList, ReleaseTask },
  data() {
    return {
      currrentKey: 1
    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {

  },
  methods: {
    back() {
      this.currrentKey = 1
    },
    addTask() {
      this.currrentKey = 2
    },
    releaseTask() {
      this.currrentKey = 1
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
