import {
  Activity
} from '../../models/activity.js'

let activity = new Activity();
var WxParse = require('../../wxParse/wxParse.js');
//参数
var limit=10;
var page=1;
var Forder='Fdesc';
var fdistance='';
var categoryId='';
var hasNextPage=false;
var nextPage=2;
//获取应用实例
const app = getApp();
// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    selectIndex: 0,//智能排序选中标志
    titleselect: '0',//标题选中
    cateOneselect: '0',//全部项目一级分类选中
    cateTwoselect: '',//全部项目二级分类选中
    diseOneselect: '附近',//距离一级分类选中
    diseTwoselect: '1000m',//距离二级分类选中
    IntelligenceTag: false,//智能排序面板
    AllTag: false, //全部项目面板
    distanceTag: false, //距离面板
    IntelligenceList: ['智能排序', '离我最近', '案例数', '满意度', '咨询量', '访问量',],
    Allarray: ['热门项目', '舞蹈', '声乐', '播音', '乐器', '运动', '跆拳道', '瑜伽', '绘画', '吉他',],
    Allitems: ['中国舞', '民族舞', '钢琴', '跆拳道', '瑜伽', '绘画', '吉他',],
    Distancearray: ['附近'],
    disitem: ['1000m', '3000m', '5000m', '10000m', '20000m', '50000m',],
    imgData: [],
    Furl: app.globalData.Serverurl,
    activeId:'',
    ordertext:'正序',
    categorytext:'分类',
    distancetext:'距离'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      activeId: options.activeId
    })
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {
        that.selectActiveById(options.activeId, options.activeType);
        that.getTree();     
      })
    } else {
      that.selectActiveById(options.activeId, options.activeType);
      that.getTree();
    }
    //获取课程数据
    that.selectMadeCourse(fdistance, categoryId, options.activeId);
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
    //获取课程数据
    that.selectMadeCourse(fdistance, categoryId, that.data.activeId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (hasNextPage){
      that.selectMadeCourseLoad(fdistance, categoryId, that.data.activeId);
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
  SelectIntelligence: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      selectIndex: e.currentTarget.dataset.select,
      IntelligenceTag: false,
    })
  },
  //全部项目点击事件
  selecttitleone: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      titleselect: e.currentTarget.dataset.select,
      AllTag: !this.data.AllTag,
      IntelligenceTag: false,
      distanceTag: false,
    })
  },
  //距离点击事件
  selecttitletwo: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      titleselect: e.currentTarget.dataset.select,
      distanceTag: !this.data.distanceTag,
      IntelligenceTag: false,
      AllTag: false,
    })

  },
  //智能排序点击事件
  selecttitlethree: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      titleselect: e.currentTarget.dataset.select,
      IntelligenceTag: !this.data.IntelligenceTag,
      AllTag: false,
      distanceTag: false,
    })
    if (that.data.IntelligenceTag){
      that.setData({
        ordertext:'倒序'
      })
      Forder='Fasc';
      that.selectMadeCourse(fdistance, categoryId, that.data.activeId);
    }else{
      that.setData({
        ordertext: '正序'
      })
      Forder = 'Fdesc';
      that.selectMadeCourse(fdistance, categoryId, that.data.activeId);
    }
  },
  //全部项目二级分类选中事件
  tapcateTwoselect: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      cateTwoselect: e.currentTarget.dataset.select,
      AllTag: false,
      categorytext: e.currentTarget.dataset.select
    })
    categoryId = e.currentTarget.dataset.id;
    that.selectMadeCourse(fdistance, categoryId, that.data.activeId);
  },
  //全部项目一级分类选中事件
  tapcateOneselect: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      cateOneselect: e.currentTarget.dataset.select,
    })
  },
  //距离二级分类选中事件
  disTwoselect: function (e) {
    var that = this;
    var distance = e.currentTarget.dataset.select;
    that.setData({//把选中值放入判断值
      diseTwoselect: distance,
      distanceTag: false,
      distancetext: e.currentTarget.dataset.select
    })
    fdistance = distance.substring(0, distance.length-1);
    that.selectMadeCourse(fdistance, categoryId, that.data.activeId);
  },
  //距离一级分类选中事件
  disOneselect: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
        diseOneselect: e.currentTarget.dataset.select,
    })
  },
  //获取轮播图详情
  selectActiveById: function (activeId, activeType) {
    var that = this;
    activity.selectActiveById(activeId, activeType, data => {
     
      that.setData({
        imgData: data.data.imgurl.split(','),
      });
      WxParse.wxParse('schoolIntroduce', 'html', data.data.contxt, that, 0);
    }, res => { });
  },
  //获取全部分类
  getTree: function () {
    var that=this;
    activity.getTree(data => {    
      that.setData({
        Allarray: data,
      });
     
    }, res => {});
  },
  //获取课程详情
  selectMadeCourse: function (fdistance,categoryId,activeId){
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    activity.selectMadeCourse(fdistance,categoryId,Forder, activeId, limit, page, app.globalData.latitude, app.globalData.longitude,data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;

      var newdatas=data.data;
      for(let i=0;i<newdatas.length;i++){
        newdatas[i].courseImg = newdatas[i].courseImg.split(',')[0];
        if (newdatas[i].activeId != '' && newdatas[i].activeId != null){       
          newdatas[i].courseAdvancePayment = newdatas[i].activePrice;
        }
      }
      that.setData({
        array: newdatas,
      });
    }, res => { });
  },
  //课程详情上拉加载
  selectMadeCourseLoad: function (fdistance, categoryId, activeId) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    activity.selectMadeCourse(fdistance, categoryId, Forder, activeId, limit, nextPage, app.globalData.latitude, app.globalData.longitude, data => {
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var temparray = that.data.array;
      var newdatas = data.data;
      for (let i = 0; i < newdatas.length; i++) {
        newdatas[i].courseImg = newdatas[i].courseImg.split(',')[0];
        if (newdatas[i].activeId != '' && newdatas[i].activeId != null) {
          newdatas[i].courseAdvancePayment = newdatas[i].activePrice;
        }
      }
      for (let i = 0; i < newdatas.length; i++) {      
        temparray.push(newdatas[i]);
      }

      that.setData({
        array: temparray,
      });

      // 隐藏加载框
      wx.hideLoading();
    }, res => { });
  },
})