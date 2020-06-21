<template>
  <div class="page-content">
    <div style="padding: 10px 20px 0 20px;">
      <el-form id="search-form2" ref="form" :model="params" label-width="90px">
        <div class="group">
          <el-form-item label="游戏类型：">
            <el-input v-model="params.name" placeholder="输入游戏类型名称" clearable @keyup.enter.native="search" />
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
        <el-button type="primary" class="my-btn-icon" icon="el-icon-plus" @click="addType">
          新增类型
        </el-button>
        <el-button type="primary" class="my-btn-icon" @click="batchDelete">
          批量删除
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
        { label: '游戏类型', prop: 'name' },
        { slot:'creationTime' },
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
        slot="creationTime"
        label="添加时间"
      >
        <template v-slot="scope">
          <div>
            {{ scope.row.creationTime | timeFormatNotUtc }}
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
              <p @click="edit(scope.row)">编辑</p>
            </a>
            <a href="javascript:void(0)">
              <p @click="deleteType(scope.row)">删除</p>
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
    <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" width="380px" class="add-type-dialog" @close="close">
      <div class="add-form">
        <label><span class="star">* </span>游戏类型：</label>
        <div>
          <input v-model.trim="name" type="text" placeholder="请输入游戏类型名称" @focus="focus">
          <p v-if="messageTip" class="messageTip">{{ messageTip }}</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
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
      dialogTitle: '',
      messageTip: '',
      name: '',
      dialogTableVisible: false,
      isDialogShow: false,
      params: {
        name: '',
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      },
      title: '',
      message: '',
      id: '',
      ids: [],
      isSingeleDelete: true,
      type: ''
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
    // 显示单个删除提示弹窗
    deleteType(row) {
      this.isDialogShow = true
      this.id = row.id
      this.title = '确定要删除“' + row.name + '”吗？'
      this.isSingeleDelete = true
    },
    // 批量删除
    batchDelete() {
      this.isSingeleDelete = false
      if (!this.multipleSelection.length) {
        this.$message.error('请先选择游戏类型')
        return false
      }
      this.multipleSelection.forEach(item => {
        this.ids.push(item.id)
      })
      this.isDialogShow = true
      this.title = '确定要删除这' + this.multipleSelection.length + '个游戏类型吗？'
    },
    // 删除确认
    submit() {
      if (this.isSingeleDelete) {
        gameApi.DeleteCategory({ id: this.id }).then(res => {
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
        gameApi.DeleteCategories({ ids: this.ids }).then(res => {
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
    // 重置
    reset() {
      for (const key in this.params) {
        this.params[key] = null
      }
      this.params.maxResultCount = 10
    },
    // 获取游戏类型
    getList() {
      gameApi.GetCategories(this.params).then(res => {
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
    // 编辑类型
    edit(row) {
      this.dialogTitle = '编辑类型'
      this.dialogTableVisible = true
      this.name = row.name
      this.type = row
    },
    // 新增类型
    addType() {
      this.dialogTitle = '新增类型'
      this.dialogTableVisible = true
    },
    // 新增或者编辑类型弹窗确认
    confirm() {
      if (this.dialogTitle === '新增类型') {
        if (!this.name) {
          this.messageTip = '请输入游戏类型名称'
          return false
        }
        const params = {
          name: this.name,
          icon: ''
        }
        gameApi.CreateCategory(params).then(res => {
          if (res.data.success) {
            this.dialogTableVisible = false
            this.$message({
              message: '新增成功',
              type: 'success'
            })
            this.search()
            this.name = ''
          }
        }).catch(() => {
        })
      } else {
        const params = {
          id: this.type.id,
          name: this.name,
          icon: ''
        }
        gameApi.UpdateCategory(params).then(res => {
          if (res.data.success) {
            this.dialogTableVisible = false
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.search()
          }
        }).catch(() => {
        })
      }
    },
    // 关闭弹窗
    close() {
      this.name = ''
    },
    focus() {
      this.messageTip = ''
    }
  }
}
</script>
<style lang="scss">
.add-type-dialog{
  .el-dialog__header{
  padding: 0;
  line-height: 37px;
  text-align:center;
  background: #ff9900;
  .el-dialog__title{
    color: #fff;
  }
  .el-dialog__headerbtn{
  top: 9px;
  right: 15px;
}
.el-dialog__headerbtn .el-dialog__close{
  color: #fff;
}
}
}
.el-table th.is-leaf, .el-table td{
  text-align: center;
}

.add-form{
  display: flex;
  .star{
    color: #FF0000;
  }
  label{
    line-height: 34px;
  }
  input{
    border: 1px solid #cccccc;
    width: 223px;
    height: 34px;
    padding-left: 10px;;
  }
}
.el-dialog__footer{
  text-align: center;
}
.messageTip{
  color: #FF0000;
  font-size: 12px;
  margin-top: 5px;
}
// .el-button [class*="el-icon-"]+span{
//   margin-left: 0;
// }
.icons-operate  {
  justify-content: center;
}
</style>
