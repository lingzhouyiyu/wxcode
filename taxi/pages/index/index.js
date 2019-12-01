var app = getApp()
var QQMapWX = require('../../common/js/qqmap-wx-jssdk.min');
var qqmapsdk = new QQMapWX({
	key: 'INFBZ-FAZK3-S2W3B-3UOH3-NOGL2-XJBIS' // 必填
});
var Flng, Flat, Faddr;
Page({
	data: {
		longitude: null,
		latitude: null,
		locationString: '',
		curaddr: '',
		inputValue: null,
	},
	onLoad: function() {
			var that = this;
			// 获取定位，并把位置标示出来
			console.log(app.globalData.devwidth)
			wx.getLocation({
				type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
				success: function(res) {
					// Flng = res.longitude;
					// Flat = res.latitude;
					that.setData({
						longitude: res.longitude,
						latitude: res.latitude,
						locationString: res.latitude + "," + res.longitude
					})
					that.geocoder(res.latitude + "," + res.longitude);
				},
				fail: function() {
					// fail
				},
				complete: function() {
					// complete
				}
			})
		}
		//获取中间点的经纬度，并mark出来
		,
	regionchange(e) {
		if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
			var that = this;
			this.mapCtx = wx.createMapContext("mapselect");
			this.mapCtx.getCenterLocation({
				type: 'gcj02',
				success: function(res) {
					// console.log(res)
					// Flng = res.longitude;
					// Flat = res.latitude;
					that.setData({
						latitude: res.latitude,
						longitude: res.longitude,
						controls: [{
							id: 1,
							iconPath: '../../common/images/marker.png',
							position: {
								left: app.globalData.devwidth / 2 - 16,
								top: app.globalData.devheight / 2 - 16,
								width: 32,
								height: 32
							},
							clickable: true,
							scale: 28
						}],
						locationString: res.latitude + "," + res.longitude
					})
					that.geocoder(res.latitude + "," + res.longitude);
				}
			})
		}
	},

	//定位到自己的位置事件
	my_location: function(e) {
		var that = this;
		that.onLoad();
	},
	//逆地址解析
	geocoder: function(locationString) {
		var that = this;
		qqmapsdk.reverseGeocoder({
			location: locationString,
			success: function(res) { //成功后的回调
				// Faddr = res.result.formatted_addresses.recommend;
				that.setData({
					// longitude: res.data.result.location.lng,
					// latitude: res.data.result.location.lng,
					curaddr: res.result.formatted_addresses.recommend
				})
			},
			fail: function(error) {
				console.error(error);
			},
			complete: function(res) {
				console.log(res);
			}
		})
		// wx.request({
		//   url: 'https://apis.map.qq.com/ws/geocoder/v1/',
		//   data: {
		//     "key": "INFBZ-FAZK3-S2W3B-3UOH3-NOGL2-XJBIS",
		//     "location": locationString
		//   },
		//   method: 'GET',
		//   success: function (res) {
		//     console.log(res);
		//     that.setData({
		//       // longitude: res.data.result.location.lng,
		//       // latitude: res.data.result.location.lng,
		//       curaddr: res.data.result.formatted_addresses.recommend
		//     })
		//   }
		// });
	},
	//获取车辆信息
	getCarList: function(){
		
	}
	
})
