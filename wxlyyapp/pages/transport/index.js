// pages/transport/index.js
var app = getApp();
var interval = null;
var VehicleId = null;
var utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lAnimate: '',
    rAnimate: '',
    countindex: 0,
    addindex: 0,
    runingState:'',
    windowHeight: app.devheight,
    updateTime:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var instance = this;
    VehicleId = options.id;
    instance.getVehicleNumber(options.id);
    instance.getlines(options.id);
    instance.triggerInit(options.id);
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
    console.log('onHide');
   // clearInterval(interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
    clearInterval(interval);
  },

  getVehicleNumber(VehicleId) {
    let vm = this;
    wx.request({
      url: app.GJhostUrl + 'BusAPIManage/DriverApi/GetBusInfo',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.GJOBJ.Token
      },
      data: {
        VehicleId: VehicleId,
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
        if (res.data.result) {
          if (res.data.error_code=='0') {
            vm.setData({
              VehicleNumber: res.data.result.BusNumber
            })
          }
        }
        else {
          //wx.showToast({ title: res.data.message, icon: 'none', duration: 2000})
        }


        // wx.hideToast();
      },
      fail: function (res) {

      },
      complete: function (res) {
      }
    })
  },

  triggerInit(VehicleId) {
    console.log('triggerInit VehicleId:' + VehicleId);
    let vm = this;
    wx.request({
      url: app.GJhostUrl + 'BusAPIManage/DriverApi/GetBusOrders',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.GJOBJ.Token
      },
      data: {
        VehicleId: VehicleId,
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
        if (res.data.result) {
          var temptaskList = res.data.result[0];
          console.log(new Date());
          if (temptaskList) {
              vm.setData({
                countindex: temptaskList.OrderCount,                
                updateTime: utils.formatTime(new Date())
              })
          }
        }
        else {
          //wx.showToast({ title: res.data.message, icon: 'none', duration: 2000})
        }

        
        // wx.hideToast();
      },
      fail: function (res) {

      },
      complete: function (res) {
        clearInterval(interval);
        //vm.trigger(VehicleId);
        interval = setInterval(function () {
          vm.trigger(VehicleId);
        }, 3000);
      }
    })
  },
  trigger(VehicleId) {
    console.log('VehicleId:' + VehicleId);
    let vm = this;
    wx.request({
      url: app.GJhostUrl + 'BusAPIManage/DriverApi/GetBusOrders',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.GJOBJ.Token
      },
      data: {
        VehicleId: VehicleId, 
      },
      success: function (res) {
        console.log(res);
        vm.setData({updateTime: utils.formatTime(new Date())});
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        if (res.data.result) {
          var temptaskList = res.data.result[0];
          if (temptaskList){
            if (temptaskList.OrderCount != vm.data.countindex){
              let option = {
                duration: 100, // 动画执行时间
                timingFunction: 'ease-in' // 动画执行效果
              };
              var lanimation = wx.createAnimation(option); // 创建动画
              var ranimation = wx.createAnimation(option);
              // 起点
              lanimation.translateX(100);
              lanimation.opacity(0.1).step();
              // 终点
              ranimation.translateX(-100);
              ranimation.opacity(0.1).step();
              vm.setData({
                lAnimate: lanimation.export(),// 开始执行动画
                rAnimate: ranimation.export() // 开始执行动画
              })

              vm.playVoice();

              setTimeout(() => {
                // 起点
                lanimation.translateX(0);
                lanimation.opacity(1).step();
                // 终点
                ranimation.translateX(0);
                ranimation.opacity(1).step();
                
                vm.setData({
                  lAnimate: lanimation.export(),// 开始执行动画
                  rAnimate: ranimation.export(),// 开始执行动画
                  addindex: temptaskList.OrderCount - vm.data.countindex  ,
                  countindex: temptaskList.OrderCount,
                  VehicleNumber:temptaskList.VehicleNumber
                })
              }, 100);             
            }
          }         
        }
        else {
          //wx.showToast({ title: res.data.message, icon: 'none', duration: 2000})
        }
       // wx.hideToast();
      },
      fail: function (res) {
        //console.log(res);
      //  wx.hideToast();
       // wx.showToast({
       //   title: '调用接口失败', icon: 'none', duration: 2000
       // })
      },
      complete: function (res) {
      }
    })
  },

  playVoice: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/images/dingdong.wav'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  getlines: function (VehicleId){
    var vm = this;
    console.log("getlines");
    wx.request({
      url: app.GJhostUrl + 'BusAPIManage/BusAPI/RouteTypeList?VehicleId=' + VehicleId,
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.GJOBJ.Token
      },

      success: function (res) {
        console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        console.log(res.data);
        if (res.data.result) {
              vm.setData({
                lines: res.data.result,
                runingState: res.data.result[0].BusType
             })
        }
        else {
          //wx.showToast({ title: res.data.message, icon: 'none', duration: 2000})
        }
        // wx.hideToast();
      },
      fail: function (res) {
        console.log(res);
        //console.log(res);
        //  wx.hideToast();
        // wx.showToast({
        //   title: '调用接口失败', icon: 'none', duration: 2000
        // })
      },
      complete: function (res) {
      }
    })
  },

  chageState: function (typeId, latitude, longitude) {
    console.log(typeId);
    var vm = this;
    console.log("getlines");
    wx.request({
      //url: app.GJhostUrl + 'BusAPIManage/BusAPI/RouteUpdateType?VehicleId=' + VehicleId + '&typeId=' + typeId,
      url: app.GJhostUrl + 'BusAPIManage/BusAPI/RouteUpdateType',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.GJOBJ.Token
      },
      data: {
        vehicleId: VehicleId,
        typeId:typeId,
        latitude:latitude,
        longitude:longitude,
        driverId:app.GJOBJ.UserId,
        driverName:app.GJOBJ.UserName
      },

      success: function (res) {
        console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        console.log(res.data);
        if (res.data.error_code=='0') {
          vm.setData({ runingState: typeId == 0 ? "停运" : (typeId == 1 ? "去程" :'返程') })
        }
        else {
          //wx.showToast({ title: res.data.message, icon: 'none', duration: 2000})
        }
        // wx.hideToast();
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        wx.hideToast();
      }
    })

   
  },
  optionRunning: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res.latitude);
        console.log(res.longitude);
      },
      complete(res) {
        var latitude = '';
        var longitude = '';
        if (res.latitude && res.longitude) {
          latitude = res.latitude;
          longitude = res.longitude;
        }
        that.chageState(0, latitude, longitude);
      }
    })
    
  },
  optionGo: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res.latitude);
        console.log(res.longitude);
      },
      complete(res) {
        var latitude = '';
        var longitude = '';
        if (res.latitude && res.longitude) {
          latitude = res.latitude;
          longitude = res.longitude;
        }
        that.chageState(1, latitude, longitude);
      }
    })
    
  },  
  optionBack: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res.latitude);
        console.log(res.longitude);
      },
      complete(res) {
        var latitude = '';
        var longitude = '';
        if (res.latitude && res.longitude) {
          latitude = res.latitude;
          longitude = res.longitude;
        }
        that.chageState(2, latitude, longitude);
      }
    })
  }
})