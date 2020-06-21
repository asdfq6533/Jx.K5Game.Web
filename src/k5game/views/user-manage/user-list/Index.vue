<template>
  <div class="page-content">
    <el-card class="my-card">
      <div>
        <el-form id="search-form3" ref="form" :model="params">
          <div class="group">
            <!-- <el-form-item label="手机号：" prop="phoneNumber">
              <el-input v-model="params.phoneNumber" placeholder="输入手机号" clearable />
            </el-form-item>
            <el-form-item label="昵称：" prop="userName">
              <el-input v-model="params.userName" placeholder="输入昵称" clearable />
            </el-form-item>
            <el-form-item label="微信号" prop="wxName">
              <el-input v-model="params.wxName" placeholder="输入微信号" clearable />
            </el-form-item>
            <el-form-item label="QQ:" prop="QQNumber">
              <el-input v-model="params.QQNumber" placeholder="输入QQ" clearable />
            </el-form-item>
            <el-form-item label="性别：" prop="gender">
              <el-select v-model="params.gender" placeholder="请选择">
                <el-option
                  label="全部"
                  value=""
                />
                <el-option
                  label="男"
                  value="male"
                />
                <el-option
                  label="女"
                  value="female"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="是否绑定微信：" prop="isBindWx">
              <el-select v-model="params.isBindWx" placeholder="请选择">
                <el-option
                  label="全部"
                  value=""
                />
                <el-option
                  label="是"
                  value="true"
                />
                <el-option
                  label="否"
                  value="false"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="身份证:" prop="IDNumber">
              <el-input v-model="params.IDNumber" placeholder="输入身份证" clearable />
            </el-form-item>
            <el-form-item label="电子邮箱:" prop="email">
              <el-input v-model="params.email" placeholder="输入电子邮箱" clearable />
            </el-form-item>
            <el-form-item label="注册时间:" prop="regeisterTime">
              <div class="chooseTime">
                <el-date-picker
                  v-model="params.startTime"
                  type="datetime"
                  placeholder="起始时间"
                />
                <p class="line" />
                <el-date-picker
                  v-model="params.endTime"
                  type="datetime"
                  placeholder="结束时间"
                />
              </div>
            </el-form-item> -->
            <el-form-item>
              <el-input v-model="params.filter" placeholder="模糊搜索" clearable @keyup.enter.native="search" />
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="reset">重置</el-button>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="exportBtn">
        <el-button type="primary">导出勾选项</el-button>
        <el-button type="primary">导出搜索结果</el-button>
      </div>
      <lxz-table
        ref="multipleTable"
        :table-data="dataList"
        :columns="[
          { slot: 'selection' },
          { label: '昵称', prop: 'nickName' ,width: '130px'},
          { label: '手机号码', prop: 'phoneNumber',width: '130px' },
          { label: '微信号', prop: 'wx' },
          { label: 'QQ', prop: 'qq'},
          {slot:'gender'},
          {slot:'isAuthentication'},
          { label: '身份证', prop: 'idCard',width: '180px'},
          { label: '电子邮箱', prop: 'emailAddress',width: '220px'},
          {slot:'lastLoginTime'},
          {slot:'creationTime'},
          { slot: 'operate'}
        ]"
        :page-obj="pageObj"
        @handleSelectionChange="handleSelectionChange"
        @changeTableSort="sortChange"
      >
        <el-table-column
          slot="selection"
          type="selection"
          width="45"
        />
        <el-table-column
          slot="gender"
          label="性别"
        >
          <template v-slot="scope">
            {{ !scope.row.gender?'': scope.row.gender }}
          </template>
        </el-table-column>
        <el-table-column
          slot="isAuthentication"
          label="是否绑定微信"
        >
          <template v-slot="scope">
            {{ !scope.row.wx?'否': '是' }}
          </template>
        </el-table-column>
        <el-table-column
          slot="lastLoginTime"
          label="上次登录时间"
          width="150"
        >
          <template v-slot="scope">
            {{ scope.row.lastLoginTime | timeFormatNotUtc }}
          </template>
        </el-table-column>
        <el-table-column
          slot="creationTime"
          label="注册时间"
          width="150"
        >
          <template v-slot="scope">
            {{ scope.row.creationTime | timeFormatNotUtc }}
          </template>
        </el-table-column>
        <el-table-column
          slot="operate"
          label="操作"
          width="160"
          fixed="right"
        >
          <template v-slot="scope">
            <div class="icons-operate">
              <a href="javascript:void(0)">
                <p @click="editProduct(scope.row)">编辑</p>
              </a>
              <a href="javascript:void(0)">
                <p @click="goDtailProduct(scope.row)">查看</p>
              </a>
              <a href="javascript:void(0)">
                <p @click="changeStatus(scope.row)">{{ scope.row.isActive?'禁用':'启用' }}</p>
              </a>
            </div>
          </template>
        </el-table-column>
      </lxz-table>
    </el-card>
    <el-dialog
      title="修改角色"
      :visible="showEdit"
      width="25%"
      :show-close="false"
    >
      <div class="wrap">
        <el-checkbox-group v-model="checkList">
          <div v-for="item in rolesList" :id="item.id" :key="item.id" class="checkForm">
            <el-checkbox :label="item.displayName" />
          </div>
        </el-checkbox-group>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="submitClick">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import moment from 'moment'
