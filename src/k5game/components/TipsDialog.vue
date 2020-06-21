<template>
  <el-dialog :title="title" :visible.sync="isShow" width="500px" @close="close">
    <slot />
    <div class="content">
      {{ content }}
    </div>
    <div slot="footer" class="dialog-footer">
      <button class="cancel" @click="close">取 消</button>
      <button class="confirm" @click="submitClick">确 定</button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'LabelCreateDialog',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  },
  data(val) {
    return {
      isShow: false
    }
  },
  computed: {

  },
  watch: {
    value(val) {
      this.isShow = val
    }
  },
  methods: {
    submitClick() {
      this.$emit('submit')
      // this.close()
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-footer{
  text-align: center;
  button{
    width: 124px;
    height: 32px;
    border: #3b8cff 1px solid;
    border-radius: 5px;
    color:#3b8cff ;
    background: none;
  }
  .cancel{
    margin-right: 20px;
  }
  .confirm{
    background: #3b8cff;
    color: #fff;
  }
}
.content{
      font-size: 16px;
      text-align: center;
    }
</style>
