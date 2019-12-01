import {
  Activity
} from '../../models/activity.js'

let activity = new Activity();

var WxParse = require('../../wxParse/wxParse.js');
//获取应用实例
const app = getApp()
var phonedata = '';
// pages/activitydetail/activitydetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    activityData: '',
    activeId: '',
    activeType: '',
    yuyuemoney: '',
    payafter: '',
    hasPhone: false,
    clickCount:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    //判断用户是否已经验证过手机
    phonedata = app.globalData.userPhone;
    if (phonedata == '' || phonedata == null) {
      that.setData({
        hasPhone: false,
      })
    } else {
      that.setData({
        hasPhone: true,
      })
    }
    //赋值
    that.setData({
      activeId: options.activeId,
      activeType: options.activeType,
      clickCount: 0,
    })
    if (app.globalData.token == null) {
      app.getToken().then((resArg) => {
        that.selectActiveById(options.activeId, options.activeType);
      })
    } else {
      that.selectActiveById(options.activeId, options.activeType);
    }
    wx.showShareMenu({
      withShareTicket: true
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
    wx.showShareMenu({
      withShareTicket: true
    })
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
  onShareAppMessage: function (options) {
    var that = this; 
    var shareobj = {
      title: "蛙涡教育",
      path: 'pages/index/index',
      imgUrl: '',
      withShareTicket: true,
      success: function (res) {
        console.log(res);
        // 转发成功之后的回调        　　　　　　
        if (res.errMsg == 'shareAppMessage:ok') {
       
        }
      },
      fail: function (res) {
        // 转发失败之后的回调        　　　　　　
        if (res.errMsg == 'shareAppMessage:cancel') {
          // 用户取消转发

        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息

        }
      },
      complete: function (res) {
        // 转发结束之后的回调（转发成不成功都会执行）
        console.log(res);
      },
    };
    if (that.data.clickCount!=2){
      that.setData({
        clickCount: that.data.clickCount + 1,
      })
    }   
    if (that.data.clickCount == 2) {
      //下单
      activity.generateActivityOrder(that.data.activeId, 1, '2', app.globalData.openid, app.globalData.userPhone, data => {
        console.log(data);
        if (data.status == 900) {
          console.log('您已领取过体验券!');
          wx.showToast({
            title: '恭喜您领券成功!',
            duration: 1500,
            icon: 'success',
            success:function(){
              setTimeout(function () {
                wx.navigateTo({
                  url: '../../pages/Signup/Signup',
                })
              }, 1500)
            }
          })        
        } else {
          //零元支付
          activity.payWithNoWx(data.data.orderNo, datas => {
            console.log('领券成功!');
            if (datas.status == 200) {
              wx.showToast({
                title: '恭喜您领券成功!',
                duration: 1500,
                icon: 'success',
                success:function(){
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../../pages/Signup/Signup',
                    })
                  }, 1500)
                }
              })           
            }
          }, res => { })
        }
      }, res => { });
    }
    return shareobj;
  },
//   onShareAppMessage: function(options) {
//     console.log("点击转发按钮");
//     var that = this;
//     var shareobj = {
//       title: "蛙涡教育",
//       path: 'pages/index/index',
//       imgUrl: '',
//       withShareTicket: true,
//       success: function(res) {　
//         console.log(res);
//         // 转发成功之后的回调        　　　　　　
//         if (res.errMsg == 'shareAppMessage:ok') {
//           //下单
//           activity.generateActivityOrder(that.data.activeId, 1, '2', app.globalData.openid, app.globalData.userPhone, data => {
//             console.log(data);
//             if (data.status == 900) {
//               console.log('您已领取过体验券!');
//               wx.showToast({
//                 title: '您已领取过体验券!',
//                 duration: 1500,
//                 icon:'none'
//               })
//               setTimeout(function () {
//                 wx.navigateTo({
//                   url: '../../pages/Signup/Signup',
//                 })
//               }, 1500)
//               return;
//             } else {
//               //零元支付
//               activity.payWithNoWx(data.data.orderNo, datas => {
//                 console.log('领券成功!');
//                 if (datas.status == 200) {
//                   wx.showToast({
//                     title: '领券成功!',
//                     duration: 1500,
//                   })
//                   setTimeout(function() {
//                     wx.navigateTo({
//                       url: '../../pages/Signup/Signup',
//                     })
//                   }, 1500)
//                 }
//               }, res => {})
//             }
//           }, res => {});
//         }
//       },
//       fail: function(res) {
//         // 转发失败之后的回调        　　　　　　
//         if (res.errMsg == 'shareAppMessage:cancel') {
//           // 用户取消转发

//         } else if (res.errMsg == 'shareAppMessage:fail') {
//           // 转发失败，其中 detail message 为详细失败信息

//         }
//       },
//       complete: function(res) {
//         // 转发结束之后的回调（转发成不成功都会执行）
// console.log(res);
//       },
//     };
//     return shareobj;
//   },
  //电话咨询
  makephonecall: function() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phoneNumber,
    })
  },
  //去验证手机
  gotoregister: function() {
    var that = this;
    wx.navigateTo({
      url: '../../pages/register/register?tag=activityfx' + '&activeId=' + that.data.activeId + '&activeType=' + that.data.activeType,
    })
  },
  //获取详情
  selectActiveById: function(activeId, activeType) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    activity.selectActiveById(activeId, activeType, data => {
      // console.log(data.data);
      var moneycount = 0;
      if (data.data.platformPrice == '' || data.data.platformPrice == null) {
        moneycount = data.data.activityPrice;
      } else {
        moneycount = data.data.platformPrice;
      }

      that.setData({
        activityData: data.data,
        yuyuemoney: (moneycount * 0.15).toFixed(2),
        payafter: (moneycount - (moneycount * 0.15)).toFixed(2)
      })
      WxParse.wxParse('activity_buy', 'html', data.data.contxt, that, 5);
      // 隐藏加载框
      wx.hideLoading();
    }, res => {});
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
})