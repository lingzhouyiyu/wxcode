// pages/wxstudent/manage/classes.js
const app = getApp()

Page({
  data: {
    taskList: [], //任务列表
    loaded: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadtask();  //调用湖区任务列表
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
    this.loadtask();  //调用湖区任务列表
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //读取任务列表
  loadtask: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true,
      duration: 20000
    })
    wx.request({

      url: app.XSDZhostUrl + 'AppTeachersManage/AppTeachers/GetStudentClass?queryJson={"UserId":"' + app.XSDZOBJ.UserId+'"}', //fb1eb5d5-d434-4dcb-b98b-5f5853880cce
     
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
            taskList: res.data.resultdata,
            loaded: true
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
  },

  bindSearchface: function () {

  }

})