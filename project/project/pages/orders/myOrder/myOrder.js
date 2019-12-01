// pages/orders/myOrder/myOrder.js
import {
  HTTP
} from '../../../utils/http.js'
let http = new HTTP()
import {
  ConfirmOrder
} from '../../../models/confirmOrder.js'
let confirmOrder = new ConfirmOrder()
//获取应用实例
const app = getApp()
//获取订单参数
var limit = 10;
var page = 1;
var nextPage = 2;
var hasNextPage = false;
var currentStatus = "1";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    optselect: 'listone',
    orderList: [],
    loadingTips: true,
    Furl: app.globalData.Serverurl,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    that.setData({
      optselect: options.optselect,
    });
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    switch (options.optselect) {
      case 'listone':
        currentStatus = "1",
          that.getOrder(currentStatus);
        break;
      case 'listtwo':
        currentStatus = "2",
          that.getOrder(currentStatus);
        break;
      case 'listthree':
        currentStatus = "3",
          that.getOrder(currentStatus);
        break;
      case 'listfour':
        currentStatus = "4",
          that.getOrder(currentStatus);
        break;
      default:
        currentStatus = "1",
          that.getOrder(currentStatus);
    }
    // if (!app.globalData.openid) {
    //   app.getToken().then(res => {
    //     that.getOrder(currentStatus);
    //   });
    // } else {
    //   that.getOrder(currentStatus);
    // }

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
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    that.getOrder(currentStatus);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (hasNextPage) {
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      that.getOrder_load(currentStatus, nextPage);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //顶部选项切换
  jumpTo: function(e) {
    var that = this;
    that.setData({
      optselect: e.currentTarget.dataset.opt,
    })
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    switch (e.currentTarget.dataset.opt) {
      case 'listone':
        currentStatus = "1",
          that.getOrder(currentStatus);
        break;
      case 'listtwo':
        currentStatus = "2",
          that.getOrder(currentStatus);
        break;
      case 'listthree':
        currentStatus = "3",
          that.getOrder(currentStatus);
        break;
      case 'listfour':
        currentStatus = "4",
          that.getOrder(currentStatus);
        break;
      default:
        currentStatus = "1",
          that.getOrder(currentStatus);
    }
  },
  //去付款
  gotopay: function(e) {
    var orderNo = e.currentTarget.dataset.ordernum;
    var amount = e.currentTarget.dataset.orderreservations;
    var orderRepaymount = e.currentTarget.dataset.paymount;
    wx.navigateTo({
      url: '../../../pages/orders/pay/pay?orderNo=' + orderNo + '&amount=' + amount + '&orderRepaymount=' + orderRepaymount,
    })
  },
  //订单详情
  gotoOrderDetail: function(e) {
    var orderNo = e.currentTarget.dataset.orderno;

    wx.navigateTo({
      url: '../../../pages/orders/OrderDetail/OrderDetail?orderNo=' + orderNo,
    })
  },

  //评价
  gotoevaluate: function(e) {
    var courseId = e.currentTarget.dataset.courseid;
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '../../../pages/evaluate/evaluate?courseId=' + courseId + '&orderId=' + orderId,
    })
  },
  //再次购买
  gotoconfirmOrder: function(e) {
    var courseId = e.currentTarget.dataset.select;

    wx.navigateTo({
      url: '../../../pages/detailcourse/detailcourse?courseId=' + courseId,
    })
  },
  //获取订单数据
  getOrder: function(status) {
    var that = this;
    let url = "wxapi/order/selectOrders";
    let params = {
      method: 'POST',
      data: {
        userId: app.globalData.openid,
        authUserId: app.globalData.openid,
        cate: status,
        limit: limit,
        page: page
      }
    };

    http.reAjax(url, params).then(function(res) {
      let data = res.data;
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      if (data.code == 200 && data.data != null) {
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
        var temparray = data.data;
        for (let i = 0; i < temparray.length; i++) {
          if (temparray[i].courseList.length > 0) {
            temparray[i].courseList[0].newcourseImg = temparray[i].courseList[0].courseImg.split(',')[0];
          }
          if (temparray[i].orderCodeUseStatus == '1') {
            temparray[i].orderReservationsPayStatus = '8';
          }
          //时分秒倒计时
          if (temparray[i].orderReservationsPayStatus){
            temparray[i].overMillisecond = parseInt(temparray[i].overMillisecond/60/60);
          }
        }    
        that.setData({
          orderList: temparray,
          loadingTips: true,
        });
      } else {
        wx.showToast({
          title: '获取订单失败！',
        })
      }
    });
  },
  //加载订单数据
  getOrder_load: function(status, nextPages) {

    let that = this;
    let url = "wxapi/order/selectOrders";
    let params = {
      method: 'POST',
      data: {
        userId: app.globalData.openid,
        cate: status,
        limit: limit,
        page: nextPages
      }
    };
    http.reAjax(url, params).then(function(res) {
      let data = res.data;


      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;

      if (!hasNextPage) {
        that.setData({
          loadingTips: false,
        });
      } else {
        that.setData({
          loadingTips: true,
        });
      }
      if (data.code == 200 && data.data != null) {
        var temparray = that.data.orderList;
        for (let i = 0; i < data.data.length; i++) {
          temparray.push(data.data[i]);
        }
        var temp = temparray;
        for (let i = 0; i < temp.length; i++) {
          if (temparray[i].courseList.length > 0) {
            temp[i].courseList[0].newcourseImg = temp[i].courseList[0].courseImg.split(',')[0];
          }
          if (temparray[i].orderCodeUseStatus == '1') {
            temparray[i].orderReservationsPayStatus = '8';
          }
        }
        that.setData({
          orderList: temp
        });

        // 隐藏加载框
        wx.hideLoading(temp);
      } else {
        wx.showToast({
          title: '获取订单失败！',
        })
      }
    });
  },
  //取消订单
  cancelOrder: function(e) {
    var orderNum = e.currentTarget.dataset.ordernum;
    let that = this;
    let url = "wxapi/order/changeStatus";
    let params = {
      method: 'POST',
      data: {
        userId: app.globalData.openid,
        status: '7',
        orderNo: orderNum,
        authUserId :app.globalData.openid
      }
    };
    wx.showModal({
      title: '提示',
      content: '确定取消吗?',
      success: function(e) {
        if (e.confirm) {
          http.reAjax(url, params).then(function(res) {
            wx.showToast({
              title: '订单取消成功!',
              duration: 1000,
              success: function() {
                that.getOrder(currentStatus);
              }
            })
          });
        } else if (e.cancel) {

        }
      }
    })

  },
  //使用预约码
  useOrderCode: function(e) {
    var that = this;
    //扫二维码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        var orderCodeImgUrl = e.currentTarget.dataset.ordercodeimgurl;
        var orderNo = e.currentTarget.dataset.orderno;
        var userId = app.globalData.openid;
        // 显示加载图标
        wx.showLoading({
          title: '处理中',
        })
        confirmOrder.useOrderCode(orderCodeImgUrl, orderNo, userId, data => {
        
          // 隐藏加载框
          wx.hideLoading();
          if (data.status == 200) {
            wx.showToast({
              title: '使用成功!',
              duration:2000,
              success: function() {
                that.getOrder(currentStatus);
              }
            })
          }
        }, res => {})
      }
    })
  },
  ////带天数的倒计时
  countDown: function(times) {
    var day = 0,
      hour = 0,
      minute = 0,
      second = 0; //时间默认值
    var timer = null;
    timer = setInterval(function() {

      if (times > 0) {
        day = Math.floor(times / (60 * 60 * 24));
        hour = Math.floor(times / (60 * 60)) - (day * 24);
        minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
        second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
      }
      if (day <= 9) day = '0' + day;
      if (hour <= 9) hour = '0' + hour;
      if (minute <= 9) minute = '0' + minute;
      if (second <= 9) second = '0' + second;
      
      // log(day + "天:" + hour + "小时：" + minute + "分钟：" + second + "秒");
      times--;
    }, 1000);
    if (times <= 0) {
      clearInterval(timer);
    }
    
  },
 

})