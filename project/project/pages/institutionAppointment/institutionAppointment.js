import {
  Detailinstitution
} from '../../models/detailinstitution.js'

let detailinstitution = new Detailinstitution();
//刷新参数
var limit = 6;
var currentPage = 1;
var hasNextPage = true;
var nextPage = 1;
//获取应用实例
const app = getApp()
// pages/teacherAppointment/teacherAppointment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotarray: [],
    array: [],
    schoolId : '',
    catalogSelect: "推荐",
    categoryId: "",
    islast: true,
    hascourse: false,
    hascategory: false,
    Furl: app.globalData.Serverurl,
    pullTips:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
    that.setData({
      schoolId : options.schoolId ,
    });
    var schoolId  = options.schoolId ;
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {

        that.selectCategoryBySchoolId (schoolId );
        that.selectCourseForSchool("", schoolId );
      })
    } else {

      that.selectCategoryBySchoolId (schoolId );
      that.selectCourseForSchool("", schoolId );
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.selectCourseForSchool(this.data.categoryId, this.data.schoolId );

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    var that = this;
    if (hasNextPage) {
      that.setData({
        pullTips: true,
      });
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      });
      that.selectCourseForSchoolLoad(this.data.categoryId, this.data.schoolId );
    }else{
      that.setData({
        pullTips:false,
      });
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gotodetailcourse: function (e) {
    var courseId = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: '../../pages/detailcourse/detailcourse?courseId=' + courseId,
    })
  },
  tabSelect: function (e) {
    var that = this;
    var categoryId = e.currentTarget.dataset.categoryid;
    that.selectCourseForSchool(categoryId, that.data.schoolId );
    that.setData({ //把选中值放入判断值
      catalogSelect: e.currentTarget.dataset.select,
      categoryId: categoryId
    })
  },
  //获取分类
  selectCategoryBySchoolId : function (schoolId ) {
    var that = this;
    detailinstitution.selectCategoryBySchoolId (schoolId , data => {
      // console.log(data);
      var temp = data.data;
      
      if (data.data.length > 0) {
        temp.unshift({
          categoryId: "",
          categoryName: "推荐"
        });
        that.setData({
          hotarray: temp,
          hascategory: false,
        });
      } else {
        that.setData({
          hascategory: true,
        });
      }
     
    }, res => { });
  },
  //获取课程列表
  selectCourseForSchool: function (categoryId, schoolId ) {
    var that = this;
    detailinstitution.selectCourseForSchool(categoryId, limit, currentPage, schoolId , app.globalData.latitude, app.globalData.longitude, data => {
      // console.log(data);
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      that.setData({
        islast: true,
      });
      var newdatas=data.data;
      for (let i = 0; i < newdatas.length;i++){
        if (newdatas[i].courseImg != '' || newdatas[i].courseImg!=null){
          newdatas[i].courseImg = newdatas[i].courseImg.split(',')[0];
        } 
        if (newdatas[i].activePrice != null && newdatas[i].activePrice != '') {
          newdatas[i].courseAdvancePayment = newdatas[i].activePrice;
        }     
      }
      if (newdatas.length > 0) {
        hasNextPage = data.hasNextPage;
        nextPage = data.nextPage;
        that.setData({
          array: newdatas,
          hascourse: false,
        });
      } else {
        that.setData({
          hascourse: true,
        });
      }
   
    }, res => { });
  },
  //课程列表上拉加载
  selectCourseForSchoolLoad: function (categoryId, schoolId ) {
    var that = this;
    detailinstitution.selectCourseForSchool(categoryId, limit, nextPage, schoolId , app.globalData.latitude, app.globalData.longitude, data => {

      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      that.setData({
        islast: data.hasNextPage,
      });
      var newdatas = data.data;
      for (let i = 0; i < newdatas.length; i++) {
        if (newdatas[i].courseImg != '' || newdatas[i].courseImg != null) {
          newdatas[i].courseImg = newdatas[i].courseImg.split(',')[0];
        }
      }
      if (newdatas.length > 0) {
        var temp = that.data.array;
        for (var i = 0; i < newdatas.length; i++) {
          temp.push(newdatas[i]);
        }
        that.setData({
          array: temp,
        });
      }
      // 隐藏加载框
      wx.hideLoading();
      // console.log(that.data.array.length);
    }, res => { });
  }
})