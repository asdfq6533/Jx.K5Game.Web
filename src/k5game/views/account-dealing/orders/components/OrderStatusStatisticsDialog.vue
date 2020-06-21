<template>
  <el-dialog title="协商结果" :visible.sync="dialogFormVisible" @close="handleClose">
    <div>
      统计
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import * as accountTransactionApi from '@/api/account-transaction'
export default {
  name: 'OrderStatusStatisticsDialog',
  mixins: [dialogMixin],
  props: {
    params: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    dialogFormVisible(newValue) {
      if (newValue) {
        this.getAll()
      }
    }
  },
  methods: {
    getAll() {
      this.getList('已完成', '#003366')
      this.getList('已取消', '#336633')
      this.getList('已删除', '#E65D6E')
      this.getList('问题单', '#CC3333')
    },
    getList(status, color) {
      const params = JSON.parse(JSON.stringify(this.params))
      params.maxResultCount = 1
      params.status = status
      accountTransactionApi.GetPurchaseAccountTransactions(params).then(res => {
        // const totalCount = res.data.result.totalCount
        console.log(res.data.result)
      })
    }
  }
}
</script>

<style scoped>

</style>
