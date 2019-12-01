// pages/listIndex/selectArea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: null,
    district: null,
    localcity: null,
    localdistrict: null,
    areas: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      city: getApp().globalData.city,
      district: getApp().globalData.district,
      localcity: getApp().globalData.localcity,
      localdistrict: getApp().globalData.localdistrict,
      areas: getApp().globalData.serviceAreas,
      hotAreas: getApp().globalData.hotAreas,
    })


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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  tapArea: function (e) {
    var app = getApp();
    this.setData({
      city: e.currentTarget.dataset.city,
      district: e.currentTarget.dataset.district,
    });
    app.globalData.city = e.currentTarget.dataset.city;
    app.globalData.district = e.currentTarget.dataset.district;
    // app.checkServiceArea();
    app.globalData.localService = true;
    //wx.navigateBack();
    wx.reLaunch({
      url: "../index/index"
    })
  }
})