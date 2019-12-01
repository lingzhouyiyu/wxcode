import {
  DetailTeacher
} from '../../models/detailTeacher.js'
let rankings = new DetailTeacher()
//刷新参数
var limit = 5;
var currentPage = 1;
var hasNextPage = false;
var nextPage = 2;
var Ftype='week';
//获取应用实例
const app = getApp()
// pages/rankings/rankings.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tapcurrent: 0,
    weekData:[],
    monthData: [],
    Furl: app.globalData.Serverurl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectTeacherPHB(Ftype);
   
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
    this.selectTeacherPHB(Ftype);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (hasNextPage){
      this.selectTeacherPHBLoad(Ftype);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  gotodetailTeacher: function (e) {
    var teacherId = e.currentTarget.dataset.teacherid;

    wx.navigateTo({
      url: '../../pages/detailTeacher/detailTeacher?teacherId=' + teacherId,
    })
  },
  menutap: function (e) {
    
    this.setData({
      tapcurrent: e.currentTarget.dataset.current
    });
    if (e.currentTarget.dataset.current == '0') {
      Ftype='week';
      this.selectTeacherPHB(Ftype);
    } else if (e.currentTarget.dataset.current == '1') {
      Ftype='month';
      this.selectTeacherPHB(Ftype);
    }
  },
  //获取教师数据
  selectTeacherPHB: function (Forder){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that=this;
    rankings.selectTeacherPHB(Forder,limit, currentPage,data=>{
      // console.log(data.data);
      var newdatas=data.data;
      for (let j = 0; j < newdatas.length;j++){
        newdatas[j].teacherImage = newdatas[j].teacherImage.split(',')[0];
      }
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      if(Forder=='week'){     
          that.setData({
            weekData: newdatas
          });
      } else if (Forder == 'month'){
       
        that.setData({
          monthData: newdatas
        });
      }
    },res=>{});
  },
  //上拉加载
  selectTeacherPHBLoad: function (Forder) {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    rankings.selectTeacherPHB(Forder, limit, nextPage, data => {
      // 隐藏加载框
      wx.hideLoading();
      // console.log(data.data);
      var newdatas = data.data;
      for (let j = 0; j < newdatas.length; j++) {
        newdatas[j].teacherImage = newdatas[j].teacherImage.split(',')[0];
      }
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;

      if (Forder == 'week') {
        var temp=that.data.weekData;
        for (let i = 0; i < newdatas.length;i++){
          temp.push(newdatas[i]);
        }
        that.setData({
          weekData: temp
        });
      } else if (Forder == 'month') {
        var temps = that.data.monthData;
        for (let i = 0; i < newdatas.length; i++) {
          temps.push(newdatas[i]);
        }
        that.setData({
          monthData: temps
        });
      }
    }, res => { });
  },
})