//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    manage: ''
  },

  onLoad: function () {
    this.setData({
      manage: app.XSDZOBJ.Manage
    })
  }, 


  openSetting: function (e) {
    console.log(e.detail.authSetting["scope.userLocation"]);
    console.log(e.detail.authSetting["scope.camera"]);
    console.log(e.detail.authSetting["scope.userLocation","scope.camera"]);
  },
  
  //退出登录
  bindlogout: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
   /* wx.removeStorage({
      key: 'key',
      success(res) {
        console.log(res.data);
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    }) */
  }
})
