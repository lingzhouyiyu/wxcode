//获取应用实例
const app = getApp();

import {
  ConfirmOrder
} from '../../../models/confirmOrder.js'

let confirmOrder = new ConfirmOrder()
// pages/orders/confirmOrder_activity/confirmOrder_activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordercounts: 1,
    cacReservation: 0,
    reservation: 0,
    phonenum: "",
    activeId: '',
    activeType: '',
    activityData: '',
    finalcacReservation: 0,
    WawowCoin: 0,
    WawowCoins: 0,
    usewabi: true,
    useWaCoin: '2',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      phonenum: options.phonedata,
      activeId: options.activeId,
      activeType: options.activeType,
    });
    that.selectActiveById(options.activeId, options.activeType);
    app.globalData.userPhone = options.phonedata;
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
    var that=this;
    that.selectActiveById(that.data.ctiveId, that.data.activeType);
    // 停止下拉动作
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
  countsub: function() {
    var that = this;
    if (that.data.ordercounts != 1) {
      that.setData({
        ordercounts: that.data.ordercounts - 1,
        cacReservation: that.data.reservation * (that.data.ordercounts - 1),
      })
      if (this.data.usewabi) { //用蛙币
        if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
          that.setData({
            WawowCoin: that.data.cacReservation,
            finalcacReservation: 0,
          })
        } else { //蛙币数量小于预约金
          that.setData({
            WawowCoin: that.data.WawowCoins,
            finalcacReservation: that.data.cacReservation - that.data.WawowCoins
          })
        }
      } else { //不用蛙币
        if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
          that.setData({
            WawowCoin: that.data.cacReservation,
            finalcacReservation: that.data.cacReservation,
          })
        } else { //蛙币数量小于预约金
          that.setData({
            WawowCoin: that.data.WawowCoins,
            finalcacReservation: that.data.cacReservation,
          })
        }
      }
    } else {
      return;
    }

  },
  countadd: function() {
    var that = this;
    that.setData({
      ordercounts: that.data.ordercounts + 1,
      cacReservation: that.data.reservation * (that.data.ordercounts + 1),
    })
    if (this.data.usewabi) { //用蛙币
      if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
        that.setData({
          WawowCoin: that.data.cacReservation,
          finalcacReservation: 0,
        })
      } else { //蛙币数量小于预约金
        that.setData({
          WawowCoin: that.data.WawowCoins,
          finalcacReservation: that.data.cacReservation - that.data.WawowCoins
        })
      }
    } else { //不用蛙币
      if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
        that.setData({
          WawowCoin: that.data.cacReservation,
          finalcacReservation: that.data.cacReservation,
        })
      } else { //蛙币数量小于预约金
        that.setData({
          WawowCoin: that.data.WawowCoins,
          finalcacReservation: that.data.cacReservation,
        })
      }
    }
  },
  ordercounts: function(e) {
    this.setData({
      ordercounts: e.detail.value
    })
  },
  //查询蛙币数量
  getTotalWawowCoin: function() {
    var that = this;
    confirmOrder.getTotalWawowCoin(app.globalData.openid, data => {
      that.setData({
        WawowCoin: data.data,
        WawowCoins: data.data,
      })
      // 初始化还需支付预约金
      if (that.data.WawowCoins == 0) { //不能用蛙币
        that.setData({
          usewabi: false,
        })
      } else { //能用蛙币
        if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
          that.setData({
            WawowCoin: that.data.cacReservation,
            finalcacReservation: 0,
          })
        } else { //蛙币数量小于预约金
          that.setData({
            WawowCoin: that.data.WawowCoins,
            finalcacReservation: that.data.cacReservation - that.data.WawowCoins
          })
        }
      }
    }, res => {});
  },
  //选择蛙币
  selectwabi: function() {
    var that = this;
    if (that.data.WawowCoins == 0) { //不能用蛙币
      wx.showToast({
        title: '您暂时没有蛙币!',
        duration: 1000,
        icon: 'none'
      })
      return;
    } else { //能用蛙币
      this.setData({
        usewabi: !this.data.usewabi
      })
      if (this.data.usewabi) { //用蛙币
        if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
          that.setData({
            WawowCoin: that.data.cacReservation,
            finalcacReservation: 0,
          })
        } else { //蛙币数量小于预约金
          that.setData({
            WawowCoin: that.data.WawowCoins,
            finalcacReservation: that.data.cacReservation - that.data.WawowCoins
          })
        }
      } else { //不用蛙币
        if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
          that.setData({
            WawowCoin: that.data.cacReservation,
            finalcacReservation: that.data.cacReservation,
          })
        } else { //蛙币数量小于预约金
          that.setData({
            WawowCoin: that.data.WawowCoins,
            finalcacReservation: that.data.cacReservation,
          })
        }
      }
    }

  },
  //下单支付
  downOrder: function() {
    var that = this;
    //是否使用蛙币
    if (that.data.usewabi) {
      that.setData({
        useWaCoin: '1'
      })
    } else {
      that.setData({
        useWaCoin: '2'
      })
    }
    confirmOrder.generateActivityOrder(that.data.activeId, that.data.ordercounts, that.data.useWaCoin, app.globalData.openid, that.data.phonenum, data => {
      wx.navigateTo({
        url: '../../../pages/orders/pay/pay?orderNo=' + data.data.orderNo + '&tag=active' + '&amount=' + data.data.amount + '&orderRepaymount=' + '视到场具体情况而定',
      })
    }, res => {});
  },
  //获取活动详情
  selectActiveById: function(activeId, activeType) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    confirmOrder.selectActiveById(activeId, activeType, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      that.setData({
        activityData: data.data,
        reservation: data.data.perCapitaPrice,
        cacReservation: data.data.perCapitaPrice,
        finalcacReservation: data.data.perCapitaPrice,
      })
      that.getTotalWawowCoin();
    }, res => {});
  },
})