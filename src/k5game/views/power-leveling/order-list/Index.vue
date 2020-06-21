<template>
  <div class="page-content">
    <el-card>
      <order-list v-show="currrentKey === 0" @onAdd="currrentKey=1" @onOrderDetail="orderDetailClick" />
      <order-add v-if="currrentKey === 1" @onBack="back" />
      <order-detail v-else-if="currrentKey === 2" :order-id="orderId" @onBack="currrentKey=0" />
    </el-card>
  </div>
</template>
<script>

import OrderList from './components/OrderList'
import OrderAdd from './components/OrderAdd'
import OrderDetail from './components/OrderDetail'
export default {
  components: { OrderDetail, OrderAdd, OrderList },
  data() {
    return {
      orderId: '',
      currrentKey: 0
    }
  },
  methods: {
    back() {
      this.currrentKey = 0
      this.bus.$emit('orderRefresh')
    },
    orderDetailClick(row) {
      this.currrentKey = 2
      this.orderId = row.id
      console.log(this.orderId)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
