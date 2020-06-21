<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="商品名称">
            <el-input v-model="params.accountName" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="游戏名称">
            <el-select v-model="params.gameName" placeholder="全部" filterable clearable>
              <el-option
                v-for="item in getAllGames"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="卖家">
            <el-input v-model="params.accountName" placeholder="输入卖家用户名" />
          </el-form-item>
          <el-form-item label="卖家手机号">
            <el-input v-model="params.accountName" placeholder="输入卖家手机号" />
          </el-form-item>
          <el-form-item label="销售模式">
            <el-select v-model="params.accountLableId" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="寄售交易"
                value="寄售交易"
              />
              <el-option
                label="自主经营"
                value="自主经营"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select v-model="params.status" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="待审核"
                value="待审核"
              />
              <el-option
                label="审核拒绝"
                value="审核拒绝"
              />
              <el-option
                label="审核通过"
                value="审核通过"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="creatTime"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="info" icon="el-icon-search" @click="reset">重置</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <ul class="operate">
      <li>
        <el-button type="success" class="my-btn-icon" @click="batchCheck">
          批量审核
        </el-button>
      </li>
      <li>
        <el-button type="primary" class="my-btn-icon">
          导出勾选项
        </el-button>
      </li>
      <!-- <li>
        <el-button type="primary" class="my-btn-icon">
          导出搜索结果
        </el-button>
      </li> -->
    </ul>
    <lxz-table
      ref="multipleTable"
      :table-data="dataList"
      :columns="[
        { slot: 'selection' },
        { slot: 'pic' },
        { label: '商品名称', prop: 'accountName', width: '250px' },
        { label: '游戏名称', prop: 'gameName', width: '100px' },
        { slot: 'price'},
        { label: '销售模式', prop: 'saleUnit'},
        { slot: 'label' },
        { label: '卖家', prop: 'saleUnit'},
        { label: '卖家手机号', prop: 'saleUnit'},
        { slot: 'status' },
        { slot: 'creatTime' },
        { slot: 'operate'}
      ]"
      :page-obj="pageObj"
      @handleSelectionChange="handleSelectionChange"
      @changeTableSort="sortChange"
    >
      <el-table-column
        slot="selection"
        type="selection"
        width="45"
      />
      <el-table-column
        slot="pic"
        label="主图"
        width="120"
      >
        <template v-slot="scope">
          <div class="pic-div">
            <img v-if="scope.row.picUrl" :src="getPicRealUrl(scope.row.picUrl)">
            <img v-else :src="require('@/assets/images/picture.png')">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        slot="price"
        label="价格¥"
        width="90"
      >
        <template v-slot="scope">
          {{ '¥' + scope.row.accountPrice }}
        </template>
      </el-table-column>
      <el-table-column
        slot="label"
        label="标签"
      >
        <template v-slot="scope">
          <div class="label-div">
            <p v-for="(item, key) in scope.row.accountLables" :key="key">
              {{ item.name }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        slot="status"
        label="审核状态"
        width="100"
      >
        <template v-slot="scope">
          {{ scope.row.status }}
        </template>
      </el-table-column>
      <el-table-column
        slot="creatTime"
        label="发布时间"
        width="100"
      >
        <template v-slot="scope">
          {{ scope.row.creatTime }}
        </template>
      </el-table-column>
      <el-table-column
        slot="operate"
        label="操作"
        width="160"
        fixed="right"
      >
        <template v-slot="scope">
          <div class="icons-operate">
            <a href="javascript:void(0)">
              <p @click="goDtailProduct(scope.row)">查看</p>
            </a>
            <a href="javascript:void(0)">
              <p @click="check(scope.row)">审核</p>
            </a>
          </div>
        </template>
      </el-table-column>
    </lxz-table>
    <tips-dialog
      v-model="isDialogShow"
      :title="title"
      @onRefresh="search"
    >
      <div class="checkDialog">
        <label><span>*</span> 审核备注：</label>
        <el-input
          v-model="checkRemark"
          type="textarea"
          :autosize="{ minRows: 3}"
          maxlength="200"
          placeholder="请输入审核意见，最多200字"
        />
      </div>
    </tips-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import TipsDialog from '@/k5game/components/TipsDialog'
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as accountTransactionApi from '@/api/account-transaction'
import * as accountPackageApi from '@/api/accountPackage'
import config from '@/config'
export default {
  name: 'AccountProductManage',
  components: { LxzTable, TipsDialog },
  mixins: [listMixin],
  data() {
    return {
      multipleSelection: [],
      params: {},
      startTime: null,
      endTime: null,
      isDialogShow: false,
      title: '',
      isBatchOperate: false,
      creatTime: '',
      message: '',
      checkRemark: ''
    }
  },
  computed: {
    getAllGames() {
      return this.$store.state.game.list
    },
    getGameName() {
      return this.params.gameName
    }
  },
  watch: {
    // 游戏 id
    getGameName: {
      handler(val, oldName) {
        if (val) {
          let gameId = null
          this.getAllGames.some(item => {
            if (item.name === val) {
              gameId = item.id
            }
          })
          accountPackageApi.GetGameLable({ gameId: gameId }).then(res => {
            const items = res.data.result.items
            this.allLabel = items
          })
        }
      },
      immediate: true
    },
    startTime(val) {
      this.params.startTime = moment(val).format('YYYY-MM-DD')
    },
    endTime(val) {
      this.params.endTime = moment(val).add(1, 'days').format('YYYY-MM-DD')
    }
  },
  created() {
    // 接收从创建或编辑传来的activeName
    const activeName = this.$route.query.activeName
    if (activeName) {
      this.activeName = activeName
      activeName !== '全部商品' ? this.params.accountState = activeName : null
    }
    this.search()
  },
  mounted() {
    if (this.getAllGames.length === 0) {
      this.$store.dispatch('game/getList')
    }
  },
  methods: {
    // 搜索
    search() {
      if (this.params.startTime > this.params.endTime) {
        this.$message({
          message: '结束时间不能小于开始时间',
          type: 'error'
        })
      } else {
        this.params.skipCount = 0
        this.pageObj.currentPage = 1
        this.getList()
      }
    },
    // 批量审核
    batchCheck() {
      this.title = '批量审核提示'
      this.isDialogShow = true
    },
    // 单个审核
    check() {

    },
    // 批量处理
    batchHandle(str) {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请至少选择一个数据',
          type: 'error'
        })
      } else {
        const ids = []
        this.multipleSelection.map(item => {
          ids.push(item.id)
        })
        const params = {
          batchOperations: str,
          ids: ids
        }
        accountTransactionApi.BatchOperationAsync(params).then(res => {
          if (res.data.success) {
            const items = res.data.result.items
            if (items.length === 0) {
              this.$message({
                message: `${str.replace('批量', '')}成功`,
                type: 'success'
              })
              this.search()
            } else {
              this.isBatchResultShow = true
              this.batchResult = items
            }
          }
        })
      }
    },
    // 重置
    reset() {
      for (const key in this.params) {
        this.params[key] = null
      }
      this.params.maxResultCount = 10
      this.params.accountState = '上架商品'
    },
    // 图片真实地址
    getPicRealUrl(val) {
      return config.baseUrl + config.pictureUrl + '/' + val
    },
    getList() {
      accountTransactionApi.GetAccountTransactionProductListAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
      })
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查看商品
    goDtailProduct(row) {
      this.$router.push({
        name: 'ProductCheckDetail',
        query: {
          id: row.id
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'count') {
        return
      }
      if (order === 'ascending') {
        this.params.sorting = `${prop} asc`
      } else {
        this.params.sorting = `${prop} desc`
      }
      this.search()
    }
  }
}
</script>
<style lang="scss" scoped>
.checkDialog{
  display: flex;
  align-items: center;
  span{
    color: red;
  }
  lebal{
    flex-shrink: 0;
  }
}
</style>
