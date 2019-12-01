// pages/mapShow/mapIndex.js
var gcoord = require('../../libs/gcoord.js');
var utils = require('../../utils/util.js');
var lineid;
var interval = null;
var app;
var linemarkers;
var tepPoints = new Array();
//var tepPoints = new Array();
Page({
  /**
   * 页面的初始数据
   */

  data: {
    'backline': '',  //返程线路ID
    'lineid': null, //线路id
    'linetype': null, //去程-返程
    'onlineCount':0,//在线车辆数
    'onlineflag':'0',  //是否开通实时信息  1 开通  0 未开通
    'showtip': false,
    'barHeight': 0,
    'scale': 15,
    'loaded': 0,
    "latitude": "",
    "longitude": "",
    "controls": [],
    "markers": [],
    "polyline": [],
    'includePoints': [],
    'cars': [],
    'selmarkID': null,
    'curStation': null  //当前选中站点对象
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app = getApp();
    that.setData({
      lineNo: options.id,
      lineid: options.line_id,
      linetype: options.type,
      onlineflag: options.online,
      city: getApp().globalData.city,
      district: getApp().globalData.district,
      localcity: getApp().globalData.localcity,
      localdistrict: getApp().globalData.localdistrict,

      devwidth: app.globalData.devwidth,
      devheight: app.globalData.devheight,
      controls: [{  //地图上的按钮
        id: 1,
        iconPath: '/source/icon/marker-location.png',
        position: {
          left: app.globalData.devwidth - 40,
          top: app.globalData.devheight - 340,
          width: 30,
          height: 30
        },
        clickable: true
      }, {
        id: 2,
        iconPath: '/source/icon/big.png',
        position: {
          left: app.globalData.devwidth - 40,
          top: app.globalData.devheight - 300,
          width: 30,
          height: 30
        },
        clickable: true
      }, {
        id: 3,
        iconPath: '/source/icon/small.png',
        position: {
          left: app.globalData.devwidth - 40,
          top: app.globalData.devheight - 250,
          width: 30,
          height: 30
        },
        clickable: true
      }, {
        id: 4,
        iconPath: '/source/icon/busline.png',
        position: {
          left: app.globalData.devwidth - 40,
          top: app.globalData.devheight - 380,
          width: 30,
          height: 30
        },
        clickable: true
      }]
    })
    lineid = options.line_id;

  },

  onReady: function () {
    this.mapCtx = wx.createMapContext('busMap');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {  
    
    var instance = this;
    this.loadBusLine();
    //console.log('map on show');
    instance.runloadCarLocation();
  },

  runloadCarLocation: function () {
    var instance = this;
    clearInterval(interval);
    instance.loadCarLocation();
    if (instance.data.onlineflag=='1'){
      interval = setInterval(function () {
        instance.loadCarLocation();
      }, 5000);
    }    
  },

  gotothere: function (e) {
    var that = this;
    wx.openLocation({
      latitude: parseFloat(that.data.latitude),
      longitude: parseFloat(that.data.longitude),
      name: that.data.markers[that.data.curStation].name,
      scale: 28
    })
  },

  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    var idStr = id + '';
    if (idStr.substr(0, 1) == 'm') {
      var index = idStr.substr(1, idStr.length - 1);
      that.setData({
        //scale: 16,//19
        longitude: this.data.markers[parseInt(index) - 1].longitude,
        latitude: this.data.markers[parseInt(index) - 1].latitude,
        curStation: parseInt(index) - 1,
        loacalflag: true
      });

      var tapinterval = setInterval(function () {
        that.setData({ showtip: true });
        clearInterval(tapinterval)
      }, 1000);
      return;
    }

    this.setData({ selmarkID: id });
    this.changebar(true)
  },

  controlTap: function (e) {
    var that = this;
    var tscale = 8;
    if (e.controlId == 1) {
      that.mapCtx.moveToLocation();
    }
    else if (e.controlId == 2) {
      that.mapCtx.getScale({
        success: function (res) {
          tscale = res.scale;
          that.mapCtx.getCenterLocation({
            success: function (res) {
              if (tscale < 19) {
                that.setData({
                  scale: ++tscale,
                  longitude: res.longitude,
                  latitude: res.latitude
                })
              }
            }
          })
        }
      });
    }
    else if (e.controlId == 3) {
      that.mapCtx.getScale({
        success: function (res) {
          tscale = res.scale;
          that.mapCtx.getCenterLocation({
            success: function (res) {
              if (tscale > 4) {
                that.setData({
                  scale: --tscale,
                  longitude: res.longitude,
                  latitude: res.latitude
                })
              }
            }
          })
        }
      });
    }
    else if (e.controlId == 4) {
      that.mapCtx.includePoints({
        padding: [10],
        points: that.data.includePoints
      })

    }
  },

//请求接口，根据请求结果res，交由dealdata()处理数据后在地图上更新 线路标点polyline  站点以及车辆位置 markers  视野范围 includePoints
  loadBusLine: function () {
    var instance = this;
    wx.request({
      url: app.hostUrl + '/BusAPI/RouteListDetail_Map',

      data: {
        busrouteId: instance.data.lineNo,
        keywords: instance.data.lineid,
        city: app.globalData.district,
        ApplicationTerminalValue:'WeChat'
      },
      method: 'GET',
      success: function (res) {
        //console.log("----ddddd----");
        //console.log(res);
        if (typeof (res.data.result) != "undefined" && res.data.result.buslines != "undefined"){
          instance.dealdata(res.data.result.buslines); 
        }        
        else{
          wx.showToast({
            title: '获取线路信息出错:' + res.data.message,
            icon: 'none',
            duration: 5000
          });
          instance.setData({loaded: 1 });
          //wx.navigateBack() 
          //setInterval(wx.navigateBack , 5000);
          return;
        }

        //以上处理线路站点信息


        var tepmarkers = new Array();
        if (res.data.result.buslines[0].buslocation) {
          for (var i = 0; i < res.data.result.buslines[0].buslocation.length; i++) {
            //console.log('车辆位置' + i);
            ////console.log(res.data.result.buslines[0].buslocation[i]);
            var tempmarker = new Object();

            tempmarker.id = i;  //res.data.result.buslines[0].buslocation[i].id; //
            tempmarker.title = res.data.result.buslines[0].buslocation[i].vid;//vid


            /*
            var gcoordresult = gcoord.transform(
              [parseFloat(res.data.result.buslines[0].buslocation[i].lng), parseFloat(res.data.result.buslines[0].buslocation[i].lat)], // 经纬度坐标
              gcoord.WGS84,                 // 当前坐标系
              gcoord.GCJ02                  // 目标坐标系
            );
            console.log(res.data.result.buslines[0].buslocation[i].lng);
            console.log(res.data.result.buslines[0].buslocation[i].lat);
            console.log(gcoordresult);  // [ 116.41661560068297, 39.92196580126834 ]

            tempmarker.latitude = gcoordresult[1];
            tempmarker.longitude = gcoordresult[0];
            */
            tempmarker.latitude = parseFloat(res.data.result.buslines[0].buslocation[i].lat);
            tempmarker.longitude = parseFloat(res.data.result.buslines[0].buslocation[i].lng);

            tempmarker.iconPath = '/source/icon/car2.png';
            tempmarker.width = 19;
            tempmarker.height = 32;
            tempmarker.anchor = { x: .5, y: .5 };
            tempmarker.rotate = res.data.result.buslines[0].buslocation[i].hx;

            tepmarkers.push(tempmarker);
          }
        }

        if (linemarkers && tepmarkers) {
          //console.log("有车");
          var tepcovers = linemarkers.concat(tepmarkers);
          //var tepcovers = tepmarkers;
          ////console.log(tepcovers);
        }
        else {
          var tepcovers = linemarkers;
          //console.log('linemarkers 或者 tepmarkers  不存在');
        }
        
        instance.setData({ markers: tepcovers, loaded: 1 });
        //console.log(tepcovers);

      },
      fail: function () {        
        //console.log("-----loadBusLine 错误1111111111-----");
      },
      complete: function () {
        
      }
    });
  },


  //只是读取车辆初始位置，标点到地图  
  loadCarLocation: function () {
    //在当前页面显示导航条加载动画。
    wx.showNavigationBarLoading()
    //console.log('地图模式 loadCarLocation');
    var instance = this;
    wx.request({
      url: app.hostUrl + '/BusAPI/RouteListDetail_Map',
      method: 'GET',
      data: {
        busrouteId: instance.data.lineNo,
        keywords: instance.data.lineid,
        city: app.globalData.district,
        ApplicationTerminalValue: 'WeChat'
      },
      success: function (res) {      

        if (typeof (res.data.result) == "undefined" || typeof (res.data.result.buslines) == "undefined" )
        {
          //console.log('获取线路信息出错');
          return;
        }
        
        instance.setData({
           cars: res.data.result.buslines[0].buslocation,
           onlineCount: (res.data.result.buslines[0].buslocation == null ? 0 : res.data.result.buslines[0].buslocation.length)
           });
        var tepmarkers = new Array();
        if (res.data.result.buslines[0].buslocation) {
          for (var i = 0; i < res.data.result.buslines[0].buslocation.length; i++) {
            //console.log('车辆位置'+i);
            ////console.log(res.data.result.buslines[0].buslocation[i]);
            var tempmarker = new Object();
           
            tempmarker.id = i;  //res.data.result.buslines[0].buslocation[i].id; //
            tempmarker.title = res.data.result.buslines[0].buslocation[i].vid;//vid


            /*
            var gcoordresult = gcoord.transform(
              [parseFloat(res.data.result.buslines[0].buslocation[i].lng), parseFloat(res.data.result.buslines[0].buslocation[i].lat)], // 经纬度坐标
              gcoord.WGS84,                 // 当前坐标系
              gcoord.GCJ02                  // 目标坐标系
            );
            console.log(res.data.result.buslines[0].buslocation[i].lng);
            console.log(res.data.result.buslines[0].buslocation[i].lat);
            console.log(gcoordresult);  // [ 116.41661560068297, 39.92196580126834 ]

            tempmarker.latitude = gcoordresult[1];
            tempmarker.longitude = gcoordresult[0];
            */
            tempmarker.latitude = parseFloat(res.data.result.buslines[0].buslocation[i].lat);
            tempmarker.longitude = parseFloat(res.data.result.buslines[0].buslocation[i].lng);

            //console.log(utils);
            //utils.pointCorrect(tepPoints, tempmarker.longitude, tempmarker.latitude, 0.3);

          
            tempmarker.iconPath = '/source/icon/car2.png';
            tempmarker.width = 19;
            tempmarker.height = 32;
            tempmarker.anchor = { x: .5, y: .5 };
            tempmarker.rotate = res.data.result.buslines[0].buslocation[i].hx;
            tepmarkers.push(tempmarker);
          }
        }



        
        if (linemarkers && tepmarkers ) {
          ////console.log("有车");
          var tepcovers = linemarkers.concat(tepmarkers);
          //var tepcovers = tepmarkers;
          ////console.log(tepcovers);
        }
        else {
          var tepcovers = linemarkers;
          //console.log('linemarkers 或者 tepmarkers  不存在');
        }

        instance.setData({ markers: tepcovers, loaded: 1 });
        

      },
      fail: function () {
        //console.log('loadCarLocation fail');
      },
      complete: function () {
        wx.hideNavigationBarLoading()
      }

      
    });
  },

//根据请求结果res，处理数据后在地图上更新 线路标点polyline  站点以及车辆位置 markers  视野范围 includePoints
  dealdata: function (res) {
    var instance = this;

    var tepmarkers = new Array();
    var teppolylines = new Array();
    var teppolyline = new Object();
    tepPoints = new Array();

    //console.log("94949494949");
    //console.log(res);
    instance.setData({ backline: res[0].fid });
    var tempArry = res[0].polyline.split(";");

    for (var j = 0; j < tempArry.length; j++) {
      if (tempArry[j] != "") {
        var tempobj = new Object();
        tempobj.longitude = tempArry[j].substring(0, tempArry[j].indexOf(","));
        tempobj.latitude = tempArry[j].substring(tempArry[j].indexOf(",") + 1);
        tepPoints[j] = tempobj;
      }
    }
    teppolyline.points = tepPoints;
    teppolyline.color = "#0000ff";
    teppolyline.width = 4;
    teppolyline.dottedLine = false;
    teppolyline.arrowLine = true;
    teppolylines[0] = teppolyline;
    var teplatitude = "";
    var teplongitude = "";
    var tempstr = "";
    //console.log("00000000");
    var includepoints = new Array();
    for (var i = 0; i < res[0].busstops.length; i++) {
      var includepoint = new Object(); //视野内的点，站点位置
      var tempmarker = new Object();
      tempmarker.id = "m" + res[0].busstops[i].sequence;

      var newlabel = new Object();
      
      

      newlabel.content = (i+1)+"."+ res[0].busstops[i].name;
      newlabel.color = "#0099ff";
      newlabel.bgColor = "#ffffff";
      newlabel.borderColor = "#0099ff";
      newlabel.fontSize = 12;
      newlabel.borderWidth = 1;
      newlabel.padding = 1;
     
      newlabel.borderRadius = 3;


      if (i == 0) {
        tempmarker.iconPath = '/source/icon/start.png';
        tempmarker.height = 32;
        tempmarker.width = 32;
        newlabel.x = 14;
        newlabel.y = -25;

      }
      else if ((i + 1) == res[0].busstops.length) {
        tempmarker.iconPath = '/source/icon/end.png';
        tempmarker.height = 32;
        tempmarker.width = 32;
        newlabel.x = 14;
        newlabel.y = -25;
      }
      else {
        tempmarker.iconPath = '/source/icon/bustitle.png';
        tempmarker.height = 11;
        tempmarker.width = 11;
        tempmarker.anchor = { x: .5, y: .5 };
        newlabel.x = 8;
        newlabel.y = -10;
      }

      tempmarker.mname = res[0].busstops[i].name;
      tempstr = res[0].busstops[i].location;
      teplongitude = tempstr.substring(0, tempstr.indexOf(","));
      teplatitude = tempstr.substring(tempstr.indexOf(",") + 1);


      includepoint = { 'latitude': teplatitude, 'longitude': teplongitude };
      includepoints[i] = includepoint;

      tempmarker.latitude = teplatitude;
      tempmarker.longitude = teplongitude;
      tempmarker.label = newlabel;

      tepmarkers[i] = tempmarker;
    }

    linemarkers = tepmarkers
    ////console.log(JSON.stringify(teppolylines));
    instance.setData({ 
      markers: tepmarkers, 
      polyline: teppolylines,
      lineinfo: res[0],
      includePoints: includepoints
      });

    wx.hideLoading()
  },

  onHide: function () {
    //console.log('地图 onHide');
    clearInterval(interval)
  },
  onUnload: function () {
    //console.log('地图 onUnload');
    clearInterval(interval)
  },

  regionchange: function (e) {
    var that = this;
    // if (that.data.longitude != res.longitude || that.data.latitude != res.latitude)
    that.setData({ showtip: false });
  },

  maptap: function (e) {
    //console.log('maptap')
    //this.hidebar();
    this.setData({ showtip: false });
    this.changebar(false)

  },
  mapupdated: function (e) {

  },

  //去程，返程切换
  changeline: function (e) {
    if (this.data.backline != '') {
      this.setData({
        linetype: this.data.linetype == '去程' ? '返程' : '去程',
        lineNo: this.data.backline,
        backline: '',
        showtip: false   //取消显示站点信息
      });
      this.changebar(false)  //取消显示车辆信息


      //切换往返程时，显示加载效果
      wx.showLoading({
        title: '正在切换线路...',
        icon: 'loading'
      });
      this.loadBusLine();
      this.runloadCarLocation();
    }
  },

  selectArea: function () {
    wx.navigateTo({
      url: "../index/selectArea"
    })
  },

  searchLine: function () {

    wx.navigateBack() 
    /*
    wx.navigateTo({
      url: "../index/index"
    })
    */
  },

  gotoList: function () {
    var instance = this;
    wx.navigateTo({
      url: "../listIndex/showline?id=" + instance.data.lineNo + "&line_id=" + instance.data.lineid + "&type=" + instance.data.linetype + "&online=" + instance.data.onlineflag
    })
  },

  gotoRecovery: function () {
    var instance = this;
    wx.navigateTo({
      url: "../mapshow/recovery?id=" + instance.data.lineNo + "&line_id=" + instance.data.lineid + "&type=" + instance.data.linetype + "&online=" + instance.data.onlineflag
    })
  },

  changebar: function (showhide) {
    var that = this;
    if (showhide && that.data.barHeight < 100) {
      //清除interval 如果不清除interval会一直往上加
      //clearInterval(intervalChange)
      that.setData({ barHeight: 100, opacity: 1 })
    }
    else if (!showhide && that.data.barHeight > 0) {
      that.setData({ barHeight: 0, opacity: 0 })
    }
  }



})