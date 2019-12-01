//app.js
App({
  XSDZhostUrl: 'https://llyapi.laiyunyou.cn/',
  XSDZOBJ: new Object(),
  baiduAccess_token:'',

  NKhostUrl: 'https://llyapi.laiyunyou.cn/',
  NKOBJ: new Object(),

  TAXIhostUrl: 'http://sns.laiyunyou.cn:7272/', //'http://112.74.52.69:7272/',
  TAXIOBJ: new Object(),

  GJhostUrl: 'https://bus.laiyunyou.cn/',
  GJOBJ: new Object(),

  devwidth: null,
  devheight: null,

  onLaunch: function() {

  },

  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },

  globalData: {
    userInfo: null
  },

  onLaunch: function (options) {
    console.log('app on load');
    // 动态设置map的宽和高
    var app = this;
    wx.getSystemInfo({
      success: function (res) {
        app.devwidth = res.windowWidth;
        app.devheight = res.windowHeight;
        //app.globalData.platform = res.platform;        //devtools（windows系统），ios,android
      }
    })
  },

  logtimeout: function (options) {
    console.log('app on load');
  
  }

  
})
