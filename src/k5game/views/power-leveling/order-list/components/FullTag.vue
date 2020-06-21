<template>
  <div class="tag">
    <div class="full-btn-div">
      <el-button type="primary" @click="removeSelectedsClick">删除选中行</el-button>
      <el-button type="primary" class="add-btn" @click="addFullTagClick">添加</el-button>
    </div>
    <vxe-table
      ref="xTree"
      :edit-rules="validRules"
      border
      resizable
      show-overflow
      :data.sync="fullText"
      :edit-config="{trigger: 'click', mode: 'cell', activeMethod: activeCellMethod}"
      @edit-closed="editClosedEvent"
    >
      <vxe-table-column type="selection" width="40" />
      <vxe-table-column field="title" title="键值" :edit-render="{name: 'input'}" />
      <vxe-table-column field="value" title="值" :edit-render="{type: 'default'}">
        <template v-slot:edit="scope">
          <el-input v-if="scope.row.type === 'Select'" v-model="scope.row.value" :readonly="true" @click.native="selectClick(scope)" />
          <el-input v-else v-model="scope.row.value" />
        </template>
        <template v-slot="{ row }">{{ row.value }}</template>
      </vxe-table-column>
    </vxe-table>
    <select-dialog
      ref="orderInfoDialog"
      :data="data"
      :is-show="isSelectShow"
      @onClose="isSelectShow=false"
      @onChange="selectedChange"
    />
  </div>
</template>

<script>

import SelectDialog from './SelectDialog'
export default {
  name: 'FullTag',
  components: { SelectDialog },
  props: {
    tagList: {
      type: Array,
      default: null
    },
    result: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      fullText: [],
      validRules: {},
      data: null,
      isSelectShow: false
    }
  },
  watch: {
    result(newValue) {
      this.setFullText(newValue)
    }
  },
  methods: {
    setValues(val) {
      this.setFullText(val)
    },
    // 下拉改变
    selectedChange(value, index) {
      this.fullText[index].value = value
    },
    // 选中下拉
    selectClick(scope) {
      this.data = scope
      this.isSelectShow = true
    },
    // 设值禁止修改
    activeCellMethod({ column, columnIndex, rowIndex }) {
      let row = -1
      const obj = this.fullText[rowIndex]
      this.tagList.some(item => {
        if (obj.title === item.text && item.disabled) {
          row = rowIndex
          return true
        }
      })
      return row !== rowIndex || columnIndex !== 1
    },
    // 设给表格值
    setFullText(text) {
      const arr = []
      if (text) {
        text = JSON.parse(text)
        if (Object.keys(text).length > 0) {
          for (const item in text) {
            let flag = true
            this.tagList.some(item2 => {
              if (item2.text === item) {
                const obj = {
                  title: item,
                  value: item2.value,
                  type: item2.type,
                  data: item2.data
                }
                arr.push(obj)
                flag = false
                return true
              }
            })
            if (flag) {
              arr.push({
                title: item,
                value: item.value
              })
            }
          }
          this.fullText = arr
        } else {
          this.fullText = []
        }
      } else {
        this.fullText = []
      }
    },
    // 删除键值
    removeSelectedsClick() {
      console.log('removeSelectedsClick')
      // this.$refs.table.removeSelecteds()
      // console.log(this.fullText)
      const records = this.$refs.xTree.getSelectRecords()
      if (records.length > 0) {
        records.map(item => {
          this.fullText.some((item2, key) => {
            if (item.title === item2.title) {
              this.fullText.splice(key, 1)
              return true
            }
          })
        })
        this.updateProduct(this.fullText)
      }
    },
    // 添加标签值
    addFullTagClick() {
      let flag = true
      this.fullText.some(item => {
        if (item.title === '键值') {
          flag = false
          return true
        }
      })
      if (flag) {
        this.fullText.unshift({
          title: '键值',
          value: '值'
        })
        this.updateProduct(this.fullText)
      } else {
        this.$message({
          message: '请修改键值',
          type: 'error'
        })
      }
    },
    // 关闭编辑
    editClosedEvent() {
      this.updateProduct(this.fullText)
    },
    // 更新值
    updateProduct(arr) {
      const fullObj = {}
      arr.map(item => {
        fullObj[item.title] = item.value ? item.value : ''
      })
      this.$emit('onUpdate', fullObj)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/variables";
.full-btn-div{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 15px 10px 15px;
  h2{
    flex: 1;
  }
}
.tag{
  padding-bottom: 40px;
}
</style>
