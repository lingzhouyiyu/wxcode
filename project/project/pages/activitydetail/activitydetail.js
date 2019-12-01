import {
  Activity
} from '../../models/activity.js'

let activity = new Activity();

var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()

// pages/activitydetail/activitydetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    activityData:'',
    activeId:'',
    activeType:'',
    yuyuemoney:'',
    payafter:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({
      activeId: options.activeId,
      activeType: options.activeType,
    })
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
  //电话咨询
  makephonecall: function () {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phoneNumber,
    })
  },
  gotoconfirmOrder_activity: function () {
    var that=this;
    var phonedata = app.globalData.userPhone;
    if (phonedata == '' || phonedata == null) {
      wx.navigateTo({
        url: '../../pages/register/register?tag=activitybl' + '&activeId=' + that.data.activeId + '&activeType=' + that.data.activeType,
      })
    } else {
      wx.navigateTo({
        url: '../../pages/orders/confirmOrder_activitybl/confirmOrder_activitybl?phonedata=' + phonedata + '&activeId=' + that.data.activeId + '&activeType=' + that.data.activeType,
      })
    }
   
  },
  //获取详情
  selectActiveById: function (activeId, activeType) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    activity.selectActiveById(activeId, activeType, data => {
      // console.log(data.data);
      var moneycount=0;
      if (data.data.platformPrice == '' || data.data.platformPrice==null){
        moneycount = data.data.activityPrice;
      }else{
        moneycount = data.data.platformPrice;
      }

      that.setData({
        activityData:data.data,
        yuyuemoney:(moneycount*0.15).toFixed(2),
        payafter: (moneycount - (moneycount * 0.15)).toFixed(2)
      })
      WxParse.wxParse('activity_buy', 'html', data.data.contxt, that, 5);
      // 隐藏加载框
      wx.hideLoading();
    }, res => { });
  },
  // 预约金说明弹框
  submit: function () {
    this.setData({
      showModal: true
    })
  },
  preventTouchMove: function () {
    return;
  },
  close_mask: function () {
    this.setData({
      showModal: false
    })
  },
})