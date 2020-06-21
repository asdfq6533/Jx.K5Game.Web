<template>
  <div>
    <el-dialog class="my-dialog" title="指派打手" :visible.sync="dialogFormVisible" @close="handleClose">
      <div>
        <el-form ref="ruleForm">
          <el-form-item label="指派打手" prop="id">
            <el-select v-model="assignBeaterId" filterable clearable placeholder="请选择" style="width: 100%">
              <el-option
                v-for="item in allBeaters"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">关闭</el-button>
        <el-button type="primary" @click="submitClick">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as daiLianOrder from '@/api/powerLeveling'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
export default {
  name: 'AssignDialog',
  mixins: [dialogMixin],
  data() {
    return {
      assignBeaterId: '',
      allBeaters: [],
      orderId: ''
    }
  },
  watch: {
    isShow(newValue) {
      this.dialogFormVisible = newValue
      if (newValue) {
        this.getBeaters()
      }
    }
  },
  methods: {
    setValues(id) {
      this.orderId = id
    },
    submitClick() {
      if (this.assignBeaterId) {
        const params = {
          orderId: this.orderId,
          assignBeaterId: this.assignBeaterId,
          isReSet: this.isReSet
        }
        daiLianOrder.SetDaShou(params).then(res => {
          if (res.data.success) {
            this.$message({
              message: '指派打手成功',
              type: 'success'
            })
            this.$emit('onRefresh')
            this.handleClose()
          }
        })
      } else {
        this.$message({
          message: '请指派打手',
          type: 'error'
        })
      }
    },
    getBeaters() {
      daiLianOrder.GetBeaters().then(res => {
        const items = res.data.result.items
        items.some((item, key) => {
          if (item.label === 'K5家的炉石鸡') {
            items.splice(key, 1)
            items.unshift(item)
            return true
          }
        })
        this.allBeaters = items
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .my-dialog {
    /deep/ .el-dialog {
      max-width: 400px;
    }
  }
</style>
