// pages/nk/task/buyticket.js

var Urloptions = null;
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    startIndex: 0,
    endIndex: 0,
    Stations: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    Urloptions = options;
    this.setData({
      RouteName: options.RouteName
    });
    this.loadTicketPrice();


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

  //购票提交按钮点击事件
  buttBuyTicketontap: function(e) {
    var that = this;
    wx.showModal({
      title: '温馨提示：',
      content: '确认购买' + that.data.Stations[that.data.startIndex].StationName + '-' + that.data.Stations[that.data.startIndex].EndStations[that.data.endIndex].StationName + '车票吗？',
      cancelText: '取消',
      confirmText: '确认购买',
      confirmColor: '#3cc51f',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.doBuyTicket();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },

  /**
   *下单购买信息
   */
  doBuyTicket: function() {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })

    var tempStartStation = that.data.Stations[that.data.startIndex];
    var tempEndStation = tempStartStation.EndStations[that.data.endIndex];

    var postDatajson  = [{
      //Account: app.NKOBJ.Account, //账号
      OrderPrice: tempEndStation.Price, //订单总金额
      PaymentType: 0, //支付方式：0=余额支付，1=微信；2=支付宝；3=银联；4=其他
      StandardPrice: tempEndStation.Price, //标准金额
      Discount: 0, //优惠金额
      Turnover: tempEndStation.Price, //成交金额
      IsGive: false, //是否赠送
      UserId: app.NKOBJ.Account, //用户编号
      ClassId: Urloptions.TaskId, //班次Id
      StartStationID: tempStartStation.StationId, //起始站Id
      StartStationName: tempStartStation.StationName, //起始站名称
      EndStationID: tempEndStation.StationId, //起始站Id
      EndStationName: tempEndStation.StationName, //起始站名称
      UserAccount: app.NKOBJ.Account,
      UserName: app.NKOBJ.UserName
    }];
    
    console.log(JSON.stringify(postDatajson));

    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_OrderList/API_AddOrderByDriver',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        entitys: JSON.stringify(postDatajson)
      },
      success: function(res) {
        wx.hideToast();
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 2000
        })
      },
      fail: function(res) {
        wx.hideToast();
        //console.log(res);
        wx.showToast({
          title: '调用接口失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function(res) {

      }
    })
  },


  startStationTap: function(e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      startIndex: e.currentTarget.dataset.index,
      endIndex: 0
    })

  },
  endStationTap: function(e) {
    console.log(e.currentTarget.dataset.index);
    this.setData({
      endIndex: e.currentTarget.dataset.index
    })
  },

  //获取票价信息
  loadTicketPrice: function() {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Route/API_GetTicketPrice',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: app.NKOBJ.Account, //账号
        vehicleId: Urloptions.TaskId, //车牌编号
      },
      success: function(res) {
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束        

        if (res.data.resultdata) {
          that.setData({
            Stations: res.data.resultdata.PriceInfo
          })
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideToast();
      },
      fail: function(res) {
        wx.hideToast();
        //console.log(res);
        wx.showToast({
          title: '调用接口失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function(res) {

      }
    })
  }
})