<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="游戏名称：">
            <el-input v-model="params.name " placeholder="输入游戏名称或别名" clearable @keyup.enter.native="search" />
          </el-form-item>
          <el-form-item label="游戏类型：">
            <el-select v-model="params.type" placeholder="全部" filterable clearable>
              <el-option
                v-for="item in gameTypes"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="游戏平台：">
            <el-select v-model="params.paltform" placeholder="全部" filterable clearable>
              <el-option
                label="手机游戏"
                value="手机游戏"
              />
              <el-option
                label="网络游戏"
                value="网络游戏"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="展示状态：">
            <el-select v-model="params.flag" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="展示中"
                value="0"
              />
              <el-option
                label="未展示"
                value="1"
              />
            </el-select>
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
      <li>
        <el-button type="primary" class="my-btn-icon" @click="batchDelete">
          批量删除
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
        { label: '游戏名称', prop: 'name' },
        { label: '别名', prop: 'nameST' },
        { slot:'gameType' },
        { label: '游戏币名称 ', prop: 'coinName'},
        { slot: 'gamePlatform' },
        { slot: 'flag'},
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
        slot="flag"
        label="展示状态"
      >
        <template v-slot="scope">
          {{ scope.row.flag >0?'未展示':'展示中' }}
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
              <p @click="godetail(scope.row)">查看</p>
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
      :content="title"
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
import * as gameInfoApi from '@/api/gameInfo'
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
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      },
      gameTypes: [],
      gamePlatform: '',
      title: '',
      message: '',
      typesParams: {
        name: '',
        sorting: '',
        maxResultCount: 1000,
        skipCount: 0
      },
      gameIds: [],
      isBatchDelete: false
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
    this.getTypeLists()
  },
  methods: {
    // 获取游戏类型列表
    getTypeLists() {
      gameInfoApi.GetCategories(this.typesParams).then(res => {
        if (res.data.success) {
          this.gameTypes = res.data.result.items
        }
      })
    },
    // 搜索
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      this.getList()
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
      gameInfoApi.GetGameName(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
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
    // 批量删除
    batchDelete() {
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择游戏')
        return false
      }
      this.isBatchDelete = true
      this.isDialogShow = true
      this.multipleSelection.some(item => {
        this.gameIds.push(item.id)
      })
      this.title = '确定删除这' + this.multipleSelection.length + '个游戏吗？'
    },
    // 查看游戏
    godetail(row) {
      window.sessionStorage.setItem('gameInfo', JSON.stringify(row))
      this.$router.push({
        name: 'gameDetail'
      })
    },
    // 编辑游戏
    edit(row) {
      window.sessionStorage.setItem('gameInfo', JSON.stringify(row))
      this.$router.push({
        name: 'editGame'
      })
    },
    // 删除游戏
    deleteGame(row) {
      this.isBatchDelete = false
      this.isDialogShow = true
      this.id = row.id
      this.title = '确定删除“' + row.name + '”这个游戏吗？'
    },
    // 确定删除
    submit() {
      if (this.isBatchDelete) {
        gameInfoApi.BatchDeleteGame({ gameIds: this.gameIds }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.search()
            this.isDialogShow = false
          }
        })
      } else {
        gameInfoApi.DeleteGame({ id: this.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.search()
            this.isDialogShow = false
          }
        })
      }
    },
    // 新增游戏
    addGame() {
      this.$router.push({
        name: 'addGame'
      })
    }
  }
}
</script>
<style lang="scss">
.el-dialog__header{
  text-align: center;
}
</style>