import listMixin from '@/k5game/mixins/list-mixin'
import LxzTable from '@/k5game/components/LxzTable'
import * as userManageApi from '@/api/user-manage'
export default {
  name: 'Index',
  components: { LxzTable },
  mixins: [listMixin],
  data() {
    return {
      regeisterTime: '',
      showEdit: false,
      params: {
        phoneNumber: '',
        userName: '',
        wxName: '',
        QQNumber: '',
        gender: '',
        isBindWx: '',
        IDNumber: '',
        email: '',
        startTime: '',
        endTime: '',
        filter: '',
        permission: '',
        role: 0,
        sorting: '',
        maxResultCount: 10,
        skipCount: 0
      },
      dataList: [],
      pageObj: {},
      roles: [],
      rolesList: [],
      id: '',
      checkList: []
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
    this.getRoles()
  },
  methods: {
    getList() {
      userManageApi.getUsers(this.params).then(res => {
        if (res.data.success === true) {
          const result = res.data.result
          this.pageObj.totalCount = result.totalCount
          this.dataList = result.items
        }
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'count') {
        return
      }
      if (order === 'ascending') {
        this.params.sorting = `${prop} asc`
      } else {
        this.params.sorting = `${prop} desc`
      }
      this.getList()
    },
    userInfoClick(row) {
      this.userInfoId = row.id
      this.isUserInfoShow = true
    },
    // 处理选中
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    search() {
      this.dataList = []
      this.getList()
    },
    // 获取用户角色
    getUserDetail(id) {
      const params = {
        id: id
      }
      userManageApi.GetUserDetail(params).then(res => {
        if (res.data.success === true) {
          const role = res.data.result.roles
          role.forEach(e => {
            for (let i = 0; i < this.rolesList.length; i++) {
              if (e === this.rolesList[i].id) {
                this.checkList.push(this.rolesList[i].name)
              }
            }
          })
        }
      })
    },
    // 获取角色列表
    getRoles() {
      userManageApi.GetRoles().then(res => {
        if (res.data.success === true) {
          this.rolesList = res.data.result.items
        }
      })
    },
    // 编辑用户
    editProduct(row) {
      this.showEdit = true
      this.getUserDetail(row.id)
      this.id = row.id
    },
    // 查看用户
    goDtailProduct(row) {
      this.$router.push({
        name: 'UserDetail',
        query: {
          id: row.id,
          activeName: this.activeName
        }
      })
    },
    close() {
      this.showEdit = false
    },
    // 修改角色
    submitClick(e) {
      this.showEdit = false
      const role = []
      this.checkList.forEach(e => {
        for (let i = 0; i < this.rolesList.length; i++) {
          if (e === this.rolesList[i].displayName) {
            role.push(this.rolesList[i].name)
          }
        }
      })
      const params = {
        'id': this.id,
        'assignedRoleNames': role
      }
      userManageApi.UpdateUserRoles(params).then(res => {
        // eslint-disable-next-line no-empty
        if (res.data.success === true) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
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
    // 禁用账户
    changeStatus(row) {
      const params = {
        id: row.id
      }
      userManageApi.LockUser(params).then(res => {
        // eslint-disable-next-line no-empty
        if (res.data.success === true) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.getList()
        }
      })
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
</style>
