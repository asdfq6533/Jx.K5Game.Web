<template>
  <div class="notify-wrap">
    <svg-icon icon-class="close" class="closeIcon" @click="close" />
    <div class="notify">
      <img :src="imgPath" alt="">
      <div>
        <p v-for="(val, key, index) in message" :key="index"> <span>{{ key }}:</span> {{ val }}</p>
      </div>

    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      imgPath: '',
      message: ''
    }
  },
  mounted() {
    this.message = this.$store.state.message.notificationMsg
    // this.message = {
    //   '类型': '订单状态变更通知',
    //   '通知': '买家已经成功付款，请尽快发货',
    //   '商品': '11',
    //   '订单编号': 'DD200616164618BB3S',
    //   '价格': 1.00
    // }
    if (this.message.类型.indexOf('订单') > -1) {
      this.imgPath = require('@/assets/images/u5167.png')
    } else if (this.message.类型.indexOf('售后') > -1) {
      this.imgPath = require('@/assets/images/u5176.png')
    }
  },
  methods: {
    close() {
      this.$store.dispatch('message/setNotify', false)
    }
  }
}
</script>
<style lang="scss">
.notify-wrap{
    position: fixed;
    right: 15px;
    bottom: 20px;
    width: 500px;
    font-size: 14px;
    padding: 14px 26px 14px 13px;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #e6ebf5;
    position: fixed;
    background-color: #fff;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
    transition: opacity .3s, transform .3s, left .3s, right .3s, top 0.4s, bottom .3s;
    overflow: hidden;
    .closeIcon{
        position: absolute;
        right: 15px;
        top: 15px;
    }
    .notify{
      display: flex;
      align-items: center;
      p{
        line-height: 20px;
        margin-bottom: 5px;
      }
      p:first-of-type{
        color: #FF3300;
        span{
            display: none;
        }
      }
      p:nth-of-type(1){
        span{
          display: none;
        }
      }
      img{
        width: 66px;
        height: 66px;
        border-radius:8px;
        margin-right: 15px;
      }
      .title{
        font-weight: bold;
      }
      .price{
        color: #FFBA00;
        font-size: 18px;
      }
    }
  }
</style>
