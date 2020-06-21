<template>
  <div class="page-content">
    <el-card>
      <div>
        <el-page-header content="查看审核" @back="goBack" />
      </div>
      <div class="container">
        <ul>
          <li v-for="(item, key) in dataList" :key="key">
            <h1>{{ item.name }}</h1>
            <div class="img-content">
              <img
                v-if="item.picUrl"
                :src="baseUrl + item.picUrl"
              >
              <img
                v-if="item.picUrl"
                :src="baseUrl + item.picUrl"
                :preview="key"
                :preview-text="item.name"
                class="full-img"
              >
              <div v-if="item.isPass !== null" class="cover" />
              <div class="content">
                <div>
                  <p v-if="item.isPass !== null">
                    {{ item.isPass ? '通过' : '不通过' }}
                  </p>
                </div>
                <p v-if="!item.isPass && item.unpassInfo">
                  {{ item.unpassInfo }}
                </p>
              </div>
            </div>
            <div class="btns">
              <el-button type="primary" @click="passClick(true, item)">通过</el-button>
              <el-button type="info" @click="passClick(false, item)">不通过</el-button>
            </div>
          </li>
        </ul>
        <div v-if="dataList.length" class="right">
          <div style="padding-top: 80px;">
            <el-switch
              v-model="isDelete"
              active-text="作废"
              inactive-text="继续"
            />
          </div>
          <el-button :disabled="getAuditData.status === -1 || getAuditData.status === 2" type="primary" @click="auditTask">结算提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import * as taskService from '@/api/task-service'
import commonMixin from '@/k5game/mixins/common-mixin'
import config from '@/config'
export default {
  name: 'TaskAuditDetail',
  mixins: [commonMixin],
  data() {
    return {
      isGoOnOrDeleteShow: false,
      dataList: [],
      baseUrl: config.baseUrl,
      isDelete: false,
      remark: ''
    }
  },
  computed: {
    getAuditData() {
      return this.$store.state.task.taskAuditData
    }
  },
  created() {
    this.getAuditsList()
  },
  methods: {
    goBack() {
      this.closeSelectedTag('TaskAudit')
    },
    auditTask() {
      if (this.isDelete) {
        this.$prompt('请输入原因', '审核', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '原因不能为空'
        }).then(({ value }) => {
          this.sendAuthRequest(value)
        })
      } else {
        this.$confirm('是否通过审核', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendAuthRequest('')
        })
      }
    },
    sendAuthRequest(value) {
      const params = {
        receivingId: this.$route.query.id,
        isDelete: this.isDelete,
        remark: value
      }
      taskService.CheckTaskPassAsync(params).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$store.commit('task/SET_TASK_AUDIT_LIST', [])
          this.closeSelectedTag('TaskAudit')
        }
      })
    },
    // 通过/不通过材料
    passClick(flag, item) {
      if (!item.picUrl) {
        this.$message({
          message: '用户还没上传图片！',
          type: 'error'
        })
        return
      }

      if (!flag) {
        this.$prompt('请输入原因', '审核', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S/,
          inputErrorMessage: '原因不能为空'
        }).then(({ value }) => {
          const params = {
            id: item.id,
            isPass: false,
            unpassInfo: value
          }
          this.auditMaterials(params)
        })
      } else {
        this.$confirm('你确定通过审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: item.id,
            isPass: true,
            unpassInfo: null
          }
          this.auditMaterials(params)
        })
      }
    },
    // 审核材料
    auditMaterials(params) {
      taskService.CheckTaskAuditsAsync(params).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getAuditsList()
        }
      })
    },
    // 获取任务列表
    getAuditsList() {
      const params = {
        id: this.$route.query.id
      }
      taskService.GetTaskAuditsListAsync(params).then(res => {
        const items = res.data.result
        this.handleData(items)
      })
    },
    handleData(items) {
      const tempArr = ['搜索页面', '浏览其他宝贝', '跟客服聊天截图', '宝贝付款截图', '评截图']
      const arr = []
      console.log(items)
      tempArr.map(temp => {
        items.some(obj => {
          if (obj.name.indexOf(temp) !== -1) {
            arr.push(obj)
            return true
          }
        })
      })
      this.dataList = arr
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/styles/mixin.scss';
.container {
  display: flex;
  align-items: flex-start;
  ul {
    display: flex;
    flex-wrap: wrap;
    h1{
      font-size: 14px;
    }
    li {
      list-style: none;
      margin-right: 20px;
      width: 180px;
      text-align: center;
      .img-content{
        position: relative;
        background: gray;
        height: 240px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .cover{
          background: #000;
          opacity: 0.6;
          position: absolute;
          top:0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .full-img {
          position: absolute;
          z-index: 999;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        img{
          width: 100%;
        }
        .content{
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          padding: 10px;
          color: white;
          & > div {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;
            font-size: 24px;
            padding-top: 10px;
            transform:rotate(-15deg);
          }
          & > p {
            text-align: left;
            font-size: 14px;
            @include text-overflow(4)
          }
        }
      }
      .btns {
        margin-top: 10px;
      }
    }
  }
  .right{
    margin-left:  40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    button {
      margin-top: 40px;
      height: 60px;
      width: 160px;
    }
  }
}
</style>
