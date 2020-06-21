<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="游戏平台：">
            <el-input v-model="params.name " placeholder="请输入游戏平台名称" clearable />
          </el-form-item>
          <el-form-item label="操作系统：">
            <el-input v-model="params.name " placeholder="请输入操作系统名称" clearable />
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="info" icon="el-icon-search" @click="reset">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <ul class="operate">
      <li>
        <el-button type="success" class="my-btn-icon" icon="el-icon-plus" @click="addGame">
          新增游戏
        </el-button>
      </li>
      <!-- <li>
        <el-button type="primary" class="my-btn-icon">
          导出勾选项
        </el-button>
      </li>
      <li>
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
        { label: '游戏平台', prop: 'platformName' },
        { label: '操作系统', prop: 'systemName' },
        { slot:'gameType' },
        { label: '游戏币名称 ', prop: 'coinName'},
        { slot: 'gamePlatform' },
        { slot: 'isShow'},
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
        label="游戏图片"
        width="160"
      >
        <template v-slot="scope">
          <div class="pic-div">
            <img v-if="scope.row.pictureUrl" :src="getPicRealUrl(scope.row.pictureUrl)">
            <img v-else :src="require('@/assets/images/picture.png')">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        slot="isShow"
        label="展示状态"
      >
        <template v-slot="scope">
          {{ scope.row.isShow }}
        </template>
      </el-table-column>
      <el-table-column
        slot="gameType"
        label="游戏类型"
        width="180"
      >
        <template v-slot="scope">
          {{ scope.row.gameType }}
        </template>
      </el-table-column>
      <el-table-column
        slot="gamePlatform"
        label="游戏平台"
        width="150"
      >
        <template v-slot="scope">
          <div>
            {{ scope.row.gamePlatform }}
          </div>
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
              <p @click="edit(scope.row)">编辑</p>
            </a>
            <a href="javascript:void(0)">
              <p @click="deleteGame(scope.row)">删除</p>
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
import TipsDialog from '@/k5game/components/TipsDialog'
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as gameApi from '@/api/gameInfo'
// eslint-disable-next-line no-unused-vars
import config from '@/config'
export default {
  name: 'AccountProductManage',
  components: { LxzTable, TipsDialog },
  mixins: [listMixin],
  data() {
    return {
      multipleSelection: [],
      isDialogShow: false,
      params: {
        name: '',
        serviceType: '',
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      },
      gameType: '',
      gamePlatform: '',
      title: '',
      message: ''
    }
  },
  computed: {

  },
  watch: {

  },
  created() {
    this.search()
  },
  mounted() {

  },
  methods: {
    // 搜索
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      this.getList()
    },
    submit() {

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
    getList() {
      gameApi.GetGameName(this.params).then(res => {
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
    // 图片真实地址
    getPicRealUrl(val) {
      return config.baseUrl + config.pictureUrl + val
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 查看商品
    goDtailProduct(row) {
      this.$router.push({
        name: 'gameDetail',
        query: {
          id: row.id
        }
      })
    },
    edit(row) {
      this.$router.push({
        name: 'editGame'
      })
    },
    deleteGame(row) {

    },
    addGame() {
      this.$router.push({
        name: 'addGame'
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
