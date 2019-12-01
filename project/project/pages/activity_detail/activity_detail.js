import {
  Activity
} from '../../models/activity.js'

let activity = new Activity();

var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp();

// pages/activity_detail/activity_detail.js
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
    var that = this;
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {
        that.selectActiveById(options.activeId, options.activeType);
      })
    } else {
      that.selectActiveById(options.activeId, options.activeType);
    }
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
    // 停止下拉动作
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

  },
  //获取详情
  selectActiveById: function (activeId, activeType) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    activity.selectActiveById(activeId, activeType, data => {

      WxParse.wxParse('activity_detail', 'html', data.data.contxt, that, 5);
      // 隐藏加载框
      wx.hideLoading();
    }, res => { });
  },
})