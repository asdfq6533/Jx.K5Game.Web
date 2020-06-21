<template>
  <el-dialog class="my-dialog" title="订单备注列表" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      <el-table
        :data="list"
        border
        class="power-level-table"
      >
        <el-table-column
          prop="orderStatusName"
          label="订单状态"
        />
        <el-table-column
          prop="creatorUserName"
          label="填写人"
        />
        <el-table-column
          prop="creationTime"
          label="填写时间"
        >
          <template v-slot="scope">
            {{ scope.row.creationTime|dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="备注"
        />
      </el-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as powerLevelingApi from '@/api/powerLeveling'
export default {
  name: 'OrderRemarksListDialog',
  mixins: [dialogMixin],
  data() {
    return {
      list: []
    }
  },
  methods: {
    setValues(item) {
      if (item) {
        powerLevelingApi.GetOrderRemarkList({ id: item.id }).then(res => {
          this.list = res.data.result.items
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
