<template>
  <div class="page-content">
    <el-card>
      <el-form ref="ruleForm">
        <div class="group">
          <el-form-item>
            <el-select v-model="form.channelId" placeholder="频道">
              <el-option
                v-for="item in getChannelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="create">创建分类</el-button>
          </el-form-item>
        </div>
      </el-form>
      <lxy-table
        :table-data="dataList"
        :columns="[
          { label: '别名', prop: 'id'},
          { label: '名称', prop: 'name'},
          { label: '所属频道', prop: 'channelName'},
          { slot: 'operate' }
        ]"
      >
        <el-table-column
          slot="operate"
          label="操作"
          width="160"
        >
          <template v-slot="scope">
            <div class="icons">
              <el-tooltip class="item" effect="dark" content="编辑分类" placement="top">
                <a href="javascript:void(0)">
                  <svg-icon icon-class="edit-2-fill" @click="eidt(scope.row)" />
                </a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除分类" placement="top">
                <a href="javascript:void(0)" style="font-size: 26px; color: #ec5851;">
                  <svg-icon icon-class="delete" @click="deleteClick(scope.row)" />
                </a>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </lxy-table>
    </el-card>
    <create-or-edit v-model="isCreateOrEditShow" @onRefresh="getList" />
  </div>
</template>

<script>
import LxyTable from '@/k5game/components/LxyTable'
import * as newsApi from '@/api/news'
import CreateOrEdit from './components/CreateOrEdit'
export default {
  name: 'Category',
  components: { LxyTable, CreateOrEdit },
  data() {
    return {
      isCreateOrEditShow: false,
      form: {
        channelId: ''
      },
      dataList: []
    }
  },
  computed: {
    getChannelId() {
      return this.form.channelId
    },
    getChannelList() {
      return this.$store.state.news.channelList
    }
  },
  watch: {
    getChannelId(val) {
      this.getList()
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    if (!this.getChannelList || this.getChannelList.length === 0) {
      this.$store.dispatch('news/getChannelList')
    }
  },
  methods: {
    deleteClick(row) {
      this.$alert('你确定要删除吗', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        newsApi.DeleteCategory({ id: row.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getList()
          }
        })
      })
    },
    create() {
      this.$store.commit('news/SET_CATEGORY_DATA', null)
      this.isCreateOrEditShow = true
    },
    eidt(data) {
      this.$store.commit('news/SET_CATEGORY_DATA', data)
      this.isCreateOrEditShow = true
    },
    getList() {
      newsApi.GetCategories(this.form).then(res => {
        this.dataList = res.data.result.items
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.group{
  display: flex;
  .el-form-item{
    margin-right: 20px;
  }
}
.icons{
  font-size: 24px;
  color: gray;
}
</style>
