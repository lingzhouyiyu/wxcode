import {
  Mine
} from '../../models/mine.js'
const mine = new Mine()
//刷新参数
var limit = 15;
var page = 1;
var hasNextPage = false;
var nextPage = 0;
//获取应用实例
const app = getApp()
// pages/Collection/Collection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tapcurrent: 0,
    courseList:[],
    teacherList:[],
    Furl: app.globalData.Serverurl,
    isShow:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.selectCourse();
    // this.selectTeacher();
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
    that.setData({
      isShow: true
    })
    if(that.data.tapcurrent==0){
      this.selectCourse();     
    } else if (that.data.tapcurrent == 1){
      this.selectTeacher();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (hasNextPage){
      if (that.data.tapcurrent == 0) {
        this.selectCourseLoad();
      } else if (that.data.tapcurrent == 1) {
        this.selectTeacherLoad();
      }
      that.setData({
        isShow: true
      })
    }else{
      that.setData({
        isShow:false
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  menutap: function (e) {
var that=this;
    this.setData({
      tapcurrent: e.currentTarget.dataset.current
    });
    if (that.data.tapcurrent == 0) {
      this.selectCourse();
    } else if (that.data.tapcurrent == 1) {
      this.selectTeacher();
    }
  },
  gotodetailcourse: function (e) {
    var courseId = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: '../../pages/detailcourse/detailcourse?courseId=' + courseId,
    })
  },
  gotodetailTeacher: function (e) {
    wx.navigateTo({
      url: '../../pages/detailTeacher/detailTeacher?teacherId=' + e.currentTarget.dataset.select,
    })
  },
  gototeacherAppointment: function (e) {
    wx.navigateTo({
      url: '../../pages/teacherAppointment/teacherAppointment?teacherId=' + e.currentTarget.dataset.select,
    })
  },
  //课程数据
  selectCourse:function(){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that=this;
    mine.selectCollectCourseList(limit, app.globalData.openid, page, app.globalData.latitude, app.globalData.longitude,data=>{
     
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      console.log(data.data);
      var temp = data.data;
      for (let i = 0; i < temp.length; i++) {
        temp[i].courseImg = temp[i].courseImg.split(',')[0];
        if ((temp[i].schoolDistance / 1000) < 1) {
          temp[i].newSchoolDistance = parseInt(temp[i].schoolDistance) + "m";
        } else {
          temp[i].newSchoolDistance = (temp[i].schoolDistance / 1000).toFixed(1) + "km";
        }
      }
      that.setData({
        courseList: temp
      });
    },res=>{});
  },
  //课程数据加载
  selectCourseLoad: function () {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    mine.selectCollectCourseList(limit, app.globalData.openid, nextPage, app.globalData.latitude, app.globalData.longitude, data => {

      // 隐藏加载框
      wx.hideLoading();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;

      var newdatas = that.data.courseList;
      var temp = data.data;
      for (let i = 0; i < temp.length; i++) {
        temp[i].courseImg = temp[i].courseImg.split(',')[0];
        if ((temp[i].schoolDistance / 1000) < 1) {
          temp[i].newSchoolDistance = parseInt(temp[i].schoolDistance) + "m";
        } else {
          temp[i].newSchoolDistance = (temp[i].schoolDistance / 1000).toFixed(1) + "km";
        }
        newdatas.push(temp[i]);
      }
      that.setData({
        courseList: newdatas
      });
    }, res => { });
  },
  //教师数据
  selectTeacher: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that=this;
    mine.selectCollectionsTeacher('Fdesc',limit, app.globalData.openid, page, app.globalData.latitude, app.globalData.longitude, data => {
    
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var temp=data.data;
      for(let i=0;i<temp.length;i++){
        if (temp[i].sellCourse != null && temp[i].sellCourse != '') {
          if (temp[i].sellCourse.length == 0) {
            temp[i].hascourse = false;
          } else {
            temp[i].hascourse = true;
          }
        } else {
          temp[i].hascourse = false;
        }
        temp[i].teacherImage = temp[i].teacherImage.split(',')[0];
        if ((temp[i].schoolDistance / 1000) < 1) {
          temp[i].newSchoolDistance = parseInt(temp[i].schoolDistance) + "m";
        } else {
          temp[i].newSchoolDistance = (temp[i].schoolDistance / 1000).toFixed(1) + "km";
        }  
      }
      that.setData({
        teacherList: temp,
      });
    }, res => { });
  },
  //教师数据加载
  selectTeacherLoad: function () {
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    mine.selectCollectionsTeacher('Fdesc', limit, app.globalData.openid, nextPage, app.globalData.latitude, app.globalData.longitude, data => {
    
      // 隐藏加载框
      wx.hideLoading();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var newdatas = that.data.teacherList;
      var temp = data.data;
      for (let i = 0; i < temp.length; i++) {
        if (temp[i].sellCourse != null && temp[i].sellCourse != '') {
          if (temp[i].sellCourse.length == 0) {
            temp[i].hascourse = false;
          } else {
            temp[i].hascourse = true;
          }
        } else {
          temp[i].hascourse = false;
        }
        temp[i].teacherImage = temp[i].teacherImage.split(',')[0];
        if ((temp[i].schoolDistance / 1000) < 1) {
          temp[i].newSchoolDistance = parseInt(temp[i].schoolDistance) + "m";
        } else {
          temp[i].newSchoolDistance = (temp[i].schoolDistance / 1000).toFixed(1) + "km";
        }
        newdatas.push(temp[i]);
      }
      that.setData({
        teacherList: newdatas,
      });
    }, res => { });
  },
})