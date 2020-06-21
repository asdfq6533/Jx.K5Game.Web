<template>
  <div class="page-content">
    <div class="product-information">
      <el-form ref="form" :model="form" label-width="120px" :rules="rules">
        <div class="formWrap">
          <h3>游戏信息</h3>
          <el-form-item label="游戏名称：" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入游戏名称" />
          </el-form-item>
          <el-form-item label="原版名称：" prop="nameEN">
            <el-input v-model.trim="form.nameEN" placeholder="请输入原版名称" />
          </el-form-item>
          <el-form-item label="别名：" prop="nameST">
            <el-input v-model.trim="form.nameST" placeholder="请输入游戏别名" />
          </el-form-item>
          <el-form-item label="游戏类型：" prop="gameType">
            <el-select
              v-model="gameType"
              multiple
              filterable
              clearable
              default-first-option
              placeholder="请选择游戏类型"
            >
              <el-option
                v-for="item in gameTypes"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="游戏币名称：" prop="coinName">
            <el-input v-model.trim="form.coinName" placeholder="请输入游戏币名称" />
          </el-form-item>
          <el-form-item label="游戏平台：" prop="gamePlatform">
            <el-select
              v-model="gamePlatform"
              placeholder="请选择游戏平台"
              multiple
              filterable
              clearable
              default-first-option
              style="width: 100%"
            >
              <el-option
                label="手机游戏"
                value="手机游戏"
              />
              <el-option
                label="网络游戏"
                value="网络游戏"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="手续费：" prop="feeExtra">
            <el-input v-model.trim="form.feeExtra" placeholder="请输入0-100内的数字，商品成交后以此数值结算" /> %
          </el-form-item>
          <el-form-item ref="imgUpload" label="游戏图片：" prop="pictureUrl">
            <div>
              <p class="imgTips">
                图片尺寸建议400*400，大小≤1M，支持jpg，jpeg，png格式
              </p>
              <el-upload
                class="avatar-uploader"
                :action="`${baseUrl}/File/UploadPicture`"
                :show-file-list="false"
                :on-success="uploadSuccess"
                :before-upload="beforeAvatarUpload"
                accept=".jpg,.jpeg,.png"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="是否展示：" prop="flag">
            <el-switch
              v-model="flag"
              active-color="#13ce66"
              inactive-color="#999"
            />
          </el-form-item>
        </div>
        <div class="formWrap">
          <h3>热门推荐 <span>注：用于更改app端热门游戏的展示顺序，数字越小展示越靠前；</span></h3>
          <el-form-item label="账号交易：" prop="tradeHot" class="hotRecommend">
            <el-switch
              v-model="isTradeHot"
              active-color="#13ce66"
              inactive-color="#999"
              @change="changeIsTradeHot"
            />
            <label class="sort"><span v-if="isTradeHot">*</span>排序：</label><el-input v-model="tradeHot" placeholder="请输入0-10以内的整数" />
          </el-form-item>
          <el-form-item label="游戏代练：" prop="levelingHot" class="hotRecommend">
            <el-switch
              v-model="isLevelingHot"
              active-color="#13ce66"
              inactive-color="#999"
              @change="changeIsLevelingHot"
            />
            <label class="sort"><span v-if="isLevelingHot">*</span>排序：</label><el-input v-model="levelingHot" placeholder="请输入0-10以内的整数" />
          </el-form-item>
        </div>
        <div class="formWrap">
          <h3>游戏区服 <button type="button" @click="batchRemove">删除选中项</button></h3>
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
              show-checkbox
              node-key="number"
              :default-expand-all="false"
              empty-text=""
              :check-strictly="true"
              :expand-on-click-node="false"
              @check-change="handleCheckChange"
              @node-expand="serviceTreeExpand"
              @node-collapse="serviceTreeCollapse"
            >
              <span slot-scope="{node, data}" class="custom-tree-node">
                <input
                  v-model="data.name"
                  type="text"
                >
                <span v-if="data.name === ''" class="el-tree-message">请输入名称</span>
                <span>
                  <el-button
                    class="addService"
                    type="text"
                    size="mini"
                    @click.prevent="() => append(data)"
                  >
                    添加服务器
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click.prevent="() => remove(node, data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>

          <div class="addArea">
            <button type="button" @click="addArea">
              <svg-icon icon-class="add2" class="icon2" />
              添加区
            </button>
          </div>
        </div>
        <div class="formWrap">
          <h3>游戏等级 <button type="button" @click="batchRemoveGrade">删除选中项</button></h3>
          <div class="addForm">
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
              show-checkbox
              node-key="number"
              :default-expand-all="false"
              :expand-on-click-node="false"
              empty-text=""
              :check-strictly="true"
              @check-change="gradeCheckChange"
              @node-expand="gradeTreeExpand"
              @node-collapse="gradeTreeCollapse"
            >
              <span slot-scope="{node, data}" class="custom-tree-node">
                <input v-model="data.name" type="text">
                <span v-if="data.name === ''" class="el-tree-message">请输入名称</span>
                <span>
                  <el-button
                    class="addService"
                    type="text"
                    size="mini"
                    @click="() => appendLevel(data)"
                  >
                    添加等级
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => removeLevel(node, data)"
                  >
                    删除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </div>

          <div class="addArea">
            <button type="button" @click="addGrade">
              <svg-icon icon-class="add2" class="icon2" />
              添加段位
            </button>
          </div>
        </div>
      </el-form>
      <div class="btn">
        <el-button type="primary" @click="addGame">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
