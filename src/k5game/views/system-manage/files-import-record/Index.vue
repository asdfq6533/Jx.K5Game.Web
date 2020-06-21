<template>
  <div style="padding: 20px; max-width: 1100px;">
    <el-card class="box-card">
      <div class="filter-div">
        <div class="input-group">
          <label>文件名称</label>
          <el-input v-model="params.name" placeholder="请输入名称" />
        </div>
        <div class="input-group">
          <label>文件类型</label>
          <el-select v-model="params.filesImportTypes" placeholder="请选择" value="">
            <el-option
              v-for="item in fileOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="input-group">
          <el-button type="primary" @click="searchClick">查询</el-button>
        </div>
      </div>
      <div>
        <lxy-table
          :table-data="list"
          :columns="[
            { slot: 'expand' },
            { slot: 'filesImport' },
            { label: '文件名称', prop: 'name'},
            { label: '上传人', prop: 'nickName'},
            { label: '创建日期', prop: 'creationTime', type: 'date'}
          ]"
          :page-obj="pageObj"
        >
          <el-table-column slot="filesImport" label="导入类型">
            <template v-slot="scope">
              {{ getFileImport(scope.row.filesImport) }}
            </template>
          </el-table-column>
          <el-table-column slot="expand" type="expand" label="详情" width="60px">
            <template v-slot="scope">
              <el-form label-position="left" inline class="demo-table-expand">
                <div class="data-div">
                  <label>导入成功的数据</label>
                  <div v-html="getData(scope.row.successData)" />
                  <label>导入失败的数据</label>
                  <div v-html="getData(scope.row.failData)" />
                </div>
              </el-form>
            </template>
          </el-table-column>
        </lxy-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as fileApi from '@/api/file'
import LxyTable from '@/k5game/components/LxyTable'
const MAXRESULTCOUNT = 10
export default {
  name: 'Index',
  components: { LxyTable },
  data() {
    return {
      params: {
        filesImportType: '账号交易产品',
        sorting: '',
        maxResultCount: MAXRESULTCOUNT,
        skipCount: 0
      },
      fileOptions: [
        {
          value: 0,
          label: '账号交易产品'
        }
      ],
      list: [],
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
    this.getFilesImportRecordListAsync()
  },
  methods: {
    getData(data) {
      // const newData = JSON.parse(data)
      // console.log('1')
      return data.replace(/},/g, '} <br><br> ')
    },
    searchClick() {
      this.pageObj.currentPage = 1
      this.params.skipCount = 0
      this.getFilesImportRecordListAsync()
    },
    getFileImport(type) {
      switch (type) {
        case 0:
          return '账号交易产品'
        default:
          return '未知'
      }
    },
    getFilesImportRecordListAsync() {
      fileApi.FilesImportRecordLog(this.params).then(res => {
        this.list = res.data.result.items
        this.pageObj.totalCount = res.data.result.totalCount
      })
    },
    handleCurrentChange(val) {
      this.pageObj.currentPage = val
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getFilesImportRecordListAsync()
    }
  }
}
</script>

<style lang="scss" scoped>
.data-div{
  & > label{
    display: block;
    padding: 10px 0;
  }
}
.filter-div{
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
  .input-group{
    padding: 15px 10px 0 0;
    display: flex;
    align-items: center;
    label {
      margin-right: 10px;
      white-space: nowrap;
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
</style>
