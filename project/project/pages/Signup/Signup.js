import {
  Mine
} from '../../models/mine.js'
let mine = new Mine()
//获取应用实例
const app = getApp()
var limit = 10;
var page = 1;
var hasNextPage = false;
var nextPage = 2;
// pages/Signup/Signup.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getActivityData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getActivityData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (hasNextPage) {
      this.getActivityDataLoad();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //订单详情
  gotoactiveOrderDetail: function(e) {
    var orderNo = e.currentTarget.dataset.orderno;
    var activeId = e.currentTarget.dataset.activeid;
    var activeType = e.currentTarget.dataset.activetype;
    wx.navigateTo({
      url: '../../pages/orders/activeOrderDetail/activeOrderDetail?orderNo=' + orderNo + '&activeId=' + activeId + '&activeType=' + activeType,
    })
  },
  //获取报名数据
  getActivityData: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    mine.selectActiveOrder(limit, page, app.globalData.openid, data => {
      console.log(data.data);
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      that.setData({
        activeData: data.data
      })
    }, res => {});
  },
  //上拉加载
  getActivityDataLoad: function() {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    mine.selectActiveOrder(limit, nextPage, app.globalData.openid, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var temp = that.data.activeData;
      for (let i = 0; i < data.data.length; i++) {
        temp.push(data.data[i]);
      }
      that.setData({
        activeData: temp
      })
      // 隐藏加载框
      wx.hideLoading();
    }, res => {});
  },
  //领取体验券
  sureOrderCode: function(e) {
    var that=this;
    var orderNo = e.currentTarget.dataset.ordernum;
    var status = e.currentTarget.dataset.status;
    if (status == '1') { //已领取
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确定领取该体验券吗？领券时务必在商家前台当面领取使用！',
      success: function (res) {
        if (res.confirm) {
          mine.sureOrderCode(orderNo, app.globalData.openid, data => {
            wx.showToast({
              title: '领取成功!',
              duration: 1500,
              icon: 'none'
            })
            that.getActivityData();
          }, res => { })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
   
  },
})