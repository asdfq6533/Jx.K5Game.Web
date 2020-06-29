<template>
  <div class="page-content">
    <div class="formDetail">
      <form-detail title="基本信息">
        <div class="group">
          <div class="group-item">
            <label>商品名称：</label>
            <p>{{ detail.title }}</p>
          </div>
          <div class="group-item">
            <label>游戏名称：</label>
            <p>{{ getGameName }}</p>
          </div>
          <div class="group-item">
            <label>游戏区服：</label>
            <p>{{ platform }}</p>
          </div>

          <div class="group-item">
            <label>价格：</label>
            <p>{{ detail.activityPrice?detail.activityPrice:detail.price }}</p>
          </div>
          <div class="group-item">
            <label>商品状态：</label>
            <p>{{ status }}</p>
          </div>
          <div class="group-item">
            <label>销售模式：</label>
            <p>{{ detail.saleMode }}</p>
          </div>
        </div>
        <div class="group">
          <div>
            <label>商品图片：</label>
          </div>
          <div>
            <p class="imgTip">图片尺寸800*800，大小≤1M，支持gif，jpg，jpeg，png格式，默认第一张为首图</p>
            <div>
              <img v-for="(item,key) in imgList" :key="key" :src="item" alt="">
            </div>
          </div>
        </div>
        <div class="group">
          <div class="group-item" style="width:100%">
            <label>商品描述：</label>
            <p>{{ detail.detail }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item" style="width:100%">
            <label>商品标签：</label>
            <p>{{ commodityLabelStr }}</p>
          </div>
        </div>
        <div class="group">
          <div v-for="(val, prop, index) in baseInfo" :key="index" class="group-item">
            <label>{{ prop + '：' }}</label>
            <p v-html="val" />
          </div>
        </div>
      </form-detail>
      <form-detail title="补充信息">
        <div class="group">
          <div class="group-item">
            <label>游戏账号：</label>
            <p>{{ sensInfo.account }}</p>
          </div>
          <div class="group-item">
            <label>游戏密码：</label>
            <p>{{ sensInfo.password }}</p>
          </div>
          <div class="group-item">
            <label>手机绑定：</label>
            <p>{{ saleAccounts.isBindPhone?'是':'否' }}</p>
          </div>
          <div v-if="saleAccounts.isBindPhone" class="group-item">
            <label>绑定手机：</label>
            <p>{{ sensInfo.bindPhone }}</p>
          </div>
          <div class="group-item">
            <label>邮箱绑定：</label>
            <p>{{ saleAccounts.isBindEmail?'是':'否' }}</p>
          </div>
          <div v-if="saleAccounts.isBindEmail" class="group-item">
            <label>邮箱账号：</label>
            <p>{{ sensInfo.bindEmail }}</p>
          </div>
          <div v-if="saleAccounts.isBindEmail" class="group-item">
            <label>邮箱密码：</label>
            <p>{{ sensInfo.emailPassword }}</p>
          </div>
          <div class="group-item">
            <label>设置密保：</label>
            <p>{{ sensInfo.encryptedForm?'是':'否' }}</p>
          </div>
        </div>
        <div v-for="(item, index) in sensInfo.encryptedForm" :key="index" class="group">
          <div class="group-item">
            <label>密保问题{{ index + 1 }}：</label>
            <p>{{ item.questionVal }}</p>
          </div>
          <div class="group-item">
            <label>密保答案{{ index + 1 }}：</label>
            <p>{{ item.answerVal }}</p>
          </div>
        </div>
      </form-detail>
      <form-detail title="卖家联系信息">
        <div class="group">
          <div class="group-item">
            <label>卖家：</label>
            <p>{{ sallerUser.nickName }}</p>
          </div>
          <div class="group-item">
            <label>卖家手机号：</label>
            <p>{{ sallerUser.phoneNumber }}</p>
          </div>
          <div class="group-item">
            <label>卖家微信号：</label>
            <p>{{ sallerUser.wx }}</p>
          </div>
          <div class="group-item">
            <label>卖家QQ：</label>
            <p>{{ sallerUser.qq }}</p>
          </div>
        </div>
        <div class="group">
          <el-button type="primary" @click="approve">审核通过</el-button>
          <el-button @click="refused">审核拒绝</el-button>
        </div>
      </form-detail>
    </div>
    <tips-dialog
      v-model="isDialogShow"
      :title="title"
      @onRefresh="search"
      @submit="submit"
    >
      <div class="checkDialog">
        <p class="tips">{{ message }}</p>
        <div v-if="!params.isPass" class="refuseForm">
          <label><span>*</span> 拒绝说明：</label>
          <el-input
            v-model="params.remark"
            type="textarea"
            :autosize="{ minRows: 3}"
            maxlength="200"
            placeholder="请输入拒绝原因，最多200字"
          />
        </div>

      </div>
    </tips-dialog>
  </div>
</template>

<script>
import FormDetail from '@/k5game/components/FormDetail'
import * as accountTransictionApi from '@/api/account-transaction'
import TipsDialog from '@/k5game/components/TipsDialog'
import config from '@/config'
export default {
  name: 'AccountProductDetail',
  components: { FormDetail, TipsDialog },
  data() {
    return {
      isDialogShow: false,
      title: '',
      detail: '',
      sensInfo: '',
      baseInfo: '',
      commodityLabelStr: '',
      saleAccounts: '',
      imgList: [],
      sallerUser: '',
      platform: '',
      productStatus: [
        {
          id: 0,
          name: '待审核'
        },
        {
          id: 2,
          name: '销售中'
        },
        {
          id: 3,
          name: '已出售'
        },
        {
          id: 4,
          name: '已下架'
        },
        {
          id: -1,
          name: '审核失败'
        }
      ],
      status: '',
      params: {
        ids: '',
        remark: '',
        isPass: true
      },
      checker: '',
      checkRemark: ''
    }
  },
  computed: {
    getGameName() {
      const list = this.$store.state.game.list
      let gameName = ''
      list.some(item => {
        if (item.id === this.detail.gameId) {
          gameName = item.name
          return true
        }
      })
      return gameName
    }
  },
  created() {
    this.getProductDetail()
  },
  mounted() {

  },
  methods: {
    getProductDetail() {
      accountTransictionApi.GetCommodityDetailsAsync({ id: this.$route.query.id }).then(res => {
        if (res.data.success) {
          this.detail = res.data.result
          this.saleAccounts = this.detail.saleAccounts[0]
          this.sensInfo = JSON.parse(this.detail.saleAccounts[0].sensInfo)
          const baseInfo = JSON.parse(this.detail.saleAccounts[0].baseInfo)
          // eslint-disable-next-line no-unused-vars
          const { platform, ...data } = baseInfo
          this.baseInfo = data
          this.platform = baseInfo.platform
          this.detail.commodityLabelStr.some(item => {
            this.commodityLabelStr += item + '，'
          })
          this.productStatus.some(item => {
            if (this.detail.status === item.id) {
              this.status = item.name
            }
          })
          this.commodityLabelStr = this.commodityLabelStr.substring(0, this.commodityLabelStr.length - 1)
          const img = this.detail.imagePath.split('|')
          img.some(item => {
            this.imgList.push(config.baseUrl + config.pictureUrl + item)
          })
          this.sallerUser = this.detail.sallerUser
        }
      })
    },
    refused() {
      this.params.ids = []
      this.params.ids.push(this.detail.id)
      this.params.isPass = false
      this.isDialogShow = true
      this.title = '审核拒绝提示'
    },
    approve() {
      this.params.ids = []
      this.params.ids.push(this.detail.id)
      this.params.isPass = true
      this.isDialogShow = true
      this.title = '审核通过提示'
      this.message = '确定要审核通过' + this.detail.title + '这个商品吗，审核通过后将展示在商品列表中。'
    },
    submit() {
      if (!this.params.isPass) {
        if (!this.params.remark) {
          this.$message.error('请输入拒绝原因')
          return
        }
      }
      this.isDialogShow = false
      this.examineCommodity()
    },
    // 审核商品
    examineCommodity() {
      accountTransictionApi.ExamineCommodityAsync(this.params).then(res => {
        if (res.data.success) {
          if (this.params.isPass) {
            this.UpperShelfCommodityAsync(this.params.ids)
          } else {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.$router.go(-1)
          }
        }
      })
    },
    // 上架商品
    UpperShelfCommodityAsync(ids) {
      const params = {
        ids: ids
      }
      accountTransictionApi.UpperShelfCommodityAsync(params).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$router.go(-1)
        }
      })
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
  .formDetail{
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
      img{
        width: 80px;
        height: 80px;
        margin-right: 10px;
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
}
.checkDialog{
  .refuseForm{
    display: flex;
    label{
      flex-shrink: 0;
    }
    span{
      color: red;
    }
  }
}
</style>
