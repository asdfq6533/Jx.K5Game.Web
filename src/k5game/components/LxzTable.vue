<template>
  <div class="data-table">
    <el-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      style="width: 100%;"
      :max-height="maxHeight"
      @sort-change="changeTSort"
      @selection-change="handleSChange"
    >
      <template v-for="(col, index) in columns">
        <!-- 操作列/自定义列 -->
        <slot v-if="col.slot" :name="col.slot" />
        <!-- 普通列 -->
        <el-table-column
          v-else
          :key="index"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :formatter="col.formatter"
          :sortable="col.sortable"
          align="left"
        >
          <template v-if="col.type === 'date'" v-slot="scope">
            {{ scope.row[col.prop] | dateFormat }}
          </template>
          <template v-else-if="col.type === 'time'" v-slot="scope">
            {{ scope.row[col.prop] | timeFormat }}
          </template>
          <template v-else-if="col.type === 'timeNotUtc'" v-slot="scope">
            {{ scope.row[col.prop] | timeFormatNotUtc }}
          </template>
          <template v-else-if="col.type === 'bool'" v-slot="scope">
            {{ scope.row[col.prop] ? '是' : '否' }}
          </template>
        </el-table-column>
      </template>
    </el-table>
    <!-- 是否调用分页 -->
    <div class="bottom">
      <p v-if="pageObj">已选中{{ selectedCount }}条，共{{ pageObj.totalCount }}条</p>
      <el-pagination
        v-if="pageObj"
        background
        layout="sizes, total, prev, pager, next, jumper"
        :page-size="pageObj.maxCount"
        :total="pageObj.totalCount"
        :current-page.sync="pageObj.currentPage"
        @size-change="pageObj.sizeChange"
        @current-change="pageObj.pageChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LxzTable',
  props: {
    maxHeight: {
      type: Number,
      default: null
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    pageObj: {
      type: Object,
      default: null
    },
    loading: Boolean
  },
  data() {
    return {
      selectedCount: 0
    }
  },
  methods: {
    clearSelection() {
      this.$refs.multipleTable.clearSelection()
    },
    changeTSort(column) {
      this.$emit('changeTableSort', column)
    },
    handleSChange(val) {
      this.selectedCount = val.length
      this.$emit('handleSelectionChange', val)
    }
  }
}
</script>
<style lang="scss">
.data-table{
  margin: 0 10px;
  /deep/ table {
    background: #f6f8fc!important;
    tr {
      background: #f6f8fc;
    }
  }
  /deep/ .el-table__body-wrapper, /deep/.el-table__header-wrapper{
    background: #f6f8fc;
  }
  /deep/.hover-row, /deep/.hover-row>td {
    background: #fff7e6 !important;
  }
  /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td{
    background-color: #fff7e6 !important;
  }
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-left: 20px;
  color: #9a999c;
  p{
    margin: 0;
    padding: 20px 0 0 0;
    font-size: 14px;
  }
  .el-pagination {
    margin: 20px 20px 0 0;
    display: flex;
    justify-content: flex-end;
  }
}
.el-table .cell{
  white-space: nowrap!important;
}
</style>
