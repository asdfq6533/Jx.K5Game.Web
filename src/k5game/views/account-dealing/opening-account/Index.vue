<template>
  <div class="page-content">
    <el-card>
      <div class="filter-div">
        <div class="input-group">
          <label>所属游戏</label>
          <el-select v-model="params.gameId" placeholder="请选择" style="max-width: 120px">
            <el-option
              v-for="item in allGames"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>是否批量出售</label>
          <el-select v-model="params.isBestStart" placeholder="请选择" style="max-width: 120px">
            <el-option
              :key="0"
              label="全部"
              value=""
            />
            <el-option
              :key="1"
              label="是"
              :value="true"
            />
            <el-option
              :key="2"
              label="否"
              :value="false"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>标签名称</label>
          <el-input v-model="params.packageName" placeholder="请输入内容" />
        </div>
        <div class="input-group">
          <el-button slot="append" icon="el-icon-search" @click="searchClick" />
        </div>
      </div>
      <div style="margin-top: 20px; padding-bottom: 20px">
        <el-button type="primary" @click="addOpeningClick">添加标签</el-button>
      </div>
      <lxy-table
        :table-data="list"
        :columns="[
          { prop: 'packageName', label: '标签名称', width: '300'},
          { prop: 'name', label: '所属游戏'},
          { prop: 'packagePrice', label: '批量出售价格'},
          { prop: 'saleAccountCount', label: '库存'},
          { prop: 'packageDetail', label: '标签详情'},
          { prop: 'memo', label: '标签备注'},
          { prop: 'isActive', label: '是否启用', type: 'bool'},
          { slot: 'operation' }
        ]"
        :page-obj="pageObj"
      >
        <el-table-column
          slot="operation"
          label="操作"
          width="145"
        >
          <template v-slot="scope">
            <el-dropdown trigger="click">
              <el-button type="primary" style="width: 120px">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown" style="width: 120px">
                <el-dropdown-item @click.native="editClick(scope.row)">
                  <svg-icon icon-class="edit" />
                  <label>编辑</label>
                </el-dropdown-item>
                <el-dropdown-item @click.native="deleteClick(scope.row)">
                  <svg-icon icon-class="close" />
                  <label>删除</label>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </lxy-table>
    </el-card>
    <opening-form-dialog
      ref="editDialog"
      :is-show="isLabelShow"
      @onClose="isLabelShow=false"
      @onRefresh="searchClick"
    />
  </div>
</template>

<script>
import accountMixin from '@/k5game/mixins/account-mixin'
import * as accountPackageApi from '@/api/accountPackage'
import OpeningFormDialog from './components/OpeningFormDialog'
import LxyTable from '@/k5game/components/LxyTable'
const MAXRESULTCOUNT = 10
export default {
  name: 'Index',
  components: { LxyTable, OpeningFormDialog },
  mixins: [accountMixin],
  data() {
    return {
      allGames: [],
      params: {
        maxResultCount: MAXRESULTCOUNT,
        skipCount: 0
      },
      list: [],
      isLabelShow: false,
      pageObj: {
        maxResultCount: MAXRESULTCOUNT,
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
  mounted() {
    this.getAllGames(() => {
      this.allGames.unshift({
        name: '全部',
        id: ''
      })
    })
    this.getAccountPackage()
  },
  methods: {
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.searchClick()
    },
    deleteClick(item) {
      this.$alert('你确定要删除吗', {
        confirmButtonText: '确定'
      }).then(res => {
        accountPackageApi.DeleteAccountPackage({ id: item.id, packageName: item.packageName }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.searchClick()
          }
        })
      })
    },
    editClick(item) {
      this.isLabelShow = true
      this.$refs.editDialog.setValues(item)
    },
    addOpeningClick() {
      this.isLabelShow = true
    },
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getAccountPackage()
    },
    searchClick() {
      this.pageObj.currentPage = 1
      this.params.skipCount = 0
      this.getAccountPackage()
    },
    getAccountPackage() {
      if (this.params.isBestStart === '') {
        delete this.params.isBestStart
      }
      accountPackageApi.GetAccountPackage(this.params).then(res => {
        this.list = res.data.result.items
        this.pageObj.totalCount = res.data.result.totalCount
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 20px;
}
</style>
