<template>
  <div class="page-content">
    <el-card>
      <div class="filter-div">
        <div class="input-group">
          <label>真实姓名</label>
          <el-input v-model="params.realName" placeholder="请输入内容" style="max-width: 150px" />
        </div>
        <div class="input-group">
          <label>审核状态</label>
          <el-select v-model="params.nameAuthStus" placeholder="请选择" style="max-width: 120px">
            <el-option
              v-for="item in auditStatus"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>身份证类型</label>
          <el-select v-model="params.cardType" placeholder="请选择" style="max-width: 120px">
            <el-option
              v-for="item in idType"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-group">
          <label>证件号码</label>
          <el-input v-model="params.cardCode" placeholder="请输入证件号码" />
        </div>
        <div class="input-group">
          <label>手机号码</label>
          <el-input v-model="params.phoneNumber" placeholder="请输入手机号码" />
        </div>
        <div class="input-group">
          <el-button type="primary" @click="searchClick">搜索</el-button>
        </div>
      </div>
      <div class="input-group" style="padding: 20px 0">
        <el-button type="primary" @click="auditClick">批量审核</el-button>
      </div>
      <lxy-table
        :table-data="list"
        :columns="[
          { slot: 'selection' },
          { label: '真实姓名', prop: 'realName', sortable: true },
          { slot: 'cardType' },
          { label: '证件号码', prop: 'cardCode', sortable: true, width: 170 },
          { label: 'QQ号', prop: 'qq', sortable: true, width: 140 },
          { label: '手机号码', prop: 'phoneNumber', sortable: true, width: 140 },
          { slot: 'nameAuthStus' },
          { label: '创建时间', prop: 'creationTime', type: 'date', sortable: true, width: 140 },
          { slot: 'operation' },
        ]"
        :page-obj="pageObj"
        @changeTableSort="changeTableSort"
        @handleSelectionChange="handleSelectionChange"
      >
        <el-table-column slot="selection" type="selection" />
        <el-table-column slot="cardType" label="证件类型">
          <template v-slot="scope">
            {{ getCardTypeString(scope.row.cardType) }}
          </template>
        </el-table-column>
        <el-table-column slot="nameAuthStus" label="状态">
          <template v-slot="scope">
            {{ getNameAuthStusString(scope.row.nameAuthStus) }}
          </template>
        </el-table-column>
        <el-table-column0
          slot="operation"
          label="操作"
          width="120"
        >
          <template v-slot="scope">
            <el-dropdown trigger="click">
              <el-button type="primary">
                操作<i class="el-icon-arrow-down el-icon--right" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="editClick(scope.row)">
                  <svg-icon icon-class="edit" />
                  <label>编辑</label>
                </el-dropdown-item>
                <el-dropdown-item @click.native="obsoleteClick(scope.row)">
                  <svg-icon icon-class="close" />
                  <label>作废</label>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column0>
      </lxy-table>
    </el-card>
    <edit-form-dialog
      ref="editDialog"
      :is-show="isEditShow"
      @onClose="isEditShow = false"
      @onRefresh="searchClick"
    />
  </div>
</template>

<script>
import * as accountNameAuthApi from '@/api/accountNameAuth'
import EditFormDialog from './components/EditFormDialog'
import listMixin from '@/k5game/mixins/list-mixin'
import LxyTable from '@/k5game/components/LxyTable'
const MAXRESULTCOUNT = 10
export default {
  name: 'Inedx',
  components: { LxyTable, EditFormDialog },
  mixins: [listMixin],
  data() {
    return {
      list: [],
      params: {
        maxResultCount: MAXRESULTCOUNT,
        skipCount: 0,
        realName: '',
        nameAuthStus: '',
        sorting: '',
        cardType: '',
        cardCode: '',
        qq: '',
        phoneNumber: ''
      },
      auditStatus: [
        { text: '全部', value: '' },
        { text: '待审核', value: '待审核' },
        { text: '已审核', value: '已审核' },
        { text: '作废', value: '作废' }
      ],
      idType: [
        { text: '无', value: '无' },
        { text: '身份证', value: '身份证' },
        { text: '护照', value: '护照' }
      ],
      selectedList: [],
      isEditShow: false,
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
    this.getList()
  },
  methods: {
    changeTableSort(column) {
      if (column.order === 'ascending') {
        this.params.sorting = String(column.prop) + ' asc'
      } else if (column.order === 'descending') {
        this.params.sorting = String(column.prop) + ' desc'
      } else {
        this.params.sorting = ''
      }
      this.searchClick()
    },
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.searchClick()
    },
    obsoleteClick(item) {
      this.$alert('你确定要作废', {
        confirmButtonText: '确定'
      }).then(() => {
        accountNameAuthApi.ActivateAccountNameAuth({ id: item.id }).then(res => {
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
      this.isEditShow = true
      this.$refs.editDialog.setValues(item)
    },
    getCardTypeString(num) {
      switch (num) {
        case 0:
          return '无'
        case 1:
          return '身份证'
        case 2:
          return '护照'
      }
    },
    getNameAuthStusString(num) {
      switch (num) {
        case 0:
          return '待审核'
        case 1:
          return '已审核'
        case 2:
          return '作废'
      }
    },
    auditClick() {
      const params = {
        accountNameAuthList: []
      }
      this.selectedList.map(item => {
        params.accountNameAuthList.push(item)
      })

      this.$alert('你确定审核通过吗', {
        confirmButtonText: '确定'
      }).then(() => {
        accountNameAuthApi.VolumeActivation(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.selectedList = []
            this.searchClick()
          }
        })
      })
    },
    handleSelectionChange(val) {
      this.list.map((item) => {
        this.selectedList.some((id, key) => {
          if (item.id === id) {
            this.selectedList.splice(key, 1)
            return true
          }
        })
      })
      val.map((item) => {
        this.selectedList.push(item.id)
      })
    },
    handleCallOrderChecked() {
      const selectedData = []
      this.selectedList.map((id) => {
        this.list.some((row) => {
          if (row.id === id) {
            selectedData.push(row)
            return true
          }
        })
      })
      this.$nextTick(() => {
        selectedData.map((row) => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      })
    },
    searchClick() {
      this.pageObj.currentPage = 1
      this.params.skipCount = 0
      this.getList()
    },
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    },
    getList() {
      accountNameAuthApi.GetAccountNameAuth(this.params).then(res => {
        this.list = res.data.result.items
        this.pageObj.totalCount = res.data.result.totalCount
        this.handleCallOrderChecked()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
  .filter-div{
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 20px;
    .input-group{
      padding: 15px 10px 0 0;
      display: flex;
      align-items: center;
      label {
        white-space: nowrap;
        margin-right: 10px;
      }
    }
    .search-input{
      margin-top: 15px;
      width: 100%;
      max-width: 940px;
      display: flex;
      .el-button{
        margin-left: 10px;
      }
    }
  }
}
</style>
