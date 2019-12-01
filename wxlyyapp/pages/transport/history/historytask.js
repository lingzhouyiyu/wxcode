// pages/nk/historytask/historytask.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    endSelsctDate: '',
    taskList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var d = new Date()
    d.setMonth(d.getMonth() + 1);
    this.setData({
      date: this.getFormatDate(new Date()),
      endSelsctDate: this.getFormatDate(d),
      windowHeight: app.devheight
    });
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
    this.loadList();
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
    this.loadList();
    wx.stopPullDownRefresh();
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   *读取班次信息
   */
  loadList: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.GJhostUrl + 'BusAPIManage/DriverApi/GetWorkDetails',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.GJOBJ.Token
      },
      data: {
        driverId: app.GJOBJ.UserId,  
        beginData: this.data.date, //不传默认为当天yyyy-MM-dd HH:mm:ss
        endDate: this.data.date, //不传默认为当天yyyy-MM-dd HH:mm:ss
        vehicleId:''
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
          that.setData({
            taskList: res.data.result,
          })
        }
        else {
          //wx.showToast({ title: res.data.message, icon: 'none', duration: 2000})
        }
        wx.hideToast();
      },
      fail: function (res) {
        //console.log(res);
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
        
        //console.log(res);
      }
    })
  },

  //获取当前日期 格式如下 2018-01-01
  getFormatDate: function (date) {
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  preDay: function () {
    var d = new Date(this.data.date)
    d.setDate(d.getDate() - 1);
    this.setData({
      date: this.getFormatDate(d)
    });
    this.loadList(); //读取班次信息
  },

  nextDay: function () {
    var d = new Date(this.data.date)
    d.setDate(d.getDate() + 1);
    this.setData({
      date: this.getFormatDate(d)
    });
    this.loadList(); //读取班次信息
  }
})