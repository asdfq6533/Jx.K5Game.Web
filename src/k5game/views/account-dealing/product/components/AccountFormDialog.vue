<template>
  <el-dialog
    :title="form.id ? '修改账号' : '添加账号'"
    :visible.sync="dialogFormVisible"
    @close="handleClose"
  >
    <el-form ref="ruleForm" :rules="rules" :model="form">
      <div class="input-group">
        <el-form-item label="游戏" :label-width="formLabelWidth" prop="gameId">
          <el-select v-model="form.gameId" style="max-width: 400px" placeholder="请选择游戏" @change="gameSelectedClick">
            <el-option
              v-for="(item,key) in allGames"
              :key="key"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <el-form-item v-if="accountGameLabelList2.length > 0 && roleType !== 1" label="游戏标签" :label-width="formLabelWidth">
        <div class="input-group select-group">
          <el-select v-model="selectedLabel2" multiple placeholder="请选择">
            <el-option
              v-for="(item, key) in accountGameLabelList2"
              :key="key"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>
      </el-form-item>
      <el-form-item v-if="(accountGameLabelList.length > 0 && roleType !== 0) || false" label="批量出售" :label-width="formLabelWidth">
        <div class="input-group select-group">
          <el-select v-model="selectedLabel1" multiple placeholder="请选择">
            <el-option
              v-for="(item, key) in accountGameLabelList"
              :key="key"
              :label="item.name + `（${item.packagePrice}）`"
              :value="item.id"
            />
          </el-select>
        </div>
      </el-form-item>
      <div class="input-group">
        <el-form-item label="身份证验证" :label-width="formLabelWidth" prop="authentication">
          <el-switch
            v-model="form.authentication"
          />
        </el-form-item>
        <el-form-item label="手机验证" :label-width="formLabelWidth" prop="phoenValidation">
          <el-switch
            v-model="form.phoenValidation"
          />
        </el-form-item>
        <el-form-item label="邮箱验证" :label-width="formLabelWidth" prop="emailVaildation">
          <el-switch
            v-model="form.emailVaildation"
          />
        </el-form-item>
      </div>
      <div class="input-group">
        <el-form-item v-if="selectedLabel2.length" label="商品标题" :label-width="formLabelWidth" prop="accountName">
          <el-input v-model="form.accountName" placeholder="请输入商品标题" />
        </el-form-item>
        <el-form-item v-if="roleType === 2" label="成本价格" :label-width="formLabelWidth" prop="costPrice" style="max-width: 480px">
          <el-input-number
            v-model="form.costPrice"
            controls-position="right"
            :min="0"
            :max="100000000"
          />
        </el-form-item>
        <el-form-item v-if="false" label="上架周期" :label-width="formLabelWidth" prop="accountOnCycle">
          <el-select v-model="form.accountOnCycle" placeholder="请选择上架周期">
            <el-option label="一周" value="一周" />
            <el-option label="半个月" value="半个月" />
          </el-select>
        </el-form-item>
      </div>
      <div class="input-group">
        <el-form-item v-if="selectedLabel2.length" label="账号价格" style="max-width: 480px" :label-width="formLabelWidth" prop="accountPrice">
          <el-input-number
            v-model="form.accountPrice"
            controls-position="right"
            :min="0"
            :max="100000000"
          />
        </el-form-item>
        <el-form-item v-if="selectedLabel2.length" label="折扣价" style="max-width: 480px" :label-width="formLabelWidth" prop="discountedPrice">
          <el-input-number
            v-model="form.discountedPrice"
            controls-position="right"
            :min="0"
            :max="100000000"
          />
        </el-form-item>
      </div>
      <div class="input-group">
        <el-form-item label="游戏角色名" :label-width="formLabelWidth" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入游戏角色名" />
        </el-form-item>
        <el-form-item label="游戏区服" :label-width="formLabelWidth" prop="client">
          <el-cascader
            v-model="form.serviceList"
            :props="{
              value: 'value',
              label: 'text',
              children: 'children',
            }"
            :options="serverList"
          />
        </el-form-item>
      </div>
      <div class="input-group">
        <el-form-item label="游戏账号" :label-width="formLabelWidth" prop="accountNumber">
          <el-input v-model="form.accountNumber" placeholder="请输入游戏账号" />
        </el-form-item>
        <el-form-item label="游戏密码" :label-width="formLabelWidth" prop="accountPassWord">
          <el-input v-model="form.accountPassWord" placeholder="请输入游戏密码" />
        </el-form-item>
      </div>
      <div class="input-group">
        <el-form-item label="账号密保信息" :label-width="formLabelWidth" prop="accountTheLock">
          <el-input v-model="form.accountTheLock" placeholder="请输入账号密保信息" />
        </el-form-item>
      </div>
      <div class="input-group">
        <el-form-item label="联系方式" :label-width="formLabelWidth" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="在线时间" :label-width="formLabelWidth" prop="onlineTime">
          <el-input v-model="form.onlineTime" placeholder="请输入在线时间" />
        </el-form-item>
      </div>
      <el-form-item label="描述" :label-width="formLabelWidth" prop="description">
        <el-input v-model="form.description" type="textarea" placeholder="请输入描述" />
      </el-form-item>
      <el-upload
        :action="`${baseUrl}/File/UploadPicture`"
        list-type="picture-card"
        :on-remove="handleRemove"
        :on-success="uploadSuccess"
        :file-list="fileList"
      >
        <i class="el-icon-plus" />
      </el-upload>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close()">取 消</el-button>
      <el-button type="primary" @click="submitClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as accountPackageApi from '@/api/accountPackage'
