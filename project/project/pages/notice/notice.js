
import {
  IndexModel
} from '../../models/index.js'
let notice = new IndexModel()
//刷新参数
var limit = 5;
var currentPage = 1;
//获取应用实例
const app = getApp()
// pages/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messagearray:['1','2','3'],
    noticearray: ['1', '2', '3'],
    tapcurrent:0,
    hasmessage:true,
    Furl: app.globalData.Serverurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //通知
    this.selectAllNotice();
    //私信
    this.selectAllCantact();
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
  menutap:function(e){
   
    this.setData({
      tapcurrent : e.currentTarget.dataset.current
    });
  },
  //通知
  selectAllNotice:function(){
    var that=this;
    notice.selectAllNotice(limit, currentPage,data=>{
        // console.log(data);
        that.setData({
          noticearray:data.data,
        });
    },res=>{});
  },
  //私信
  selectAllCantact: function () {
    var that = this;
    notice.selectAllCantact(limit, currentPage, app.globalData.openid, data => {
      // console.log(data);
     if(data.count==0){
      that.setData({
        hasmessage: false
      });
     }else{
       that.setData({
         hasmessage: true
       });
     }
      that.setData({
        messagearray: data.data,
      });
    }, res => { });
  },
})