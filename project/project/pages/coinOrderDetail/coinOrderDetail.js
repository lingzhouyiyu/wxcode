import {
  Mine
} from '../../models/mine.js'
let mine = new Mine()
//获取应用实例
const app = getApp()
// 明细查询参数
var limit = 15;
var page = 1;
var hasNextPage = false;
var nextPage = 2;
// pages/coinOrderDetail/coinOrderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getWawowCoinOrder();
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
    this.getWawowCoinOrder();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (hasNextPage){
      this.getWawowCoinOrderLoad();
    }
   
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //查询明细
  getWawowCoinOrder: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    mine.getWawowCoinOrder(limit, page, app.globalData.openid, data => {
      console.log(data);
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      var temp = data.data;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].type == '1') {
          temp[i].title = '蛙币充值';
          temp[i].money = '+' + temp[i].wawowCoin
        } else if (temp[i].type == '2') {
          temp[i].title = '蛙币消费';
          temp[i].money = '-' + temp[i].wawowCoin
        }
      }

      that.setData({
        detailData: temp
      })
    }, res => {});
  },
  //查询明细
  getWawowCoinOrderLoad: function() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    mine.getWawowCoinOrder(limit, nextPage, app.globalData.openid, data => {
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      // 隐藏加载框
      wx.hideLoading();
      var temp = data.data;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].type == '1') {
          temp[i].title = '蛙币充值';
          temp[i].money = '+' + temp[i].wawowCoin
        } else if (temp[i].type == '2') {
          temp[i].title = '蛙币消费';
          temp[i].money = '-' + temp[i].wawowCoin
        }
      }
      // console.log(temp);
      var array = that.data.detailData;
      for (let j = 0; j < temp.length; j++) {
        array.push(temp[j]);
      }
      that.setData({
        detailData: array
      })
    }, res => {});
  },
})