// pages/listIndex/showline.js
var interval = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loaded: false,
    lineinfo:{},
    lineid:null, //线路id
    linetype:null, //去程-返程
    onlineflag: '0',  //是否开通实时信息  1 开通  0 未开通
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ 
      backline:'',
      lineNo: options.id,
      lineid:options.line_id,
      linetype:options.type,
      onlineflag: options.online,
      });   
  }, 


  //去程，返程切换
  changeline: function (e) {
    //切换往返程时，显示加载效果
    wx.showLoading({
      title: '正在切换线路...',
      icon: 'loading'
    });
    if (this.data.backline!=''){
      this.setData({
        linetype: this.data.linetype == '去程' ? '返程' : '去程',
        lineNo: this.data.backline,
        backline: ''
      });
      this.loadBusLine();
    }
   
  },

  runloadCarLocation: function () {
    var instance = this;
    clearInterval(interval);
    instance.loadBusLine();
    if (instance.data.onlineflag=="1"){
      interval = setInterval(function () {
        instance.loadBusLine();
      }, 5000);
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  }, 

  tapStation: function (event) {
    console.log(event);
    this.setData({ curStationid: event.currentTarget.id });   
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
    var app = getApp();
    console.log(app.globalData.devwidth);
    this.setData({
      onlineCount: 0,//在线车辆数
      devwidth: app.globalData.devwidth,
      devheight: app.globalData.devheight,
      scrollheight: (app.globalData.devheight - 105)
    })
    //this.loadBusLine();
    this.runloadCarLocation();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
    onHide: function () {
    console.log('列表 onHide');
    clearInterval(interval)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('列表 onUnload');
    clearInterval(interval)
  },



  loadBusLine: function () {
    var instance = this;
    var app = getApp();
    wx.showNavigationBarLoading()
    wx.request({
      url: app.hostUrl + '/BusAPI/RouteListDetail',
      data: {
        busrouteId: instance.data.lineNo,
        keywords: instance.data.lineid,
        city: app.globalData.district
      },
      method: 'GET',
      success: function (res) { 
        console.log('列表 loadBusLine');
        if (typeof (res.data.result) != "undefined" && res.data.result.buslines != "undefined"){
          var tempbusline = res.data.result.buslines[0];
          var newbusline = res.data.result.buslines[0];
          var stopcount = tempbusline.busstops.length; //站点数量
          var onlinecount = tempbusline.buslocation.length; //在线车辆数
          //最后一个站点的message对象
          var tempmessage = tempbusline.busstops[stopcount - 1].message; 
          
          for (var j = 0; j < tempbusline.busstops.length; j++) {
            var newbusstop = new Object();
            newbusstop.Coordinate = tempbusline.busstops[j].Coordinate;
            newbusstop.distance = tempbusline.busstops[j].distance;
            newbusstop.id = tempbusline.busstops[j].id;
            newbusstop.location = tempbusline.busstops[j].location;
            newbusstop.message = tempbusline.busstops[j].message;
            newbusstop.name = tempbusline.busstops[j].name;
            newbusstop.sequence = tempbusline.busstops[j].sequence;
            newbusstop.inwaycar = 0;
            //newbusstop.instopcar = 0;

            newbusline.busstops[j] = newbusstop;

          }


          if (tempmessage){
            for (var x = 0; x < tempmessage.length; x++) {
              if (tempmessage[x].stop){
                console.log(tempmessage[x].stop);
                var tepindex = stopcount - 2 - parseInt(tempmessage[x].stop);
                if (tepindex > -1)
                newbusline.busstops[tepindex].inwaycar++;
              }
              else {
                console.log(tempmessage)
              }

            }
          }


          instance.setData({
            onlineCount: onlinecount,
            lineinfo: newbusline,
            backline: tempbusline.fid,
            loaded: true
          });
          }
        else {
          wx.showToast({
            title: '获取线路信息出错！',
            icon: 'none',
            duration: 2000
          });
          instance.setData({ loaded: true });
          //wx.navigateBack() 
          return;
        }
    
          //console.log(res.data.result.buslines[buslinesIndex]);
      },
      fail: function () {
        //instance.loadBusLine();
      },
      complete: function () {
        wx.hideLoading();
        wx.hideNavigationBarLoading()
      }



    });
  },
/*
     wx.navigateTo({
      url: "../mapshow/mapIndex?id=" + instance.data.lineNo + "&line_id=" + instance.data.lineid + "&type=" + instance.data.linetype+ "&online=" + instance.data.onlineflag
    })
 */
  backmap: function () {
      var instance = this;    
      wx.navigateBack() 
  }
})