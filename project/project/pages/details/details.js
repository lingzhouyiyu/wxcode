import {
  DetailModel
} from '../../models/detail.js'
let detailModel = new DetailModel()
//刷新参数
var limit = 5;
var currentPage = 1;
var hasNextPage=false;
var nextPage=0;
//获取应用实例
const app = getApp();
//搜索关键字
var Fkeyworlds = "";
var Forder = "Fasc";
var orderStatus=true;
// pages/details/details.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectTag: '0',
    selectTags: '0',
    array: ['1','2','3'],
    schoolList:[],
    Furl: app.globalData.Serverurl,
    region: [],
    schoolAddress:"昆明市",
    hotCourseList:[],
    teacherList:[],
    Distancearray: ['附近'],
    disitem: ['不限','1000m', '3000m', '5000m', '10000m', '15000m', '30000m'],
    diseOneselect: '附近',//距离一级分类选中
    diseTwoselect: '距离',//距离二级分类选中
    distancetag:true,
    CategoryId:"",
    Fdistance:'1000',
    address:'昆明市',
    optionselect1:false,
    optionselect2: false,
    optionselect3: false,
    areaTag:false,
    Areadata:'',
    areaTitle:'商圈',
    areaLatitude:'',
    areaLongitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var danceCategoryId = options.danceCategoryId;
   
    var that=this;
    Fkeyworlds='';
    that.setData({
      CategoryId: options.danceCategoryId,
      // Fdistance: that.data.diseTwoselect.substring(0, that.data.diseTwoselect.length - 1),
      // address: app.globalData.address,
      Fdistance:''
    });

    var temp=[];
    temp.push('云南省');
    temp.push(that.data.address);
    that.setData({
      region: temp,
    });
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {
        that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
        that.selectShopArea();    
      })
    } else {
      that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);    
      that.selectShopArea();
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

    var that=this;
    if(that.data.areaTitle=='商圈'||that.data.areaTitle=='不限'){
      if (that.data.selectTag == 0) {
        that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
      } else if (that.data.selectTag == 1) {
        that.selectCategoryTeacher(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
      } else if (that.data.selectTag == 2) {
        that.selectForCategoryHotCourse(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
      }
    }else{
      if (that.data.selectTag == 0) {
        that.selectSchoolForCategory(that.data.CategoryId, that.data.areaLatitude, that.data.areaLongitude);
      } else if (that.data.selectTag == 1) {
        that.selectCategoryTeacher(that.data.CategoryId, that.data.areaLatitude, that.data.areaLongitude);
      } else if (that.data.selectTag == 2) {
        that.selectForCategoryHotCourse(that.data.CategoryId, that.data.areaLatitude, that.data.areaLongitude);
      }
    }
   
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
   
    var that = this;
    if (hasNextPage){
      // 显示加载图标
      wx.showLoading({
        title: '玩命加载中',
      })
      if (that.data.areaTitle == '商圈' || that.data.areaTitle == '不限') {

        if (that.data.selectTag == 0) {
          that.selectSchoolForCategoryLoad(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
        } else if (that.data.selectTag == 1) {
          that.selectCategoryTeacherLoad(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
        } else if (that.data.selectTag == 2) {
          that.selectForCategoryHotCourseLoad(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
        }
      } else {

        if (that.data.selectTag == 0) {
          that.selectSchoolForCategoryLoad(that.data.CategoryId, that.data.areaLatitude, that.data.areaLongitude);
        } else if (that.data.selectTag == 1) {
          that.selectCategoryTeacherLoad(that.data.CategoryId, that.data.areaLatitude, that.data.areaLongitude);
        } else if (that.data.selectTag == 2) {
          that.selectForCategoryHotCourseLoad(that.data.CategoryId, that.data.areaLatitude, that.data.areaLongitude);
        }
      }
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  searchdata: function (e) {
    var that = this;
    Fkeyworlds = e.detail.value.replace(/\s+/g, '');
 
    if (that.data.selectTag == 0) {
      that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    } else if (that.data.selectTag == 1) {
      that.selectCategoryTeacher(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    } else if (that.data.selectTag == 2) {
      that.selectForCategoryHotCourse(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    }
  },
  //距离二级分类选中事件
  disTwoselect: function (e) {
    var that = this;
    var distance = e.currentTarget.dataset.select;
    that.setData({//把选中值放入判断值
      diseTwoselect: e.currentTarget.dataset.select,
      Fdistance: distance.substring(0, distance.length - 1),
      optionselect2: !that.data.optionselect2
    })
    if (distance=='不限'){
      that.setData({
        Fdistance:''
      })
    }
    that.setData({
      distancetag: true,
    });
    
    if (that.data.selectTag == 0) {
      that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    } else if (that.data.selectTag == 2) {
      that.selectForCategoryHotCourse(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    }
  },
  //距离一级分类选中事件
  disOneselect: function (e) {
    var that = this;
    that.setData({//把选中值放入判断值
      diseOneselect: e.currentTarget.dataset.select,
    })
  },
  selectitem: function(e) {
    var that = this;
    that.setData({ //把选中值放入判断值
      selectTag: e.currentTarget.dataset.select,
      selectTags:'0',     
    });
    var that=this;
    if (that.data.selectTag == 0) {
      that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    } else if (that.data.selectTag == 1) {
      that.selectCategoryTeacher(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    } else if (that.data.selectTag == 2) {
      that.selectForCategoryHotCourse(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    }
  },
  selectitems: function(e) {
    var that = this;
    var tags = e.currentTarget.dataset.select;
    if (tags==1){
      that.setData({
        distancetag: !that.data.distancetag,
      });
    }else{
      that.setData({
        distancetag: true,        
      });
    }
    that.setData({ //把选中值放入判断值
      selectTags: e.currentTarget.dataset.select,
    })

    
    if (tags == 2){
      orderStatus = !orderStatus;
    }else{
      that.setData({
        areaTag: false,
      });
    }
    // if (orderStatus==true){
    //   Forder ="Fasc";
    // }else{
    //   Forder = "Fdesc";
    // }
   

    if (that.data.selectTags == 0){
      that.setData({
        optionselect1: !that.data.optionselect1
      });
    } else if (that.data.selectTags == 1){
      that.setData({
        optionselect2: !that.data.optionselect2
      });
    } else if (that.data.selectTags == 2){
      that.setData({
        optionselect3: !that.data.optionselect3,
        areaTag: !that.data.areaTag
      });
    }
    //正序倒序请求数据
    // if (that.data.selectTags == 2){
    //   if (that.data.selectTag == 0) {
    //     that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    //   } else if (that.data.selectTag == 1) {
    //     that.selectCategoryTeacher(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    //   } else if (that.data.selectTag == 2) {
    //     that.selectForCategoryHotCourse(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    //   }
    // }


  },
  //商圈搜索
  searchArea:function(e){
    var that=this;
    var latitude = e.currentTarget.dataset.latitude;
    var longitude = e.currentTarget.dataset.longitude;
    var name = e.currentTarget.dataset.name;
    that.setData({
      areaTag: false,   
      areaTitle:name,
      areaLatitude: latitude,
      areaLongitude: longitude   
    });
    if (name=='不限'){
    
      if (that.data.selectTag == 0) {
        that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
      } else if (that.data.selectTag == 1) {
        that.selectCategoryTeacher(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
      } else if (that.data.selectTag == 2) {
        that.selectForCategoryHotCourse(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
      }
    }else{
    
      if (that.data.selectTag == 0) {
        that.selectSchoolForCategory(that.data.CategoryId, latitude, longitude);
      } else if (that.data.selectTag == 1) {
        that.selectCategoryTeacher(that.data.CategoryId, latitude, longitude);
      } else if (that.data.selectTag == 2) {
        that.selectForCategoryHotCourse(that.data.CategoryId, latitude, longitude);
      }
    }
 
  },
  bindRegionChange: function (e) {
   var that=this;
    this.setData({
      region: e.detail.value,
      schoolAddress: e.detail.value[1],
      optionselect1: !that.data.optionselect1
    })
   
    if (that.data.selectTag == 0) {
      that.selectSchoolForCategory(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    } else if (that.data.selectTag == 1) {
      that.selectCategoryTeacher(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    } else if (that.data.selectTag == 2) {
      that.selectForCategoryHotCourse(that.data.CategoryId, app.globalData.latitude, app.globalData.longitude);
    }
  },
  gotodetailinstitution: function (e) {
    wx.navigateTo({
      url: '../../pages/detailinstitution/detailinstitution?schoolId=' + e.currentTarget.dataset.select,
    })
  },
  gotodetailcourse: function (e) {
    var courseId = e.currentTarget.dataset.courseid;

    wx.navigateTo({
      url: '../../pages/detailcourse/detailcourse?courseId=' + courseId,
    })
  },
  gotoinstitutionAppointment: function (e) {
    wx.navigateTo({
      url: '../../pages/institutionAppointment/institutionAppointment?schoolId=' + e.currentTarget.dataset.select,
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
  gotodetailcourse: function (e) {
    var courseId = e.currentTarget.dataset.courseid;
    wx.navigateTo({
      url: '../../pages/detailcourse/detailcourse?courseId=' + courseId,
    })
  },
  //获取学校列表
  selectSchoolForCategory: function (danceCategoryId, latitude, longitude){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that=this;
    detailModel.selectSchoolForCategory(that.data.schoolAddress, that.data.Fdistance, Fkeyworlds, Forder, danceCategoryId,limit, currentPage, latitude, longitude, data => {
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
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
      that.setData({
        schoolList: newdatas,
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh(); 
      
    }, res => { })
  },
  //学校列表上拉加载
  selectSchoolForCategoryLoad: function (danceCategoryId, latitude, longitude) {

    var that = this;
    detailModel.selectSchoolForCategory(that.data.schoolAddress, that.data.Fdistance, Fkeyworlds, Forder, danceCategoryId, limit, nextPage, latitude, longitude, data => {
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
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
      var temp = that.data.schoolList;
      for (let i = 0; i < newdatas.length;i++){
        temp.push(newdatas[i]);
      }
      that.setData({
        schoolList: temp,
      });
      // 隐藏加载框
      wx.hideLoading();
      
    }, res => { })
  },
  //获取热门课程
  selectForCategoryHotCourse: function (danceCategoryId, latitude, longitude){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that=this;
    detailModel.selectForCategoryHotCourse(that.data.Fdistance, Fkeyworlds, Forder, danceCategoryId, limit, currentPage, this.data.schoolAddress,latitude, longitude,data=>{
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var newdatas=data.data;
      for(let i=0;i<newdatas.length;i++){
        if (newdatas[i].courseImg != "" && newdatas[i].courseImg != null) {
          newdatas[i].courseImg = newdatas[i].courseImg.split(',')[0];
        }
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }  
        if (newdatas[i].activePrice != null && newdatas[i].activePrice != '') {
          newdatas[i].courseAdvancePayment = newdatas[i].activePrice;
        }
      }
      that.setData({
        hotCourseList: newdatas,
      });
     
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    },res=>{});
  },
  //热门课程上拉加载
  selectForCategoryHotCourseLoad: function (danceCategoryId, latitude, longitude) {
    var that = this;
    detailModel.selectForCategoryHotCourse(that.data.Fdistance, Fkeyworlds, Forder, danceCategoryId, limit, nextPage, this.data.schoolAddress, latitude, longitude, data => {
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var temp = that.data.hotCourseList;
      for (let i = 0; i < data.data.length; i++) {
        temp.push(data.data[i]);
      }
      
      var newdatas = temp;
      for (let i = 0; i < newdatas.length; i++) {
        if (newdatas[i].courseImg != "" && newdatas[i].courseImg != null) {
          newdatas[i].courseImg = newdatas[i].courseImg.split(',')[0];
        }
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }
      }
      that.setData({
        hotCourseList: newdatas,
      });
      // 隐藏加载框
      wx.hideLoading();
    }, res => { });
  },
  //获取教师列表
  selectCategoryTeacher: function (danceCategoryId, latitude, longitude){
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that=this;
    detailModel.selectCategoryTeacher(this.data.schoolAddress, Fkeyworlds, danceCategoryId, Forder, limit, currentPage,latitude, longitude,data=>{
      
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var newdatas=data.data;
      for(let i=0;i<newdatas.length;i++){
        if (newdatas[i].sellCourse != null && newdatas[i].sellCourse != '') {
          if (newdatas[i].sellCourse.length == 0) {
            newdatas[i].hascourse = false;
          } else {
            newdatas[i].hascourse = true;
          }
        } else {
          newdatas[i].hascourse = false;
        }
        if (newdatas[i].teacherImage != "" && newdatas[i].teacherImage!=null){
          newdatas[i].teacherImage = newdatas[i].teacherImage.split(',')[0];
        }
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }   
      }
      that.setData({
        teacherList: newdatas,
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    },res=>{});
  },
  //教师列表上拉加载
  selectCategoryTeacherLoad: function (danceCategoryId, latitude, longitude) {
    var that = this;
    detailModel.selectCategoryTeacher(this.data.schoolAddress, Fkeyworlds, danceCategoryId, Forder, limit, nextPage, latitude, longitude, data => {
     
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var temp = that.data.teacherList;
      for (let i = 0; i < data.data.length; i++) {
        temp.push(data.data[i]);
      }
      var newdatas = temp;
      for (let i = 0; i < newdatas.length; i++) {
       
        if (newdatas[i].sellCourse != null && newdatas[i].sellCourse != '') {
          if (newdatas[i].sellCourse.length == 0) {
            newdatas[i].hascourse = false;
          } else {
            newdatas[i].hascourse = true;
          }
        } else {
          newdatas[i].hascourse = false;
        }
        if (newdatas[i].teacherImage != "" && newdatas[i].teacherImage != null) {
          newdatas[i].teacherImage = newdatas[i].teacherImage.split(',')[0];
        }
        if ((newdatas[i].schoolDistance / 1000) < 1) {
          newdatas[i].newSchoolDistance = parseInt(newdatas[i].schoolDistance) + "m";
        } else {
          newdatas[i].newSchoolDistance = (newdatas[i].schoolDistance / 1000).toFixed(1) + "km";
        }   
      }
      that.setData({
        teacherList: newdatas,
      });
      // 隐藏加载框
      wx.hideLoading();
    }, res => { });
  },
  //获取商圈数据
  selectShopArea:function(){
    var limit=10;
    var page=1;
    detailModel.selectShopArea(limit,page,data=>{
     
      data.data.unshift({
        areaName:'不限',
        createTime: '',
        id: '',
        schoolLatitude: '',
        schoolLongitude: '',
      });
      this.setData({
        Areadata:data.data
      })
    },res=>{})
  }
})