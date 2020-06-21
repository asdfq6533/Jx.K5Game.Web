<template>
  <div class="page-content">
    <el-card>
      <div style="padding-bottom: 20px">
        <el-page-header :content="!dataInfo.id ? '添加文章' : '修改文章'" @back="closeSelectedTag('newsArticle')" />
      </div>
      <el-form ref="ruleForm" :model="dataInfo" :rules="rules" label-width="100px">
        <div class="group">
          <div class="group-item">
            <el-form-item label="别名" prop="slug" style="margin: 0;">
              <el-input v-model="dataInfo.slug" placeholder="别名" />
              <span class="mes">别名只允许字母、数字、下划线和短横</span>
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="dataInfo.title" placeholder="商品名称" />
            </el-form-item>
          </div>
          <div>
            <el-form-item label="标签" prop="tags" style="margin: 0">
              <el-input v-model="dataInfo.tags" placeholder="商品名称" />
              <span class="mes">多个标签用逗号(,)隔开</span>
            </el-form-item>
          </div>
          <div class="group-item">
            <el-form-item label="所属频道" prop="channelId">
              <el-select v-model="channelId" clearable placeholder="选择频道">
                <el-option
                  v-for="item in getChannelList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属分类" prop="categoryId">
              <el-select v-model="dataInfo.categoryId" clearable placeholder="选择分类">
                <el-option
                  v-for="item in getCategoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="所属游戏" prop="gameId">
              <el-select v-model="dataInfo.gameId" placeholder="游戏名称" clearable>
                <el-option
                  v-for="item in getAllGames"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="group-item">
            <el-form-item label="作者" prop="author">
              <el-input v-model="dataInfo.author" placeholder="作者" />
            </el-form-item>
            <el-form-item label="来源" prop="quoteUrl">
              <el-input v-model="dataInfo.quoteUrl" placeholder="来源" />
            </el-form-item>
          </div>
          <div class="group-item">
            <el-form-item label="浏览量" prop="views">
              <el-input v-model="dataInfo.views" type="number" placeholder="浏览量" />
            </el-form-item>
            <div class="group-item2">
              <el-form-item label="" prop="isOriginal">
                <el-checkbox v-model="dataInfo.isOriginal">是否原创</el-checkbox>
              </el-form-item>
              <el-form-item label="" prop="allowComment" label-width="20px">
                <el-checkbox v-model="dataInfo.allowComment">是否允许评论</el-checkbox>
              </el-form-item>
            </div>
          </div>
          <div>
            <el-form-item label="上传封面" prop="image">
              <input ref="inputer" type="file" accept="image/png,image/jpeg,image/gif,image/jpg" @change="addImg">
              <img v-if="dataInfo.image" :src="picParthUrl + dataInfo.image" style="max-width: 100%">
            </el-form-item>
          </div>
          <div class="group-item">
            <el-form-item label="摘要" prop="excerpt">
              <el-input v-model="dataInfo.excerpt" type="textarea" placeholder="商品名称" />
            </el-form-item>
          </div>
          <el-form-item label="文章内容" prop="content">
            <tinymce v-model="dataInfo.content" :height="300" />
          </el-form-item>
        </div>
      </el-form>
      <div style="padding: 10px 0 20px 0; text-align: right">
        <el-button type="primary" @click="createOrEdit">保存文章</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce/index'
import * as fileApi from '@/api/file'
import * as newsApi from '@/api/news'
import commonMixin from '@/k5game/mixins/common-mixin'
import config from '@/config'
export default {
  name: 'ArticleCreate',
  components: { Tinymce },
  mixins: [commonMixin],
  data() {
    return {
      picParthUrl: config.baseUrl + config.pictureUrl,
      channelId: '',
      dataInfo: {},
      rules: {
        slug: [
          { required: true, message: '请输入别名', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9-_]+$/, message: '只能允许字母、数字、下划线和短横' }
        ],
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请输入选择所属分类', trigger: 'blur' }
        ],
        excerpt: [
          { required: true, message: '请输入摘要', trigger: 'blur' }
        ],
        gameId: [
          { required: true, message: '请选择所属游戏', trigger: 'blur' }
        ],
        tags: [
          { required: true, message: '请输入标签', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '请输入作者', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getChannelList() {
      return this.$store.state.news.channelList
    },
    getCategoryList() {
      return this.$store.state.news.categoryList
    },
    getAllGames() {
      return this.$store.state.game.list
    }
  },
  watch: {
    channelId(val) {
      if (val) {
        this.$store.dispatch('news/getCategoryList', val)
      } else {
        this.$store.dispatch('news/getCategoryList', '')
      }
    }
  },
  created() {
    const id = this.$route.query.id
    if (id) {
      this.getArticleForEdit(id)
    }
  },
  mounted() {
    if (!this.getChannelList || this.getChannelList.length === 0) {
      this.$store.dispatch('news/getChannelList')
    }
    if (!this.getCategoryList || this.getCategoryList.length === 0) {
      this.$store.dispatch('news/getCategoryList')
    }
    if (this.getAllGames.length === 0) {
      this.$store.dispatch('game/getList')
    }
  },
  methods: {
    getArticleForEdit(id) {
      newsApi.GetArticleForEdit({ id: id }).then(res => {
        this.dataInfo = res.data.result
      })
    },
    addImg(event) {
      const file = event.target.files[0]
      if ((file.type).indexOf('image/') === -1) {
        this.$message({
          message: '上传必须是图片',
          type: 'error'
        })
      } else {
        const formData = new FormData()
        formData.append('file', event.target.files[0])
        fileApi.upload(formData).then(res => {
          console.log(res)
          const imgData = res.data.result
          this.dataInfo.image = imgData.fileName
        })
      }
    },
    createOrEdit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          newsApi.CreateOrEditArticle(this.dataInfo).then(res => {
            if (res.data.success) {
              this.$message({
                message: this.dataInfo.id ? '更新成功' : '创建成功',
                type: 'success'
              })
              this.closeSelectedTag('newsArticle')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.group{
  .mes{
    color: gray;
    font-size: 12px;
    margin: 0;
    padding: 0;
  }
  .group-item{
    display: flex;
    .el-form-item{
      flex: 1;
    }
  }
  .group-item2{
    display: flex;
    width: 50%;
  }
}
/deep/.el-select{
  width: 100% !important;
  max-width: 100% !important;
}
</style>
