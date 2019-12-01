//获取应用实例
const app = getApp() 
class HTTP {
  constructor() {
    this.baseRestUrl = getApp().globalData.Serverurl
  }
  //http 请求类, 当noRefech为true时，不做未授权重试机制
  request(params) {
  
    var that = this
    var url = this.baseRestUrl + params.url;

    if (!params.method) {
      params.method = 'GET';
    }
    // params.data.authUserId=app.globalData.openid;
    wx.request({
      url: url,
      data: params.data,
      method: params.method,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
        //'content-type': 'application/json',
       // 'Authorization': getApp().globalData.token
      },
      success: function (res) {  //成功回调
        // 判断以2（2xx)开头的状态码为正确
        // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);
        if (startChar == '2') {
          params.success && params.success(res.data);
        } else {
          params.error && params.error(res);
        }
      },
      fail: function (err) { //失败回调
        params.fail && params.fail(err)
      },
      complete: function (res) { //执行完回调
        params.complete(res)
      }
    });
  }

  /**
   * Promise
   */
  reAjax(url, params){
    return new Promise((resove, reject) => {
      wx.request({
        url: getApp().globalData.Serverurl + url,
        data: params.data || {},
        header: {
          'content-type': 'application/x-www-form-urlencoded', // 默认值
          'Authorization': getApp().globalData.token
        },
        method: params.method,
        success: function (res) {
          if (res.statusCode == 200) {
            resove(res)
          } else {
            reject(res)
          }
        },
        fail: function (res) {
          reject(res)
        },
        complete: function (res) {
          reject(res)
        }
      })
    })
  }
};
export { HTTP };