import {
  FindModel
} from '../../models/find.js'
let findModel = new FindModel()

var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()

// pages/newsdetail/newsdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Id: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      Id: options.id,
    });
    this.selectUnderNewsById(this.data.Id);
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //发现新闻详情
  selectUnderNewsById: function (Id) {
    var that=this;
    findModel.selectUnderNewsById(Id,data => {
        this.setData({
          // newsList: data.data,
        });
         console.log(data.data);
      WxParse.wxParse('introduceHtml', 'html', data.data.introduceHtml, that, 5);
      }, res => { })
    },
  

})