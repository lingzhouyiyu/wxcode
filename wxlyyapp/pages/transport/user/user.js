// pages/nk/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户退出登录
   */
  bindlogout: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
    /* 
    wx.removeStorage({
      key: 'key',
      success(res) {
        console.log(res.data);
        
      }
    })
    */
  },

   openSetting: function (e) {
    console.log(e.detail.authSetting["scope.userLocation"]);
    console.log(e.detail.authSetting["scope.camera"]);
    console.log(e.detail.authSetting["scope.userLocation", "scope.camera"]);
  }
})