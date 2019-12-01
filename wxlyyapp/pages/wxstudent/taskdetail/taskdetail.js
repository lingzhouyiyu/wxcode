//index.js
//获取应用实例
const app = getApp()
var task_id = null;  //任务id
Page({
  data: {
    taskInfo: new Object(),
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    task_id = options.id;
    this.setData({
      taskid: task_id
    })
  },

  onShow:function(){
    this.loadTaskDetail(); //获取任务详情
  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {
    this.loadTaskDetail(); //获取任务详情
    wx.stopPullDownRefresh();
  },

  //检票？
  taskdetail: function () {
    wx.navigateTo({
      url: "../checkticket/checkticket"
    })
  },

  //读取任务列表
  loadTaskDetail: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    wx.request({
      url: app.XSDZhostUrl + 'AppTeachersManage/AppTeachers/SJ_GetTaskInfo?queryJson={"TaskId":"' + task_id +'","TotalType":"1","IsOnCarType":"0,1,2"}',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.XSDZOBJ.Token
      },
      data: {
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
            taskInfo: res.data.resultdata,
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
        //console.log(res);
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
      }
    })
  }


})
