App({
  //bmapak: 'fsUChVmxZq9vGtu5GoNyuATBWPNTP2eB',  
  bmapak: 'Cas5yYNei8rTQ5Z20EIRldDS51oULYns',  
  
  //hostUrl: 'http://120.78.94.46:8989',
  //hostUrl: 'http://119.23.20.214:8012',
  hostUrl: 'https://bus.laiyunyou.cn',
  

  globalData: {
    locationInfo: null,
    devwidth: null,
    devheight: null,
    devstatusBarHeight: null,
    city: null,  //当前选定城市
    district: null,  //当前选定县区
    localcity: null,  //当前定位信息 城市
    localdistrict: null,  //当前定位信息 县区
    localService:false,
    serviceAreas:null  //已开通服务地区信息   

  },
	onLaunch: function(options) {
    console.log('app on load');
    // 动态设置map的宽和高
    var app = this;
    wx.getSystemInfo({
      success: function (res) {
        app.globalData.devwidth=res.windowWidth;
        app.globalData.devheight = res.windowHeight;
        app.globalData.platform = res.platform;        //devtools（windows系统），ios,android
      }
    })
  },

	onShow: function(options) {},

	onHide: function() {},

	onError: function(msg) {
	  console.log(msg);
    console.log("erro msg---");
	},
 
 

	getLocationInfo: function(cb) {
		var app = this;
		if (this.globalData.locationInfo) {
			cb(this.globalData.locationInfo);
		} else {
			wx.getLocation({
				type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
				success: function(res) {              
					app.globalData.locationInfo = res;
          cb(res);
          console.log('getLocationInfo.success');
				},
				fail: function() {
          console.log('getLocationInfo.fail');
				},
				complete: function() {
          //console.log('5.complete');
				}
			});
		}
	}
});
