// pages/orders/pay/pay.js
import { HTTP } from '../../../utils/http.js'
let http = new HTTP()
import {
  Mine
} from '../../../models/mine.js'
let mine = new Mine()
//获取应用实例
const app = getApp()
var tags='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: "",
    amount: "",
    orderRepaymount: "",
    isShow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (!app.globalData.openid) {
      app.getToken();
    }
    tags = options.tag;
    this.setData({
      orderNo: options.orderNo,
      amount: options.amount,
      orderRepaymount: options.orderRepaymount,
    });
    if (tags == 'active'){
      this.setData({
        isShow:false
      })
    }
  },

  /**
   * 点击开始进行支付
   */
  toPay: function () {
    var that = this;
    let openid = app.globalData.openid;
    if (!openid) {
      app.getToken();
    }

    //支付头信息
    let payInfo = {
      out_trade_no: that.data.orderNo,
      body: "蛙涡教育支付",
      openid: openid,
      authUserId: openid
    }

    if (that.data.amount==0){
      that.prepayOrder_zero();
    }else{
      that.prepayOrder(payInfo);
    } 
  },

  /**
   * 调用微信统一下单
   * 获取相关数据
   */
  prepayOrder: function (payInfo) {
    let that = this;
    let url = "wxapi/wxPay/prePay";
    let params = {
      method: 'POST',
      data: payInfo
    };
    http.reAjax(url, params).then(function (res) {
    
      let data = res.data;
    
      if (data.status == 200 && data.data != null) {
      
        that.wxPayment(data.data);
      } else {
        wx.showToast({
          title: '付款失败！',
        })
      }
    });
  },

  /**
   * 调用微信支付
   */
  wxPayment: function (options) {
    var that = this;
 
    wx.requestPayment({
      'timeStamp': options.timeStamp,
      'nonceStr': options.nonceStr,
      'package': options.package,
      'signType': options.signType,
      'paySign': options.paySign,
      'success': function (res) {
   
        if (res.errMsg == "requestPayment:ok") {
          //支付成功
            wx.navigateTo({
              url: '../../../pages/orders/payresult/payresult?tag=' + tags,
            })
                   
        }
      },
      'fail': function (res) {
     
      },
      'complete': function (res) {
        
      }
    })
  },
  //预约金为0
  prepayOrder_zero:function(){
    var that = this;
    console.log(that.data.orderNo);   
    mine.payWithNoWx(that.data.orderNo,data=>{
      // console.log(data);
      if (data.status==200){
        wx.showToast({
          title: '支付成功!',
          duration:1500,
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../../../pages/orders/payresult/payresult?tag=' + tags,
          })
        }, 1500)       
      }
    },res=>{})
  },
})