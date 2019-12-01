
//获取应用实例
var app = getApp();

Page({
  data: {
    suggests: []
  },
  //事件处理函数
  getSug: function (e) {
    if (e.detail.value==''){
      return;
    }

/*
    try {
      var value = wx.getStorageSync(e.detail.value)
      if (value) {
        this.setData({ suggests: value.buslines });
        this.setData({ lineId: e.detail.value });
        return;
      }
    } catch (e) {
      console.log('getStorageSync错误');
    }
*/
    wx.request({
      //url: 'http://apis.haoservice.com/lifeservice/busline/linename?key=0397befd399f45219192b71992b6a010&paybyvas=false',
      url: app.hostUrl + '/BusAPI/RouteList' ,
      method: 'GET',
      data: {
        //city: app.globalData.city,
        city:app.globalData.district,
        keywords: e.detail.value
      },
      success: function (res) {       
        this.setData({ suggests: res.data.result.buslines});
        this.setData({ lineId: e.detail.value});
        /*
        try {
          wx.setStorageSync(e.detail.value, res.data.result)
        } catch (e) {
        }
        */
      }.bind(this),
      fail: function () {
        //instance.loadBusLine();
      }
    });
  },
  onLoad: function () {
    var app = getApp();
    console.log(app.globalData);
    this.setData({
      devwidth: app.globalData.devwidth,
      devheight: app.globalData.devheight,
      scrollheight: (app.globalData.devheight)
    })
  },
/*
  getRecommend: function () {
    wx.request({
      url: 'http://gongjiao.xiaojukeji.com/api/transit/line/recommendation',
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        imei: 'general_app',
        token: 't49GcWlrGxJ0d2tGQtC9zA_MYpKZXtCpEcwSEJk1jSpUjTsOAyEMRO8ytQucZY3t25B_KiJQlAJx91hKte28p3kTFQ4QzvCTci7ZipjJxplwhSvhBp941zG-rccSjnCYwoTRPv0SfF-E-xE94pZ342SJddMoPP-hFzytXwAAAP__',
        lng: '116.29319741622',
        lat: '40.041375934019',
        city: 1,
        filter: '0,1'
      },
      success: function (res) {
        console.log(res.data);
      }
    });
  }
*/
})
