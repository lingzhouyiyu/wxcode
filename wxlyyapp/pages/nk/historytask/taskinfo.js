// pages/nk/historytask/taskinfo.js
var task_id = null;  //任务id
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ClassesInfo: {},
    TicketList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    task_id = options.id;
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
    this.loadTaskInfo();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //读取任务信息
  loadTaskInfo: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_getClassDetail',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: app.NKOBJ.Account,  //账号
        classesId: task_id, //班次编号
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


        if (res.data.resultdata) {
          that.setData({
            ClassesInfo: res.data.resultdata.ClassesInfo,
            TicketList: res.data.resultdata.TicketList,
          })
        }
        else {
          wx.showToast({
            title: '获取数据失败', icon: 'none', duration: 2000
          })
        }
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
      }
    })
  },
})