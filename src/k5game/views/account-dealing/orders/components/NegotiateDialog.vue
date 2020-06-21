<template>
  <el-dialog title="协商结果" :visible.sync="dialogFormVisible" @close="handleClose">
    <div v-if="result">
      <div class="input-group">
        <label>订单编号</label>
        <el-input :value="id" readonly />
      </div>
      <div class="input-group">
        <label>原价</label>
        <el-input :value="result.purchasePrice" readonly />
      </div>
      <div class="input-group">
        <label>已退金额</label>
        <el-input :value="result.theRefundAmount" readonly />
      </div>
      <div class="input-group">
        <label>退款金额</label>
        <el-input :value="result.systemGetCoin" readonly />
      </div>
      <div class="input-group">
        <label>取消理由</label>
        <el-input type="textarea" :value="result.systemGetCoin" readonly />
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as accountTransactionApi from '@/api/account-transaction'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
export default {
  name: 'NegotiateDialog',
  mixins: [dialogMixin],
  data() {
    return {
      id: '',
      result: {}
    }
  },
  methods: {
    setValues(item) {
      this.id = item.id
      this.getArbitration(this.id)
    },
    getArbitration(id) {
      accountTransactionApi.ArbitrationResult({ id: id }).then(res => {
        this.result = res.data.result
      })
      // accountTransaction.Arbitration({ id: id }).then(res => {
      //   this.result = res.data.result
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
  .input-group {
    display: flex;
    align-items: center;
    padding: 0 15px 0 40px;
    margin-bottom: 20px;

    label {
      width: 85px;
    }
  }

</style>