let areaId = 4000
let serviceId = 5000

let gradeId = 6000
let levelId = 7000
import config from '@/config'
import * as gameInfoApi from '@/api/gameInfo'
import { compressImage } from '@/k5game/components/compressImage'
export default {
  name: 'Index',
  data() {
    var reg = /^([1-9]|10)$/
    var validateTradeHot = (rule, value, callback) => {
      if (this.isTradeHot) {
        if (!value) {
          return callback(new Error('请输入账户排序'))
        }
        if (!reg.test(value)) {
          return callback(new Error('请输入0-10以内的整数'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    var validateLevelingHot = (rule, value, callback) => {
      if (this.isLevelingHot) {
        if (!value) {
          return callback(new Error('请输入账户排序'))
        }
        if (!reg.test(value)) {
          return callback(new Error('请输入0-10以内的整数'))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    }
    return {
      tradeHot: '',
      levelingHot: '',
      flag: true,
      baseUrl: config.baseUrl,
      gradeAllShow: true,
      allAreaShow: true,
      gameServices: [],
      gameGrades: [],
      gamePlatform: [],
      gameType: [],
      gameName: '',
      form: {
        name: '',
        nameEN: '',
        nameST: '',
        coinName: '',
        gameType: '',
        gamePlatform: '',
        gameGrades: '',
        pictureUrl: '',
        editPictureStatus: 0,
        feeBase: 0,
        feeExtra: '',
        tradeHot: '',
        levelingHot: '',
        flag: 0,
        services: []
      },
      rules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ],
        gameType: [
          { required: true, message: '请选择游戏类型', trigger: 'change' }
        ],
        gamePlatform: [
          { required: true, message: '请选择游戏平台', trigger: 'change' }
        ],
        feeExtra: [
          { required: true, message: '请输入手续费', trigger: 'blur' },
          { pattern: /^([0-9]{1,2}|100)$/, message: '请输入0-100内的整数', trigger: 'blur' }
        ],
        pictureUrl: [
          { required: true, message: '请输入选择游戏图片' }
        ],
        tradeHot: [
          { validator: validateTradeHot, trigger: 'blur' }
        ],
        levelingHot: [
          { validator: validateLevelingHot, trigger: 'blur' }
        ]
      },
      gameTypes: [],
      typesParams: {
        name: '',
        sorting: '',
        maxResultCount: 1000,
        skipCount: 0
      },
      isTradeHot: false,
      isLevelingHot: false,
      imageUrl: '',
      fileList: [],
      gameServiceChanged: false,
      gameGradesChanged: false,
      gameServerIds: [],
      serviceChecked: [],
      gradeChecked: []
    }
  },
  computed: {
  },
  watch: {
    gamePlatform(val) {
      if (val) {
        this.form.gamePlatform = ''
        val.some(item => {
          this.form.gamePlatform += item + '，'
        })
        console.log(this.form.gamePlatform)
      }
    },
    gameType(val) {
      if (val) {
        this.form.gameType = ''
        val.some(item => {
          this.form.gameType += item + '，'
        })
      }
    },
    gameServices: {
      handler(val, oldVal) {
        this.gameServiceChanged = true
      },
      deep: true
    },
    gameGrades: {
      handler(val, oldVal) {
        this.gameGradesChanged = true
      },
      deep: true
    },
    tradeHot(val) {
      this.form.tradeHot = val
    },
    levelingHot(val) {
      this.form.levelingHot = val
    }
  },
  created() {

  },
  mounted() {
    this.getTypeLists()
    this.form = JSON.parse(window.sessionStorage.getItem('gameInfo'))
    this.getService()
    this.gamePlatform = this.form.gamePlatform.split('，')
    this.gameType = this.form.gameType.split('，')
    this.imageUrl = config.baseUrl + config.pictureUrl + this.form.pictureUrl
    this.flag = !(this.form.flag > 0)
    if (Number(this.form.tradeHot) >= 0 && Number(this.form.tradeHot) <= 10) {
      this.tradeHot = this.form.tradeHot
      this.isTradeHot = true
    } else {
      this.tradeHot = ''
      this.isTradeHot = false
    }
    if (this.form.levelingHot >= 0 && this.form.levelingHot <= 10) {
      this.levelingHot = this.form.levelingHot
      this.isLevelingHot = true
    } else {
      this.levelingHot = ''
      this.isLevelingHot = false
    }
    if (this.form.gameGrades) {
      this.gameGrades = JSON.parse(this.form.gameGrades)
    }
  },
  methods: {
    changeIsTradeHot(val) {
      if (!val) {
        this.tradeHot = ''
      }
    },
    changeIsLevelingHot(val) {
      if (!val) {
        this.levelingHot = ''
      }
    },
    // 获取游戏区服
    getService() {
      gameInfoApi.GetGameService({ gameId: this.form.id }).then(res => {
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
          // console.log(this.gameServices)
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
      // console.log(obj)
      for (let i = 0, len = list.length; i < len; i++) {
        // 父级id
        const id = list[i].parentId
        // 没父级
        if (!id) {
          this.$set(list[i], 'children', [])
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
    // 获取游戏类型列表
    getTypeLists() {
      gameInfoApi.GetCategories(this.typesParams).then(res => {
        if (res.data.success) {
          this.gameTypes = res.data.result.items
        }
      })
    },
    uploadSuccess(response, file, fileList) {
      // 图片上传成功
      this.imageUrl = URL.createObjectURL(file.raw)
      this.form.pictureUrl = response.result.fileName
      this.$refs.imgUpload.clearValidate()
    },
    beforeAvatarUpload(file) {
      // 图片上传之前进行压缩
      // const _this = this
      const isLt2M = file.size / 1024 / 1024 < 5
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.$message.error('请上传正确的图片格式文件')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
        return false
      }
      const compress = new Promise((resolve, reject) => {
        const read = new FileReader()
        read.readAsDataURL(file)
        read.onload = (e) => {
          const src = e.target.result
          compressImage(src, {
            maxWidth: 1920, // 限制最大宽度
            maxHeight: 1080, // 限制最大高度，若宽高都限制了，按原图比例最小边为主
            // width: 640, // 压缩后图片的宽
            quality: 1 // 压缩后图片的清晰度，取值0-1，值越小，所绘制出的图像越模糊
          }).then(result => {
            const newFile = this.dataURItoBlob(result)
            resolve(newFile)
          })
        }
      })
      return compress
    },
    /* base64转Blob对象 */
    dataURItoBlob(data) {
      let byteString
      if (data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(data.split(',')[1])
      } else {
        byteString = unescape(data.split(',')[1])
      }
      const mimeString = data
        .split(',')[0]
        .split(':')[1]
        .split(';')[0]
      const ia = new Uint8Array(byteString.length)
      for (let i = 0; i < byteString.length; i += 1) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ia], { type: mimeString })
    },
    blurService(data, node) {
      const treeList = this.gameServices
      // 判断是否存在相同的名字
      for (let i = 0; i < treeList.length; i++) {
        if (treeList[i].name === data.name && treeList[i].number !== data.number) {
          this.$message.error('已存在相同的区服名字')
        }
        if (treeList[i].children && treeList[i].children.length) {
          const children = treeList[i].children
          for (let j = 0; j < children.length; j++) {
            if (children[j].name === data.name && children[j].number !== data.number) {
              this.$message.error('已存在相同的区服名字')
            }
          }
        }
      }
    },
    blurGrade(data, node) {
      const treeList = this.gameGrades
      // 判断是否存在相同的名字
      for (let i = 0; i < treeList.length; i++) {
        if (treeList[i].name === data.name && treeList[i].number !== data.number) {
          this.$message.error('已存在相同的名字')
        }
        if (treeList[i].children && treeList[i].children.length) {
          const children = treeList[i].children
          for (let j = 0; j < children.length; j++) {
            if (children[j].name === data.name && children[j].number !== data.number) {
              this.$message.error('已存在相同的名字')
            }
          }
        }
      }
    },
    // 发布游戏
    addGame() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.gameType = this.form.gameType.substring(0, this.form.gameType.length - 1)
          this.form.gamePlatform = this.form.gamePlatform.substring(0, this.form.gamePlatform.length - 1)
          this.form.flag = this.flag ? 0 : 1
          if (this.gameServiceChanged) {
            this.form.services = this.gameServices
          } else {
            this.form.services = [
              {
                name: '默认区',
                isActive: true,
                children: [
                  {
                    name: '默认服',
                    isActive: true
                  }
                ]
              }
            ]
          }
          if (this.gameGradesChanged) {
            this.form.gameGrades = JSON.stringify(this.gameGrades)
          } else {
            this.form.gameGrades = ''
          }
          if (!this.form.tradeHot) {
            this.form.tradeHot = -99
          }
          if (!this.form.levelingHot) {
            this.form.levelingHot = -99
          }
          console.log(this.form)
          gameInfoApi.AddOrUpateGame(this.form).then(res => {
            if (res.data.success) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.go(-1)
              }, 2000)
            }
          })
        } else {
          this.$nextTick(() => {
            var isError = document.getElementsByClassName('is-error')
            isError[0].querySelector('input').focus()
            isError[0].querySelector('input').scrollIntoView(false)
          })
          return false
        }
      })
    },
    // 添加区
    addArea() {
      const newArea = {
        number: areaId++,
        name: '',
        isActive: true,
        children: []
      }
      this.gameServices.push(newArea)
    },
    // 添加服务器
    append(data) {
      let newChild = {}
      if (data.id) {
        newChild = { number: serviceId++, isActive: true, name: '', parentId: data.id }
      } else {
        newChild = { number: serviceId++, isActive: true, name: '' }
      }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      if (this.allAreaShow) {
        this.showAllArea()
      }
      data.children.push(newChild)
    },
    // 获取选中的节点
    handleCheckChange(data, checked, indeterminate) {
      this.gameServerIds = []
      this.serviceChecked = this.$refs.gameServicesTree.getCheckedNodes()
      this.serviceChecked.some(item => {
        if (item.id) {
          this.gameServerIds.push(item.id)
        }
      })
    },
    // 批量删除服务器
    batchRemove() {
      const _this = this
      if (!this.serviceChecked.length) {
        this.$message.error('请先选择要删除的游戏区服')
        return false
      }
      this.$confirm('确定删除这些区服吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.gameServerIds.length) {
          gameInfoApi.BatchDeleteGameServer({ gameServerIds: this.gameServerIds }).then(res => {
            if (res.data.success) {
              _this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.getService()
              this.serviceChecked = []
            }
          })
        } else {
          this.serviceChecked.some(data => {
            const node = _this.$refs.gameServicesTree.getNode(data)
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.number === data.number)
            children.splice(index, 1)
          })
          _this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.serviceChecked = []
        }
      }).catch(() => {})
    },
    // 删除服务器
    remove(node, data) {
      const _this = this
      if (data.children && data.children.length) {
        this.$confirm('该区下已经存在服务器，确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteService()
        }).catch(() => {})
      } else {
        deleteService()
      }
      function deleteService() {
        if (data.id) {
          gameInfoApi.DeleteGameServer({ id: data.id }).then(res => {
            if (res.data.success) {
              const parent = node.parent
              const children = parent.data.children || parent.data
              const index = children.findIndex(d => d.number === data.number)
              children.splice(index, 1)
              _this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          })
        } else {
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.number === data.number)
          children.splice(index, 1)
          _this.$message({
            message: '删除成功',
            type: 'success'
          })
        }
      }
    },
    // 添加等级
    appendLevel(data) {
      const newChild = { number: levelId++, name: '', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      if (this.gradeAllShow) {
        this.showAllGrade()
      }
      data.children.push(newChild)
    },
    // 删除等级
    removeLevel(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.number === data.number)
      children.splice(index, 1)
    },
    // 游戏区服树节点被展开
    serviceTreeExpand() {
      this.allAreaShow = false
    },
    // 游戏区服树节点被关闭
    serviceTreeCollapse() {
      const self = this
      const treeList = this.gameServices
      if (treeList.length === 1) {
        this.allAreaShow = true
      } else {
        for (let i = 0; i < treeList.length; i++) {
          if (self.$refs.gameServicesTree.store.nodesMap[treeList[i].number].expanded) {
            this.allAreaShow = false
          } else {
            this.allAreaShow = true
          }
        }
      }
    },
    // 游戏等级树节点被展开
    gradeTreeExpand() {
      this.gradeAllShow = false
    },
    // 游戏等级树节点被关闭
    gradeTreeCollapse() {
      const self = this
      const treeList = this.gameGrades
      if (treeList.length.length === 1) {
        this.gradeAllShow = true
      } else {
        for (let i = 0; i < treeList.length; i++) {
          if (self.$refs.gradeTree.store.nodesMap[treeList[i].number].expanded) {
            this.gradeAllShow = false
          } else {
            this.gradeAllShow = true
          }
        }
      }
    },
    // 获取选中的等级节点
    gradeCheckChange(data, checked, indeterminate) {
      console.log(this.$refs.gradeTree.getCheckedNodes())
      this.gradeChecked = this.$refs.gradeTree.getCheckedNodes()
    },
    // 批量删除等级
    batchRemoveGrade() {
      const _this = this
      if (!this.gradeChecked.length) {
        this.$message.error('请先选择要删除的游戏等级')
        return false
      }
      this.$confirm('确定删除这些等级吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.gradeChecked.some(data => {
          const node = _this.$refs.gradeTree.getNode(data)
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.number === data.number)
          children.splice(index, 1)
        })
        _this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.gradeChecked = []
      }).catch(() => {})
    },
    // 添加段位
    addGrade() {
      const newArea = {
        number: gradeId++,
        name: '',
        children: []
      }
      this.gameGrades.push(newArea)
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
    }
  }
}
</script>
<style lang="scss">
.hide .el-upload--picture-card {
	display: none;
}
.formTips{
  font-size: 12px;
  margin-left: 15px;
}
.product-information{
  margin: 15px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .tips{
    padding:15px;
    background: #fffaea;
    border: 1px solid #ffe592;
    font-size: 14px;
    h4{
      color: #ff9900;
      font-weight: normal;
      margin: 0 0 10px;
    }
  }
  .formWrap{
    margin-top: 20px;
    h3{
      font-size: 18px;
      color: #333;
      font-weight: normal;
      margin-bottom: 10px;
      span{
        font-size: 12px;
        color: #FF0000;
        margin-left: 5px;
      }
      button{
        color: #ff9933;
        font-size: 12px;
        padding: 3px 8px;
        border: 1px solid #ff9933;
        background: #fff;
        border-radius: 5px;
        margin-left: 5px;
      }
    }
    .sort{
      margin-left: 20px;
      span{
        color: #FF0000;
        margin-right: 3px;
      }
    }
    .addForm{
      display: flex;
      align-items: flex-start;
      .showAll{
        height: 40px;
      }
    }
  }
  .title{
    line-height: 40px;
    border-bottom: 1px solid #f2f2f2;
    margin-bottom: 25px;
  }
  .el-input,.el-textarea,.el-checkbox-group,.el-select{
    width: 350px!important;
  }
  .modeTips{
    font-size: 12px;
    color: #FF9900;
  }
  .imgTips{
    font-size: 12px;
    color: #999;
  }
  .furtherInformation{
    button{
      margin-left: 15px;
      height: 32px;
      color: #FF9933;
      font-size: 12px;
      border: 1px solid #FF9933;
      background: #fff;
      border-radius: 3px;
    }
  }
  .contactInfo{
    span{
      font-size: 12px;
      margin-left: 15px;
    }
  }
  .btn{
    margin-top: 40px;
    width: 50%;
    text-align: center;
    button{
      width: 255px;
      height: 45px;
    }
    p{
      color: #333;
      font-size: 12px;
      margin-top: 10px;
    }
  }

}
.custom-tree-node{
  input{
    width: 180px;
    height: 30px;
    border: 1px solid #f2f2f2;
    padding-left: 10px;
    font-size: 13px;
    margin-right: 5px;
  }
}
.el-tree-node__content{
    height: 40px;
  }
 .el-tree-node__children .addService{
   display: none;
 }
 .addArea{
   padding-left: 100px;
   button{
     border: 1px solid #d7d7d7;
     color: #333;
     background: #fff;
     height: 30px;
     width: 90px;
     font-size: 13px;
   }
 }
 .el-button--text{
   color: #02A7F0;
 }
 .hotRecommend{
   .el-form-item__error {
     margin-left: 115px;
   }
 }
 .el-tree-message{
   font-size: 12px;
   color: #FF0000;
 }
</style>
