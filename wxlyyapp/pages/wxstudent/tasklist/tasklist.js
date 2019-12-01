// pages/nk/historytask/historytask.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    endSelsctDate: '',
    taskList: [],
    loaded: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var systemInfo = wx.getSystemInfoSync();
    var d = new Date()
    d.setMonth(d.getMonth() + 1);
    this.setData({
      date: this.getFormatDate(new Date()),
      endSelsctDate: this.getFormatDate(d),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.loadClass();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.loadClass();
    wx.stopPullDownRefresh();
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   *读取任务列表
   */
  loadClass: function() {

    var that = this;
    var queryJson = {
      YearMonth: this.data.date, //this.data.date,
      DriverId: app.XSDZOBJ.UserId, //app.XSDZOBJ.UserId
      TaskState: ''
    }
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    wx.request({
      url: app.XSDZhostUrl + '/AppTeachersManage/AppTeachers/SJ_GetTaskList',
      data: {
        queryJson: JSON.stringify(queryJson)
      },
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.XSDZOBJ.Token
      },
      success: function(res) {
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束

        if (res.data.resultdata) {
          that.setData({
            taskList: res.data.resultdata,
            loaded: true
          })
        } else {
          wx.showToast({
            title: '获取数据失败',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function(res) {
        //console.log(res);
        wx.showToast({
          title: '调用接口失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function(res) {
        wx.hideToast();
      }
    })
  },

  //获取当前日期 格式如下 2018-01-01
  getFormatDate: function(date) {
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    //if (strDate >= 0 && strDate <= 9) {
    // strDate = "0" + strDate;
    //}
    var currentdate = date.getFullYear() + seperator1 + month;
    return currentdate;
  },

  preDay: function() {
    var d = new Date(this.data.date)
    d.setMonth(d.getMonth() - 1);
    this.setData({
      date: this.getFormatDate(d)
    });
    this.loadClass(); //读取班次信息
  },

  nextDay: function() {
    var d = new Date(this.data.date)
    d.setMonth(d.getMonth() + 1);
    this.setData({
      date: this.getFormatDate(d)
    });
    this.loadClass(); //读取班次信息
  },
  bindDateChange: function(e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    });
    this.loadClass(); //读取班次信息
  }
})