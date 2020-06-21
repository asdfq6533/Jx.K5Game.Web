import * as accountTransactionApi from '@/api/account-transaction'
import * as accountPackageApi from '@/api/accountPackage'
const productMixin = {
  data() {
    return {
      dataInfo: {},
      productLabels: [],
      selectedDetailLabel1: [],
      selectedDetailLabel2: [],
      selectedLabel1: [],
      selectedLabel2: [],
      accountGameLabelList: [],
      accountGameLabelList2: [],
      baseForm: [],
      descForm: [],
      securityForm: [],
      sellForm: []
    }
  },
  computed: {
    getGameId() {
      return this.dataInfo.gameId
    }
  },
  watch: {
    getGameId(val) {
      if (val) {
        this.getGameLabel(val)
      }
    }
  },
  methods: {
    // 获取所有标签
    getProductLabels() {
      if (!this.dataInfo.id) {
        return
      }
      accountTransactionApi.GetProductLableRelationsAsync({ id: this.dataInfo.id }).then(res => {
        this.productLabels = res.data.result.items
        this.handleProductLabels()
      })
    },
    // 处理更新产品的标签
    handleProductLabels() {
      if (this.selectedLabel2.length || this.selectedLabel1.length) {
        return
      }
      this.productLabels.map(obj => {
        this.accountGameLabelList.some(item => {
          if (obj.lableId === item.id) {
            item.stockQty = obj.stockQty
            this.selectedDetailLabel1.push(item)
            this.selectedLabel1.push(item.id)
            return true
          }
        })
        this.accountGameLabelList2.some(item => {
          if (obj.lableId === item.id) {
            item.stockQty = obj.stockQty
            this.selectedDetailLabel2.push(item)
            this.selectedLabel2.push(item.id)
            return true
          }
        })
      })
    },
    // 获取产品信息
    getProductDetail(call) {
      const id = this.$route.query.id
      if (!id) {
        return
      }
      const params = {
        id: id
      }
      accountTransactionApi.GetProductDetailAsync(params).then(res => {
        this.dataInfo = res.data.result
        this.getProductLabels()
        const baseObj = this.dataInfo.jsonBaseInfo ? JSON.parse(this.dataInfo.jsonBaseInfo) : {}
        for (const prop in baseObj) {
          this.baseForm.push({
            fieldName: prop,
            value: baseObj[prop]
          })
        }
        const descObj = this.dataInfo.jsonDescription ? JSON.parse(this.dataInfo.jsonDescription) : {}
        for (const prop in descObj) {
          this.descForm.push({
            fieldName: prop,
            value: descObj[prop]
          })
        }

        const securityObj = this.dataInfo.jsonSecurity ? JSON.parse(this.dataInfo.jsonSecurity) : {}
        for (const prop in securityObj) {
          this.securityForm.push({
            fieldName: prop,
            value: securityObj[prop]
          })
        }

        const sellObj = this.dataInfo.jsonUserInfo ? JSON.parse(this.dataInfo.jsonUserInfo) : {}
        for (const prop in sellObj) {
          this.sellForm.push({
            fieldName: prop,
            value: sellObj[prop]
          })
        }
        if (call && typeof call === 'function') {
          call()
        }
      })
    },
    // 根据游戏获取标签
    getGameLabel(val) {
      this.selectedLabel1 = []
      this.selectedLabel2 = []
      accountPackageApi.GetGameLable({ gameId: val }).then(res => {
        const items = res.data.result.items
        this.accountGameLabelList = []
        this.accountGameLabelList2 = []
        items.map(item => {
          if (item.isBestStart && item.parentId) {
            this.accountGameLabelList.push(item)
          } else if (!item.isBestStart) {
            this.accountGameLabelList2.push(item)
          }
        })
        this.handleProductLabels()
      })
    }
  }
}

export default productMixin
