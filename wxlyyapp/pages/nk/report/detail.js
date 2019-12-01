// pages/nk/historytask/taskinfo.js
var options = null;  //任务id
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    TicketList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = options;
    this.setData({
      options: options,
      windowHeight: app.devheight});
    console.log(options);
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
    this.loadOrdersInfo();    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loadOrdersInfo();
  },

  //读取任务信息
  loadOrdersInfo: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })

    console.log(that.data.options);
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_OrderList/API_OrderStatisticDetail',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        vehicleId: that.data.options.id, 
        beginDate: that.data.options.beginDate,
        endDate: that.data.options.endDate
      },
      success: function (res) {
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
            TicketList: res.data.resultdata,
          })
        }
        else {
          wx.showToast({
            title: '获取数据失败', icon: 'none', duration: 2000
          })
        }
        wx.hideToast();
      },
      fail: function (res) {
        wx.hideToast();
        //console.log(res);
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
      }
    })
  },
})