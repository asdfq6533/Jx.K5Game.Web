<template>
  <div class="data-table">
    <el-table
      v-loading="loading"
      :data="tableData"
      :default-expand-all="expandAll"
      :row-key="rowKey"
      :tree-props="treeProps"
      style="width: 100%"
      border
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
</template>

<script>
export default {
  name: 'LxyTable',
  props: {
    rowKey: {
      type: String,
      default: null
    },
    treeProps: {
      type: Object,
      default: () => {
        return {}
      }
    },
    expandAll: {
      type: Boolean,
      default: false
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
  methods: {
    changeTSort(column) {
      this.$emit('changeTableSort', column)
    },
    handleSChange(val) {
      this.$emit('handleSelectionChange', val)
    }
  }
}
</script>
