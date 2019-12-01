var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
// pages/teacherdata/teacherdata.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacherData:null,
    teacherBestWork:[],
    teacherPhoto:[],
    Furl: app.globalData.Serverurl,
    teacherPhotoArray:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that=this;
    var data=wx.getStorageSync('teacherData');

    var teacherBestWork = data.teacherBestWork.split(',');
    var teacherPhoto = data.teacherPhoto.split(',');
    var tempimg=[];
    for (let i = 0; i < teacherPhoto.length;i++){
      tempimg.push(that.data.Furl + teacherPhoto[i]);
    }
    this.setData({
      teacherData: data,
      teacherBestWork: teacherBestWork,
      teacherPhoto: teacherPhoto,
      teacherPhotoArray: tempimg
    });
    var teacherIntroduce = data.teacherIntroduce;
    WxParse.wxParse('teacherIntroduce', 'html', teacherIntroduce, that, 5);
    
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
    // 停止下拉动作
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
  /** 
	 * 预览图片
	 */
  previewImage: function (e) {
    var current = e.target.dataset.src;

    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.teacherPhotoArray // 需要预览的图片http链接列表
    })
  }  

})