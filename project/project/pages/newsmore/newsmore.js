
import {
  FindModel
} from '../../models/find.js'
let findModel = new FindModel()
//刷新参数
var limit = 2;
var currentPage = 1;

//获取应用实例
const app = getApp()
// pages/newsmore/newsmore.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:[],
    Furl: app.globalData.Serverurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {
        that.selectAllPlatNews();
       
      })
    } else {
      that.selectAllPlatNews();

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
  gotonewsdetail: function (e) {
    wx.navigateTo({
      url: '../../pages/newsdetail/newsdetail?id=' + e.currentTarget.dataset.newsid,
    })
  },
  //新闻列表
  selectAllPlatNews: function () {
    findModel.selectAllPlatNews(limit, currentPage, data => {
      var temp = data.data;
      for (let i = 0; i < temp.length; i++) {
        temp[i].imgarray = temp[i].newUrl.split(',');
      }
      this.setData({
        newsList: temp,
      });
      //  console.log(data.data);
    }, res => { })
  },
})