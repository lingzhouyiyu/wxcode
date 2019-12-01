
var WxParse = require('../../wxParse/wxParse.js');
// pages/teachercert/teachercert.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherCertificates:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var teacherCertificates = wx.getStorageSync('teacherCertificates')
    this.setData({
      teacherCertificates: teacherCertificates,
    });
    WxParse.wxParse('teacherCertificates', 'html', teacherCertificates, that, 5);
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
    wx.stopPullDownRefresh();
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
  
  }
})