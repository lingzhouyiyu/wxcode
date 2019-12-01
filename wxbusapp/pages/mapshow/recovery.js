var app = getApp();
var pointindex;
Page({
  data: {
    pointindex:'',
    map_width: 380
    , map_height: 380
    , placeData: {}
    , items: []
    , markers: []

    , polyline: [{
      points: [],
      color: "#0000ff",
      width: 4,
      dottedLine: false,
      arrowLine: true
    }]
  },

  //show current position
  onLoad: function (options) {
    var that = this;
    that.setData({
      backline: '',
      lineNo: options.id,
      lineid: options.line_id,
      linetype: options.type,
      onlineflag: options.online,
    });  
    // 获取定位，并把位置标示出来
    app.getLocationInfo(function (locationInfo) {
      console.log('map', locationInfo);
      that.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude
      })
    })
    // 动态设置map的宽和高
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          map_width: res.windowWidth
          , map_height: res.windowHeight - 200
          , controls: [{
            id: 1,
            iconPath: '../../source/icon/ic_location.png',
            position: {
              left: res.windowWidth / 2 - 15,
              top: res.windowHeight / 2 - 100 - 30,
              width: 30,
              height: 30
            },
            clickable: true
          }]
        })
      }
    })

    wx.request({
      url: app.hostUrl + '/BusAPI/RouteListDetail_Map',
      data: {
        busrouteId: that.data.lineNo,
        keywords: that.data.lineid,
        city: app.globalData.district
      },
      method: 'GET',
      success: function (res) {
        that.dealdata(res.data.result.buslines[0].polyline);
        //console.log(res.data.result.buslines[buslinesIndex]);
      },
      fail: function () {

      }
    });
  },

  //获取中间点的经纬度，并mark出来
  getLngLat: function () {
    var that = this;
    var slocation = '';
    this.mapCtx = wx.createMapContext("map4select");
    this.mapCtx.getCenterLocation({
      success: function (res) {
        slocation = res.latitude + ',' + res.longitude;
      }
    });


  }
  , regionchange: function (e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
    if (e.type == 'end') {
      this.getLngLat()
    }
  }
  , markertap(e) {
    console.log(e);
    console.log(e.markerId);
    
    var markers = this.data.markers;
   
    var marker = new Object();
    marker = this.data.markers[e.markerId]
    marker.iconPath = '../../source/icon/marker_yellow.png';
    markers[e.markerId] = marker;

    var markerPre = new Object();
    /**/
    if (pointindex){      
      markerPre = this.data.markers[parseInt(pointindex)];
      console.log(markerPre);
      markerPre.iconPath = '../../source/icon/marker_red.png';
      markers[pointindex] = markerPre;
    }
     
   
    this.setData({
      pointindex: e.markerId,
      markers: markers
    })
    pointindex = e.markerId;
  },

  doNew: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("map4select");
    this.mapCtx.getCenterLocation({
      success: function (res) {
        var newpoint = new Object();
        newpoint.longitude = res.longitude;
        newpoint.latitude = res.latitude;

        var tempindex = that.data.polyline[0].points.length;
        var newmarker = new Object();
        newmarker.longitude = res.longitude;
        newmarker.latitude = res.latitude;
        newmarker.id = tempindex;
        newmarker.iconPath = '../../source/icon/marker_red.png';
        newmarker.height = 23;
        newmarker.width = 25;
        newmarker.anchor = { x: .5, y: .5 };
        newmarker.latitude = res.latitude;
        newmarker.longitude = res.longitude;
        var newlabel = new Object();
        newlabel.content = "" + (tempindex);
        newlabel.color = "#ff0000";
        newmarker.label = newlabel;


        var newpoints = new Array();
        newpoints = that.data.polyline[0].points;
        var markers = new Array();
        markers = that.data.markers;

        newpoints[tempindex] = newpoint;
        markers[tempindex] = newmarker;


        
        var points = that.data.polyline;;
        points[0].points = newpoints;


        that.setData({
          polyline: points,
          markers: markers,
          pointindex: tempindex
        })
        pointindex = tempindex;


      }
    })
  },



  //选中标点删除
  dodelete: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("map4select");
    this.mapCtx.getCenterLocation({
      success: function (res) {

        var newpoints = new Array();
        var markers = new Array();


        for (var i = 0; i < that.data.polyline[0].points.length - 1; i++) {
          if (i < pointindex) {
            newpoints[i] = that.data.polyline[0].points[i];
            markers[i] = that.data.markers[i];
          }
          else {
            newpoints[i] = that.data.polyline[0].points[i + 1];
            var tmarker = that.data.markers[i + 1];
            tmarker.id = i;

            var tlabel = new Object();
            tlabel.content = "" + i;
            tlabel.color = "#ff0000";
            tmarker.label = tlabel;

            //markers[i] = that.data.markers[i - 1];
            //markers[i].id = i;

            markers[i] = tmarker;
          }

        }


        var points = that.data.polyline;;
        points[0].points = newpoints;


        that.setData({
          polyline: points,
          markers: markers
        })
        console.log(that.data.markers);
      }
    })
  },
  //选中标点下标之后插入新标点
  doinsert: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("map4select");
    this.mapCtx.getCenterLocation({
      success: function (res) {
        var newpoint = new Object();
        newpoint.longitude = res.longitude;
        newpoint.latitude = res.latitude;

        var newmarker = new Object();
        newmarker.longitude = res.longitude;
        newmarker.latitude = res.latitude;
        newmarker.id = pointindex + 1;
        newmarker.iconPath = '../../source/icon/marker_red.png';
        newmarker.height = 23;
        newmarker.width = 25;
        newmarker.anchor = { x: .5, y: .5 };
        newmarker.latitude = res.latitude;
        newmarker.longitude = res.longitude;
        var newlabel = new Object();
        newlabel.content = "" + (pointindex + 1);
        newlabel.color = "#ff0000";
        newmarker.label = newlabel;


        var newpoints = new Array();
        var markers = new Array();


        for (var i = 0; i < that.data.polyline[0].points.length + 1; i++) {
          if (i < (pointindex + 1)) {
            newpoints[i] = that.data.polyline[0].points[i];
            markers[i] = that.data.markers[i];
          }
          else if (i == (pointindex + 1)) {
            newpoints[i] = newpoint;
            markers[i] = newmarker;
          }
          else {
            newpoints[i] = that.data.polyline[0].points[i - 1];

            var tmarker = that.data.markers[i - 1];
            tmarker.id = i;

            var tlabel = new Object();
            tlabel.content = "" + i;
            tlabel.color = "#ff0000";
            tmarker.label = tlabel;

            //markers[i] = that.data.markers[i - 1];
            //markers[i].id = i;

            markers[i] = tmarker;
          }

        }


        var points = that.data.polyline;;
        points[0].points = newpoints;


        that.setData({
          polyline: points,
          markers: markers
        })
        console.log(that.data.markers);
      }
    })
  },
  doEdit: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("map4select");
    this.mapCtx.getCenterLocation({
      success: function (res) {
        var point = that.data.polyline[0];
        console.log(pointindex);
        console.log(point);
        point.points[pointindex].longitude = res.longitude;
        point.points[pointindex].latitude = res.latitude;
        var points = new Array();
        points[0] = point;


        var markers = that.data.markers;
        markers[pointindex].latitude = res.latitude;
        markers[pointindex].longitude = res.longitude;


        that.setData({
          polyline: points,
          markers: markers
        })
      }
    })

  },

  dealdata: function (tempstring) {
    console.log(tempstring);
    var instance = this;
    var templongitude = "";
    var templatitude = "";
    var tempmarkers = new Array();


    var teppolylines = new Array();
    var teppolyline = new Object();
    var tepPoints = new Array();
    var tempArry = tempstring.split(";");
    for (var j = 0; j < tempArry.length; j++) {
      if (tempArry[j] != "") {
        var tempobj = new Object();
        templongitude = tempArry[j].substring(0, tempArry[j].indexOf(","));
        templatitude = tempArry[j].substring(tempArry[j].indexOf(",") + 1);



        tempobj.longitude = templongitude;
        tempobj.latitude = templatitude;
        tepPoints[j] = tempobj;


        var tempmarker = new Object();

        tempmarker.id = j;
        tempmarker.iconPath = '../../source/icon/marker_red.png';
        tempmarker.height = 23;
        tempmarker.width = 25;
        tempmarker.anchor = { x: .5, y: .5 };
        tempmarker.latitude = templatitude;
        tempmarker.longitude = templongitude;



        var templabel = new Object();
        templabel.content = "" + j;
        templabel.color = "#ff0000";
        tempmarker.label = templabel;
        tempmarkers[j] = tempmarker;
      }
    }
    teppolyline.points = tepPoints;
    teppolyline.color = "#0000ff";
    teppolyline.width = 1;
    teppolyline.dottedLine = false;
    teppolyline.arrowLine = true;
    teppolylines[0] = teppolyline;

    var includepoint = new Object(); //视野内的点，站点位置

    instance.setData({
      markers: tempmarkers,
      polyline: teppolylines,
      longitude: templongitude,
      latitude: templatitude,
      items: tepPoints
    });
  },
  doinput: function (e) {
    var that = this;
    wx.getClipboardData({
      success: function (res) {
        console.log(res.data)
        that.dealdata(res.data);
      }
    })
  },
  dooutput: function (e) {
    var that = this;
    var tempstring = '';
    var newpoints = new Array();
    newpoints = that.data.polyline[0].points;
    for (var i = 0; i < newpoints.length;i++){
      if(i==0)
      tempstring =  newpoints[i].longitude + ","+ newpoints[i].latitude;
      else
        tempstring = tempstring +";"+ newpoints[i].longitude + "," + newpoints[i].latitude;
    }

    console.log(tempstring);
    wx.setClipboardData({
      data: tempstring,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  dooutput2: function (e) {
    var that = this;
    var tempstring = '';
    var newpoints = new Array();
    newpoints = that.data.polyline[0].points;
    for (var i = 0; i < newpoints.length; i++) {
      if (i == 0)
        tempstring = newpoints[i].longitude + "," + newpoints[i].latitude;
      else
        tempstring = newpoints[i].longitude + "," + newpoints[i].latitude + ";" + tempstring;
    }

    console.log(tempstring);
    wx.setClipboardData({
      data: tempstring,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
  }


})