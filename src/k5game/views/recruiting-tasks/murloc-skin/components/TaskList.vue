<template>
  <div>
    <div>
      <el-form id="search-form3" ref="form" :model="params" label-width="100px" label-position="right">
        <div class="group">
          <el-form-item label="订单号：" prop="id">
            <el-input v-model="params.id" placeholder="输入订单号" clearable />
          </el-form-item>
          <el-form-item label="手机号：" prop="phoneNum">
            <el-input v-model="params.phoneNum" placeholder="输入手机号" clearable />
          </el-form-item>
          <el-form-item label="邀请链接：" prop="link">
            <el-input v-model="params.link" placeholder="输入邀请链接" clearable />
          </el-form-item>
          <el-form-item label="被邀请账号：" prop="linkAccounts">
            <el-input v-model="params.linkAccounts" placeholder="输入电子邮箱" clearable />
          </el-form-item>
          <el-form-item label="下单渠道：" prop="sources">
            <el-select v-model="params.sources" placeholder="请选择">
              <el-option
                label="全部"
                value=""
              />
              <el-option
                label="k5电竞"
                value="k5电竞"
              />
              <el-option
                label="淘宝--匠心"
                value="淘宝--匠心"
              />
              <el-option
                label="淘宝--骏网"
                value="淘宝--骏网"
              />
              <el-option
                label="淘宝--柒柒"
                value="淘宝--柒柒"
              />
              <el-option
                label="淘宝--见中"
                value="淘宝--见中"
              />
              <el-option
                label="淘宝--无极"
                value="淘宝--无极"
              />
              <el-option
                label="微信--露露"
                value="微信--露露"
              />
              <el-option
                label="微信--k5"
                value="微信--k5"
              />
              <el-option
                label="微信--敏敏"
                value="微信--敏敏"
              />
              <el-option
                label="微信--盈盈"
                value="微信--盈盈"
              />
              <el-option
                label="微信--团子"
                value="微信--团子"
              />
              <el-option
                label="微信--机房"
                value="微信--机房"
              />
              <el-option
                label="补单"
                value="补单"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间：" prop="orderTime">
            <div class="chooseTime">
              <el-date-picker
                v-model="startTime"
                type="date"
                placeholder="起始时间"
              />
              <p class="line" />
              <el-date-picker
                v-model="endTime"
                type="date"
                placeholder="结束时间"
              />
            </div>
          </el-form-item>
          <!-- <el-form-item>
            <el-input v-model="params.filter" placeholder="模糊搜索" clearable />
          </el-form-item> -->
        </div>
      </el-form>
    </div>
    <div class="Btn">
      <el-form id="btnForm">
        <el-form-item>
          <el-button type="success" icon="el-icon-plus" @click="addTask">发布任务</el-button>
          <el-button type="primary" @click="exportChoice">导出勾选项</el-button>
          <el-button type="primary" @click="exportAll">导出搜索结果</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="reset">重置</el-button>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <lxz-table
      ref="multipleTable"
      :table-data="dataList"
      :columns="[
        { slot: 'selection' },
        { label: '订单号', prop: 'id',width: '170px'},
        { label: '手机号码', prop: 'phoneNum',width: '130px' },
        { label: '邀请链接', prop: 'link',width: '250px'},
        {slot:'linkAccounts'},
        { label: '下单渠道', prop: 'sources',width: '100px'},
        {label: '收款金额', prop: 'totalAmount',width: '100px'},
        {slot:'creationTime'},
        { slot: 'operate'}
      ]"
      :page-obj="pageObj"
      @handleSelectionChange="handleSelectionChange"
    >
      <el-table-column
        slot="selection"
        type="selection"
        width="45"
      />
      <el-table-column
        slot="creationTime"
        label="下单时间"
        width="150"
      >
        <template v-slot="scope">
          {{ scope.row.creationTime | timeFormatNotUtc }}
        </template>
      </el-table-column>
      <el-table-column
        slot="linkAccounts"
        label="被邀请账号"
        width="230"
      >
        <template v-slot="scope">
          {{ scope.row.linkAccountsStr }}
        </template>
      </el-table-column>
      <el-table-column
        slot="operate"
        label="操作"
        width="100"
        fixed="right"
      >
        <template v-slot="scope">
          <div class="icons-operate">
            <a href="javascript:void(0)">
              <p @click="goDtailProduct(scope.row)">查看</p>
            </a>
          </div>
        </template>
      </el-table-column>
    </lxz-table>
  </div>
