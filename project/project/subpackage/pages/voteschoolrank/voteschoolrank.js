import {
  Vote
} from '../../models/vote.js'

let vote = new Vote();

//获取应用实例
const app = getApp()
var limit = 10;
var page = 1;
var nextPage = 2;
var hasNextPage = false;
var interval=null;
var activeIDschool = '1000000324491431';
// pages/voteschoolrank/voteschoolrank.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankdata: [],
    Furl: app.globalData.Serverurl,
    countDownDay: '00',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    overTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.mostPopularSchoolRanking();
    this.getVoteActivity(activeIDschool);
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
    this.mostPopularSchoolRanking();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (hasNextPage) {
      this.mostPopularSchoolRankingLoad();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  gotovoteschooldetail: function(e) {
    wx.navigateTo({
      url: '../../pages/voteschooldetail/voteschooldetail?id=' + e.currentTarget.dataset.id,
    })
  },
  //获取学校排行榜初始化数据
  mostPopularSchoolRanking: function () {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    vote.mostPopularSchoolRanking(limit, page, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      for (let i = 0; i < data.data.length; i++) {
        data.data[i].schoolPicture = data.data[i].schoolPicture.split(',')[0]
      }
      that.setData({
        rankdata: data.data
      })
    }, res => { })
  },
  //获取学校排行榜初始化数据加载
  mostPopularSchoolRankingLoad: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })

    vote.mostPopularSchoolRanking(limit, nextPage, data => {
      // 隐藏加载框
      wx.hideLoading();
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      var temp = that.data.rankdata;
      for (let i = 0; i < data.data.length; i++) {
        data.data[i].schoolPicture = data.data[i].schoolPicture.split(',')[0]
        temp.push(data.data[i]);
      }
      that.setData({
        rankdata: temp
      })
    }, res => { })
  },
  //倒计时
  countdown: function () {
    clearInterval(interval); 
    // var totalSecond = 1505540080 - Date.parse(new Date()) / 1000;
    var totalSecond = this.data.overTime;
     interval = setInterval(function () {
      // 秒数  
      var second = totalSecond;

      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  //获取学校/个人投票活动图、时间
  getVoteActivity: function (activeID) {
    var that = this;
    vote.getVoteActivity(activeID, data => {
      that.setData({
        activeBeginDate: data.data.activeBeginDate,
        activeEndDate: data.data.activeEndDate,
        imgurl: data.data.imgurl,
        overTime: data.data.overTime
      })
      that.countdown();
    }, res => { })
  },
})