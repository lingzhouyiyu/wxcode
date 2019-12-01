import {
  DetailTeacher
} from '../../models/detailTeacher.js'

let detailTeacher = new DetailTeacher();
//刷新参数
var limit = 5;
var currentPage = 1;
//获取应用实例
const app = getApp()

// pages/detailTeacher/detailTeacher.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotarray: [],
    schoolList: [],
    teacherData: '',
    Furl: app.globalData.Serverurl,
    teacherName: '',
    teacherJob: '',
    teacherBestWork: '',
    teacherIntroduce: '',
    teacherPhoto: '',
    curseList: [],
    hascategory:false,
    hascourse:false,
    catalogSelect: "推荐",
    schoolSelect:'',
    teacherId:'',
    commentData:[],
    schoolId:'',
    hasComment:true,
    collectionImg:'laoshixin',
    collectionTag:true,
    collectionTxt:'收藏',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      teacherId: options.teacherId,
    });
    var teacherId = options.teacherId;
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {
        that.selectSchoolForTeacher(teacherId);
        that.selectTeacherById(teacherId);
        that.selectCategoryByTeacherId(teacherId);
        that.selectCourseForTeacherById("",teacherId);
        that.selectTeacherCommentList(teacherId);
      })
    } else {
      that.selectSchoolForTeacher(teacherId);
      that.selectTeacherById(teacherId);
      that.selectCategoryByTeacherId(teacherId);
      that.selectCourseForTeacherById("",teacherId);
      that.selectTeacherCommentList(teacherId);
    }
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
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  gototeacherdata: function(e) {
    var that = this;
    var data = {
      teacherName: that.data.teacherName,
      teacherJob: that.data.teacherJob,
      teacherBestWork: that.data.teacherBestWork,
      teacherIntroduce: that.data.teacherIntroduce,
      teacherPhoto: that.data.teacherPhoto
    }
    wx.setStorageSync('teacherData', data)
    wx.navigateTo({
      url: '../../pages/teacherdata/teacherdata',
    })
  },
  gototeachercert: function(e) {
    var teacherCertificates = e.currentTarget.dataset.teachercertificates;
    wx.setStorageSync('teacherCertificates', teacherCertificates)
    wx.navigateTo({
      url: '../../pages/teachercert/teachercert',
    })
  },
  gototeacherhonor: function(e) {
    var teacherHonor = e.currentTarget.dataset.teacherhonor;
    wx.navigateTo({
      url: '../../pages/teacherhonor/teacherhonor?teacherHonor=' + teacherHonor,
    })
  },
  gototeacherAppointment: function() {
    var that=this;
    wx.navigateTo({
      url: '../../pages/teacherAppointment/teacherAppointment?teacherId=' + that.data.teacherId,
    })
  },
  tabSelect: function (e) {
    var that = this;
    var categoryId = e.currentTarget.dataset.categoryid;

    that.selectCourseForTeacherById(categoryId,that.data.teacherId);
    that.setData({ //把选中值放入判断值
      catalogSelect: e.currentTarget.dataset.select
    })
  },
  gotodetailinstitution: function (e) {
    var that = this;
    that.setData({
      schoolSelect: e.currentTarget.dataset.select
    });
   
    wx.navigateTo({
      url: '../../pages/detailinstitution/detailinstitution?schoolId=' + that.data.schoolSelect,
    })
  },
  gotodetailcourse: function (e) {
    var courseId = e.currentTarget.dataset.courseid;
 
    wx.navigateTo({
      url: '../../pages/detailcourse/detailcourse?courseId=' + courseId,
    })
  },
  //获取学校列表
  selectSchoolForTeacher: function(teacherId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailTeacher.selectSchoolForTeacher(teacherId, app.globalData.latitude, app.globalData.longitude, data => {
     
      var newdatas = data.data;
      for (var i = 0; i < newdatas.length; i++) {
        
        if (newdatas[i].course != null && newdatas[i].course != ''){
          if (newdatas[i].course.length == 0) {
            newdatas[i].hascourse = false;
          } else {
            newdatas[i].hascourse = true;
          }
        }else{
          newdatas[i].hascourse = false; 
        }      
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }
        if (newdatas[i].schoolPicture != '' && newdatas[i].schoolPicture!=null){
          var imgs = newdatas[i].schoolPicture.split(',');
          newdatas[i].schoolPicture = imgs[0];
        }else{
          newdatas[i].schoolPicture = '';
        }
       
      }
      var temp = [];
      if (newdatas.length>2){
        for (let i = 0; i < 2; i++) {
          temp.push(newdatas[i]);
        }
        that.setData({
          schoolList: temp,
        });
      }else{
        that.setData({
          schoolList: newdatas,
        });
      }
      
      var idStr='';
      for(let j=0;j<data.data.length;j++){

        idStr = idStr+data.data[j].schoolId+',';     
      }

      that.setData({
        schoolId: idStr.substring(0, idStr.length-1),
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => {});
  },
  //获取老师数据
  selectTeacherById: function(teacherId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailTeacher.selectTeacherById( app.globalData.openid,teacherId, data => {
     
      if (data.data.collectCount>0){
        that.setData({
          collectionImg: 'laoshixin',
          collectionTag: false,
          collectionTxt: '已收藏'
        });
      }
      if (data.data.teacherAge == null || data.data.teacherAge==''){
        data.data.teacherAge=1;
      }
      that.setData({
        teacherData: data.data,
        teacherName: data.data.teacherName,
        teacherJob: data.data.teacherJob,
        teacherBestWork: data.data.teacherBestWork,
        teacherIntroduce: data.data.teacherIntroduce,
        teacherPhoto: data.data.teacherPhoto
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => {});
  },
  //获取分类
  selectCategoryByTeacherId: function(teacherId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailTeacher.selectCategoryByTeacherId(teacherId, data => {
     
      var temp=data.data;
      temp.unshift({categoryId: "", categoryName: "推荐"}); 
      if(data.data.length>0){
        that.setData({
          hotarray: temp,
          hascategory:false,
        });
      }else{
        that.setData({
          hascategory: true,
        });
      }
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => {});
  },
  //获取课程列表
  selectCourseForTeacherById: function (categoryId,teacherId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailTeacher.selectCourseForTeacherById(categoryId,limit, currentPage, teacherId, app.globalData.latitude, app.globalData.longitude, data => {
     
      var newdatas = data.data;
      for (var i = 0; i < newdatas.length; i++) {
       //距离转换
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }
        //图片专换
        if (newdatas[i].courseImg != '' && newdatas[i].courseImg != null) {
          var imgs = newdatas[i].courseImg.split(',');
          newdatas[i].courseImg = imgs[0];
        } else {
          newdatas[i].courseImg = '';
        }
        if (newdatas[i].activePrice != null && newdatas[i].activePrice != '') {
          newdatas[i].courseAdvancePayment = newdatas[i].activePrice;
        }
      }
      if (newdatas.length>0){
        if (newdatas.length>3){
          var temp = [];
          for (let i = 0; i < 3; i++) {
            temp.push(newdatas[i]);
          }
          that.setData({
            curseList: temp,
            hascourse: false,
          });
        }else{
          that.setData({
            curseList: newdatas,
            hascourse: false,
          });
        }
        
      }else{
        that.setData({
          hascourse: true,
        });
      }  
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();    
    }, res => {});
  },
  //获取教师评论列表
  selectTeacherCommentList: function (teacherId){
    var that=this;
    var limit=5;
    var page=1;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailTeacher.selectTeacherCommentList(limit, page, teacherId,data=>{

      if(data.data.length>0){
        that.setData({
          hasComment:false,
        });
      }else{
        that.setData({
          hasComment: true,
        });
      }
      var temparray=data.data;
      for(let i=0;i<temparray.length;i++){
        if (temparray[i].picture != "" && temparray[i].picture != null){
          temparray[i].imgarray = temparray[i].picture.substring(0, temparray[i].picture.length - 1).split(',');
        }else{
          temparray[i].imgarray=[];
        }
        if (temparray[i].nickPicture == "" || temparray[i].nickPicture == null) {
          temparray[i].nickPicture = '../../images/avatarImg.png';
        } else if (temparray[i].nickPicture.substring(0, 6) == '/image') {
          temparray[i].nickPicture = that.data.Furl + temparray[i].nickPicture;
        } 
        if (temparray[i].nickName == "" || temparray[i].nickName == null) {
          temparray[i].nickName = '匿名';
        }
        switch (temparray[i].teacherScore) {
          case 1:
            temparray[i].starArray = ["star", "stars", "stars", "stars", "stars"];           
            break;
          case 2:
            temparray[i].starArray = ["star", "star", "stars", "stars", "stars"];               
            break;
          case 3:
            temparray[i].starArray = ["star", "star", "star", "stars", "stars"];              
            break;
          case 4:
            temparray[i].starArray = ["star", "star", "star", "star", "stars"];   
             break;
          case 5:
            temparray[i].starArray = ["star", "star", "star", "star", "star"];             
            break;
          default:
            temparray[i].starArray = ["star", "star", "star", "star", "star"];              
            break;
        };
        if (temparray[i].createTime != null && temparray[i].createTime != '') {
          temparray[i].newtime = temparray[i].createTime.substring(0, 10);
        }
        else {
          temparray[i].newtime = '2018-11-23';
        }
      }
      that.setData({
        commentData: temparray,
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    },res=>{});
  },
  //收藏
  teacherCollection:function(){
    var that=this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();    
    if (that.data.collectionTag){
      detailTeacher.addWxTeacherCollection(app.globalData.openid, that.data.schoolId, that.data.teacherId, data => {
       
        that.setData({
          collectionImg:'laoshixin',
          collectionTag:false,
          collectionTxt:'已收藏'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
      }, res => { });
    }else{
      detailTeacher.cancelWxTeacherCollection(app.globalData.openid, that.data.teacherId, data => {
       
        that.setData({
          collectionImg: 'laoshixin',
          collectionTag: true,
          collectionTxt: '收藏'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
      }, res => { });
    }    
  },
})