import {
  Vote
} from '../../models/vote.js'

let vote = new Vote();

//获取应用实例
const app = getApp()
// pages/voteschooldetail/voteschooldetail.js
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolData:[],
    id: '',
    Furl: app.globalData.Serverurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    if (options.scene) {
   
      var scene = decodeURIComponent(options.scene);
     
      var arrPara = scene.split(",");

      this.setData({
        id: arrPara[1]
      })
      this.schoolDetail(arrPara[1]);
    } else {
      this.schoolDetail(options.id);
      this.setData({
        id: options.id
      })
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
    this.schoolDetail(this.data.id);
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
  gotoindex: function () {
    wx.redirectTo({
      url: '../../../subpackage/pages/vote/vote',
    })
  },
  gotovoteshare:function(){
    var that=this;
    wx.navigateTo({
      url: '../../pages/voteshare/voteshare?tag=schoolshare' + '&name=' + that.data.schoolData.schoolName + '&number=' + that.data.schoolData.id,
    })
  },
  //获取学校详情
  schoolDetail:function(id){
    var that=this;
    WxParse.wxParse('schoolcontent', 'html', '', that, 5);
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    vote.schoolDetail(id,data=>{
    
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
     
      
        data.data.newschoolPicture = data.data.schoolPicture.split(',');
      
      if(data.status==200){
          that.setData({
            schoolData:data.data
          })
          if(data.data.type=='0'){
            WxParse.wxParse('schoolcontent', 'html', data.data.schoolEnvironment, that, 5);
            WxParse.wxParse('schooltext', 'html', data.data.schoolIntroduce, that, 5);
          }        
      }
      console.log(that.data.schoolData);
    },res=>{})
  },
  //学校投票
  vote: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    vote.vote(id, app.globalData.openid, data => {
      if (data.msg == '200' ||data.msg == '910') {
        wx.showToast({
          title: '投票成功',
        })
        that.schoolDetail(that.data.id);
        setTimeout(function () {
          wx.navigateTo({
            url: '../../../subpackage/pages/vote/vote',
          })
        }, 2000);
      } else if (data.msg == '909') {
        wx.showToast({
          title: '今日已经投票！',
          icon: 'none',
          duration: 1000
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../../../subpackage/pages/vote/vote',
          })
        }, 1000);
      }
    }, res => { });
  },
})