// pages/nk/user/changepassword.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    PrePswinputValue:'',
    NewPswinputValue: '',
    ConfimPswinputValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 旧密码输入
   */
  bindPrePswInput: function (e) {
    this.setData({
      PrePswinputValue: e.detail.value
    })
  },

  /**
  * 新密码输入
  */
  bindNewPswInput: function (e) {
    this.setData({
      NewPswinputValue: e.detail.value
    })
  },

  /**
* 确认新密码输入
*/
  bindConfimPswInput: function (e) {
    this.setData({
      ConfimPswinputValue: e.detail.value
    })
  },


  /**
   * 提交修改密码
   */
  buttontap: function () {
    var that = this;
    if (that.data.PrePswinputValue.length == 0 || that.data.NewPswinputValue.length == 0 || this.data.ConfimPswinputValue.length == 0){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
    }
    else if (that.data.NewPswinputValue != that.data.ConfimPswinputValue){
      wx.showToast({
        title: '两次输入的新密码不一致',
        icon: 'none',
        duration: 2000
      })
    }
    else{


      
      wx.showToast({
        title: '正在加载数据',
        icon: 'loading',
        mask: true
      })
      wx.request({
        url: app.GJhostUrl + 'BusAPIManage/DriverApi/BusDriverModifyPassword',
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'LyyUserToken': app.GJOBJ.Token
        },
        data: {
          account: app.GJOBJ.Account,
          oldPassword: that.data.PrePswinputValue,
          newPassword: that.data.NewPswinputValue
        },
        success: function (res) {
          wx.hideToast();
          //console.log(res);
          //登录超时处理
          if (res.statusCode == 401) {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
          //登录超时处理结束


          if (res.data.error_code=='0') {
            wx.showToast({
              title: '修改密码成功', icon: 'success', duration: 2000
            })

          }
          else {
            wx.showToast({
              title: '提交数据失败', icon: 'none', duration: 2000
            })
          }
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
    }

    console.log('修改密码');
  }
})