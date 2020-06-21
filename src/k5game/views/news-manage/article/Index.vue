<template>
  <div class="page-content">
    <el-card>
      <el-form id="search-form2" ref="form" :model="params" label-width="">
        <div class="group">
          <el-form-item>
            <el-input v-model="params.title" placeholder="搜索文章" />
          </el-form-item>
          <el-form-item>
            <el-select v-model="params.channelId" clearable placeholder="选择频道">
              <el-option
                v-for="item in getChannelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="params.categoryId" clearable placeholder="选择分类">
              <el-option
                v-for="item in getCategoryList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="search-item">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div style="padding: 10px 0 20px 0;">
        <el-button type="primary" @click="create">创建文章</el-button>
      </div>
      <lxy-table
        :table-data="dataList"
        :columns="[
          { label: '标题', prop: 'title' },
          { label: '所属分类', prop: 'categoryName' },
          { label: '所属游戏', prop: 'gameName' },
          { label: '浏览数量', prop: 'views', width: '90px' },
          { label: '评论数', prop: 'commentCount', width: '90px' },
          { label: '作者', prop: 'author', width: '90px' },
          { label: '发布时间', prop: 'creationTime', type: 'timeNotUtc', width: '140px' },
          { slot: 'operate' }
        ]"
        :page-obj="pageObj"
      >
        <el-table-column
          slot="operate"
          label="操作"
          width="160"
        >
          <template v-slot="scope">
            <div class="icons">
              <el-tooltip class="item" effect="dark" content="编辑文章" placement="top">
                <a href="javascript:void(0)">
                  <svg-icon icon-class="edit-2-fill" @click="eidt(scope.row)" />
                </a>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除文章" placement="top">
                <a href="javascript:void(0)" style="font-size: 26px; color: #ec5851;">
                  <svg-icon icon-class="delete" @click="deleteClick(scope.row)" />
                </a>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </lxy-table>
    </el-card>
  </div>
</template>

<script>
import * as newsApi from '@/api/news'
import LxyTable from '@/k5game/components/LxyTable'
import listMixin from '@/k5game/mixins/list-mixin'
export default {
  components: { LxyTable },
  mixins: [listMixin],
  data() {
    return {
      categiryList: [],
      params: {},
      dataList: []
    }
  },
  computed: {
    getChannelId() {
      return this.params.channelId
    },
    getChannelList() {
      return this.$store.state.news.channelList
    },
    getCategoryList() {
      return this.$store.state.news.categoryList
    }
  },
  watch: {
    getChannelId(val) {
      if (val) {
        this.$store.dispatch('news/getCategoryList', val)
      } else {
        this.$store.dispatch('news/getCategoryList')
      }
    }
  },
  created() {
    this.search()
  },
  mounted() {
    if (!this.getChannelList || this.getChannelList.length === 0) {
      this.$store.dispatch('news/getChannelList')
    }
    if (!this.getCategoryList || this.getCategoryList.length === 0) {
      this.$store.dispatch('news/getCategoryList')
    }
  },
  methods: {
    deleteClick(row) {
      this.$alert('你确定要删除吗', '提示', {
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        newsApi.DeleteArticle({ id: row.id }).then(res => {
          if (res.data.success) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.search()
          }
        })
      })
    },
    eidt(row) {
      this.$router.push({
        name: 'newsArticleCreate',
        query: {
          id: row.id
        }
      })
    },
    create() {
      //
      this.$router.push({
        name: 'newsArticleCreate'
      })
    },
    getList() {
      newsApi.GetArticles(this.params).then(res => {
        this.dataList = res.data.result.items
      })
    }
  }
}
</script>

<style lang="scss">
.icons{
  font-size: 24px;
  color: gray;
}
</style>
