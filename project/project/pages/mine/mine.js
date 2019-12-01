import {
  Mine
} from '../../models/mine.js'
let mine = new Mine()
//获取应用实例
const app = getApp()
// pages/mine/mine.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: "",
    WawowCoin:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    this.getTotalWawowCoin();
    //获取二维码
    // app.getQRCode();
    //判断用户是否授权
    this.getSetting();
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
    this.getTotalWawowCoin();
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

    this.getTotalWawowCoin();
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
  userInfo:function(e){
    var that=this;
    this.dialog.hideModal();
    that.setData({
      userInfo: e.detail.userInfo,
    })
  },
  getSetting: function () {
    //判断是否授权
    wx.getSetting({
      success: res => {
        //用户信息授权
        if (res.authSetting['scope.userInfo']) {
          app.globalData.hasAuth = true;
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          if (app.globalData.userInfo == null) {
            wx.getUserInfo({
              success: res => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                  userInfo: app.globalData.userInfo,
                })
              }
            })
          } else {
            this.setData({
              userInfo: app.globalData.userInfo,
            })
          }

        } else { //用户未授权
          app.globalData.hasAuth = false;
          //弹出授权弹框
          this.dialog.showModal();
        }     
      }
    })
  },
  gotorecharge: function() {
    var phonedata = app.globalData.userPhone;
    if (phonedata == '' || phonedata == null){//获取数据
      mine.userIsAuth(app.globalData.openid, data => {
        console.log(data);
        app.globalData.userPhone = data.data.phone;
        phonedata = data.data.phone;
        if (phonedata == '' || phonedata == null) {
          wx.navigateTo({
            url: '../../pages/register/register?tag=recharge',
          })
        } else {
          wx.navigateTo({
            url: '../../pages/recharge/recharge?phonedata=' + phonedata,
          })
        }
      }, res => { 
        
      });
    }else{
      wx.navigateTo({
        url: '../../pages/recharge/recharge?phonedata=' + phonedata,
      })
    }
  },
  getTotalWawowCoin: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    mine.getTotalWawowCoin(app.globalData.openid, data => {
      that.setData({
        WawowCoin: data.data
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      
    }, res => {

    });
  },
  gotoregister: function() {
    wx.navigateTo({
      url: '../../pages/register/register',
    })
  },
  gotoapplyTeacher: function() {
    wx.navigateTo({
      url: '../../pages/applyTeacher/applyTeacher',
    })
  },
  gotoapplyInstitution: function() {
    wx.navigateTo({
      url: '../../pages/applyInstitution/applyInstitution',
    })
  },
  gotomyOrder: function(e) {
    var optselect = e.currentTarget.dataset.optselect
    wx.navigateTo({
      url: '../../pages/orders/myOrder/myOrder?optselect=' + optselect,
    })
  },
  gotocoupon: function() {
    wx.navigateTo({
      url: '../../pages/coupon/coupon?tag=mine',
    })
  },
  gotoAbouts: function() {
    wx.navigateTo({
      url: '../../pages/Abouts/Abouts',
    })
  },
  gotoSignup: function() {
    wx.navigateTo({
      url: '../../pages/Signup/Signup',
    })
  },
  gotoCollection: function() {
    wx.navigateTo({
      url: '../../pages/Collection/Collection',
    })
  },
  gotoDisciple: function() {
    wx.navigateTo({
      url: '../../pages/Disciple/index/index',
    })
  },
  gotoshare: function () {
    wx.navigateTo({
      url: '../../pages/share/share',
    })
  },
})