</template>
<script>
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as murlocSkinApi from '@/api/murloc-skin'
import moment from 'moment'
export default {
  name: 'Index',
  components: { LxzTable },
  mixins: [listMixin],
  data() {
    return {
      list: null,
      tHeader: ['订单号', '手机号码', '邀请链接', '被邀请账号', '下单渠道', '收款金额', '下单时间'],
      tValue: ['id', 'phoneNum', 'link', 'linkAccountsStr', 'sources', 'totalAmount', 'creationTime'],
      startTime: null,
      endTime: null,
      params: {
        fishSkinOrder: '',
        phoneNum: '',
        link: '',
        linkAccounts: '',
        sources: '',
        startTime: '',
        endTime: '',
        sorting: '',
        creationtime: 'desc',
        maxResultCount: 10,
        skipCount: 0,
        role: 0
      },
      dataList: [],
      pageObj: {},
      roles: [],
      rolesList: [],
      id: '',
      checkList: [],
      filename: '导出数据',
      downloadLoading: false,
      autoWidth: true,
      bookType: 'xlsx',
      isExportAll: false
    }
  },
  computed: {

  },
  watch: {
    startTime(val) {
      this.params.startTime = moment(val).format('YYYY-MM-DD')
    },
    endTime(val) {
      this.params.endTime = moment(val).add(1, 'days').format('YYYY-MM-DD')
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      murlocSkinApi.GetAllFishSkinOrders(this.params).then(res => {
        if (res.data.success === true) {
          const result = res.data.result
          this.pageObj.totalCount = result.totalCount
          for (let i = 0; i < result.items.length; i++) {
            let linkAccounts = []
            let acounts = ''
            if (result.items[i].linkAccounts) {
              linkAccounts = JSON.parse(result.items[i].linkAccounts)
              for (let j = 0; j < linkAccounts.length; j++) {
                acounts += linkAccounts[j].Account + '，'
              }
              acounts = acounts.slice(0, -1)
              this.$set(result.items[i], 'linkAccountsStr', acounts)
            } else {
              linkAccounts = []
              this.$set(result.items[i], 'linkAccountsStr', '')
            }
          }
          this.dataList = result.items
        }
      })
    },
    refresh(row) {
      const params = {
        id: row.id
      }
      murlocSkinApi.GetLevelbyAccountAndSerice(params).then(res => {
        if (res.data.success === true) {
          this.getList()
        }
      })
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    search() {
      if (this.params.startTime > this.params.endTime) {
        this.$message({
          message: '结束时间不能小于开始时间',
          type: 'error'
        })
      } else {
        this.dataList = []
        this.getList()
      }
    },
    // 查看
    goDtailProduct(row) {
      this.$router.push({
        name: 'TaskDetail',
        query: {
          id: row.id
        }
      })
    },
    // 重置
    reset() {
      for (const key in this.params) {
        this.params[key] = ''
      }
      this.params.maxResultCount = 10
      this.params.role = 0
      this.params.skipCount = 0
    },
    addTask() {
      this.$emit('addTask')
    },
    // 导出勾选项
    exportChoice() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: '请勾选操作项',
          type: 'error'
        })
        return
      }
      this.list = this.multipleSelection
      this.handleDownload()
    },
    // 导出搜索结果
    exportAll() {
      this.params.maxResultCount = this.pageObj.totalCount
      this.params.role = 0
      this.params.skipCount = 0
      murlocSkinApi.GetAllFishSkinOrders(this.params).then(res => {
        if (res.data.success === true) {
          const result = res.data.result
          this.pageObj.totalCount = result.totalCount
          for (let i = 0; i < result.items.length; i++) {
            let linkAccounts = []
            let acounts = ''
            if (result.items[i].linkAccounts) {
              linkAccounts = JSON.parse(result.items[i].linkAccounts)
              for (let j = 0; j < linkAccounts.length; j++) {
                acounts += linkAccounts[j].Account + '，'
              }
              acounts = acounts.slice(0, -1)
              this.$set(result.items[i], 'linkAccountsStr', acounts)
            } else {
              linkAccounts = []
              this.$set(result.items[i], 'linkAccountsStr', '')
            }
          }
          this.list = result.items
          this.handleDownload()
        }
      })
    },
    handleDownload() {
      import('@/api//Export2Excel').then(excel => {
        const data = this.formatJson(this.tValue, this.list)
        // console.log(data)
        excel.export_json_to_excel({
          header: this.tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.isExportAll = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'creationTime') {
          return v[j] ? moment(v[j]).format('YYYY-MM-DD HH:mm') : ''
        }
        return v[j]
      }))
    }
  }
}
</script>

<style lang="scss" scoped>
#search-form3{
    .group{
      margin-left: 20px;
        display: flex;
        flex-wrap: wrap;
        & > .el-form-item {
            margin-right: 20px;
        }
    }
}
.exportBtn{
  margin: 0 20px 10px 15px;
}
.chooseTime{
  display: flex;
  align-items: center;
  .line{
    margin: 0 5px ;
    width: 10px;
    height: 1px;
    background: #DCDFE6;
  }
}
.icons-operate{
  a{
    font-size: 14px;
    color: #108ee9;
    margin-right: 4px;
  }
}
.wrap{
    width: 100%;
    border: 1px solid #C5D0DC;
    padding: 10px 12px;
}
.checkForm{
    line-height: 30px;
}
#btnForm{
  display: flex;
  justify-content: space-between;
  margin: 0 20px;
}
</style>
