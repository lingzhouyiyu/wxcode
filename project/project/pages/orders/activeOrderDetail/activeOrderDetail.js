import {
  ConfirmOrder
} from '../../../models/confirmOrder.js'
let orderDetail = new ConfirmOrder()
//获取应用实例
const app = getApp();
// pages/orders/OrderDetail/OrderDetail.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderNo: '',
    orderData: '',
    Furl: app.globalData.Serverurl,
    schoolLatitude: '',
    schoolLongitude: '',
    schoolAddress: '',
    activeId: '',
    activeType: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      orderNo: options.orderNo,
      activeId: options.activeId,
      activeType: options.activeType,
    });
    //获取订单详情
    this.selectActiveOrderDetail(options.orderNo);
   
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
  //活动详情
  gotoactivity_detail:function(){
    var activeId = this.data.activeId;
    var activeType = this.data.activeType;
    wx.navigateTo({
      url: '../../../pages/activity_detail/activity_detail?activeId=' + activeId + '&activeType=' + activeType,
    })
  },
  makephonecall: function () {
    var that = this;
    wx.makePhoneCall({
      // phoneNumber: that.data.orderData.orderDetail.schoolPhone,
      phoneNumber: app.globalData.phoneNumber,
    })
  },

  selectActiveOrderDetail: function (orderNo) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    orderDetail.selectActiveOrderDetail(orderNo, data => {
     
      if (data.data.orderRepaymount == null || data.data.orderRepaymount==''){
        data.data.orderRepaymount ='请详细阅读活动内容';
      }
      that.setData({
        orderData: data.data,
        // schoolLatitude: data.data.orderDetail.schoolLatitude,
        // schoolLongitude: data.data.orderDetail.schoolLongitude,
        // schoolAddress: data.data.orderDetail.schoolAddress,
      });
      // 隐藏加载框
      wx.hideLoading();
    }, res => { });

  },
  //打开地图
  openlocation: function () {
    return;
    var that = this;
    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: parseFloat(that.data.schoolLatitude),//要去的纬度-地址
          longitude: parseFloat(that.data.schoolLongitude),//要去的经度-地址
          name: that.data.schoolAddress,
          address: that.data.schoolAddress
        })
      }
    })
  },
  //复制
  setClipboardData:function(){
    var that=this;
    wx.setClipboardData({
      data: that.data.orderData.orderNum,
      success:function(){
        wx.showToast({
          title: '复制成功!',
          duration:1000,
          icon:'none'
        })
      }
    })
  },
})