import {
  Detailinstitution
} from '../../models/detailinstitution.js'
let detailinstitution = new Detailinstitution();
var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp();
var limit = 5;
var page = 1;
// pages/detailcourse/detailcourse.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    introduceSelect: '0',
    hidetag: true,
    courseData: '',
    hotarray: ['全部', '好评', '耐心尽责', '放松舒服', '老师技术好', '服务热情周到', '值得信赖', '幽默', ],
    schoolData: '',
    schoolImg: '',
    reservation: '',
    Furl: app.globalData.Serverurl,
    courseId: '',
    schoolId: '',
    commentData: [],
    collectionImg: 'kechengzan',
    collectionTag: true,
    collectionTxt: '收藏',
    voucherArray: [],
    voucherCount: 0,
    hasGetArray: [],
    showModal: false,
    teacherList: [],
    hasmessage: true,
    hasActive: false,
    isbuy:false,
    buycount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      courseId: options.courseId,
    });

    this.selectCourseById(options.courseId);
    this.courseBuyCount(options.courseId);
    this.selectCourseCommentList();

    this.selectCoupon(limit, page);
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
  introduce_item_switch: function(e) {
    var that = this;
    that.setData({ //把选中值放入判断值
      introduceSelect: e.currentTarget.dataset.select
    })
  },
  gotodetailcourse_service: function() {

    wx.navigateTo({
      url: '../../pages/detailcourse_service/detailcourse_service',
    })
  },
  getVoucher: function() {
    var that = this;
    that.setData({
      hidetag: false,
    })
  },
  //获取红包数据
  selectCoupon: function(limits, pages) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectCoupon(limits, pages, app.globalData.openid, data => { 
      var temp = data.data;
      var array = [];
      for (let i = 0; i < data.data.length; i++) {
        temp[i].startTime = temp[i].startTime.substring(0, 10);
        temp[i].endTime = temp[i].endTime.substring(0, 10);
        if (temp[i].hasGet == 1) {
          array.push(temp[i]);
        }
      }
      var count = 0;
      if (array != '' & array != null && array != []) {
        count = array.length;
      }
      that.setData({
        voucherArray: temp,
        voucherCount: data.count,
        hasGetArray: array,
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => {});
  },
  //领取红包
  addCouponUse: function(e) {
    var that = this;
    var couponId = e.currentTarget.dataset.couponid;
    var hasGet = e.currentTarget.dataset.hasget;
    if (hasGet == 1) {
      wx.showToast({
        title: '红包已领取!',
        icon: 'none',
        duration: 1000
      })
    } else {
      // 显示顶部刷新图标
      wx.showNavigationBarLoading();
      detailinstitution.addCouponUse(couponId, app.globalData.openid, data => {
        wx.showToast({
          title: '领取成功!',
          icon: 'success',
          duration: 1000,
          success: function() {
            that.selectCoupon(limit, page);
          }
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
      }, res => {});
    }

  },
  hideVoucher: function() {
    var that = this;
    that.setData({
      hidetag: true,
    })
  },
  //立即购买
  gotoconfirmOrder: function() {    
    var that = this;
    if (that.data.buycount > 0 && that.data.courseData.purchaseLimit==1) {
      wx.showToast({
        title: '该课程限购一次!',
        duration:1500,
        icon:'none'
      })
      return;
    }else{
      this.getvalue().then(res => {
        var phonedata = app.globalData.userPhone;
        if (phonedata == '' || phonedata == null) {
          wx.navigateTo({
            url: '../../pages/register/register?tag=course' + '&money=' + res[0] + '&id=' + res[1] + '&courseAdvancePayment=' + that.data.courseData.courseAdvancePayment + '&courseId=' + that.data.courseData.courseId,
          })
        } else {
          wx.navigateTo({
            url: '../../pages/orders/confirmOrder/confirmOrder?phonedata=' + phonedata + '&money=' + res[0] + '&id=' + res[1] + '&tag=detailcourse' + '&courseAdvancePayment=' + that.data.courseData.courseAdvancePayment + '&courseId=' + that.data.courseData.courseId,
          })
        }
      })
    }
  },
  //计算优惠券金额
  getvalue: function() {
    var that = this;
    return new Promise(function(resolve, reject) {
      var datas = [];
      for (let k = 0; k < that.data.voucherArray.length;k++){
        if (that.data.voucherArray[k].hasGet==1){
          datas.push(that.data.voucherArray[k]);
        }
      }
      var data = datas;
      var temp = [];
      for (let j = 0; j < data.length; j++) {
        if ((that.data.courseData.courseAdvancePayment - that.data.courseData.tailPrice) > data[j].maxPrice) {
          temp.push(data[j]);
        }
      }
      if (temp.length == 0) {
        var temps = [];
        temps.push(0);
        temps.push(0);
        resolve(temps);
      } else {
        var Maxmoney = temp[0].price;
        var Maxid = temp[0].id;

        for (let i = 0; i < temp.length; i++) {
          if (temp[i].hasGet == 1) {
            if (temp[i].price > Maxmoney) {
              Maxmoney = temp[i].price;
              Maxid = temp[i].id;
            }
          }
        }
        var temps = [];
        temps.push(Maxmoney);
        temps.push(Maxid);
        resolve(temps);
      }
    })
  },
  gotodetailinstitution: function(e) {
    var that = this;
    wx.navigateTo({
      url: '../../pages/detailinstitution/detailinstitution?schoolId=' + e.currentTarget.dataset.select,
    })
  },
  //获取课程详情
  selectCourseById: function(courseId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectCourseById(app.globalData.openid, courseId, data => {
      var schoolId = data.data.schoolId;
      that.selectSchoolById(schoolId);
      that.selectTeacherByCourseId(schoolId);
      var temp = data.data;
      if (temp.courseImg != '' && temp.courseImg != null) {
        temp.newImg = temp.courseImg.split(',');
      }
      if (temp.courseUnit.search("/") != -1) {

      } else {
        temp.courseUnit = '/' + temp.courseUnit;
      }
      if (temp.activeId != null && temp.activeId != '') {
        temp.courseAdvancePayment = temp.activePrice;
        that.setData({
          hasActive: true
        })
      } else {
        that.setData({
          hasActive: false
        })
      }
      if (temp.collectCount > 0) {
        that.setData({
          // collectionImg: 'laoshixins',
          collectionTag: false,
          collectionTxt: '已收藏'
        });
      }
      temp.yuyuejin = (temp.courseAdvancePayment - temp.tailPrice).toFixed(2);
      that.setData({
        courseData: temp,
        schoolId: data.data.schoolId,
      });
      if (that.data.buycount > 0 && that.data.courseData.purchaseLimit == 1) {
        that.setData({
          isbuy: true
        })
      }

      var details = data.data.courseDetails;
      var environment = data.data.courseEnvironment;
      WxParse.wxParse('courseDetails', 'html', details, that, 5);
      WxParse.wxParse('courseEnvironment', 'html', environment, that, 5);
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => {});
  },
  //课程下单次数
  courseBuyCount: function (courseId){
    var that=this;
    detailinstitution.getUserBuyCount(courseId,app.globalData.openid,data=>{
      that.setData({
        buycount:data.data
      })
    },res=>{});
  },
  //获取课程所在学校的数据
  selectSchoolById: function(schoolId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectSchoolById(schoolId, data => {

      var img = data.data.schoolPicture.split(',');
      that.setData({
        schoolData: data.data,
        schoolImg: img[0]
      })

      that.reservationAmount();
     
    }, res => {});
  },
  //计算预约金以及到院再付金额
  reservationAmount: function() {
    var that = this;
    var courseData = that.data.courseData;
    var schoolData = that.data.schoolData;

    if (courseData.courseAdvancePayment && schoolData.schoolCommission) {
      that.setData({
        //预约金
        reservation: (courseData.courseAdvancePayment * (schoolData.schoolCommission * 0.01)).toFixed(2),
        //到院再付金
        repaymount: (courseData.courseAdvancePayment - (courseData.courseAdvancePayment * (schoolData.schoolCommission * 0.01))).toFixed(2),
      });

      //然后把课程数据、学校数据、计算后的预约金、到付金均存入本地缓存
      var courseAndSchoolData = {};
      courseAndSchoolData.courseData = courseData;
      courseAndSchoolData.schoolData = schoolData;
      courseAndSchoolData.reservation = that.data.reservation;
      courseAndSchoolData.repaymount = that.data.repaymount;

      wx.setStorage({
        key: "courseAndSchoolData",
        data: courseAndSchoolData
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }
  },
  //收藏课程
  courseCollection: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    if (that.data.collectionTag) {
      detailinstitution.addWxCourseCollection(that.data.courseId, app.globalData.openid, that.data.schoolId, data => {
        that.setData({
          // collectionImg: 'laoshixins',
          collectionTag: false,
          collectionTxt: '已收藏'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
      }, res => {});
    } else {
      detailinstitution.cancelCourse(that.data.courseId, app.globalData.openid, data => {
        that.setData({
          // collectionImg: 'kechengzan',
          collectionTag: true,
          collectionTxt: '收藏'
        });
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
      }, res => {});
    }
  },
  //电话咨询
  makephonecall: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phoneNumber,
    })
  },
  //获取评论数据
  selectCourseCommentList: function() {
    var that = this;
    var limit = 5;
    var page = 1;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectCourseCommentList(that.data.courseId, limit, page, data => {
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
          temparray[i].nickPicture = '../../images/avatarImg.png';
        } else if (temparray[i].nickPicture.substring(0, 6) == '/image') {
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
    }, res => {});
  },
  myCatchTouch: function() {
    return;
  },
  // 预约金说明弹框
  submit: function() {
    this.setData({
      showModal: true
    })
  },
  preventTouchMove: function() {
    return;
  },
  close_mask: function() {
    this.setData({
      showModal: false
    })
  },
  //获取教师列表
  selectTeacherByCourseId: function(schoolId) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectTeacherByCourseId(schoolId, data => {

      that.setData({
        teacherList: data.data
      })
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => {})
  },
  gotodetailteacher: function(e) {
    var teacherId = e.currentTarget.dataset.teacherid;
    wx.navigateTo({
      url: '../../pages/detailTeacher/detailTeacher?teacherId=' + teacherId,
    })
  }
})