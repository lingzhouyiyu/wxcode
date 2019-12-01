// pages/orders/payresult/payresult.js
//获取应用实例
const app = getApp()
var tags = '';
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
    tags = options.tag;
  },

  /**
   * 查看订单页面
   */
  showOrder: function () {
    var that = this;
    if (tags=='course'){
      wx.navigateTo({
        url: '../../../pages/orders/myOrder/myOrder?optselect=listone',
      })
    }else{
      wx.navigateTo({
        url: '../../../pages/Signup/Signup',
      })
    }
   
  }

})