// pages/nk/historytask/historytask.js
var app = getApp();
var carobjs = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    endSelsctDate: '',
    orderList: [],
    carList: ['全部'],
    carIndex:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    var d = new Date()
    d.setMonth(d.getMonth() + 1);
    this.setData({
      date: this.getFormatDate(new Date()),
      endSelsctDate: this.getFormatDate(d),
      windowHeight: app.devheight
    });
  },

  loadcarlist: function () {
    var that = this;
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Car/API_GetCar',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        keyword: ''
      },
      success: function (res) {
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        if (res.data.resultdata) {
          var temprouteList = [];
          temprouteList[0] = '全部'
          carobjs = res.data.resultdata;
          for (var i = 0; i < res.data.resultdata.length; i++) {
            temprouteList[i+1] = res.data.resultdata[i].VIN
          }
          that.setData({
            carList: temprouteList
          })
        }
        else {
          wx.showToast({
            title: res.data.message, icon: 'none', duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
      }
    })
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
    this.loadcarlist();
    this.loadOrders();
  },

  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.loadOrders();
    wx.stopPullDownRefresh();
  },


  bindCarChange: function (e) {
    this.setData({
      carIndex: e.detail.value
    })
    this.loadOrders();
  },

  /**
   *读取班次信息
   */
  loadOrders: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_OrderList/API_OrderStatistic',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        beginDate: this.data.date, //开始日期，为空则统计当天
        endDate: this.data.date, //结束日期，为空则统计当天        
        vehicleId: that.data.carIndex == 0 ? '' : carobjs[that.data.carIndex-1].id,  //车辆在系统中的唯一主键，为空则统计权限内所有车辆
      },
      success: function (res) {
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        if (res.data.resultdata) {
          
          var tempList = [];
          var SumObj= new Object;
          for (var i = 0; i < res.data.resultdata.length; i++) {
            if (i < res.data.resultdata.length-1){
              tempList[i] = res.data.resultdata[i];
            }
            else
              SumObj = res.data.resultdata[i]
          }
          console.log(tempList);
          that.setData({
            orderList: tempList,
            orderSum: SumObj
          })
        }
        else {
          //wx.showToast({ title: res.data.message, icon: 'none', duration: 2000})
        }
        wx.hideToast();
      },
      fail: function (res) {
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {        
      }
    })
  },

  //获取当前日期 格式如下 2018-01-01
  getFormatDate: function (date) {
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  preDay: function () {
    var d = new Date(this.data.date)
    d.setDate(d.getDate() - 1);
    this.setData({
      date: this.getFormatDate(d)
    });
    this.loadOrders(); //读取班次信息
  },

  nextDay: function () {
    var d = new Date(this.data.date)
    d.setDate(d.getDate() + 1);
    this.setData({
      date: this.getFormatDate(d)
    });
    this.loadOrders(); //读取班次信息
  }
})