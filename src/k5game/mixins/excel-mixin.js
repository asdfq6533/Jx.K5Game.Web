import moment from 'moment'
import XLSX from 'xlsx'

const excelMixin = {
  methods: {
    // upload
    excelUploadHandle(rawFile, callBack) {
      const before = this.beforeUploadExcel(rawFile)
      if (before) {
        this.readerDataFromExcel(rawFile, callBack)
      } else {
        callBack()
      }
    },

    beforeUploadExcel(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: '文件太大，不超过1M',
        type: 'warning'
      })
      return false
    },

    readerDataFromExcel(rawFile, callBack) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]
          const header = this.getHeaderRowFromExcel(worksheet)
          const results = XLSX.utils.sheet_to_json(worksheet)
          const excelData = this.generateData({ header, results })
          callBack(excelData)
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(rawFile)
      })
    },

    generateData({ header, results }) {
      const excelData = {}
      excelData.header = header
      excelData.results = results
      return excelData
    },

    getHeaderRowFromExcel(sheet) {
      const headers = []
      const range = XLSX.utils.decode_range(sheet['!ref'])
      let C
      const R = range.s.r
      /* start in the first row */
      for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
        /* find the cell in the first row */
        let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
        headers.push(hdr)
      }
      return headers
    },

    // down
    excelDownLoadHandle(list, tHeader, filterVal, formatVal, filename = 'excel') {
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(filterVal, list, formatVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
      })
    },

    formatJson(filterVal, jsonData, formatVal) {
      return jsonData.map(v => filterVal.map(j => {
        let flag = false
        for (const index in formatVal) {
          const field = formatVal[index]['field']
          const format = formatVal[index]['format']
          if (j === field && format) {
            flag = true
            switch (format) {
              case 'Date':
                return moment((v[j])).utc().format('YYYY-MM-DD')
              case 'Boolean':
                return v[j] ? '是' : '否'
              default:
                return v[j]
            }
          }
        }
        if (!flag) {
          return v[j]
        }
      }))
    }
  }
}
export default excelMixin
