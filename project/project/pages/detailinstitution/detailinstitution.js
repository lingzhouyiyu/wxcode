import{
  Detailinstitution
}from '../../models/detailinstitution.js'
let detailinstitution = new Detailinstitution();

var WxParse=require('../../wxParse/wxParse.js');

//获取应用实例
const app=getApp();

var sessionfromData=[];

// pages/detailinstitution/detailinstitution.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    footertitle: ['推荐', '中国舞', '街舞', '名族舞', '国画', '篮球', '芭蕾舞', '其他'],
    catalogSelect: "推荐",
    recmendarray: [],
    teacherarray: [],
    introduceSelect:'0',
    hotarray: ['全部', '好评', '耐心尽责', '放松舒服', '老师技术好', '服务热情周到', '值得信赖', '幽默',],
    Furl: app.globalData.Serverurl,
    schoolName: '',
    schoolAddress: '',
    schoolPicture: '',
    schoolIntroduce: '',
    schoolEnvironment: '',
    teacherCount: '',
    hascategory:false,
    hascourse:false,
    schoolId :'',
    schoolData:'',
    teacherCount:'',
    hasTeacher:true,
    commentData:[],
    schoolLatitude:'',
    schoolLongitude:'',
    hasmessage: true,
    sessionfrom:'哈哈哈哈哈哈哈哈',//客服消息参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    var schoolId = options.schoolId;
    this.setData({
      schoolId: schoolId,
    });
    //客服消息参数
    sessionfromData=[],
    sessionfromData.push({'schoolId':options.schoolId});
    sessionfromData.push({'openId':app.globalData.openid});
    this.setData({
      sessionfrom: JSON.stringify(sessionfromData),
    })

    //获取学校课程
    this.selectCourseForSchool("",schoolId);
    //获取学校数据
    this.selectSchoolMainById(schoolId);

    //获取分类
    this.selectCategoryBySchoolId(schoolId);
    //获取教师团队
    this.selectTeacherBySchoolId(schoolId);
    //学校评论
    this.selectSchoolCommentList(schoolId);
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
  tabSelect: function (e) {
    var categoryId = e.currentTarget.dataset.categoryid;
    this.selectCourseForSchool(categoryId, this.data.schoolId);
    var that = this;
    that.setData({ //把选中值放入判断值
      catalogSelect: e.currentTarget.dataset.select
    })
  },
  introduce_item_switch:function(e){
    var that = this;
    that.setData({ //把选中值放入判断值
      introduceSelect: e.currentTarget.dataset.select
    })
  },
 
  gotodetailcourse:function(e){
    var courseId = e.currentTarget.dataset.courseid;

    wx.navigateTo({
      url: '../../pages/detailcourse/detailcourse?courseId=' + courseId,
    })
  },
  gotoinstitutionAppointment:function(){
    var that=this;
    wx.navigateTo({
      url: '../../pages/institutionAppointment/institutionAppointment?schoolId=' + that.data.schoolId ,
    })

  },
