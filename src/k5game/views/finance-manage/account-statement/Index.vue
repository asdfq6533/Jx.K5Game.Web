<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="对账单号">
            <el-input v-model="params.title" placeholder="请输入商品名称" clearable />
          </el-form-item>
          <el-form-item label="订单编号">
            <el-input v-model="params.userName" placeholder="输入卖家用户名" clearable />
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="params.phoneNum" placeholder="输入卖家手机号" clearable />
          </el-form-item>
          <el-form-item label="是否申诉单">
            <el-select v-model="params.saleMode" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="是"
                value="是"
              />
              <el-option
                label="否"
                value="否"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="支付方式">
            <el-select v-model="gameName" placeholder="全部" filterable clearable>
              <el-option
                label="支付宝"
                value="支付宝"
              />
              <el-option
                label="微信"
                value="微信"
              />
              <el-option
                label="k币"
                value="k币"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期范围">
            <el-date-picker
              v-model="creatTime"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="info" icon="el-icon-search" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <ul class="operate">
      <li>
        <el-button type="primary" class="my-btn-icon">
          导出勾选项
        </el-button>
      </li>
      <li>
        <el-button type="primary" class="my-btn-icon">
          导出搜索结果
        </el-button>
      </li>
    </ul>
    <lxz-table
      ref="multipleTable"
      :table-data="dataList"
      :columns="[
        { slot: 'selection' },
        { label: '对账单号', prop: 'title', width: '180px' },
        { label: '订单编号', prop: 'title', width: '180px' },
        { label: '商品名称', prop: 'title', width: '180px' },
        { label: '订单金额', prop: 'title', width: '180px' },
        { label: '实付金额', prop: 'title', width: '180px' },
        { label: '支付方式', prop: 'title', width: '180px' },
        { label: '下单时间', prop: 'title', width: '180px' },
        { label: '是否申诉单', prop: 'title', width: '180px' },
        { slot: 'complaintResults' },
        { slot: 'operate'}
      ]"
      :page-obj="pageObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column
        slot="selection"
        type="selection"
        width="45"
      />
      <el-table-column
        slot="complaintResults"
        label="申诉结果"
      >
        <el-table-column
          prop="name"
          label="卖家"
          width="120"
        />
        <el-table-column
          prop="name"
          label="买家"
          width="120"
        />
        <el-table-column
          prop="name"
          label="平台"
          width="120"
        />
      </el-table-column>
      <el-table-column
        slot="price"
        label="价格"
        width="120"
      >
        <template v-slot="scope">
          {{ scope.row.activityPrice?scope.row.activityPrice:scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column
        slot="sallerUserName"
        label="卖家"
      >
        <template v-slot="scope">
          {{ scope.row.sallerUser.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        slot="phoneNum"
        label="卖家手机号"
      >
        <template v-slot="scope">
          {{ scope.row.sallerUser.phoneNumber }}
        </template>
      </el-table-column>
      <el-table-column
        slot="gameName"
        label="游戏名称"
        width="180"
      >
        <template v-slot="scope">
          {{ getGameName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        slot="label"
        label="标签"
        width="150"
      >
        <template v-slot="scope">
          <div class="label-div">
            <p v-for="(item, key) in scope.row.commodityLabelStr" :key="key">
              {{ item }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        slot="status"
        label="商品状态"
        width="130"
      >
        <template v-slot="scope">
          {{ scope.row.productStatus }}
        </template>
      </el-table-column>
      <el-table-column
        slot="creatTime"
        label="发布时间"
        width="160"
      >
        <template v-slot="scope">
          {{ scope.row.creationTime | timeFormatNotUtc }}
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
          </div>
        </template>
      </el-table-column>
    </lxz-table>
    <tips-dialog
      v-model="isDialogShow"
      :title="title"
      @onRefresh="search"
      @submit="submit"
    >
      <div>
        <p class="tips">{{ message }}</p>
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
import config from '@/config'
export default {
  name: 'AccountProductManage',
  components: { LxzTable, TipsDialog },
  mixins: [listMixin],
  data() {
    return {
      id: [],
      status: '',
      gameName: '',
      productStatus: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: 2,
          name: '销售中'
        },
        {
          id: 3,
          name: '已出售'
        },
        {
          id: 4,
          name: '已下架'
        },
        {
          id: -1,
          name: '审核失败'
        }
      ],
      multipleSelection: [],
      isDialogShow: false,
      title: '',
      creatTime: '',
      message: '',
      params: {
        commodityLabelIds: [],
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      }
    }
  },
  computed: {
    getAllGames() {
      return this.$store.state.game.list
    }
  },
  watch: {
    creatTime(val) {
      if (val) {
        this.params.startTime = moment(val[0]).format('YYYY-MM-DD')
        this.params.endTime = moment(val[1]).add(1, 'days').format('YYYY-MM-DD')
      } else {
        this.params.startTime = ''
        this.params.endTime = ''
      }
    },
    gameName(val) {
      if (val) {
        this.getAllGames.some(item => {
          if (item.name === val) {
            this.params.gameId = item.id
          }
        })
      } else {
        this.params.gameId = ''
      }
    },
    status(val) {
      if (val) {
        this.productStatus.some(item => {
          if (item.name === val) {
            this.params.status = item.id
          }
        })
      } else {
        this.params.status = ''
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {
    if (this.getAllGames.length === 0) {
      this.$store.dispatch('game/getList')
    }
  },
  methods: {
    getGameName(value) {
      let gameName = ''
      this.getAllGames.some(item => {
        if (item.id === value.gameId) {
          gameName = item.name
        }
      })
      return gameName
    },
    // 搜索
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      this.getList()
    },
    submit() {
      this.lowerShelfCommodity(this.id)
    },
    // 重置
    reset() {
      this.status = ''
      this.gameName = ''
      this.creatTime = ''
      for (const key in this.params) {
        this.params[key] = null
      }
      this.params.maxResultCount = 10
      this.params.commodityLabelIds = []
    },
    // 图片真实地址
    getPicRealUrl(val) {
      const img = val.split('|')
      return config.baseUrl + config.pictureUrl + img[0]
    },
    getList() {
      accountTransactionApi.GetPagedCommoditiesAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
        this.dataList.some(item => {
          if (item.status === 0) {
            this.$set(item, 'productStatus', '待审核')
          } else if (item.status === -1) {
            this.$set(item, 'productStatus', '审核失败')
          } else if (item.status === 1) {
            this.$set(item, 'productStatus', '待上架')
          } else if (item.status === 2) {
            this.$set(item, 'productStatus', '销售中')
          } else if (item.status === 3) {
            this.$set(item, 'productStatus', '已出售')
          } else if (item.status === 4) {
            this.$set(item, 'productStatus', '已下架')
          }
        })
      })
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查看商品
    goDtailProduct(row) {
      this.$router.push({
        name: 'AccountProductDetail',
        query: {
          id: row.id
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-table thead.is-group th{
  text-align: center;
}
.el-table .cell{
  text-align: center;
  .icons-operate{
    justify-content: center;
  }
}
</style>
