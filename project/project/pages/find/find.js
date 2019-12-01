import {
  FindModel
} from '../../models/find.js'
let findModel = new FindModel()
//刷新参数
var limit = 2;
var currentPage = 1;

//获取应用实例
const app = getApp()

// pages/find/find.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  activity:[],
  newsList:[],
  Furl: app.globalData.Serverurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {
        that.selectAllPlatNews();
        that.selectAllUnderActivity();     
      })
    } else {
      that.selectAllPlatNews();
      that.selectAllUnderActivity();
     
    }
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
    var that=this;
    that.selectAllPlatNews();
    that.selectAllUnderActivity();
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
  gotonotice: function () {
    wx.navigateTo({
      url: '../../pages/notice/notice',
    })
  },
  gotoactivitymore:function(){
    wx.navigateTo({
      url: '../../pages/activitymore/activitymore',
    })
  },
  gotonewsmore: function () {
    wx.navigateTo({
      url: '../../pages/newsmore/newsmore',
    })
  },
  gotonewsdetail:function(e){
    //添加浏览量
    this.updateLookCount(e.currentTarget.dataset.newsid);
    wx.navigateTo({
      url: '../../pages/newsdetail/newsdetail?id=' + e.currentTarget.dataset.newsid,
    })
  },
  gotoactivitydetail: function (e) {
    var activeId = e.currentTarget.dataset.activeid;
    var activeType = e.currentTarget.dataset.activetype;
    if (activeType == 0 || activeType == 5) {//图文活动
      wx.navigateTo({
        url: '../../pages/activity_detail/activity_detail?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 2) {//本周优选（有课程）
      wx.navigateTo({
        url: '../../pages/activity/activity?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 6) {//线下活动（可购买）按人数收费
      wx.navigateTo({
        url: '../../pages/activity_buy/activity_buy?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 3) {//线下活动（可购买）按比例收费
      wx.navigateTo({
        url: '../../pages/activitydetail/activitydetail?activeId=' + activeId + '&activeType=' + activeType,
      })
    }
  },
  //活动列表
  selectAllUnderActivity: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    findModel.selectAllUnderActivity( limit, currentPage, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
     var newdatas=data.data;
     for(let i=0;i<newdatas.length;i++){
       newdatas[i].imgurl=newdatas[i].imgurl.split(',')[0];
     }
      this.setData({
        activity: newdatas,
      });

    }, res => { })
  },
  //新闻列表
  selectAllPlatNews: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    findModel.selectAllPlatNews(limit, currentPage, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      var temp=data.data;
      for(let i=0;i<temp.length;i++){
        temp[i].imgarray = temp[i].newUrl.split(',');
      }
      this.setData({
        newsList: temp,
      });
      console.log(temp);
    }, res => { })
  },
  //新增浏览量
  updateLookCount:function(id){
    findModel.updateLookCount(id,data=>{
  
    },res=>{});
  },
})