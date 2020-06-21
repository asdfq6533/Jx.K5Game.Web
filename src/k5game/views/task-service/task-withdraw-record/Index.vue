<template>
  <div class="page-content">
    <el-card style="max-width: 800px;">
      <div>
        <el-page-header content="提现审核" @back="goBack" />
      </div>
      <div>
        <table class="boss-table" style="width: 100%; margin-top: 20px">
          <tr>
            <td>会员名字</td>
            <td>会员手机</td>
            <td>未提现金额</td>
          </tr>
          <tr>
            <td>{{ data.userName }}</td>
            <td>{{ data.phoneNumber }}</td>
            <td>{{ data.amount }}</td>
          </tr>
        </table>
      </div>
      <div class="bottom">
        <lxy-table
          :table-data="dataList"
          :columns="[
            { label: '提现时间', prop: 'applyTime', type: 'time' },
            { label: '提现金额', prop: 'amount' }
          ]"
          :page-obj="pageObj"
        />
      </div>
      <div class="line" />
      <lxy-table
        :table-data="detailList"
        :columns="[
          { label: '领取时间', prop: 'creationTime', type: 'timeNotUtc', width: '140' },
          { label: '店铺', prop: 'task.shopName' },
          { label: '标题', prop: 'task.taskName' },
          { label: '刷单金额', prop: 'task.unitPrice' },
          { label: '提现时间', prop: 'completionTime', type: 'time', width: '140' },
          { label: '是否提现', prop: 'isDraw', type: 'bool' },
        ]"
      />
      <el-alert
        style="margin-top: 20px;"
        :title="`总刷单金额：${totalAmount}`"
        type="warning"
        :closable="false"
      />
    </el-card>
  </div>
</template>
<script>
import * as taskServiceApi from '@/api/task-service'
import LxyTable from '@/k5game/components/LxyTable'
import commonMixin from '@/k5game/mixins/common-mixin'
export default {
  name: 'TaskWithdrawRecord',
  components: { LxyTable },
  mixins: [commonMixin],
  data() {
    return {
      data: this.$store.state.task.withDrawData,
      totalAmount: 0,
      detailList: [],
      dataList: [],
      params: {
        phoneNum: null,
        sorting: null,
        skipCount: 0,
        maxResultCount: 10
      },
      pageObj: {
        maxResultCount: 10,
        totalCount: 0,
        currentPage: 1,
        sizeChange: (page) => {
          this.handleSizeChange(page)
        },
        pageChange: (page) => {
          this.pageChange(page)
        }
      }
    }
  },
  created() {
    this.getList()
    this.getDetailList()
  },
  methods: {
    goBack() {
      this.closeSelectedTag('TaskWithdraw')
    },
    handleSizeChange(page) {
      this.params.maxResultCount = page
      this.getList()
    },
    // 页码变化
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    },
    getList() {
      this.params.phoneNum = this.data.phoneNumber
      this.params.status = 1
      taskServiceApi.GetDrawAssetsAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = res.data.result.totalCount
        this.dataList = result.items
      })
    },

    // 提现明细表
    getDetailList() {
      const params = {
        userId: this.data.userId
      }
      taskServiceApi.GetDrawDetailedAsync(params).then(res => {
        this.detailList = res.data.result
        let count = 0
        this.detailList.map(item => {
          if (item.task) {
            count += item.task.unitPrice
          }
        })
        this.totalAmount = count
        console.log(count)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bottom{
  margin-top: 40px;
  padding-top: 40px;
  border-top: 1px solid #DCDFE6;
}
.line {
  margin:  40px 0;
  border-top: 1px solid #DCDFE6;
}
</style>
