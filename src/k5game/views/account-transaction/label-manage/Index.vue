<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="标签名称">
            <el-input v-model="labelName" placeholder="请输入标签名称" clearable />
          </el-form-item>
          <el-form-item label="游戏名称">
            <el-select v-model="params.gameId" placeholder="全部" filterable clearable style="max-width: 180px">
              <el-option
                v-for="item in getAllGames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-select v-model="IsEnable" placeholder="全部" filterable clearable style="maxWidth:185px">
              <el-option
                label="启用"
                value="启用"
              />
              <el-option
                label="禁用"
                value="禁用"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="info" @click="reset">重置</el-button>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <ul class="operate">
      <li>
        <el-button type="success" icon="el-icon-plus" class="my-btn-icon" @click="addLabel">
          添加标签
        </el-button>
      </li>
      <li>
        <el-button type="primary" class="my-btn-icon" @click="batchDelete">
          批量删除
        </el-button>
      </li>
    </ul>
    <lxz-table
      ref="multipleTable"
      :table-data="dataList"
      :columns="[
        { slot: 'selection' },
        { label: '标签名称', prop: 'name' },
        { slot: 'gameName' },
        { slot: 'IsEnable' },
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
        slot="gameName"
        label="游戏名称"
      >
        <template v-slot="scope">
          {{ getGameName(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column
        slot="IsEnable"
        label="是否启用"
      >
        <template v-slot="scope">
          {{ scope.row.isEnable?'启用':'禁用' }}
        </template>
      </el-table-column>
      <el-table-column
        slot="creatTime"
        label="添加时间"
      >
        <template v-slot="scope">
          {{ scope.row.creationTime | timeFormat }}
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
              <p @click="editLabel(scope.row)">编辑</p>
            </a>
            <a href="javascript:void(0)">
              <p @click="deleteBtn(scope.row)">删除</p>
            </a>
          </div>
        </template>
      </el-table-column>
    </lxz-table>
    <tips-dialog
      v-model="isLabelDeleteShow"
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
// eslint-disable-next-line no-unused-vars
import moment from 'moment'
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as accountTransactionApi from '@/api/account-transaction'
import config from '@/config'
import TipsDialog from '@/k5game/components/TipsDialog'
export default {
  name: 'Index',
  components: { LxzTable, TipsDialog },
  mixins: [listMixin],
  data() {
    return {
      multipleSelection: [],
      isLabelDeleteShow: false,
      title: '',
      message: '',
      labelName: '',
      gameName: '',
      IsEnable: '',
      id: []
    }
  },
  computed: {
    getAllGames() {
      return this.$store.state.game.list
    }
  },
  watch: {
    labelName(val) {
      if (val) {
        this.dataList.some(element => {
          if (element.name === val) {
            this.params.id = element.id
          }
        })
      } else {
        this.params.id = ''
      }
    },
    IsEnable(val) {
      if (val) {
        if (val === '启用') {
          this.params.IsEnable = true
        } else if (val === '禁用') {
          this.params.IsEnable = false
        }
      } else {
        this.params.IsEnable = ''
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
    // 重置
    reset() {
      this.labelName = ''
      this.IsEnable = ''
      for (const key in this.params) {
        this.params[key] = null
      }
      this.params.maxResultCount = 10
    },
    // 图片真实地址
    getPicRealUrl(val) {
      return config.baseUrl + config.pictureUrl + '/' + val
    },
    getList() {
      accountTransactionApi.GetPagedCommodityLabelAsync(this.params).then(res => {
        const result = res.data.result
        this.pageObj.totalCount = result.totalCount
        this.dataList = result.items
      })
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 编辑标签
    editLabel(row) {
      this.$router.push({
        name: 'editLabel',
        query: {
          id: row.id
        }
      })
    },
    // 新增标签
    addLabel() {
      this.$router.push({
        name: 'addLabel'
      })
    },
    // 单个删除按钮
    deleteBtn(item) {
      console.log(item)
      this.id = []
      this.id.push(item.id)
      this.title = '删除提示'
      this.message = '确定要删除“' + item.name + '”吗？删除后不能恢复。'
      this.isLabelDeleteShow = true
    },
    // 批量删除
    batchDelete() {
      this.id = []
      if (this.multipleSelection.length === 0) {
        this.$message.error('请至少选择一个数据')
        return
      }
      const number = this.multipleSelection.length
      this.title = '批量删除提示'
      this.message = '确定要删除' + number + '个标签吗？删除后将不能恢复。'
      this.isLabelDeleteShow = true
      this.multipleSelection.some(item => {
        this.id.push(item.id)
      })
    },
    // 删除
    delete(id) {
      accountTransactionApi.DeleteCommodityLabelAsync({ id: id }).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.search()
          this.isLabelDeleteShow = false
        }
      })
    },
    submit() {
      this.delete(this.id)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
