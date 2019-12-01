// pages/listIndex/index.js
var bmap = require('../../libs/bmap-wx.min.js');
var BMap;
var app;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    devwidth: null,
    devheight: null,
    lineList: [],
    loaded: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');
    app = getApp();
    var that = this;
    that.setData({
      devwidth: app.globalData.devwidth,
      devheight: app.globalData.devheight,
      devstatusBarHeight: app.globalData.devstatusBarHeight,
      scrollheight: (app.globalData.devheight - 110),
    })

    /* */

    if (app.globalData.localService) {
      that.setData({
        localService: true,
        loaded: true
      })
      return;
    }

    app.getLocationInfo(that.loadLocation);


    // 新建百度地图对象 
    BMap = new bmap.BMapWX({
      ak: app.bmapak
    });

  },

//通过后台接口获取已开通地区，交给回调函数处理
  loadServiceArea: function (callbackfun) {
    var that = this;
    wx.showLoading({
      title: '正在获取开通区域信息...',
      icon: 'loading'
    });
    wx.request({
      url: app.hostUrl + '/json/Area.json',
      //url: app.hostUrl + '/json/TestArea.json',
      method: 'GET',
      success: function (res) {
        app.globalData.serviceAreas = res.data.areas;
        app.globalData.hotAreas = res.data.hots;
        callbackfun(res.data)
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  //当前定位地区是否开通服务
  checkServiceArea: function () {
    var that = this;
    var city = app.globalData.city;
    var district = app.globalData.district;
    var areas = app.globalData.serviceAreas;
    for (var i = 0; i < areas.length; i++) {
      if (areas[i].name == city) {
        for (var j = 0; j < areas[i].district.length; j++) {
          if (areas[i].district[j].name == district) {
            console.log('找到' + district);
            app.globalData.localService = true;            
            break;
          }
        }
      }
    }


    //------------------------------

    that.setData({
      localService: app.globalData.localService,
      loaded: true
    });
    if (that.data.lineList.length == 0 && app.globalData.localService){
      console.log('调用 loadlines');
      that.loadlines();
    }
  },


  //获取当前所在位置 城市，县区
  loadLocation: function (res) {
    var that = this;
    wx.showLoading({
      title: '正在定位当前地区线路...',
      icon: 'loading'
    });
    wx.request({
      url: 'https://api.map.baidu.com/geocoder/v2/?output=json&pois=1',
      method: 'GET',
      data: {
        ak: app.bmapak,
        location: res.latitude + ',' + res.longitude,
      },
      success: function (res) {
        app.globalData.city = res.data.result.addressComponent.city;
        app.globalData.district = res.data.result.addressComponent.district;
        app.globalData.localcity = res.data.result.addressComponent.city;
        app.globalData.localdistrict = res.data.result.addressComponent.district;
        that.setData({
          city: res.data.result.addressComponent.city,
          localcity: res.data.result.addressComponent.city,
          district: res.data.result.addressComponent.district
        });
        that.loadServiceArea(that.checkServiceArea);//获取服务开通地区后，检查当前地区是否开通服务
      },
      complete: function () {
        wx.hideLoading();
      }
    })
  },

  selectArea: function () {
    wx.navigateTo({
      url: "./selectArea"
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('on ready');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow');
    this.setData({
      city: app.globalData.city,
      district: app.globalData.district,
      localService: app.globalData.localService
    })

    if (this.data.localService) {
      console.log("index on show");
      this.loadlines();
    }
    else {

    }
      
  },

  loadlines:function(){
    wx.showLoading({
      title: '正在加载线路...',
      icon: 'loading'
    });
    wx.request({
      url: app.hostUrl + '/BusAPI/RouteList',
      method: 'GET',
      data: {
        city: app.globalData.district
      },
      success: function (res) {
        this.setData({ lineList: res.data.result.buslines });
      }.bind(this),
      fail: function () {
        //instance.loadBusLine();
      },
      complete: function () {
        wx.hideLoading();
      }

    });
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  searchLine: function () {
    wx.navigateTo({
      url: "../listIndex/searchline"
    })
  }
})