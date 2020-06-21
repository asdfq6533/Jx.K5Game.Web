<template>
  <div>
    <el-form :inline="true" :model="params">
      <el-form-item label="所属游戏">
        <el-select v-model="params.GameId" filterable clearable placeholder="全部">
          <el-option
            v-for="item in allGames"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="套餐名称">
        <el-input v-model="params.PackageName" placeholder="可以按代练套餐名筛选" @keyup.enter.native="searchClick" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="searchClick">筛选</el-button>
      </el-form-item>
    </el-form>
    <div style="padding-bottom: 10px">
      <el-button type="primary" @click="addOrEditPowerPackage(null)">添加代练套餐</el-button>
    </div>
    <el-table
      :data="list"
      border
      class="power-level-table"
      :row-key="getRowKeys"
      :expand-row-keys="expands"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template v-slot="scope">
          <el-table
            :key="scope.row.id"
            :data="productList"
            border
            class="power-level-table"
          >
            <el-table-column
              prop="productTitle"
              label="产品标题"
            />
            <el-table-column
              prop="productPrice"
              label="产品价格"
            />
            <el-table-column
              prop="activityPrice"
              label="活动现价"
            />
            <el-table-column
              prop="productAbstract"
              label="产品简介"
            />
            <el-table-column
              prop="productGroup"
              label="产品分组"
            />
            <el-table-column
              label="操作"
            >
              <template v-slot="scope">
                <div class="my-icon-group">
                  <a class="my-icon" @click="addOrEditProduct(scope.row)">
                    <svg-icon icon-class="edit" />
                  </a>
                  <a class="my-icon" @click="deleteProduct(scope.row)">
                    <svg-icon icon-class="delete" style="font-size: 30px" />
                  </a>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="gameName"
        label="备注"
      />
      <el-table-column
        prop="packageName"
        label="套餐名称"
      />
      <el-table-column
        prop="packageAbstract"
        label="套餐介绍"
      >
        <template v-slot="scope">
          <div v-if="scope.row.packagePic" class="screenshot">
            <img v-if="scope.row.packagePic" :src="getRealUrl(scope.row.packagePic)">
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="isOpen"
        label="K5APP展示"
      >
        <template v-slot="scope">
          <el-switch
            v-model="scope.row.isOpen"
            @change="changeIsOpen(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template v-slot="scope">
          <div class="my-icon-group">
            <a class="my-icon" @click="addOrEditProduct(null, scope.row.id)">
              <svg-icon icon-class="add" />
            </a>
            <a class="my-icon" @click="addOrEditPowerPackage(scope.row)">
              <svg-icon icon-class="edit" />
            </a>
            <a class="my-icon" @click="deletePowerPackage(scope.row)">
              <svg-icon icon-class="delete" style="font-size: 30px" />
            </a>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="sizes, prev, pager, next, jumper"
      :total="totalCount"
      :current-page="currentPage"
      :page-size="params.maxResultCount"
      @size-change="handleSizeChange"
      @current-change="pageChange"
    />
    <!-- 添加代练产品 -->
    <power-product-form-dialog
      ref="powerProductForm"
      :is-show="isPowerProductFormShow"
      @onClose="isPowerProductFormShow=false"
      @onRefresh="getProductList"
    />
    <!-- 添加代练套餐 -->
    <power-form-dialog
      ref="powerForm"
      :is-show="isPowerFormShow"
      @onClose="isPowerFormShow=false"
      @onRefresh="searchClick"
    />
  </div>
</template>
<script>
import * as gameInfoApi from '@/api/gameInfo'
import * as powerLevelingApi from '@/api/powerLeveling'
import k5Utils from '@/utils/k5Utils'
import PowerProductFormDialog from './PowerProductFormDialog'
import PowerFormDialog from './PowerFormDialog'
export default {
  components: { PowerFormDialog, PowerProductFormDialog },
  data() {
    return {
      params: {
        GameId: '',
        PackageName: '',
        maxResultCount: 10
      },
      expands: [],
      allGames: [],
      list: [],
      currentPage: 1,
      totalCount: 0,
      productList: [],
      isPowerProductFormShow: false,
      isPowerFormShow: false
    }
  },
  async mounted() {
    // 默认加载所有游戏
    await this.getAllGames()
    await this.searchClick()
  },
  methods: {
    changeIsOpen(item) {
      powerLevelingApi.OpenOrClosePackage({ id: item.id }).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
      })
    },
    getRowKeys(row) {
      return row.id
    },
    deletePowerPackage(item) {
      this.$confirm('你确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.DeletePackage({ id: item.id }).then(res => {
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
    addOrEditPowerPackage(item) {
      this.isPowerFormShow = true
      this.$refs.powerForm.setValues(item)
    },
    deleteProduct(item) {
      this.$confirm('你确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        powerLevelingApi.DeleteProduct({ id: item.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getProductList(item.packageId)
          }
        })
      }).catch(() => {})
    },
    addOrEditProduct(item, id) {
      this.isPowerProductFormShow = true
      this.$refs.powerProductForm.setValues(item, id)
    },
    expandChange(val, expandedRows) {
      this.productList = []
      const that = this
      if (expandedRows.length) {
        that.expands = []
        if (val) {
          that.expands.push(val.id)// 每次push进去的是每行的ID
        }
      } else {
        that.expands = []// 默认不展开
      }
      this.getProductList(val.id)
    },
    // 获取产品列表
    getProductList(id) {
      console.log(id)
      const params = {
        id: id
      }
      powerLevelingApi.GetPowerLevelingProductList(params).then(res => {
        this.productList = res.data.result.items
        console.log(this.productList)
      })
    },
    // 当图片名称拼成绝对路径url
    getRealUrl(url) {
      return k5Utils.getNewUrl(url)
    },
    // 搜索筛选
    async searchClick() {
      const res = await gameInfoApi.GetPowerLevelingPackageList(this.params)
      this.list = res.data.result.items
      this.totalCount = res.data.result.totalCount
    },
    // 分页每页长度修改回调
    handleSizeChange(val) {
      this.params.maxResultCount = val
      this.searchClick()
    },
    // 翻页动作回调
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.searchClick()
    },
    // 获取所有游戏
    async getAllGames() {
      const res = await gameInfoApi.GetAllGames({ gamePlatform: '' })
      this.allGames = res.data.result.items
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@/styles/variables";
</style>
