<template>
  <div>
    <el-form ref="ruleForm" :model="form" :rules="rules">
      <el-page-header content="添加订单" style="margin-bottom: 20px" @back="goBack" />
      <div style="max-width: 1100px">
        <div class="my-input-group">
          <el-form-item label="所属游戏" prop="gameName">
            <el-select v-model="form.gameName" filterable clearable placeholder="全部" @change="changeGame">
              <el-option
                v-for="item in allGames"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="代练类型" prop="PackageName">
            <el-select v-model="form.PackageName" filterable clearable placeholder="请先选择所属游戏">
              <el-option
                v-for="item in allPackageNames"
                :key="item.id"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="区服" prop="server">
            <el-select v-model="form.server" filterable clearable placeholder="全部">
              <el-option
                label="国服"
                value="国服"
              />
              <el-option
                label="美服"
                value="美服"
              />
              <el-option
                label="欧服"
                value="欧服"
              />
              <el-option
                label="亚服"
                value="亚服"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="my-input-group">
          <el-form-item label="代练账号" prop="accountNum">
            <el-input v-model="form.accountNum" placeholder="请输入代练账号" @keyup.enter.native="addClick" />
          </el-form-item>
          <el-form-item label="账号密码" prop="accountPwd">
            <el-input v-model="form.accountPwd" placeholder="请输入代练账号密码" @keyup.enter.native="addClick" />
          </el-form-item>
        </div>
        <div class="my-input-group">
          <el-form-item label="来源渠道" prop="sources">
            <el-select v-model="form.sources" filterable allow-create placeholder="请选择来源聚道" style="width: 100%" @change="chooseSource">
              <el-option
                label="5173"
                value="5173"
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
            </el-select>
          </el-form-item>
          <el-form-item :label="chooseTaobao?'订单号':'客户微信号'" prop="taoBaoOrderId">
            <el-input v-model="form.taoBaoOrderId" :placeholder="chooseTaobao?'请输入淘宝订单号':'请输入客户微信号'" @keyup.enter.native="addClick" />
          </el-form-item>
        </div>
        <div class="my-input-group">
          <el-form-item label="联系电话" prop="userPhoneNum">
            <el-input v-model="form.userPhoneNum" placeholder="请输入联系方式" @keyup.enter.native="addClick" />
          </el-form-item>
          <el-form-item label="代练押金" prop="powerLevelingAntecedentMoney">
            <el-input-number v-model="form.powerLevelingAntecedentMoney" controls-position="right" :min="0" />
          </el-form-item>
        </div>
        <div class="my-input-group">
          <el-form-item label="支付金额" prop="payAmount">
            <el-input-number v-model="form.payAmount" controls-position="right" :min="0" />
          </el-form-item>
          <el-form-item label="代练佣金" prop="powerLevelingReward">
            <el-input-number v-model="form.powerLevelingReward" controls-position="right" :min="0" />
          </el-form-item>
        </div>
        <div class="my-input-group" style="max-width: 50%">
          <el-form-item label="是否短信通知" prop="isReceiveSMS">
            <el-switch v-model="form.isReceiveSMS" />
          </el-form-item>
        </div>
        <div class="my-input-group">
          <el-form-item label="代练要求" prop="powerLevelingRequirement">
            <el-input v-model="form.powerLevelingRequirement" type="textarea" placeholder="请输入代练要求" @keyup.enter.native="addClick" />
          </el-form-item>
          <el-form-item v-if="false" label="淘宝备注" prop="powerLevelingRequirement">
            <el-input v-model="form.taoBaoRemark" type="textarea" placeholder="请输入代练要求" @keyup.enter.native="addClick" />
          </el-form-item>
        </div>
      </div>
      <div class="my-input-group" style="max-width: 1100px; margin-top: 20px;">
        <el-form-item label="代练需求信息" prop="jsonOrderCanUpdate" style="min-width: 400px">
          <full-tag
            ref="fullTag1"
            :tag-list="fullTagList"
            @onUpdate="fullReadUpdate"
          />
        </el-form-item>
        <el-form-item label="打手补充信息JSON" prop="jsonOrderOnlyRead" style="min-width: 400px">
          <full-tag
            ref="fullTag2"
            :tag-list="fullTagList"
            @onUpdate="fullCanUpdate"
          />
        </el-form-item>
      </div>
      <el-form-item>
        <el-button type="primary" icon="el-icon-plus" @click="addClick">添加</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import * as daiLianOrder from '@/api/powerLeveling'
