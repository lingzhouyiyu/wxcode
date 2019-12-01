const util = require('../../utils/util.js')
import {
  IndexModel
} from '../../models/index.js'
let indexModel = new IndexModel()
//刷新参数
var limit = 5;
var currentPage = 1;
var end = 2; //上拉加载当前页
var pageCount = 0;
//腾讯位置
var QQMapWX = require('../../common/JS/qqmap-wx-jssdk.min.js');
var qqmapsdk;
//获取应用实例
const app = getApp()
//搜索关键字
var Fkeyworlds = "";
var currentCategoryId = '';

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bannersimages: ['../../images/test.jpg', '../../images/test.jpg', '../../images/test.jpg', '../../images/test.jpg'],
    footertitle: ['推荐', '中国舞', '街舞', '名族舞', '国画', '篮球', '芭蕾舞', '其他'],
    bannercategory: ['民族舞', 'Hip.Hop', '芭蕾舞', '国画', '吉他', '篮球', 'Poping', '爵士舞', 'Poping', '爵士舞'],
    teacherarray: ['易建兰', '穆雷', '杨淑敏', '张世良', '姜锦忠'],
    catalogSelect: "推荐",
    categorybanner: [1, 2, 3],
    Furl: app.globalData.Serverurl,
    latitude: 25.11624,
    longitude: 102.75205,
    address: '昆明市',
    schoolList: [],
    schoolSelect: '',
    imgArray: [],
    Height: "",
    showModalStatus: false,
    activeModal: true,
  },
  imgHeight: function(e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度   
    var imgh = e.detail.height; //图片高度   
    var imgw = e.detail.width; //图片宽度   
    var swiperH = winWid * imgh / imgw + "px";
    this.setData({
      Height: swiperH //设置高度 
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  showDialog() {
    this.dialog.showModal();
  },
  //位置--监听城市选择组件传值
  getcityName: function(e) {
    this.hideModal();
    const cityName = e.detail.cityname;
    const lat = e.detail.lat;
    const lng = e.detail.lng;
    this.setData({
      latitude: lat,
      longitude: lng,
      address: cityName
    });

    this.selectIndexSchool(currentCategoryId);
  },
  onLoad: function(options) {
    var that = this;
    //分享信息追踪
    if (options.openid != null && options.openid != '') {
      if (app.globalData.openid == null || app.globalData.openid == '') {
        this.getToken().then(res => {
          //用户openid
          var helpOpenid = res.openid;
          //分享者openid
          var shareOpenid = options.openid;

          //查询当前用户是否助力过
          indexModel.listShareCount(helpOpenid, shareOpenid, data => {
            //增加分享者的分享成功次数
            if (data.data == 0) {
              indexModel.updateWxUserShareCount(helpOpenid, shareOpenid, datas => {
                //增加蛙币
                indexModel.generateCoinOrderShare(10, shareOpenid, datashare => {

                }, res => {});
              }, res => {});
            }
          }, res => {});
        })
      } else {
        //用户openid
        var helpOpenid = app.globalData.openid;
        //分享者openid
        var shareOpenid = options.openid;

        //查询当前用户是否助力过
        indexModel.listShareCount(helpOpenid, shareOpenid, data => {
          //增加分享者的分享成功次数
          if (data.data == 0) {
            indexModel.updateWxUserShareCount(helpOpenid, shareOpenid, datas => {
              //增加蛙币
              indexModel.generateCoinOrderShare(10, shareOpenid, datashare => {

              }, res => {});
            }, res => {});
          }
        }, res => {});
      }
    }
    Fkeyworlds = '';
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");

    //首页轮播分类
    if (app.globalData.token == null) {
      this.getToken().then((resArg) => {
        that.getIndexCategory();
        that.selectThisWeek();
        that.selectGoodsTeacher();
        that.selectIndexActive();
        that.selectCategory();
        //获取用户信息
        this.getuserData();
        //获取授权，用户信息
        that.getSetting();
      })
    } else {
      that.getIndexCategory();
      that.selectThisWeek();
      that.selectGoodsTeacher();
      that.selectIndexActive();
      that.selectCategory();
      //获取用户信息
      this.getuserData();
      //获取授权，用户信息
      that.getSetting();
    }
    var scene = decodeURIComponent(options.scene) //参数二维码传递过来的参数 

    if (!app.globalData.showActive) {
      app.globalData.showActive = true;
      that.setData({
        activeModal: true
      })
    } else {
      that.setData({
        activeModal: false
      })
    }
  },
  //用户登录
  getToken: function() {
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: res => {
          var url = app.wxApi.api_wxLogin;
          var params = {
            code: res.code
          };
          console.log(res.code);
          util.wxRequest(url, params, data => { 
            if (data.status == 200) {
              app.globalData.openid = data.data.openid;
              app.globalData.token = data.data.token;
              var respam = {
                openid: data.data.openid,
                token: data.data.token
              }
              resolve(respam)
            }
          }, data => {
            //  reject();
          }, data => {})
        }
      })
    })
  },
  //下拉刷新
  onPullDownRefresh: function() {
var that=this;
    this.selectIndexSchool(currentCategoryId);
    if (app.globalData.token == null) {
      this.getToken().then((resArg) => {
        that.getIndexCategory();
        that.selectThisWeek();
        that.selectGoodsTeacher();
        that.selectIndexActive();
        that.selectCategory();
        //获取用户信息
        this.getuserData();
      })
    } else {
      that.getIndexCategory();
      that.selectThisWeek();
      that.selectGoodsTeacher();
      that.selectIndexActive();
      that.selectCategory();
      //获取用户信息
      this.getuserData();
    }
    setTimeout(this.hideLoad, 5000);
  },
  //上拉加载
  onReachBottom: function() {
    if (end > pageCount) return;
    this.selectIndexSchoolBottom(currentCategoryId);
    setTimeout(this.hideLoad, 5000);
  },
  //隐藏刷新加载状态
  hideLoad: function() {
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
    // 隐藏加载框
    wx.hideLoading();
  },
  //获取用户信息
  getuserData: function() {
    indexModel.userIsAuth(app.globalData.openid, data => {
      app.globalData.userPhone = data.data.phone;
    }, res => {});
  },
  getSetting: function() {
    //判断是否授权
    wx.getSetting({
      success: res => {
        //用户信息授权
        if (res.authSetting['scope.userInfo']) {
          app.globalData.hasAuth = true;
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          if (app.globalData.userInfo == null) {
            wx.getUserInfo({
              success: res => {
                app.globalData.userInfo = res.userInfo;
                this.setData({
                  userInfo: app.globalData.userInfo,
                  hasUserInfo: true
                })
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          } else {
            this.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true
            })
          }

        } else { //用户未授权
          app.globalData.hasAuth = false;
          this.setData({
            hasUserInfo: false
          })
          //弹出授权弹框
          // this.showDialog();
        }

        //当前位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          this.showModal();
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          this.getLocation();
        } else {
          this.getLocation();
        }
      }
    })
  },
  //判断是否授权地理位置
  allowLocation: function() {
    var that = this;
    wx.getSetting({
      success: res => {
        //当前位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          this.showModal_click();
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          that.showModals();
        } else {
          that.showModals();
        }
      }
    })
  },
  showModal_click: function() {
    var that = this;
    wx.showModal({
      title: '请求授权当前位置',
      content: '需要获取您的地理位置，请确认授权',
      success: function(res) {
        if (res.cancel) {
          wx.showToast({
            title: '拒绝授权将无法使用定位功能!',
            icon: 'none',
            duration: 2000
          })
        } else if (res.confirm) {
          wx.openSetting({
            success: function(dataAu) {
              if (dataAu.authSetting["scope.userLocation"] == true) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 1000
                })
                //再次授权，调用wx.getLocation的API
                that.showModals();
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })
  },
  showModal: function() {
    var that = this;
    wx.showModal({
      title: '请求授权当前位置',
      content: '需要获取您的地理位置，请确认授权',
      success: function(res) {
        if (res.cancel) {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none',
            duration: 1000
          })
        } else if (res.confirm) {
          wx.openSetting({
            success: function(dataAu) {
              if (dataAu.authSetting["scope.userLocation"] == true) {
                wx.showToast({
                  title: '授权成功',
                  icon: 'success',
                  duration: 1000
                })
                //再次授权，调用wx.getLocation的API
                that.getLocation();
              } else {
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              }
            }
          })
        }
      }
    })
  },
  getLocation: function() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        app.globalData.latitude = res.latitude;
        app.globalData.longitude = res.longitude;
        //获取学校列表
        if (app.globalData.token == null) {
          that.getToken().then((resArg) => {
            that.selectIndexSchool(currentCategoryId);
          })
        } else {
          that.selectIndexSchool(currentCategoryId);
        }
        // 腾讯位置实例化API核心类
        qqmapsdk = new QQMapWX({
          key: 'P2QBZ-3KUCI-4T7G6-5J54I-3TIFS-KKFZF'
        });
        //地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function(res) {
            //获得地址
            that.setData({
              address: res.result.address_component.city
            })
            app.globalData.address = res.result.address_component.city;
          },
          fail: function(res) {

          },
          complete: function(res) {
            //获得地址
            that.setData({
              address: res.result.address_component.city
            })
            app.globalData.address = res.result.address_component.city;
          }
        });
      }
    })
  },
  tabSelect: function(e) {

    var categoryid = e.currentTarget.dataset.categoryid;
    currentCategoryId = categoryid;
    this.selectIndexSchool(currentCategoryId);
    var that = this;
    that.setData({ //把选中值放入判断值
      catalogSelect: e.currentTarget.dataset.select
    })
  },
  getwidth: function(e) {

  },
  gotonotice: function() {
    wx.navigateTo({
      url: '../../pages/notice/notice',
    })
  },
  gotoDetail: function(e) {
    var danceCategoryId = e.currentTarget.dataset.categoryid;
    wx.navigateTo({
      url: '../../pages/details/details?danceCategoryId=' + danceCategoryId,
    })
  },
  gotodetailTeacher: function(e) {
    var teacherId = e.currentTarget.dataset.teacherid;

    wx.navigateTo({
      url: '../../pages/detailTeacher/detailTeacher?teacherId=' + teacherId,
    })
  },
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
  gotorankings: function() {
    wx.navigateTo({
      url: '../../pages/rankings/rankings',
    })
  },
  gotoinstitutionAppointment: function(e) {
    wx.navigateTo({
      url: '../../pages/institutionAppointment/institutionAppointment?schoolId=' + e.currentTarget.dataset.select,
    })
  },
  //分类滑动
  getIndexCategory: function() {
    indexModel.getIndexCategory(data => {
      //总记录数
      //  var totalCount = data.data.length;
      var totalCount = 20;
      //每页显示条数
      var pageSize = 10;
      //总页数
      var pageCount = this.getPageCount(totalCount, pageSize);
      var arrayList = [];
      for (var i = 0; i < pageCount; i++) {
        var obj = {};
        var temparray = [];

        if (i == pageCount - 1) {
          for (var k = i * pageSize; k < i * pageSize + (totalCount - i * pageSize); k++) {
            temparray.push(data.data[k]);
          }
        } else {
          for (var j = i * pageSize; j < i * pageSize + pageSize; j++) {
            temparray.push(data.data[j]);
          }
        }
        obj.data = temparray;
        arrayList.push(obj);
      }
      this.setData({
        categorybanner: arrayList,
      })

    }, res => {

    })
  },
  //计算总页数
  getPageCount: function(totalCount, pageSize) {
    var p = totalCount / pageSize;
    return Math.ceil(p);
  },
  //本周优选
  selectThisWeek: function() {
    var that = this;
    indexModel.selectThisWeek(data => {
      var temp = [];
      for (let i = 0; i < data.data.length; i++) {
        if (i == 4) {
          break;
        } else {
          temp.push(data.data[i]);
        }
      }
      that.setData({
        imgArray: temp,
      });
    }, res => {})
  },
  searchSchool: function(e) {
    // Fkeyworlds = e.detail.value.replace(/\s+/g, '');
    // this.selectIndexSchool(currentCategoryId);
    wx.navigateTo({
      url: '../../pages/search/search?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude,
    })
  },
  //学校列表
  selectIndexSchool: function(categoryId) {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    indexModel.selectIndexSchool(Fkeyworlds, categoryId, limit, currentPage, this.data.latitude, this.data.longitude, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      pageCount = this.getPageCount(data.count, limit);
      end = 2;
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
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    var that = this;
    var temp = that.data.schoolList;
    indexModel.selectIndexSchool(Fkeyworlds, categoryId, limit, end, this.data.latitude, this.data.longitude, data => {
      pageCount = this.getPageCount(data.count, limit);
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
      if (end > pageCount) {} else {
        end = end + 1;

        for (var i = 0; i < newdatas.length; i++) {

          temp.push(newdatas[i]);
        }
        that.setData({
          schoolList: temp,
        });

      }
      // 隐藏加载框
      wx.hideLoading();
    }, res => {

    })
  },
  //名师推荐
  selectGoodsTeacher: function() {
    var that = this;
    indexModel.selectGoodsTeacher(data => {
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
      that.setData({
        teacherarray: newdata,
      });
    }, res => {});
  },
  gotoactive: function(e) {
    var activeId = e.currentTarget.dataset.activeid;
    var activeType = e.currentTarget.dataset.activetype;
    console.log(activeType);
    console.log(activeId);
    if ((activeType == 0 || activeType == 5 )&& activeId != '1000001136645939') { //图文活动
      wx.navigateTo({
        url: '../../pages/activity_detail/activity_detail?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 2) { //本周优选（有课程）
      wx.navigateTo({
        url: '../../pages/activity/activity?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 6) { //线下活动（可购买）按人数收费
      wx.navigateTo({
        url: '../../pages/activity_buy/activity_buy?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 3) { //线下活动（可购买）按比例收费
      wx.navigateTo({
        url: '../../pages/activitydetail/activitydetail?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 7) { //分享免费领券

      wx.navigateTo({
        url: '../../pages/activityshare/activityshare?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeType == 8) { //收费领券    
      wx.navigateTo({
        url: '../../pages/activityshare_buy/activityshare_buy?activeId=' + activeId + '&activeType=' + activeType,
      })
    } else if (activeId == '1000001136645939') {
      wx.navigateTo({
        url: '../../subpackage/pages/vote/vote',
      })
    }
  },
  //首页轮播图
  selectIndexActive: function() {
    var that = this;
    indexModel.selectIndexActive(data => {
      var temp = data.data;
      for (let i = 0; i < data.data.length; i++) {
        temp[i].newimg = data.data[i].imgurl.split(',')[0];
      }
      that.setData({
        bannersimages: temp,
      });
    }, res => {});
  },
  //首页所有分类
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
  //  城市列表弹框函数
  //显示对话框
  showModals: function() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  stopPageScroll: function() {
    return;
  },
  //关闭活动弹框
  close_mask: function() {
    this.setData({
      activeModal: false
    })
  },
})