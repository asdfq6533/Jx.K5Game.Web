<template>
  <div class="page-content">
    <div class="formDetail">
      <form-detail title="基本信息">
        <div class="group">
          <div class="group-item">
            <label>商品名称：</label>
            <p>34级-多个英雄-带6300英雄-好名字</p>
          </div>
          <div class="group-item">
            <label>游戏名称：</label>
            <p>王者荣耀</p>
          </div>
          <div class="group-item">
            <label>销售模式：</label>
            <p>寄售交易</p>
          </div>
          <div class="group-item">
            <label>商品账号：</label>
            <p>42343424@qq.com</p>
          </div>
          <div class="group-item">
            <label>游戏密码：</label>
            <p>qweasd</p>
          </div>
          <div class="group-item">
            <label>价格¥：</label>
            <p>200</p>
          </div>
        </div>
        <div class="group">
          <div>
            <label>商品图片：</label>
          </div>
          <div>
            <p class="imgTip">图片尺寸800*800，大小≤1M，支持gif，jpg，jpeg，png格式，默认第一张为首图</p>
            <div>
              <img src="" alt="">
            </div>
          </div>
        </div>
      </form-detail>
      <form-detail title="补充信息">
        <div class="group">
          <div class="group-item">
            <label>手机绑定：</label>
            <p>是</p>
          </div>
          <div class="group-item">
            <label>绑定手机：</label>
            <p>13333331234</p>
          </div>
          <div class="group-item">
            <label>邮箱绑定：</label>
            <p>是</p>
          </div>
          <div class="group-item">
            <label>邮箱账号：</label>
            <p>42343424@qq.com</p>
          </div>
          <div class="group-item">
            <label>邮箱密码：</label>
            <p>qweasd</p>
          </div>
        </div>
      </form-detail>
      <form-detail title="卖家联系信息">
        <div class="group">
          <div class="group-item">
            <label>卖家：</label>
            <p>k5电竞经销商</p>
          </div>
          <div class="group-item">
            <label>卖家手机号：</label>
            <p>15012341234</p>
          </div>
          <div class="group-item">
            <label>卖家微信号：</label>
            <p>15012341234</p>
          </div>
          <div class="group-item">
            <label>卖家QQ：</label>
            <p>2412238455</p>
          </div>
        </div>
      </form-detail>
      <form-detail title="审核信息">
        <div v-if="checkPending" class="group">
          <div class="group-item">
            <label><span>*</span>&nbsp;审核备注：</label>
            <el-input
              v-model="checkReport"
              type="textarea"
              :autosize="{ minRows: 3}"
              placeholder="请输入审核意见，最多200字"
              maxlength="200"
              style="flex:1"
            />
          </div>
        </div>
        <div v-if="checkPending" class="group">
          <el-button>审核拒绝</el-button>
          <el-button type="primary">审核通过</el-button>
        </div>
        <div v-if="!checkPending" class="group">
          <div class="group-item">
            <label>审核人：</label>
            <p>张三</p>
          </div>
        </div>
        <div v-if="!checkPending" class="group">
          <div class="group-item">
            <label>审核备注：</label>
            <p>通过</p>
          </div>
        </div>
      </form-detail>
    </div>
  </div>
</template>

<script>
import FormDetail from '@/k5game/components/FormDetail'
import productMixin from '../mixins/productMixin'
import productScrollMixin from '../mixins/productScrollMixin'
import config from '@/config'
export default {
  name: 'AccountProductDetail',
  components: { FormDetail },
  mixins: [productMixin, productScrollMixin],
  data() {
    return {
      checkReport: '',
      checkPending: false
    }
  },
  computed: {

  },
  created() {
    this.getProductDetail()
  },
  mounted() {

  },
  methods: {
    getPicUrl(val) {
      return config.baseUrl + val
    }
  }
}
</script>

<style lang="scss" >
@import '~@/styles/variables';
.page-content{
  background: #fff;
  p{
    margin: 0;
    padding: 0;
  }
  .container{
    padding: 20px 10px;
    .group{
      display: flex;
      flex-wrap: wrap;
      label{
          font-weight: normal;
          color: #7d7d7d;
          width: 110px;
          text-align: right;
          display: block;
          span{
            color: red;
          }
        }
      .group-item{
        color: #303133;
        display: flex;
        width: 30%;
        padding: 5px 0;
        margin-bottom: 20px;
        p{
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          flex: 1;
        }
      }
      .imgTip{
        color:rgb(153, 153, 153);
        font-size: 12px;
        line-height: 24px;
      }
      .auditStatus{
        color:red
      }

      button{
        width: 200px;
        height: 36px;
        margin-right: 35px;
        margin-left:30px ;
      }
    }
  }
}

</style>
