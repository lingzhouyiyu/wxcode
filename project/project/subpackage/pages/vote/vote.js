const util = require('../../utils/util.js')

import {
  Vote
} from '../../models/vote.js'

let vote = new Vote();
//获取应用实例
const app = getApp()

var limit = 10;
var page = 1;
var nextPage = 2;
var hasNextPage = false;
var activeIDpersonal = '1000000621761910';
var activeIDschool = '1000000324491431';
var Fkeyworlds = '';
var interval = null;
var tipcount = 0;
// pages/vote/vote.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    optionselect: 0,
    countDownDay: '00',
    countDownHour: '00',
    countDownMinute: '00',
    countDownSecond: '00',
    personalList: [],
    schoolList: [],
    Furl: app.globalData.Serverurl,
    schoolCount: 0,
    schoolVotes: 0,
    lookCount: 0,
    activeBeginDate: '',
    activeEndDate: '',
    imgurl: '',
    overTime: 0,
    showModalguide: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    Fkeyworlds = '';
    if (app.globalData.openid == null || app.globalData.openid == '') {
      this.getToken().then(res => {
        this.signUpSchoolList();
        this.addPersonalCount(activeIDschool, 0); //增加浏览量
        this.getVoteActivity(activeIDschool);
      })
    } else {
      this.signUpSchoolList();
      this.addPersonalCount(activeIDschool, 0); //增加浏览量
      this.getVoteActivity(activeIDschool);
    }
    // wx.clearStorageSync()
    console.log(app.globalData.showActive);
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // this.isSubscribe();
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
    var that = this;
    if (that.data.optionselect == 0) { //学校
      that.signUpSchoolList();
    } else if (that.data.optionselect == 1) { //个人
      that.getJoinList();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    if (hasNextPage) {
      if (that.data.optionselect == 0) { //学校
        that.signUpSchoolListLoad();
      } else if (that.data.optionselect == 1) { //个人
        that.getJoinListLoad();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  selectoption: function(e) {
    var that = this;
    Fkeyworlds = '';
    that.setData({
      optionselect: e.currentTarget.dataset.index
    })
    if (that.data.optionselect == 0) { //学校
      that.signUpSchoolList();
      that.getSchoolCount();
      that.addPersonalCount(activeIDschool, 0); //增加浏览量
      that.getVoteActivity(activeIDschool);
      wx.setNavigationBarTitle({
        title: '蛙涡新春送福利',
      })
    } else if (that.data.optionselect == 1) { //个人
      that.getJoinList();
      that.getJoinCount(); //报名人数
      that.getVoteCount(); //投票人数
      that.addPersonalCount(activeIDpersonal, 1); //增加浏览量
      that.getVoteActivity(activeIDpersonal);
      wx.setNavigationBarTitle({
        title: '蛙涡新春送福利',
      })
    }

  },
  showtip: function() {
    return new Promise((resolve, reject) => {
      tipcount++;
      wx.setStorageSync('tip', tipcount)
      wx.showModal({
        title: '提示',
        content: '请点击页面顶部关注公众号后方可进行投票！',
        success: function(res) {

          if (res.confirm) {

          } else {

          }
        }
      })
      resolve(tipcount);
    })
  },

  //学校排行旁、我要报名、规则页面跳转
  selectbtn: function(e) {
    var that = this;
    var btnselect = e.currentTarget.dataset.index;

    switch (btnselect) {
      case '0':
        //我要报名
        // this.setData({
        //   showModal: true
        // })

        wx.getStorage({
          key: "tip",
          success: function(res) {           
            if (res.data >= 1) {
              wx.navigateTo({
                url: '../../pages/voteschoolsignup/voteschoolsignup',
              })
            }else{
              that.showtip().then(data => {
                
              })
            }
          },
          fail: function(e) {
            console.log(e);
            that.showtip().then(data => {

            })
          }
        })
        break;
      case '1':
        //排行榜
        wx.navigateTo({
          url: '../../pages/voteschoolrank/voteschoolrank?overTime=' + that.data.overTime,
        })
        break;
      case '2':
        //规则
        wx.navigateTo({
          url: '../../pages/voteschoolrule/voteschoolrule',
        })
        break;
      default:
        break;
    }
  },
  //个人排行旁、我要报名、规则页面跳转
  selectbtnpersonal: function(e) {
    var that = this;
    var btnselect = e.currentTarget.dataset.index;

    switch (btnselect) {
      case '0':
        //我要报名       
        wx.getStorage({
          key: "tip",
          success: function (res) {
            if (res.data >= 1) {
              wx.navigateTo({
                url: '../../pages/votepersonalsignup/votepersonalsignup',
              })
            } else {
              that.showtip().then(data => {

              })
            }
          },
          fail: function (e) {
            console.log(e);
            that.showtip().then(data => {

            })
          }
        })
        break;
      case '1':
        //排行榜
        wx.navigateTo({
          url: '../../pages/votepersonalrank/votepersonalrank?overTime=' + that.data.overTime,
        })
        break;
      case '2':
        //规则
        wx.navigateTo({
          url: '../../pages/votepersonalrule/votepersonalrule',
        })
        break;
      default:
        break;
    }
  },
  //个人详情
  gotovotepersonaldetail: function(e) {
    wx.navigateTo({
      url: '../../pages/votepersonaldetail/votepersonaldetail?id=' + e.currentTarget.dataset.id,
    })
  },
  //学校详情
  gotovoteschooldetail: function(e) {
    wx.navigateTo({
      url: '../../pages/voteschooldetail/voteschooldetail?id=' + e.currentTarget.dataset.id,
    })
  },
  // 倒计时开始
  // 页面渲染完成后 调用  
  countdown: function() {
    // var totalSecond = 1505540080 - Date.parse(new Date()) / 1000;
    clearInterval(interval);
    var totalSecond = this.data.overTime;
    interval = setInterval(function() {
      // 秒数  
      var second = totalSecond;

      // 天数位  
      var day = Math.floor(second / 3600 / 24);
      var dayStr = day.toString();
      if (dayStr.length == 1) dayStr = '0' + dayStr;

      // 小时位  
      var hr = Math.floor((second - day * 3600 * 24) / 3600);
      var hrStr = hr.toString();
      if (hrStr.length == 1) hrStr = '0' + hrStr;

      // 分钟位  
      var min = Math.floor((second - day * 3600 * 24 - hr * 3600) / 60);
      var minStr = min.toString();
      if (minStr.length == 1) minStr = '0' + minStr;

      // 秒位  
      var sec = second - day * 3600 * 24 - hr * 3600 - min * 60;
      var secStr = sec.toString();
      if (secStr.length == 1) secStr = '0' + secStr;

      this.setData({
        countDownDay: dayStr,
        countDownHour: hrStr,
        countDownMinute: minStr,
        countDownSecond: secStr,
      });
      totalSecond--;
      if (totalSecond < 0) {
        clearInterval(interval);
        wx.showToast({
          title: '活动已结束',
        });
        this.setData({
          countDownDay: '00',
          countDownHour: '00',
          countDownMinute: '00',
          countDownSecond: '00',
        });
      }
    }.bind(this), 1000);
  },
  //获取个人投票列表
  getJoinList: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    vote.getJoinList(Fkeyworlds, limit, page, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      for (let j = 0; j < data.data.length; j++) {
        data.data[j].image = data.data[j].image.split(',')[0];
      }
      that.setData({
        personalList: data.data
      })
    }, res => {})
  },
  //获取个人投票列表加载
  getJoinListLoad: function() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    vote.getJoinList(Fkeyworlds, limit, nextPage, data => {
      // 隐藏加载框
      wx.hideLoading();
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      var temp = that.data.personalList;

      for (let i = 0; i < data.data.length; i++) {
        data.data[i].image = data.data[i].image.split(',')[0];
        temp.push(data.data[i]);
      }
      that.setData({
        personalList: temp
      })
    }, res => {})
  },
  //获取学校投票列表
  signUpSchoolList: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    vote.signUpSchoolList(Fkeyworlds, limit, page, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      for (let j = 0; j < data.data.length; j++) {
        data.data[j].schoolPicture = data.data[j].schoolPicture.split(',')[0];
      }
      that.setData({
        schoolList: data.data
      })
    }, res => {})
  },
  //获取学校投票列表加载
  signUpSchoolListLoad: function() {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    vote.signUpSchoolList(Fkeyworlds, limit, nextPage, data => {
      // 隐藏加载框
      wx.hideLoading();
      nextPage = data.nextPage;
      hasNextPage = data.hasNextPage;
      var temp = that.data.schoolList;
      for (let i = 0; i < data.data.length; i++) {
        data.data[i].schoolPicture = data.data[i].schoolPicture.split(',')[0];
        temp.push(data.data[i]);
      }
      that.setData({
        schoolList: temp
      })
    }, res => {})
  },
  //学校投票
  vote: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.getStorage({
      key: "tip",
      success: function (res) {
        if (res.data >= 1) {
          vote.vote(id, app.globalData.openid, data => {
           
            if (data.msg == '200' || data.msg == '910') {
              wx.showToast({
                title: '投票成功',
              })
              var temp = that.data.schoolList;
              for (let j = 0; j < temp.length; j++) {
                if (temp[j].id == id) {
                  temp[j].votes = temp[j].votes + 1
                }
              }
              that.setData({
                schoolList: temp
              })
            } else if (data.msg == '909') {
              wx.showToast({
                title: '今日已经投票！',
                icon: 'none',
                duration: 1000
              })
            }
          }, res => { });
        } else {
          that.showtip().then(data => {

          })
        }
      },
      fail: function (e) {
        console.log(e);
        that.showtip().then(data => {

        })
      }
    })

  },
  //个人投票
  addPersonalVote: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.getStorage({
      key: "tip",
      success: function (res) {
        if (res.data >= 1) {
          vote.addPersonalVote(id, app.globalData.openid, data => {

              if (data.msg == '909') {
                wx.showToast({
                  title: '今日已经投票！',
                  icon: 'none',
                  duration: 1000
                })
              } else if (data.msg == '200' || data.msg == '910') {
                wx.showToast({
                  title: '投票成功',
                })
                var temp = that.data.personalList;
                for (let j = 0; j < temp.length; j++) {
                  if (temp[j].id == id) {
                    temp[j].total = temp[j].total + 1
                  }
                }
                that.setData({
                  personalList: temp
                })
              }

            
          }, res => { });
        } else {
          that.showtip().then(data => {

          })
        }
      },
      fail: function (e) {
        console.log(e);
        that.showtip().then(data => {

        })
      }
    })
    

  },
  //增加浏览量
  addPersonalCount: function(activeID, tag) {
    var that = this;
    vote.addPersonalCount(activeID, data => {
      if (data.status == 200) {
        if (tag == 0) {
          that.getSchoolCount();
        } else {
          that.getPersonalCount();
        }
      }
    }, res => {});
  },
  //所有学校活动信息返回
  getSchoolCount: function() {
    var that = this;
    vote.getSchoolCount(data => {
      if (data.status == 200) {
        that.setData({
          schoolCount: data.data.schoolCount,
          schoolVotes: data.data.schoolVotes,
          lookCount: data.data.lookCount,
        })
      }
    }, res => {});
  },
  //个人报名人数
  getJoinCount: function() {
    var that = this;
    vote.getJoinCount(data => {
      if (data.status == 200) {
        that.setData({
          schoolCount: data.data.total
        })
      }
    }, res => {})
  },
  //个人投票人数
  getVoteCount: function() {
    var that = this;
    vote.getVoteCount(data => {
      if (data.status == 200) {
        that.setData({
          schoolVotes: data.data.total
        })
      }
    }, res => {})
  },
  //个人浏览量
  getPersonalCount: function() {
    var that = this;
    vote.getPersonalCount(activeIDpersonal, data => {
      if (data.status == 200) {
        that.setData({
          lookCount: data.data.lookCount
        })
      }
    }, res => {})
  },
  //个人搜索
  getpersonvalue: function(e) {
    Fkeyworlds = e.detail.value;
    Fkeyworlds = String(Fkeyworlds).trim();
    this.getJoinList();
  },
  //学校搜索
  getschoolvalue: function(e) {
    Fkeyworlds = e.detail.value;
    Fkeyworlds = String(Fkeyworlds).trim();

    this.signUpSchoolList();
  },
  //个人搜索
  getpersonvalues: function() {
    this.getJoinList();
  },
  //学校搜索
  getschoolvalues: function() {
    this.signUpSchoolList();
  },
  //获取学校/个人投票活动图、时间
  getVoteActivity: function(activeID) {
    var that = this;
    vote.getVoteActivity(activeID, data => {
      that.setData({
        activeBeginDate: data.data.activeBeginDate,
        activeEndDate: data.data.activeEndDate,
        imgurl: data.data.imgurl,
        overTime: data.data.overTime
      })
      that.countdown();
    }, res => {})
  },
  officialLoad: function(e) {
    console.log("加载成功");
    console.log(e);
  },
  officialError: function(e) {
    console.log("加载失败");
    console.log(e);
  },
  isSubscribe: function() {
    vote.isSubscribe(app.globalData.openid, data => {
      console.log(data);
    }, res => {})
  },
  gotoindex: function() {
    wx.switchTab({
      url: '../../../pages/index/index',
    })
  },
//  < !--引导用户操作 -->
  // submit: function() {
  //   this.setData({
  //     showModalguide: true
  //   })
  // },
  preventTouchMove: function() {
    return;
  },
  // close_mask: function() {
  //   this.setData({
  //     showModalguide: false
  //   })
  // },
  previewImage: function() {
    var current = ['https://www.hiwawow.com/images/gzh3.png'];
    wx.previewImage({
      current: 'https://www.hiwawow.com/images/gzh3.png',
      urls: current
    })
  },

})