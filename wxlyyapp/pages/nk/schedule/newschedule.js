// pages/nk/schedule/newschedule.js

var utils = require('../../../utils/util.js')
const todydate = utils.getFormatDate(new Date());
var app = getApp();
var urlrouteIndex;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    routeList: [],
    routeArray: [],
    routeIndex: 0,
    carArray: [],

    driverArray: [],
    multiIndex: [0, 0],
    date: todydate,
    startdate: todydate,
    endSelsctDate: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    urlrouteIndex = options.id;
    this.loadCarsAndDriverss();
    this.loadRouters();
  
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //购票提交按钮点击事件
  buttonBuyTicketontap: function (e) {
    var that = this;
    wx.showModal({
      title: '温馨提示：',
      content: '确认新增任务吗？ \r\n车牌号：' + that.data.carArray[that.data.multiIndex[0]].VIN + '\r\n司机：' + that.data.driverArray[that.data.multiIndex[1]].DriverName + '\r\n日期：'+that.data.date,
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: '#3cc51f',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.saveNewClass();
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },


  bindPickviewOnChange: function (e) {

    const val = e.detail.value;
    console.log(e.detail.value);
    //拖动司机
    if (val[0] == this.data.multiIndex[0]){
      this.setData({
        multiIndex: val
      })
    }
    else //拖动车辆
    { 
      this.setData({
        multiIndex: [val[0], this.searchArry(this.data.carArray[val[0]].DiverId)]
      })
    }
    
    
  },

  //线路选择
  bindRouteChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      routeIndex: e.detail.value
    })
    this.loadClass();
  },

  //根据DiverId返回数据中的index
  searchArry: function (DiverId) {
    const tempDrivers = this.data.driverArray;
    for (var i = 0; i < tempDrivers.length; i++){
      if (tempDrivers[i].id == DiverId){
        console.log(i);
        console.log(tempDrivers[i].DriverName);
        return i;
      }
    }
  },

  //日期修改
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },


  preDay: function () {
    var d = new Date(this.data.date);
    var sd = new Date(todydate);
    if (sd < d) {
      d.setDate(d.getDate() - 1);
      this.setData({
        date: utils.getFormatDate(d)
      });
    }
    else {
      wx.showToast({
        title: '日期不能早与今天啦！',
        icon: 'none',
        duration: 2000
      })
    }
  },

  nextDay: function () {
    var d = new Date(this.data.date)
    d.setDate(d.getDate() + 1);
    this.setData({
      date: utils.getFormatDate(d)
    });
  },

  //读取线路员信息
  loadRouters: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Route/API_GetAllRoute',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
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
          for (var i = 0; i < res.data.resultdata.length; i++) {
            console.log(res.data.resultdata);
            temprouteList[i] = res.data.resultdata[i].RouteName
          }
          that.setData({
            routeList: temprouteList,
            routeArray: res.data.resultdata,
            routeIndex: urlrouteIndex
          })
        }
        else {
          wx.showToast({
            title: res.data.message, icon: 'none', duration: 2000
          })
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
  //读取驾驶员信息
  loadDrivers: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Driver/API_GetDriver',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        keyword: '',  //状态，多状态以英文逗号分隔，0=等确认；1=待发班；2=已发班；3=已完成；
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
          that.setData({
            driverArray: res.data.resultdata,
          })
        }
        else {
          wx.showToast({
            title: res.data.message, icon: 'none', duration: 2000
          })
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

  //读车辆信息并调用读取驾驶信息
  loadCarsAndDriverss: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    var defaultRouteID = null;
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Car/API_GetCar',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        keyword:''
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
          console.log(res.data.resultdata);
          that.setData({
            carArray: res.data.resultdata
          })
          that.loadDrivers(); //读取班次信息
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
  //新增班次请求
  saveNewClass: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })

    var UseDate = that.data.date;
    var VehicleId = that.data.carArray[that.data.multiIndex[0]].id;
    var DriverId = that.data.driverArray[that.data.multiIndex[1]].id;
    var RouteId = that.data.routeArray[that.data.routeIndex].id;
    var Comment = '';
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_AddClass',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        entity: '{"UseDate":"' + UseDate + '","VehicleId":"' + VehicleId + '","DriverId":"' + DriverId + '","RouteId":"' + RouteId + '","Comment":"' + Comment+'"}'
      },
      success: function (res) {
        wx.hideToast();
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束

        wx.showToast({
          title: res.data.message, icon: 'none', duration: 2000
        })
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

})