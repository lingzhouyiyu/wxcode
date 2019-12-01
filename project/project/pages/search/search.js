const util = require('../../utils/util.js')
import {
  IndexModel
} from '../../models/index.js'
let indexModel = new IndexModel()
//刷新参数
var limit = 5;
var currentPage = 1;
var nextPage = 2;
var hasNextPage = false;
var indexcount = 0;
//获取应用实例
const app = getApp()
var currentCategoryId = '';

var histemp = [];
var hastempdata=false;
// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    schoolList: '',
    latitude: '',
    longitude: '',
    Furl: app.globalData.Serverurl,
    footertitle: ['推荐', '中国舞', '街舞', '名族舞', '国画', '篮球', '芭蕾舞', '其他'],
    catalogSelect: "推荐",
    historyList: '',
    historyLists: '',
    isShowhistory: false,
    Fkeyworlds: '',
    hotData:'',
    hotselect:'',
    hasSchool:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      latitude: options.latitude,
      longitude: options.longitude,
      Fkeyworlds: ''
    })
    this.hotSearch();
    //获取课程数据
    this.selectSearchCourse();
    // this.selectCategory();
    //学校数据
    // this.selectIndexSchool(currentCategoryId);
    this.selectHistory();
   
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
    this.selectSearchCourse();
    // this.selectIndexSchool(currentCategoryId);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (hasNextPage) {
      this.selectIndexSchoolBottom(currentCategoryId);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //输入框值变化
  searchSchool: function(e) {
    this.setData({
      Fkeyworlds: e.detail.value.replace(/\s+/g, '')
    })
    // this.changehistory(this.data.Fkeyworlds);
    // this.selectIndexSchool(currentCategoryId);
    this.selectSearchCourse();
  },
  //
  changehistory: function(e) {
    var data = this.data.historyList;
    if(e==''){
      console.log(111);
      // this.selectHistory();
    }else{
      
      histemp = [];
      for (let i = 0; i < data.length; i++) {
        if (e != '' && data[i].keyWorlds.trim().indexOf(e) != -1) {
          console.log('历史记录中包含输入字符串');
          // if (histemp.length>0){
          //   console.log('临时数组长度不为0');
          //   this.hasdata(e).then(res=>{
          //     console.log(res);
          //     if (!res){
          //       histemp.push(data[i]);
          //     }
          //   })
          // }else{
          //   console.log('临时数组长度为0');
          //   histemp.push(data[i]);
          // }  
          histemp.push(data[i]);
        }
      }
      console.log(histemp);
      this.setData({
        historyLists: histemp
      })
    }
  },
  gotoinstitutionAppointment: function (e) {
    wx.navigateTo({
      url: '../../pages/institutionAppointment/institutionAppointment?schoolId=' + e.currentTarget.dataset.select,
    })
  },
  //查找临时数组
  hasdata:function(e){
    return new Promise((resolve, reject) => {
      for (let j = 0; j < histemp.length; j++) {
        if (histemp[j].keyWorlds.trim().indexOf(e) != -1) {
          hastempdata=true;
          break;            
        }else{
          hastempdata = false; 
        }
      }
      resolve(hastempdata);
    })
  },
  //点击确认搜索
  searchSchools: function(e) {
    this.setData({
      Fkeyworlds: e.detail.value.replace(/\s+/g, '')
    })
    this.setData({
      isShowhistory: false
    })
    if (this.data.Fkeyworlds == '') return;
    this.selectIndexSchool(currentCategoryId);
    this.addSearch();
  },
  //获得输入框焦点
  openhistory: function() {
    this.selectHistory();
  },
  //历史记录点击
  historyclick: function(e) {
    this.setData({
      Fkeyworlds: e.currentTarget.dataset.text
    })
    this.setData({
      isShowhistory: false
    })
    this.selectIndexSchool(currentCategoryId);
  },
  //关闭历史记录面板
  closehistory: function() {
    this.setData({
      isShowhistory: false
    })
  },
  //删除全部历史记录
  deleteAll: function() {
    indexModel.deleteAll(app.globalData.openid, data => {
      this.selectHistory();
      this.setData({
        Fkeyworlds: ''
      })
      this.selectIndexSchool(currentCategoryId);
    }, res => {})
  },
  //删除一条历史记录
  deleteAlong: function(e) {
    var id = e.currentTarget.dataset.id;
    var text = e.currentTarget.dataset.text;
    indexModel.deleteAlong(id, app.globalData.openid, data => {
      this.selectHistory();
      if (text == this.data.Fkeyworlds) {
        this.setData({
          Fkeyworlds: ''
        })
      }
      this.selectIndexSchool(currentCategoryId);
    }, res => {})
  },
  //分类选项切换
  tabSelect: function(e) {
    var categoryid = e.currentTarget.dataset.categoryid;
    currentCategoryId = categoryid;
    this.selectIndexSchool(currentCategoryId);
    var that = this;
    that.setData({ //把选中值放入判断值
      catalogSelect: e.currentTarget.dataset.select
    })
  },
  //搜索历史新增
  addSearch: function() {
    var that = this;
    if (that.data.Fkeyworlds == '' || that.data.Fkeyworlds == null) return;
    indexModel.addSearch(that.data.Fkeyworlds, app.globalData.openid, data => {

    }, res => {})
  },
  //获取个人搜索历史纪录
  selectHistory: function() {
    var that = this;
    var historylimit = 5;
    var historypage = 1;
    indexModel.selectHistory(historylimit, historypage, app.globalData.openid, data => {
      this.addcount().then(res => {
        if (data.count == 0 || res == 1) {
          that.setData({
            isShowhistory: false
          })
        } else {
          this.setData({
            isShowhistory: true
          })
        }
        that.setData({
          historyList: data.data
        })
      })
    }, res => {})
  },
  //计数加1
  addcount: function() {
    return new Promise((resolve, reject) => {
      indexcount++;
      resolve(indexcount);
    })
  },
  //所有分类
  selectCategory: function() {
    var that = this;
    indexModel.selectCategory(data => {
      var temparray = data.data;
      temparray.unshift({
        'categoryImage': null,
        'categoryName': '推荐',
        'danceCategoryId': '',
        'parentId': null
      });
      that.setData({
        footertitle: temparray,
      });
    }, res => {});
  },
  //学校详情跳转
  gotodetailinstitution: function(e) {
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
  //学校列表
  selectIndexSchool: function(categoryId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    indexModel.selectIndexSchool(that.data.Fkeyworlds, categoryId, limit, currentPage, this.data.latitude, this.data.longitude, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      var newdatas = data.data;
      console.log(newdatas.length);
      if (newdatas.length==0){
        that.setData({
          hasSchool:false
        })
      } else if (newdatas.length > 0){
        that.setData({
          hasSchool: true
        })
      }
      console.log(that.data.hasSchool);
      for (var i = 0; i < newdatas.length; i++) {
        if (newdatas[i].course != null && newdatas[i].course != '') {
          if (newdatas[i].course.length == 0) {
            newdatas[i].hascourse = false;
          } else {
            newdatas[i].hascourse = true;
          }
        } else {
          newdatas[i].hascourse = false;
        }
        var temparray = [];
        for (var j = 0; j < newdatas[i].course.length; j++) {
          if (j == 2) {
            break;
          } else {
            for (let p = 0; p < newdatas[i].course[j].length; p++) {
              if (newdatas[i].course[j].activePrice != null && newdatas[i].course[j].activePrice != '') {
                newdatas[i].course[j].courseAdvancePayment = newdatas[i].course[j].activePrice;
              }
            }
            temparray.push(newdatas[i].course[j]);
          }
        }
        newdatas[i].newCourse = temparray;
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }
        if (newdatas[i].schoolPicture != '' && newdatas[i].schoolPicture != null) {
          var imgs = newdatas[i].schoolPicture.split(',');
          newdatas[i].schoolPicture = imgs[0];
        } else {
          newdatas[i].schoolPicture = '';
        }
        if (newdatas[i].schoolFlexe == null || newdatas[i].schoolFlexe == '') {
          newdatas[i].schoolFlexe = 0;
        }
      }
      this.setData({
        schoolList: newdatas,
      });
    }, res => {})
  },
  //学校列表上拉加载
  selectIndexSchoolBottom: function(categoryId) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    var temp = that.data.schoolList;
    indexModel.selectIndexSchool(that.data.Fkeyworlds, categoryId, limit, nextPage, this.data.latitude, this.data.longitude, data => {
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      var newdatas = data.data;
      for (var i = 0; i < newdatas.length; i++) {
        if (newdatas[i].course != null && newdatas[i].course != '') {
          if (newdatas[i].course.length == 0) {
            newdatas[i].hascourse = false;
          } else {
            newdatas[i].hascourse = true;
          }
        } else {
          newdatas[i].hascourse = false;
        }
        var temparray = [];
        for (var j = 0; j < newdatas[i].course.length; j++) {
          if (j == 2) {
            break;
          } else {
            for (let p = 0; p < newdatas[i].course[j].length; p++) {
              if (newdatas[i].course[j].activePrice != null && newdatas[i].course[j].activePrice != '') {
                newdatas[i].course[j].courseAdvancePayment = newdatas[i].course[j].activePrice;
              }
            }
            temparray.push(newdatas[i].course[j]);
          }
        }
        newdatas[i].newCourse = temparray;
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }
        if (newdatas[i].schoolPicture != '' && newdatas[i].schoolPicture != null) {
          var imgs = newdatas[i].schoolPicture.split(',');
          newdatas[i].schoolPicture = imgs[0];
        } else {
          newdatas[i].schoolPicture = '';
        }
      }

      for (var i = 0; i < newdatas.length; i++) {
        temp.push(newdatas[i]);
      }
      that.setData({
        schoolList: temp,
      });


      // 隐藏加载框
      wx.hideLoading();
    }, res => {

    })
  },
  //获取热搜数据
  hotSearch:function(){
    indexModel.hotSearch(data=>{
      this.setData({
        hotData:data.data
      })
    },res=>{})
  },
  //热搜选项点击
  hotsearch:function(e){
    this.setData({
      hotselect: e.currentTarget.dataset.id,
      Fkeyworlds: e.currentTarget.dataset.word
    })
    this.selectIndexSchool(currentCategoryId);
    
  },

  //获取课程列表
  selectSearchCourse:function(){
    var that=this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    indexModel.selectSearchCourse(that.data.Fkeyworlds, 'Fasc', 10, 1, '' ,this.data.latitude, this.data.longitude,data=>{
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      var newdatas = data.data;
      for (let i = 0; i < newdatas.length; i++) {
        if (newdatas[i].courseImg != "" && newdatas[i].courseImg != null) {
          newdatas[i].courseImg = newdatas[i].courseImg.split(',')[0];
        }
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }
        // if (newdatas[i].activePrice != null && newdatas[i].activePrice != '') {
        //   newdatas[i].courseAdvancePayment = newdatas[i].activePrice;
        // }
      }
      that.setData({
        hotCourseList: newdatas
      })
      this.selectCategory();
      this.selectIndexSchool(currentCategoryId);
    },res=>{});
  },
})