import * as gameInfoApi from '@/api/gameInfo'
import FullTag from './FullTag'
const luShiList = [
  {
    text: '代练金币',
    disabled: true
  },
  {
    text: '友谊赛场次',
    disabled: true
  },
  {
    text: '代练时间段',
    // type: 'Select',
    disabled: true
    // data: [
    //   { label: '0-6', value: '0-6' },
    //   { label: '6-12', value: '6-12' },
    //   { label: '12-18', value: '12-18' },
    //   { label: '18-24', value: '18-24' }
    // ]
  },
  {
    text: '金币单价',
    disabled: true,
    value: 0.004
  },
  {
    text: '来源',
    disabled: true,
    value: '0'
  }
]
const daShouCanUpdateList = [{
  // text: 'ST值',
  // disabled: true
}]
const daShouOnlyReadList = [{
  text: '金币单价',
  disabled: true
}]
export default {
  name: 'OrderAdd',
  components: { FullTag },
  data() {
    const reg = /^[A-Za-z0-9]+$/
    var validateTaobaoOrderId = (rule, value, callback) => {
      if (this.form.sources.indexOf('淘宝') > -1) {
        if (!value) {
          return callback(new Error('请输入订单号'))
        }
        if (value.length !== 19) {
          return callback(new Error('订单号只可以输入19位英文或数字，不能有符号和中文'))
        }
        if (!reg.test(value)) {
          return callback(new Error('订单号只可以输入19位英文或数字，不能有符号和中文'))
        } else {
          return callback()
        }
      } else if (this.form.sources.indexOf('5173') > -1) {
        if (!value) {
          return callback(new Error('请输入订单号'))
        } else {
          return callback()
        }
      } else if (this.form.sources.indexOf('微信') > -1) {
        if (!value) {
          return callback(new Error('请输入客户微信号'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    return {
      chooseTaobao: true,
      fullTagList: [...luShiList, ...daShouCanUpdateList, ...daShouOnlyReadList],
      jsonOrderOnlyRead: '',
      jsonOrderCanUpdate: '',
      form: {
        server: '国服',
        sources: '',
        taoBaoOrderId: '',
        assignBeaterId: '',
        jsonOrderCanUpdate: '{}',
        jsonOrderOnlyRead: '{}',
        isReceiveSMS: true,
        gameName: ''
      },
      rules: {
        server: [
          { required: true, message: '请选择所属区服', trigger: 'blur' }
        ],
        gameName: [
          { required: true, message: '请选择所属游戏', trigger: 'blur' }
        ],
        PackageName: [
          { required: true, message: '请选择代练类型', trigger: 'blur' }
        ],
        userPhoneNum: [
          { required: true, message: '请输入联系方式', trigger: 'blur' }
        ],
        accountNum: [
          { required: true, message: '请输入代练账号', trigger: 'blur' }
        ],
        accountPwd: [
          { required: true, message: '请输入代练账号密码', trigger: 'blur' }
        ],
        payAmount: [
          { required: true, message: '请输入支付金额', trigger: 'blur' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确价格，最多保留2位小数', trigger: 'blur' }
        ],
        PowerLevelingReward: [
          { required: true, message: '请输入代练佣金', trigger: 'blur' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确价格，最多保留2位小数', trigger: 'change' }
        ],
        PowerLevelingAntecedentMoney: [
          { required: true, message: '请输入代练押金', trigger: 'blur' },
          { pattern: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^\d\.\d{1,2}$)/, message: '请输入正确价格，最多保留2位小数', trigger: 'change' }
        ],
        sources: [
          { required: true, message: '请选择来源渠道', trigger: 'blur' }
        ],
        taoBaoOrderId: [
          { required: true, validator: validateTaobaoOrderId, trigger: 'blur' }
        ],
        PowerLevelingRequirement: [
          { required: true, message: '请输入代练要求', trigger: 'blur' }
        ]
      },
      allPackageNames: [],
      allGames: [],
      internals: [{
        label: '内部代练',
        value: true
      }, {
        label: '打手代练',
        value: false
      }],
      list: [],
      currentPage: 1,
      totalCount: 0
    }
  },
  computed: {
    getGameName() {
      return this.form.gameName
    }
    // assignBeaterId() {
    //   return this.form.assignBeaterId
    // }
  },
  watch: {
    getGameName(newValue) {
      this.setKeys(newValue)
    }
    // assignBeaterId(newValue) {
    //   if (newValue === 19222) {
    //     let obj = {}
    //     if (this.form.jsonOrderCanUpdate) {
    //       obj = JSON.parse(this.form.jsonOrderCanUpdate)
    //     }
    //     daShouCanUpdateList.map(item => {
    //       if (item.text) {
    //         obj[item.text] = ''
    //       }
    //     })
    //     let json = JSON.stringify(obj)
    //     this.$refs.fullTag2.setValues(json)
    //     this.form.jsonOrderCanUpdate = json
    //
    //     obj = []
    //     if (this.form.jsonOrderOnlyRead) {
    //       obj = JSON.parse(this.form.jsonOrderOnlyRead)
    //     }
    //     daShouOnlyReadList.map(item => {
    //       if (item.text) {
    //         obj[item.text] = ''
    //       }
    //     })
    //     json = JSON.stringify(obj)
    //     this.$refs.fullTag1.setValues(json)
    //     this.form.jsonOrderOnlyRead = json
    //   } else {
    //     if (this.form.jsonOrderCanUpdate) {
    //       const obj = JSON.parse(this.form.jsonOrderCanUpdate)
    //       daShouCanUpdateList.map(item => {
    //         if (obj.hasOwnProperty(item.text)) {
    //           delete obj[item.text]
    //         }
    //       })
    //       const json = JSON.stringify(obj)
    //       this.$refs.fullTag2.setValues(json)
    //       this.form.jsonOrderCanUpdate = json
    //     }
    //
    //     if (this.form.jsonOrderOnlyRead) {
    //       const obj = JSON.parse(this.form.jsonOrderOnlyRead)
    //       daShouOnlyReadList.map(item => {
    //         if (obj.hasOwnProperty(item.text)) {
    //           delete obj[item.text]
    //         }
    //       })
    //       const json = JSON.stringify(obj)
    //       this.$refs.fullTag1.setValues(json)
    //       this.form.jsonOrderOnlyRead = json
    //     }
    //   }
    // }
  },
  mounted() {
    // 默认加载所有游戏
    this.getAllGames()
  },
  methods: {
    chooseSource(val) {
      console.log(val)
      if (val.indexOf('淘宝') > -1 || val.indexOf('5173') > -1) {
        this.chooseTaobao = true
      } else if (val.indexOf('微信') > -1) {
        this.chooseTaobao = false
      }
    },
    setKeys(newValue) {
      let obj = {}
      if (newValue === '炉石传说') {
        if (this.form.jsonOrderOnlyRead) {
          obj = JSON.parse(this.form.jsonOrderOnlyRead)
        }
        luShiList.map(item => {
          obj[item.text] = ''
        })
      } else if (this.form.jsonOrderOnlyRead) {
        obj = JSON.parse(this.form.jsonOrderOnlyRead)
        luShiList.map(item => {
          if (obj.hasOwnProperty(item.text)) {
            delete obj[item.text]
          }
        })
      }
      const json = JSON.stringify(obj)
      this.$refs.fullTag1.setValues(json)
      this.form.jsonOrderOnlyRead = json
    },
    goBack() {
      this.$emit('onBack')
    },
    // 搜索筛选
    addClick() {
      const priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
      const obj = JSON.parse(this.form.jsonOrderOnlyRead)
      const coin1 = obj['代练金币'] || 0
      const coin2 = obj['金币单价'] || 0
      if (this.form.gameName === '炉石传说') {
        if (!coin1 || !coin2 || !this.form.payAmount) {
          this.$message({
            message: '代练金币,金币单价,支付金额必须填',
            type: 'error'
          })
          return
        }
        if (!priceReg.test(coin1) && !priceReg.test(coin2)) {
          this.$message({
            message: '代练金币或金币单价必须是数字',
            type: 'error'
          })
          return
        }

        if (this.form.payAmount < (Number(coin1) * Number(coin2))) {
          this.$message({
            message: '代练金币乘以金币单价不能超过支付金额',
            type: 'error'
          })
          return
        }
      }
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.createDaiLianOrder()
        }
      })
    },
    // 创建订单
    createDaiLianOrder() {
      daiLianOrder.CreateDaiLianOrder(this.form).then(res => {
        if (res.data.success) {
          this.$refs.ruleForm && this.$refs.ruleForm.resetFields()
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.goBack()
        }
      }).catch(() => {
      })
    },
    // 更新打手补充信息
    fullCanUpdate(fullObj) {
      const fullString = JSON.stringify(fullObj).toString()
      this.form.jsonOrderCanUpdate = fullString
    },
    // 更新代练需求信息
    fullReadUpdate(fullObj) {
      const fullString = JSON.stringify(fullObj).toString()
      this.form.jsonOrderOnlyRead = fullString
    },
    // 获取所有游戏
    async getAllGames() {
      const res = await gameInfoApi.GetAllGames({ gamePlatform: '' })
      this.allGames = res.data.result.items
      this.form.gameName = '炉石传说'
      this.setKeys(this.form.gameName)
      this.getPackageNames()
    },
    changeGame() {
      this.getPackageNames()
    },
    getPackageNames() {
      let id = ''
      for (let i = 0; i < this.allGames.length; i++) {
        if (this.form.gameName === this.allGames[i].name) {
          id = this.allGames[i].id
        }
      }
      gameInfoApi.GetAllPackageByGameId({ id: id }).then(res => {
        if (res.data.success) {
          this.allPackageNames = res.data.result
        }
      })
    }
  }
}
</script>
<style >
.el-input-number .el-input__inner{
  text-align: left;
}
</style>
