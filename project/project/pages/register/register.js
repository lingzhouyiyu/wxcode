import {
  ConfirmOrder
} from '../../models/confirmOrder.js'
let register = new ConfirmOrder()
//获取应用实例
const app = getApp()

var phonedata = "";
var codedata = "";
var interval = null //倒计时函数
// pages/register/register.js
var tags='';
//优惠券金额id
var money='';
var id='';
var courseAdvancePayment='';
//课程id
var courseId='';
//活动id类型
var activeId='';
var activeType='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: '获取验证码', //倒计时 
    currentTime: 61,
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    tags=options.tag;
    if (tags=='course'){
      money = options.money;
      id = options.id;
      courseAdvancePayment = options.courseAdvancePayment;
      courseId = options.courseId;
    }
    if (tags == 'activity' || tags == 'activitybl' || tags =='activityfx'){
      activeId = options.activeId;
      activeType = options.activeType;
    }
    
    if(app.globalData.openid==null||app.globalData.openid==''){
      app.getToken();
    }
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
  searchPhone: function(e) {
    phonedata = e.detail.value;

  },
  searchCode: function(e) {
    codedata = e.detail.value;

  },
  gotoconfirmOrder: function() {

    if (phonedata == "") {
      wx.showToast({
        title: '请输入电话号码!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (codedata == "") {
      wx.showToast({
        title: '请输入验证码!',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (!(/^1[34578]\d{9}$/.test(phonedata))) {
      wx.showToast({
        title: '手机号码有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (phonedata.length > 11) {
      wx.showToast({
        title: '手机号码有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
//验证验证码
    this.smsCodeAuth(phonedata, codedata);

  },
  sendCode: function() {
    if(this.data.disabled) return;
    var that = this;
    if (phonedata == "") {
      wx.showToast({
        title: '请输入电话号码!',
        icon: 'none',
        duration: 1000
      })
      return;
    }

    if (!(/^1[34578]\d{9}$/.test(phonedata))) {
      wx.showToast({
        title: '手机号码有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (phonedata.length > 11) {
      wx.showToast({
        title: '手机号码有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    that.getSmsCode(phonedata);
    interval = setInterval(function() {
      that.data.currentTime--;
      that.setData({
        time: that.data.currentTime + '秒'
      })
      if (that.data.currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新发送',
          currentTime: 61,
          disabled: false
        })
      }
    }, 1000)

  },
  //获取验证码
  getSmsCode: function (mobile){
    var that=this;
    that.setData({
      disabled: true,
    });
    register.getSmsCode(mobile, app.globalData.openid,data=>{
      // console.log(data);
    },res=>{});
  },
  //验证验证码
  smsCodeAuth: function (mobile,smsCode) {
    var that = this;
    register.smsCodeAuth(mobile, smsCode, app.globalData.openid, data => {
      // console.log(data);
      app.globalData.userPhone = phonedata;
      if (data.status==200) {
        if (tags=='course'){
          wx.navigateTo({//普通课程确认订单
            url: '../../pages/orders/confirmOrder/confirmOrder?phonedata=' + phonedata + '&money=' + money + '&id=' + id + '&tag=detailcourse' + '&courseAdvancePayment=' + courseAdvancePayment + '&courseId=' + courseId,
          })  
        }else if(tags=='activity'){//按人头收费确认订单
          wx.navigateTo({
            url: '../../pages/orders/confirmOrder_activity/confirmOrder_activity?phonedata=' + phonedata + '&activeId=' + activeId + '&activeType=' + activeType,
          }) 
        } else if (tags == 'activitybl') {//按比例收费确认订单
          wx.navigateTo({
            url: '../../pages/orders/confirmOrder_activitybl/confirmOrder_activitybl?phonedata=' + phonedata + '&activeId=' + activeId + '&activeType=' + activeType,
          })
        } else if (tags == 'recharge'){//充值
          wx.navigateTo({
            url: '../../pages/recharge/recharge?phonedata=' + phonedata,
          })
        } else if (tags == 'activityfx') {//分享领券
          wx.navigateTo({
            url: '../../pages/activityshare/activityshare?activeId=' + activeId + '&activeType=' + activeType,
          })
        }          
      }else{
        wx.showToast({
          title: '验证码错误!',
          icon: 'none',
          duration: 1000
        }) 
      }  
    }, res => { });
  }
})