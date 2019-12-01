// pages/Disciple/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
    // var ctx = wx.createCanvasContext('myCanvas')
    // // Draw arc
    // ctx.beginPath()
    // ctx.moveTo(-10, 0)
    // ctx.quadraticCurveTo(200, 150, 430, 0)
    // ctx.setStrokeStyle('#fff')
    // ctx.stroke()
    // ctx.fillStyle = "red";
    // ctx.fill();  
    // ctx.draw()
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  gotoSelectschool:function(){
    wx.navigateTo({
      url: '../../../pages/Disciple/Selectschool/Selectschool',
    })
  },
  gotoapplyTeacher: function () {
    wx.navigateTo({
      url: '../../../pages/applyTeacher/applyTeacher',
    })
  },
})