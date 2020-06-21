<template>
  <el-dialog class="my-dialog" title="请选择" width="30%" :visible.sync="dialogFormVisible" @close="handleClose">
    <div v-if="data">
      <el-select v-model="value">
        <el-option v-for="item in data.row.data" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitClick">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
export default {
  name: 'SelectDialog',
  mixins: [dialogMixin],
  props: {
    data: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    submitClick() {
      console.log(this.data)
      this.$emit('onChange', this.value, this.data.rowIndex)
      this.close()
    }
  }
}
</script>

<style scoped>

</style>
