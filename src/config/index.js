const proConfig = {
  baseUrl: 'https://api.k5game.com',
  matomoUrl: 'http://analytics.jxstudio.cn',
  pictureUrl: '/upload/picture/',
  imageUrl: '/Temp/Downloads/',
  uploadExcel: '/File/UploadExcelReNameForTime'
}

const testConfig = {
  baseUrl: 'http://adsl01.ruianer.com:6500',
  // baseUrl: 'http://localhost:61352/',
  matomoUrl: 'http://analytics.jxstudio.cn',
  pictureUrl: '/upload/picture/',
  imageUrl: '/Temp/Downloads/',
  uploadExcel: '/File/UploadExcelReNameForTime'
}

let config = proConfig
if (process.env.VUE_APP_CURRENTMODE === 'test') {
  console.log('development')
  config = testConfig
}
console.log(config)

export default testConfig
