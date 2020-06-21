<template>
  <div class="page-content">
    <el-card class="my-card">
      <div class="container">
        <div class="left">
          <div>
            <page-header
              title="用户信息"
            />
          </div>
          <div class="content">
            <div class="detailForm">
              <div class="head">
                <p>基本信息</p>
              </div>
              <div class="formWrap" style="display:block;">
                <div class="group-item">
                  <label>用户昵称：</label>
                  <p>{{ detail.nickName }}</p>
                </div>
                <div class="group-item">
                  <label>头像：</label>
                  <el-image
                    style="width: 120px; height: 120px"
                    :src="imgUrl"
                    :preview-src-list="srcList"
                  />
                </div>
              </div>
            </div>
            <div class="detailForm">
              <div class="head">
                <p>认证信息</p>
              </div>
              <div class="formWrap">
                <div class="group-item">
                  <label>手机号：</label>
                  <p>{{ detail.phoneNumber }}</p>
                </div>
                <div class="group-item">
                  <label>微信号：</label>
                  <p>{{ detail.wx }}</p>
                </div>
                <div class="group-item">
                  <label>QQ：</label>
                  <p>{{ detail.qq }}</p>
                </div>
                <div class="group-item">
                  <label>身份证号码：</label>
                  <p>{{ detail.idCard }}</p>
                </div>
                <div class="group-item">
                  <label>邮箱信息：</label>
                  <p>{{ detail.emailAddress }}</p>
                </div>
              </div>
            </div>
            <div class="detailForm">
              <div class="head">
                <p>其他信息</p>
              </div>
              <div class="formWrap">
                <div class="group-item">
                  <label>注册时间：</label>
                  <p>{{ detail.creationTime | timeFormatNotUtc }}</p>
                </div>
                <div class="group-item">
                  <label>上次登录时间：</label>
                  <p>{{ detail.lastLoginTime | timeFormatNotUtc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div></div></el-card>
  </div>
</template>

<script>
import PageHeader from '@/k5game/components/PageHeader'
import config from '@/config'
import * as userManageApi from '@/api/user-manage'
export default {
  name: 'UserDetail',
  components: { PageHeader },
  data() {
    return {
      imgUrl: '',
      srcList: [],
      detail: []
    }
  },
  computed: {
    getGameName() {
      const list = this.$store.state.game.list
      let gameName = ''
      list.some(item => {
        if (item.id === this.dataInfo.gameId) {
          gameName = item.name
          return true
        }
      })
      return gameName
    }
  },
  created() {
    this.getUserDetail()
  },
  mounted() {
  },
  methods: {
    getUserDetail() {
      const id = this.$route.query.id
      if (!id) {
        return
      }
      const params = {
        id: id
      }
      userManageApi.GetUserDetail(params).then(res => {
        if (res.data.success === true) {
          this.detail = res.data.result
          if (!this.detail.profilePictureId) {
            this.imgUrl = config.baseUrl + config.pictureUrl + 'default2.jpg'
            this.srcList.push(this.imgUrl)
          } else {
            this.imgUrl = this.detail.profilePictureId
            this.srcList.push(this.imgUrl)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables';
.container{
  display: flex;
  p{
    padding: 0;
    margin: 0;
  }
}
.my-card{
  /deep/.el-card__body{
    padding: 0 !important;
  }
  padding: 0;
}
.content{
  padding: 10px 20px;
}
.left{
  width: 100%;
}
.detailForm{
  color:#303133;
  .head{
    font-weight: bold;
    position: relative;
    height: 30px;
  }
  .head::after{
    content: '';
    height: 2px;
    width: 100%;
    background: rgb(255, 153, 51);
    position: absolute;
    bottom: 0;
  }
  .formWrap{
    padding: 20px 0 100px 0 ;
    display: flex;
    flex-wrap: wrap;
    .group-item{

      display: flex;
      margin-bottom: 15px;
      width: 33%;
      label{
        color:#7d7d7d;
        min-width: 110px;
        text-align: right;
        font-weight: normal;
        margin-right: 10px;
      }
    }
  }
}
</style>
