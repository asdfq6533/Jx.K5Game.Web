<template>
  <div class="page-content">
    <div class="game-detail">
      <h3 class="game-name">{{ detail.name }}</h3>
      <div class="form-table">
        <div class="group">
          <div class="group-item">
            <label>游戏名称</label>
            <p>{{ detail.name }}</p>
          </div>
          <div class="group-item">
            <label>游戏类型</label>
            <p>{{ detail.gameType }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>原版名称</label>
            <p>{{ detail.nameEN }}</p>
          </div>
          <div class="group-item">
            <label>游戏平台</label>
            <p>{{ detail.gamePlatform }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>别名</label>
            <p>{{ detail.nameST }}</p>
          </div>
          <div class="group-item">
            <label>手续费（%）</label>
            <p>{{ detail.feeExtra }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>游戏币名称</label>
            <p>{{ detail.coinName }}</p>
          </div>
          <div class="group-item">
            <label>展示状态</label>
            <p>{{ detail.flag>0?'未展示':'展示中' }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>游戏图片</label>
            <div>
              <p class="imgTips">
                图片尺寸建议400*400，大小≤1M，支持jpg，jpeg，png格式
              </p>
              <img :src="getPictureUrl()" class="avatar">
            </div>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>账号交易热门推荐</label>
            <p>{{ isTradeHot }}</p>
          </div>
          <div class="group-item">
            <label>排序</label>
            <p>{{ detail.tradeHot }}</p>
          </div>
        </div>
        <div class="group">
          <div class="group-item">
            <label>游戏代练热门推荐</label>
            <p>是</p>
          </div>
          <div class="group-item">
            <label>排序</label>
            <p>{{ detail.levelingHot }}</p>
          </div>
        </div>
      </div>
      <div class="form-table">
        <h3 class="form-title"> 游戏区服</h3>
        <div class="addForm">
          <el-button
            v-if="allAreaShow"
            class="showAll"
            type="text"
            size="mini"
            @click="showAllArea"
          >
            展开全部
          </el-button>
          <el-button
            v-else
            class="showAll"
            type="text"
            size="mini"
            @click="collapseAllArea"
          >
            收起全部
          </el-button>
          <el-tree
            ref="gameServicesTree"
            :data="gameServices"
            node-key="number"
            :default-expand-all="false"
            empty-text=""
            @node-click="handleServicesNodeClick"
          >
            <span slot-scope="{node, data}" class="custom-tree-node">
              <span>
                {{ data.name }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="form-table">
        <h3 class="form-title">游戏等级</h3>
        <div v-if="detail.gameGrades" class="addForm">
          <el-button
            v-if="gradeAllShow"
            class="showAll"
            type="text"
            size="mini"
            @click="showAllGrade"
          >
            展开全部
          </el-button>
          <el-button
            v-else
            class="showAll"
            type="text"
            size="mini"
            @click="collapseAllgrade"
          >
            收起全部
          </el-button>
          <el-tree
            ref="gradeTree"
            :data="gameGrades"
            node-key="number"
            :default-expand-all="false"
            empty-text=""
            @node-click="handleGradeNodeClick"
          >
            <span slot-scope="{node, data}" class="custom-tree-node">
              <span>
                {{ data.name }}
              </span>
            </span>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import config from '@/config'
// eslint-disable-next-line no-unused-vars
import * as gameInfoApi from '@/api/gameInfo'
export default {
  name: 'Index',
  data() {
    return {
      detail: {},
      gradeAllShow: true,
      allAreaShow: true,
      gameServices: [],
      gameGrades: [],
      isTradeHot: '是'
    }
  },
  computed: {
  },
  watch: {
  },
  created() {

  },
  mounted() {
    this.detail = JSON.parse(window.sessionStorage.getItem('gameInfo'))
    if (this.detail.tradeHot >= 0 && this.detail.tradeHot <= 10) {
      this.isTradeHot = '是'
    } else {
      this.isTradeHot = '否'
      this.detail.tradeHot = ''
    }
    if (this.detail.levelingHot >= 0 && this.detail.levelingHot <= 10) {
      this.isLevelingHot = '是'
    } else {
      this.isLevelingHot = '否'
      this.detail.levelingHot = ''
    }
    if (this.detail.gameGrades) {
      this.gameGrades = JSON.parse(this.detail.gameGrades)
    }
    this.getService()
  },
  methods: {
    // 获取游戏区服
    getService() {
      gameInfoApi.GetGameService({ gameId: this.detail.id }).then(res => {
        if (res.data.success) {
          const item = res.data.result.items
          item.some(item => {
            if (item.name.indexOf('-') > -1) {
              const name = item.name.split('-')[1]
              this.$set(item, 'name', name)
            }
            this.$set(item, 'number', item.id)
          })
          this.gameServices = this.getTRreeArray(res.data.result.items)
        }
      })
    },
    // 获取树形数组
    getTRreeArray(list) {
      const obj = {}
      const result = []
      list.map(el => {
        obj[el.id] = el
      })
      for (let i = 0, len = list.length; i < len; i++) {
        // 父级id
        const id = list[i].parentId
        // 没父级
        if (!id) {
          result.push(list[i])
          continue
        }
        // 有父级
        if (obj[id].children) {
          obj[id].children.push(list[i])
        } else {
          obj[id].children = [list[i]]
        }
      }
      return result
    },
    getPictureUrl() {
      return config.baseUrl + config.pictureUrl + this.detail.pictureUrl
    },
    // 展开全部游戏区服
    showAllArea() {
      this.allAreaShow = false
      const self = this
      const treeList = this.gameServices
      for (let i = 0; i < treeList.length; i++) {
        self.$refs.gameServicesTree.store.nodesMap[treeList[i].number].expanded = true
      }
    },
    // 收起全部游戏区服
    collapseAllArea() {
      this.allAreaShow = true
      const self = this
      const treeList = this.gameServices
      for (let i = 0; i < treeList.length; i++) {
        self.$refs.gameServicesTree.store.nodesMap[treeList[i].number].expanded = false
      }
    },
    // 点击展开区服
    handleServicesNodeClick(data, node) {
      console.log(node)
      if (node.expanded) {
        this.allAreaShow = false
      } else {
        this.allAreaShow = true
      }
    },
    // 展开全部游戏等级
    showAllGrade() {
      this.gradeAllShow = false
      const self = this
      const treeList = this.gameGrades
      for (let i = 0; i < treeList.length; i++) {
        self.$refs.gradeTree.store.nodesMap[treeList[i].number].expanded = true
      }
    },
    // 收起全部游戏等级
    collapseAllgrade() {
      this.gradeAllShow = true
      const self = this
      const treeList = this.gameGrades
      for (let i = 0; i < treeList.length; i++) {
        self.$refs.gradeTree.store.nodesMap[treeList[i].number].expanded = false
      }
    },
    // 点击展开游戏等级
    handleGradeNodeClick(data, node) {
      if (node.expanded) {
        this.gradeAllShow = false
      } else {
        this.gradeAllShow = true
      }
    }
  }
}
</script>
<style lang="scss">
.game-detail{
  padding-left: 10px;
  .game-name{
    font-size: 18px;
    margin-bottom: 20px;
  }
  .form-table{
    .form-title{
      margin-top: 40px;
      position: relative;
      padding-left: 20px;
      font-size: 16px;
      margin-bottom: 15px;
    }
    .form-title::before{
      content: '';
      width: 5px;
      height: 20px;
      background: #ff9900;
      position: absolute;
      left: 0;
      top: 1px;
    }
    .group{
      display: flex;
      .group-item{
        width: 50%;
        display: flex;
        align-items: flex-start;
        min-height: 35px;
        font-size: 13px;
        label{
          color: #868686;
          font-weight: normal;
          font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
          min-width: 80px;
          margin-right: 20px;
        }
      }
      .imgTips{
        font-size: 12px;
        color: #999;
        margin-top: 3px;
      }
      .avatar{
        width: 70px;
        height: 70px;
        margin-bottom: 20px;
        margin-top: 5px;
      }
    }
  }
  .el-tree-node__content{
    height: 28px!important;
    .custom-tree-node{
      span{
        font-size: 13px;
      }
    }
  }
}
.addForm{
  display: flex;
  align-items: flex-start;
  .showAll{
    height: 28px;
    margin-right: 10px;
  }
}
  .el-button--text{
   color: #02A7F0;
 }
</style>
