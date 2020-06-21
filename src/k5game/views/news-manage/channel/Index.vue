<template>
  <div class="page-content">
    <el-card style="max-width: 800px;">
      <div style="padding: 10px 0 20px 0;">
        <el-button type="primary" @click="create">创建频道</el-button>
      </div>
      <lxy-table
        :table-data="dataList"
        :columns="[
          { label: '别名', prop: 'id'},
          { label: '名称', prop: 'name'},
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
              <el-tooltip class="item" effect="dark" content="编辑频道" placement="top">
                <a href="javascript:void(0)">
                  <svg-icon icon-class="edit-2-fill" @click="eidt(scope.row)" />
                </a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除频道" placement="top">
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
import CreateOrEdit from './components/CreateOrEdit'
import * as newsApi from '@/api/news'
import LxyTable from '@/k5game/components/LxyTable'
export default {
  name: 'Channel',
  components: { LxyTable, CreateOrEdit },
  data() {
    return {
      isCreateOrEditShow: false,
      dataList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    deleteClick(row) {
      this.$alert('你确定要删除吗', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        newsApi.DeleteChannel({ id: row.id }).then(res => {
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
      this.$store.commit('news/SET_CHANNEL_DATA', null)
      this.isCreateOrEditShow = true
    },
    eidt(row) {
      this.$store.commit('news/SET_CHANNEL_DATA', row)
      this.isCreateOrEditShow = true
    },
    getList() {
      newsApi.GetChannels().then(res => {
        this.dataList = res.data.result.items
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables';
.icons{
  font-size: 24px;
  color: gray;
}
</style>
