<template>
  <el-dialog :title="getData ? '修改分类': '创建分类'" :visible.sync="isShow" width="400px" @close="close">
    <el-form ref="ruleForm" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="别名" prop="slug">
        <el-input v-model="form.slug" :disabled="!!getData" placeholder="请输入别名" />
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="所属频道" prop="channelId">
        <el-select v-model="form.channelId" placeholder="请选择所属频道">
          <el-option
            v-for="item in getChannelList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// import config from '@/config'
import * as newsApi from '@/api/news'
export default {
  name: 'CreateOrEdit',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data(val) {
    return {
      isShow: false,
      form: {},
      rules: {
        slug: [
          { required: true, message: '请输入别名', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        channelId: [
          { required: true, message: '请选择所属频道', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    getChannelList() {
      return this.$store.state.news.channelList
    },
    getData() {
      return this.$store.state.news.categoryData
    }
  },
  watch: {
    value(val) {
      this.isShow = val
    },
    getData(val) {
      this.form = val || {}
    }
  },
  mounted() {
    if (!this.getChannelList || this.getChannelList.length === 0) {
      this.$store.dispatch('news/getChannelList')
    }
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.getData) {
            newsApi.UpdateCategory(this.form).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '更新成功',
                  type: 'success'
                })
                this.$emit('onRefresh')
                this.close()
              }
            })
          } else {
            newsApi.CreateCategory(this.form).then(res => {
              if (res.data.success) {
                this.$message({
                  message: '创建成功',
                  type: 'success'
                })
                this.$emit('onRefresh')
                this.close()
              }
            })
          }
        }
      })
    },
    close() {
      this.$refs.ruleForm.resetFields()
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
a {
  color: blue;
  margin-left: 10px;
}
</style>
