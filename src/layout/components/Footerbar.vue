<template>
  <div class="footer">
    <a target="_blank" href="http://www.beian.miit.gov.cn" style="display:inline-block;text-decoration:none;height:20px;line-height:20px;" rel="nofollow noopener">
      <p>浙ICP备17017437号&nbsp;&nbsp;Copyright K5电竞版权所有</p>
    </a>
    <!-- <div class="messages" @click="showChatDialog">
      <svg-icon icon-class="service" />
      <p>最近联系人</p>
    </div> -->
  </div>
</template>
<script>
export default {
  name: 'Footerbar',
  methods: {
    showChatDialog() {
      this.$emit('showChatDialog')
    }
  }
}
</script>
<style lang="scss">
.footer{
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #f2f2f2;
  color: #999;
  font-size: 12px;
  position: relative;
  .messages{
    position: absolute;
    top: 0;
    right: 0;
    background: #ffcc99;
    height: 40px;
    display: flex;
    align-items: center;
    width: 130px;
    justify-content: center;
    color:#fff;
    font-size: 13px;
  }
}
</style>
