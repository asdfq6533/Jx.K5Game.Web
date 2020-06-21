import request from '@/utils/request'

export function UploadExcel(data) {
  return request({
    url: '/File/UploadExcel',
    method: 'post',
    data
  })
}

export function FilesImportRecordLog(data) {
  return request({
    url: '/api/services/k5game/filesImportRecord/FilesImportRecordLog',
    method: 'post',
    data
  })
}
// 上传文件
export function upload(data) {
  return request({
    url: '/File/UploadPicture',
    method: 'post',
    data
  })
}
