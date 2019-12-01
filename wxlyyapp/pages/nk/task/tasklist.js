// pages/nk/task/tasklist.js

var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    taskList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.taskList);
    this.setData({
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
    this.loadTasks();
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
    this.loadTasks();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  loadTasks: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_getClassListByAccount',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: app.NKOBJ.Account,  //账号
        beginData: '', //不传默认为当天yyyy-MM-dd HH:mm:ss
        endDate: '', //不传默认为当天yyyy-MM-dd HH:mm:ss
        status: '0,1,2',  //状态，多状态以英文逗号分隔，0=等确认；1=待发班；2=已发班；3=已完成；
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

        //if (res.data.resultdata) {
        var temptaskList = res.data.resultdata;
        for (var i = 0; i < temptaskList.length;i++){
          temptaskList[i].UseDate = temptaskList[i].UseDate.substr(0, 10);
        }
          that.setData({
            taskList: temptaskList
          })
        //}
        //else {
          //wx.showToast({ title: res.data.message,icon: 'none',duration: 2000})
        //}
        wx.hideToast();
      },
      fail: function (res) {
        wx.hideToast();
        //console.log(res);
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {

        //console.log(res);
      }
    })
  },


})