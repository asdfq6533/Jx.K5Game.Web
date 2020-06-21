const dialogMixin = {
  props: {
    isShow: Boolean
  },
  data() {
    return {
      dialogFormVisible: false
    }
  },
  watch: {
    isShow(newValue) {
      this.dialogFormVisible = newValue
    }
  },
  methods: {
    setValue(item) {
    },
    handleClose() {
      this.form = {}
      this.$emit('onClose')
    },
    close() {
      this.dialogFormVisible = false
    }
  }
}
export default dialogMixin
