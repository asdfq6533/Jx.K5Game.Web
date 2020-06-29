<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="商品名称">
            <el-input v-model="params.title" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="游戏名称">
            <el-select v-model="gameName" placeholder="全部" filterable clearable>
              <el-option
                v-for="item in getAllGames"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="卖家">
            <el-input v-model="params.userName" placeholder="输入卖家用户名" />
          </el-form-item>
          <el-form-item label="卖家手机号">
            <el-input v-model="params.phoneNum" placeholder="输入卖家手机号" />
          </el-form-item>
          <el-form-item label="销售模式">
            <el-select v-model="params.saleMode" placeholder="全部" filterable clearable style="maxWidth:185px">
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
            <el-select v-model="status" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="待审核"
                value="待审核"
              />
              <el-option
                label="审核拒绝"
                value="审核拒绝"
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
        { label: '商品名称', prop: 'title', width: '250px' },
        { slot:'gameName' },
        { slot: 'price'},
        { label: '销售模式', prop: 'saleMode',width:'130px'},
        { slot: 'label' },
        { slot: 'sallerUserName'},
        {slot:'phoneNum'},
        { slot: 'status' ,width:'130px'},
        { slot: 'creatTime' },
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
        width="180"
      >
        <template v-slot="scope">
          {{ scope.row.sallerUser.nickName }}
        </template>
      </el-table-column>
      <el-table-column
        slot="phoneNum"
        label="卖家手机号"
        width="180"
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
        label="审核状态"
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
            <a v-if="scope.row.status === 0" href="javascript:void(0)">
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
// eslint-disable-next-line no-unused-vars
import * as accountTransactionApi from '@/api/account-transaction'
import config from '@/config'
export default {
  name: 'AccountProductManage',
  components: { LxzTable, TipsDialog },
  mixins: [listMixin],
  data() {
    return {
      multipleSelection: [],
      startTime: null,
      endTime: null,
      isDialogShow: false,
      title: '',
      isBatchOperate: false,
      creatTime: '',
      message: '',
      dataList: [],
      params: {
        commodityLabelIds: [],
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      },
      productStatus: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: -1,
          name: '审核失败'
        }
      ],
      gameName: '',
      status: '',
      ids: [],
      remark: ''
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
      this.ids = []
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请至少选择一个数据',
          type: 'error'
        })
        return false
      }
      this.title = '批量审核提示'
      this.message = '确定要审核通过这' + this.multipleSelection.length + '个商品吗，审核通过后将展示在商品列表中。'
      this.isDialogShow = true
      this.multipleSelection.some(item => {
        this.ids.push(item.id)
      })
    },
    // 单个审核
    check(item) {
      this.$router.push({
        name: 'ProductCheckDetail',
        query: {
          id: item.id
        }
      })
    },
    submit() {
      this.examineCommodity(this.ids)
    },
    // 审核商品
    examineCommodity(ids) {
      const params = {
        ids: ids,
        isPass: true,
        remark: this.remark
      }
      accountTransactionApi.ExamineCommodityAsync(params).then(res => {
        if (res.data.success) {
          this.UpperShelfCommodityAsync(ids)
        }
      })
    },
    // 上架商品
    UpperShelfCommodityAsync(ids) {
      const params = {
        ids: ids
      }
      accountTransactionApi.UpperShelfCommodityAsync(params).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.search()
          this.isDialogShow = false
          this.remark = ''
        }
      })
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
      accountTransactionApi.GetPagedExamineCommoditiesAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
        this.dataList.some(item => {
          if (item.status === 0) {
            this.$set(item, 'productStatus', '待审核')
          } else if (item.status === -1) {
            this.$set(item, 'productStatus', '审核失败')
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
<style lang="scss" scoped>
.checkDialog{
  display: flex;
  align-items: center;
  span{
    color: red;
  }
  label{
    flex-shrink: 0;
  }
}
</style>
