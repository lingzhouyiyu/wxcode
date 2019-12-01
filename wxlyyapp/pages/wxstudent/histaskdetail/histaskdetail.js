//index.js
//获取应用实例
// pages/nk/historytask/taskinfo.js

var task_id = null; //任务id
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
  onLoad: function(options) {
    task_id = options.id;
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
    this.loadTaskInfo();
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
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  //读取班次和订单信息
  loadTaskInfo: function() {
    var that = this;
    var queryJson = {
      TaskId: task_id,
      TotalType:1,
      IsOnCarType:'0,1,2'
    }
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    wx.request({
      url: app.XSDZhostUrl + '/AppTeachersManage/AppTeachers/SJ_GetTaskInfo',
      method: 'GET',
      data: {
        queryJson: queryJson
      },
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
            ClassesInfo: res.data.resultdata,
            TicketList: res.data.resultdata.TaskOrderList,
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
  }
})