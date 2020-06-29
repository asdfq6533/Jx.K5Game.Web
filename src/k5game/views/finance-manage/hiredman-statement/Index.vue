<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="打手">
            <el-input v-model="params.title" placeholder="请输入打手名称" clearable />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="params.userName" placeholder="输入打手联系方式" clearable />
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
        { label: '打手', prop: 'title'},
        { label: '联系方式', prop: 'saleMode'},
        { label: '代练次数', prop: 'saleMode'},
        { label: '已结算金额', prop: 'saleMode'},
        { label: '未结算金额', prop: 'saleMode'},
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
        slot="pic"
        label="主图"
        width="160"
      >
        <template v-slot="scope">
          <div class="pic-div">
            <img v-if="scope.row.imagePath" :src="getPicRealUrl(scope.row.imagePath)">
            <img v-else :src="require('@/assets/images/picture.png')">
          </div>
        </template>
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
              <p @click="goDtailProduct(scope.row)">查看代练订单</p>
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
    // 批量下架
    batchRemove() {
      this.id = []
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一个数据')
        return
      }
      for (let i = 0; i < this.multipleSelection.length; i++) {
        if (this.multipleSelection[i].status !== 2) {
          this.$message.error('请选择销售中的商品')
          return
        }
      }
      const number = this.multipleSelection.length
      this.title = '批量下架提示'
      this.message = '确定要下架' + number + '款商品吗？下架后，商品将不在列表显示。'
      this.isDialogShow = true
      this.multipleSelection.some(item => {
        this.id.push(item.id)
      })
    },
    // 单个下架
    remove(item) {
      this.id = []
      this.title = '下架提示'
      this.message = '确定要下架“' + item.title + '”吗？下架后，商品将不在出售列表显示。'
      this.isDialogShow = true
      this.id.push(item.id)
      this.opertation = '下架'
    },
    // 下架
    lowerShelfCommodity(id) {
      accountTransactionApi.LowerShelfCommodityAsync({ id: id }).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.search()
          this.isDialogShow = false
        }
      })
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
        name: 'specialOrderList'
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