import accountMixin from '@/k5game/mixins/account-mixin'
import * as accountTransactionApi from '@/api/account-transaction'
import * as gameInfo from '@/api/gameInfo'
import config from '@/config'
import dialogMixin from '@/k5game/mixins/dialog-mixin'
import k5Utils from '@/utils/k5Utils'
import { mapGetters } from 'vuex'
export default {
  name: 'AccountFormDialog',
  mixins: [accountMixin, dialogMixin],
  data() {
    const phoneValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号码'))
      } else if (!(/^1[3456789]\d{9}$/.test(value))) {
        callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
    }
    return {
      baseUrl: config.baseUrl,
      formLabelWidth: '120px',
      form: {
        accountName: '',
        screenshots: [],
        imgList: [],
        serviceList: []
      },
      labelFrom: {
        accountLableIds: []
      },
      rules: {
        gameId: { required: true, message: '请选择游戏', trigger: 'blur' },
        serviceList: { required: true, message: '请选择游戏区服', trigger: 'blur' },
        costPrice: { required: true, message: '请选择成本价', trigger: 'blur' },
        accountOnCycle: { required: true, message: '请选择上架周期', trigger: 'blur' },
        transactionType: { required: true, message: '请选择交易类型', trigger: 'blur' },
        accountName: { required: true, message: '请输入商品标题', trigger: 'blur' },
        accountPrice: { required: true, message: '请输入账号价格', trigger: 'blur' },
        roleName: { required: true, message: '请输入游戏角色名', trigger: 'blur' },
        accountNumber: { required: true, message: '请输入游戏账号', trigger: 'blur' },
        accountPassWord: { required: true, message: '请输入游戏密码', trigger: 'blur' },
        accountTheLock: { required: true, message: '请输入账号密保信息', trigger: 'blur' },
        contact: [
          { required: true, message: '请输入联系方式', trigger: 'blur' },
          { validator: phoneValidate, trigger: 'blur' }
        ]
      },
      fileList: [],
      accountGameLabelList: [],
      accountGameLabelList2: [],
      serverList: [],
      selectedLabel1: [],
      selectedLabel2: []
    }
  },
  computed: {
    ...mapGetters(['roleType'])
  },
  methods: {
    setValue(item) {
      this.selectedLabel1 = []
      this.selectedLabel2 = []
      this.labelFrom.accountLableIds = []
      this.labelFrom.accountId = ''
      this.fileList = []
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
      if (item) {
        accountTransactionApi.GetSaleAccountTransactionsdetailsManagement({ id: item.id }).then(res => {
          this.form = res.data.result.saleAccount
          this.form.imgList = []
          if (this.form.screenshots) {
            this.form.screenshots.map((item, key) => {
              item.uid = key + 1
              this.fileList.push({
                uid: key + 1,
                url: config.baseUrl + config.pictureUrl + item.url
              })
            })
          }

          const packageDto = res.data.result.packageDto
          packageDto.map(item => {
            this.labelFrom.accountLableIds.push(item.accountPackageId)
            this.labelFrom.accountId = this.form.id
            if (!this.form.gameId) {
              this.form.gameId = item.gameId
            }
          })

          this.getAllGames(() => {
            this.allGames.some(item => {
              if (item.name === this.form.gameName) {
                this.form.gameId = item.id
                const gameId = this.form.gameId
                const serviceId = this.form.serviceId
                this.getGameLabel(gameId)
                this.getServerList(gameId, (list) => {
                  console.log(k5Utils.getParentToListWithId(list, serviceId))
                  this.form.serviceList = [...k5Utils.getParentToListWithId(list, serviceId)]
                })
                delete this.form.gameName
                return true
              }
            })
          })
        })
      } else {
        this.form = {
          accountName: ''
        }
        this.getAllGames()
      }
    },
    gameSelectedClick(val) {
      this.getServerList(val)
      this.getGameLabel(val)
    },
    getGameLabel(val) {
      this.selectedLabel1 = []
      this.selectedLabel2 = []
      accountPackageApi.GetGameLable({ gameId: val }).then(res => {
        const items = res.data.result.items
        this.accountGameLabelList = []
        this.accountGameLabelList2 = []
        items.map(item => {
          this.labelFrom.accountLableIds.some(id => {
            if (id === item.id) {
              if (item.isBestStart) {
                this.selectedLabel1.push(item.id)
              } else {
                this.selectedLabel2.push(item.id)
              }
              return true
            }
          })

          if (item.isBestStart && item.parentId) {
            this.accountGameLabelList.push(item)
          } else if (!item.isBestStart) {
            this.accountGameLabelList2.push(item)
          }
        })
      })
    },
    getServerList(val, callBack) {
      const params = {
        level: 1,
        depth: 3,
        parentId: val
      }
      gameInfo.GetRegionTree(params).then(res => {
        this.serverList = res.data.result
        this.handleServerList(this.serverList, this.form.serviceId)
        if (callBack && typeof callBack === 'function') {
          callBack(this.serverList)
        }
      })
    },
    handleServerList(list, serviceId) {
      list.map(item => {
        if (item.children) {
          if (item.children.length === 0) {
            delete item.children
          } else {
            this.handleServerList(item.children)
          }
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      if (!this.form.screenshots) {
        this.form.screenshots = []
      }
      this.form.screenshots.push({ url: response.result.fileName, uid: file.uid, isNew: true })
    },
    handleRemove(file, fileList) {
      if (this.form.screenshots) {
        this.form.screenshots.some((item, key) => {
          if (item.uid === file.uid) {
            this.form.screenshots.splice(key, 1)
            if (!item.isNew) {
              this.form.imgList.push(item)
            }
            return true
          }
        })
      }
    },
    submitClick() {
      if (this.form.serviceList && this.form.serviceList.length > 0) {
        this.form.serviceId = this.form.serviceList[this.form.serviceList.length - 1]
      }
      this.form.client = '全部'
      this.labelFrom.accountLableIds = this.selectedLabel1.concat(this.selectedLabel2)
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.updateAccount()
          } else {
            this.addAccount()
          }
        }
      })
    },
    addAccount() {
      accountTransactionApi.CreateAccountTransaction(this.form).then(res => {
        if (res.data.success) {
          this.setLabel(res.data.result)
        }
      })
    },
    updateAccount() {
      const oldList = JSON.parse(JSON.stringify(this.form.screenshots))
      this.form.screenshots = []
      oldList.map(item => {
        if (item.isNew) {
          this.form.screenshots.push(item)
        }
      })
      accountTransactionApi.UpdateAccountTransactionContent(this.form).then(res => {
        if (res.data.success) {
          this.setLabel(this.form.id)
        }
      })
    },
    setLabel(id) {
      this.labelFrom.accountId = id
      accountTransactionApi.SetAccountLables(this.labelFrom).then(res => {
        if (res.data.success) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('onRefresh')
          this.close()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.mess-tip{
  padding: 0;
  margin: 0;
}
.el-form-item{
  width: 100%;
  .el-select{
    width: 100%;
  }
}
.input-group{
  display: flex;
  flex-wrap: wrap;
  .el-form-item{
    flex: 1;
    .el-input-number{
      width: 100%;
    }
  }
}
.select-group{
  .el-select{
    width: 0;
    flex: 1;
  }
  .el-select:first-child{
    margin-right: 10px;
  }
}
</style>
