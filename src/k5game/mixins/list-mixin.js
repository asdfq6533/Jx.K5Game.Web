const MaxResultCount = 10
const listMixin = {
  data() {
    return {
      params: {
        skipCount: 0,
        maxResultCount: MaxResultCount
      },
      dataList: [],
      pageObj: {
        maxResultCount: MaxResultCount,
        totalCount: 0,
        currentPage: 1,
        sizeChange: (page) => {
          this.handleSizeChange(page)
        },
        pageChange: (page) => {
          this.pageChange(page)
        }
      }
    }
  },
  methods: {
    // 搜索
    search() {
      this.params.skipCount = 0
      this.pageObj.currentPage = 1
      this.getList()
    },
    // 页面显示数改变
    handleSizeChange(page) {
      this.params.maxResultCount = page
      this.getList()
    },
    // 页码变化
    pageChange(val) {
      this.params.skipCount = this.params.maxResultCount * (val - 1)
      this.getList()
    },
    // 列表请求
    getList() {},
    // 排序改变
    changeTableSort(column) {
      if (column.order === 'ascending') {
        this.params.sorting = String(column.prop) + ' asc'
      } else if (column.order === 'descending') {
        this.params.sorting = String(column.prop) + ' desc'
      } else {
        this.params.sorting = ''
      }
      this.searchClick()
    }
  }
}
export default listMixin
