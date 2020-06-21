const uploadImgMixin = {
  methods: {
    beforeAvatarUpload(file) {
      const isPicture = file.type.indexOf('image') > -1
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isPicture) {
        this.$message.error('只能上传图片')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isPicture
    }
  }
}

export default uploadImgMixin