//获取学校课程
  selectCourseForSchool: function (categoryID,schoolId){
    var that=this;
    var limit=5;
    var page=1;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectCourseForSchool(categoryID,limit, page, schoolId, app.globalData.latitude, app.globalData.longitude,data=>{
      if (data.data.length>0){
        var newdata = data.data;
        for (let j = 0; j < newdata.length; j++) {
          //图片转化
          var imgs = newdata[j].courseImg.split(',');
          newdata[j].newcourseImg = imgs[0];
          //距离转化
          if ((newdata[j].schoolDistance / 1000) < 1) {
            newdata[j].newSchoolDistance = parseInt(newdata[j].schoolDistance) + "m";
          } else {
            newdata[j].newSchoolDistance = (newdata[j].schoolDistance / 1000).toFixed(1) + "km";
          }   
          if (newdata[j].activePrice != null && newdata[j].activePrice != ''){
            newdata[j].courseAdvancePayment = newdata[j].activePrice ;
          }
        }
        if (data.data.length>3){
          var temp = [];
          for (let i = 0; i < 3; i++) {
            temp.push(newdata[i]);
          }
          that.setData({
            recmendarray: temp,
            hascourse: false,
          });
        }else{
          that.setData({
            recmendarray: data.data,
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
    },res=>{});
  },
  //获取学校数据
  selectSchoolMainById: function (schoolId){

    var that=this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectSchoolMainById(schoolId,data=>{
   
      var img = data.data[0].schoolPicture.split(',');

      that.setData({
        schoolName: data.data[0].schoolName,
        schoolAddress: data.data[0].schoolAddress,
        schoolPicture:img[0],       
        teacherCount: data.data[0].teacherCount,
        schoolData:data.data[0],
        schoolLatitude: data.data[0].schoolLatitude,
        schoolLongitude: data.data[0].schoolLongitude,
      });

      var schoolIntroduce=data.data[0].schoolIntroduce;
      var schoolEnvironment=data.data[0].schoolEnvironment;
      WxParse.wxParse('schoolIntroduce', 'html', schoolIntroduce, that, 5);
      WxParse.wxParse('schoolEnvironment', 'html', schoolEnvironment, that, 5);
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    },res=>{});
  },
  //打开地图
  openlocation: function () {
    var that=this;

    wx.getLocation({//获取当前经纬度
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
      success: function (res) {
        wx.openLocation({//​使用微信内置地图查看位置。
          latitude: that.data.schoolLatitude,//要去的纬度-地址
          longitude: that.data.schoolLongitude,//要去的经度-地址
          name: that.data.schoolAddress,
          address: that.data.schoolAddress
        })
      }
    })
  },

  //获取分类
  selectCategoryBySchoolId: function (schoolId) {
   
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectCategoryBySchoolId(schoolId, data => {
   
      if(data.data.length==0){
        that.setData({
          hascategory:true,
        });

      }else{
      
        var temp=data.data;
        temp.unshift({ categoryId: "", categoryName: "推荐" });
      
        that.setData({
          footertitle: temp,
          hascategory: false,
        });
      }    
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => { });
  },
  //获取教师团队
  selectTeacherBySchoolId: function (schoolId) {
   
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectTeacherBySchoolId(schoolId, data => {
      let newdata = data.data;
      for (let i = 0; i < newdata.length; i++) {
        if (newdata[i].categoryName == null || newdata[i].categoryName == '') {
          newdata[i].categoryName = '';
        } else {
          newdata[i].categoryName = newdata[i].categoryName.split(',');
          var temp = [];
          for (let j = 0; j < newdata[i].categoryName.length; j++) {
            if (j > 1) break;
            temp.push(newdata[i].categoryName[j]);
          }
          newdata[i].categoryName = temp;
        }
      }
      if(data.data.length>0){
        that.setData({
          teacherarray: newdata,
          teacherCount: data.data.length,
          hasTeacher: true,
        });
      }else{
        that.setData({        
          hasTeacher: false,
        });
      }
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => { });
  },
  gotodetailTeacher: function (e) {
    var teacherId = e.currentTarget.dataset.teacherid;

    wx.navigateTo({
      url: '../../pages/detailTeacher/detailTeacher?teacherId=' + teacherId,
    })
  },
  makephonecall:function(){
    wx.makePhoneCall({
      phoneNumber: app.globalData.phoneNumber,
    })
  },
  //获取评论列表
  selectSchoolCommentList: function (schoolId){
    
    var that=this;
    var limit=5;
    var page=1;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectSchoolCommentList(limit,page,schoolId,data=>{
      if (data.count == 0) {
        that.setData({
          hasmessage: false
        });
      } else {
        that.setData({
          hasmessage: true
        });
      }
      var temparray = data.data;
      for (let i = 0; i < temparray.length; i++) {
        if (temparray[i].picture != "" && temparray[i].picture != null) {
          temparray[i].imgarray = temparray[i].picture.substring(0, temparray[i].picture.length - 1).split(',');
        } else {
          temparray[i].imgarray = [];
        }
        if (temparray[i].nickPicture == "" || temparray[i].nickPicture == null) {
          temparray[i].nickPicture ='../../images/avatarImg.png';
        } else if (temparray[i].nickPicture.substring(0,6)=='/image'){
          temparray[i].nickPicture = that.data.Furl + temparray[i].nickPicture;
        } 
        if (temparray[i].nickName == "" || temparray[i].nickName == null) {
          temparray[i].nickName = '匿名';
        }
        switch (temparray[i].schoolScore) {
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
        if (temparray[i].createTime != null && temparray[i].createTime != ''){
          temparray[i].newtime = temparray[i].createTime.substring(0, 10);
        }      
        else{
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
  onlinecontact:function(){
    var that=this;
    detailinstitution.addControect(app.globalData.openid, that.data.schoolId, that.data.schoolPicture,that.data.schoolName,data=>{
    
    },res=>{});
  },
})