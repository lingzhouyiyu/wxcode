const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 数据请求封装
const wxRequest = (url, params, successCallback, errorCallback, completeCallback) => {
  wx.request({
    url: getApp().globalData.Serverurl + url,
    data: params || {},
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: 'POST',
    success: function (res) {
      if (res.statusCode == 200) {
        successCallback(res.data)
      } else {
        errorCallback(res)
      }
    },
    fail: function (res) {
      errorCallback(res)
    },
    complete: function (res) {
      completeCallback(res)
    }
  })
}
module.exports = {
  formatTime: formatTime,
  wxRequest: wxRequest
}