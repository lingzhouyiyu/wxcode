//app.js
App({
	globalData: {
		userInfo: null,
		devwidth: '',
		devheight: '',
	},
	onLaunch: function() {
		var app = this;
		wx.getSystemInfo({
			success: function(res) {
				app.globalData.devwidth = res.windowWidth;
				app.globalData.devheight = res.windowHeight;

			}
		})

	}
})
