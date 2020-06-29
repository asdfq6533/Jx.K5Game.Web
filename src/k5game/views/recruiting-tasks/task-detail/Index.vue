<template>
  <div class="page-content">
    <el-card class="my-card">
      <div class="container">
        <div class="left">
          <el-page-header content="任务详情" style="margin-bottom: 20px" @back="goBack" />
          <div class="content">
            <div class="detailForm">
              <div v-if="linkError" class="tips">
                <svg-icon icon-class="tips" class="nav-icon tips-icon" />
                <p>链接错误,订单已停止</p>
              </div>
              <div class="formWrap">
                <div class="group-item">
                  <label>完成状态：</label>
                  <p style="color:red">{{ detail.inviteStatus }}</p>
                </div>
                <div class="group-item">
                  <label>手机号：</label>
                  <p>{{ detail.phoneNum }}</p>
                </div>
                <div class="group-item">
                  <label>邀请链接：</label>
                  <p>{{ detail.link }}</p>
                </div>
                <div class="group-item">
                  <label>下单渠道：</label>
                  <p>{{ detail.sources }}</p>
                </div>
                <div v-if="chooseTaobao" class="group-item">
                  <label>订单号：</label>
                  <p>{{ detail.taobaoOrderId }}</p>
                </div>
                <div v-if="chooseWeixin" class="group-item">
                  <label>客户微信号：</label>
                  <p>{{ detail.wx }}</p>
                </div>
                <div class="group-item">
                  <label>邀请人数：</label>
                  <p>{{ detail.linkCount }}</p>
                </div>
                <div class="group-item">
                  <label>邀请用户等级要求：</label>
                  <p>{{ detail.linkLevel }}</p>
                </div>
                <div class="group-item">
                  <label>费用：</label>
                  <p>{{ detail.totalAmount }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="inviteList">
            <el-form>
              <el-table
                :data="linkAccountList"
                style="width: 100%"
              >
                <el-table-column
                  prop="index"
                  label="序列"
                  width="100"
                />
                <el-table-column
                  prop="Account"
                  label="被邀请用户"
                  width="200"
                />
                <el-table-column
                  prop="inviteTime"
                  label="邀请时间"
                >
                  <template v-slot="scope">
                    {{ scope.row.Regdate | timeFormatNotUtc }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="Level"
                  label="被邀请用户等级"
                />
                <el-table-column
                  prop="operate"
                  label="操作"
                >
                  <template v-slot="scope">
                    <div class="icons-operate">
                      <a href="javascript:void(0)" @click="refresh(scope.row)">
                        <p>刷新</p>
                      </a>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-form>
          </div>
          <div class="logList">
            <div class="logBtn">
              <label @click="showLogs">查看日志</label>
              <i v-if="logShow" class="el-icon-arrow-up" />
              <i v-else class="el-icon-arrow-down" />
            </div>
            <div v-if="logShow" class="infinite-list-wrapper" style="overflow:auto">
              <el-timeline>
                <el-timeline-item
                  v-for="(activity, index) in logLists"
                  :key="index"
                  :timestamp="activity.creationTime | timeFormatNotUtc"
                  placement="top"
                >
                  <!-- <p>操作时间：{{ activity.timestamp }}</p> -->
                  <p>操作人：{{ activity.userName }}</p>
                  <p>操作内容：{{ activity.action }}</p>
                  <p>备注：{{ activity.remark }}</p>
                </el-timeline-item>
              </el-timeline>
              <p v-if="loading" class="getMore" @click="getMore()">加载更多...</p>
              <p v-if="noMore" class="noMore">没有更多了</p>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as murlocSkinApi from '@/api/murloc-skin'
// import config from '@/config'
export default {
  name: 'TaskDetail',
  data() {
    return {
      chooseTaobao: false,
      chooseWeixin: false,
      linkAccountList: [],
      detail: {},
      logLists: [],
      loading: false,
      noMore: false,
      logShow: false,
      linkError: false,
      id: ''
    }
  },
  computed: {

  },
  created() {
    this.id = this.$route.query.id
    // this.getDetail()
    this.refresh()
    this.getLogs()
  },
  mounted() {
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getDetail() {
      if (!this.id) {
        return
      }
      const params = {
        id: this.id
      }
      murlocSkinApi.GetAllFishSkinOrders(params).then(res => {
        if (res.data.success === true) {
          this.detail = res.data.result.items[0]
          if (this.detail.linkAccounts) {
            this.linkAccountList = JSON.parse(this.detail.linkAccounts)
            for (let i = 0; i < this.linkAccountList.length; i++) {
              this.$set(this.linkAccountList[i], 'index', i + 1)
            }
          }
          if (this.detail.status === 0 || this.detail.status === -1) {
            this.$set(this.detail, 'inviteStatus', '未完成')
          } else if (this.detail.status === 1) {
            for (let i = 0; i < this.linkAccountList.length; i++) {
              if (this.linkAccountList[i].Level < 20 || this.linkAccountList[i].Level === '暂无信息') {
                this.$set(this.detail, 'inviteStatus', '未完成')
                break
              } else {
                this.$set(this.detail, 'inviteStatus', '已完成')
              }
            }
          } else if (this.detail.status === 2) {
            this.$set(this.detail, 'inviteStatus', '已停止')
            this.linkError = true
          }
          console.log(this.detail)
          if (this.detail.sources.indexOf('淘宝') > -1) {
            this.chooseWeixin = false
            this.chooseTaobao = true
          } else if (this.detail.sources.indexOf('微信') > -1) {
            this.chooseWeixin = true
            this.chooseTaobao = false
          } else {
            this.chooseTaobao = false
            this.chooseWeixin = false
          }
        }
      })
    },
    refresh() {
      const params = {
        id: this.id
      }
      murlocSkinApi.GetLevelbyAccountAndSerice(params).then(res => {
        // eslint-disable-next-line no-empty
        if (res.data.success === true) {
          this.getDetail()
        }
      })
    },
    getMore() {
      this.params.skipCount++
      this.loading = false
      this.getLogs()
    },
    getLogs() {
      const id = this.$route.query.id
      if (!id) {
        return
      }
      const params = {
        OrederId: id,
        maxResultCount: 10,
        skipCount: 0,
        sorting: 'CreationTime Desc'
      }
      murlocSkinApi.GetPagedFishOrderLog(params).then(res => {
        // eslint-disable-next-line no-empty
        if (res.data.success === true) {
          const result = res.data.result
          if (result.items.length <= 10) {
            this.loading = false
            this.noMore = true
            this.logLists = result.items
          } else {
            this.loading = true
            this.logLists = this.logLists.push(res.data.result.items)
          }
        }
      })
    },
    showLogs() {
      this.logShow = !this.logShow
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/variables';
.container{
  p{
    padding: 0;
    margin: 0;
  }
}
.content{
  padding: 10px 20px;
}
.left{
  width: 100%;
}
.detailForm{
  color:#303133;
  width: 800px;
  .formWrap{
    padding: 20px 0  ;
    .group-item{
      display: flex;
      margin-bottom: 25px;
      label{
        color:#7d7d7d;
        min-width: 145px;
        text-align: right;
        font-weight: normal;
        margin-right: 10px;
      }
    }
  }
}
.inviteList{
  width:800px;
  margin-left:30px ;
  margin-bottom: 20px;
  .icons-operate{
    p{
      font-size: 14px;
    }
  }
}
.logList{
  padding: 30px;
  .logBtn{
    display: flex;
    align-items: center;
    color: #7d7d7d;
    margin-bottom: 15px;
    label{
      border: none;
      background: none;
      margin-right: 5px;
      color: #7d7d7d;
    }
    i{
      font-size: 18px;
    }
  }
  p{
    color: #909399;
  }
  .noMore,.getMore{
    margin-left: 70px;
    font-size: 12px;
  }
}
.tips{
  display: flex;
  align-items: center;
  margin-left: 50px;
  .svg-icon{
    font-size: 20px;
    margin-right: 10px;
  }
  p{
    color: #ff4949;
  }
}
</style>
