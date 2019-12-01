// pages/aa/aa.js
import { HTTP } from '../../utils/http.js'
let http = new HTTP()
//获取应用实例
const app = getApp()
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
    if (app.globalData.openid == null) {
      app.getToken().then((resArg) => {
        // console.log(resArg);
      })
    }
  },

  /**
   * 点击开始进行支付
   */
  btnClickToPay: function () {
    // 1、小程序内调用登录接口，获取到用户的openid
    // 2、调用商户服务器支付统一下单接口，进行预支付
    // 3、调用商户服务器再次签名接口，返回支付数据
    // 4、小程序内完成支付，商户服务器接收支付回调通知
    // https://blog.csdn.net/u013824131/article/details/55001750
    // https://blog.csdn.net/qq_37105358/article/details/81285779

    let openId = app.globalData.openid;

    //支付头信息
    let payInfo = {
      body: "test",
      totalFee: 10.00,
      openId: openId,
      authUserId: openId
    }

    this.prepayOrder(payInfo);
  },

  /**
   * 调用微信统一下单
   * 获取相关数据
   */
  prepayOrder: function (payInfo) {
    let url = "wxapiPay/wxPay/prePay";
    let params = payInfo;
    http.reAjax(url, params).then(function (res) {
      console.log(res);
      if(res.status == 200 && res.data != null) {
        this.wxPayment(res.data);
      }
    }); 
  },

  /**
   * 调用微信支付
   */
  wxPayment: function (options) {
    wx.requestPayment(
    {
      'timeStamp': options.timeStamp,
      'nonceStr': options.nonceStr,
      'package': options.package,
      'signType': options.signType,
      'paySign': options.paySign,
      'success': function (res) { 
        console.log(res);
      },
      'fail': function (res) {
        console.log(res);
      },
      'complete': function (res) { 
        console.log(res);
      }
    })
  }
})