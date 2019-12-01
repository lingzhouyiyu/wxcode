import {
  Detailinstitution
} from '../../models/detailinstitution.js'
let detailinstitution = new Detailinstitution();

//获取应用实例
const app = getApp();

var limit = 10;
var page = 1;
var hasNextPage=false;
var nextPage=2;
//优惠券id
var vid = '';
var tags = '';
var phonedata = '';
var courseAdvancePayment = '';
var courseId='';
// pages/ coupon/ coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    animationData: '',
    hongbaoList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    tags = options.tag;
    if (tags == 'confirmOrder') {
      vid = options.id;
      phonedata = options.phonedata;
      courseAdvancePayment = options.courseAdvancePayment;
      courseId = options.courseId;
    }else{
      vid = '';
    }

    this.selectMyCoupon();
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
    this.selectMyCoupon();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that=this;
    if (hasNextPage){
      that.selectMyCouponLoad();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //  弹框函数
  //显示对话框
  showModal: function() {
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
  //获取优惠券
  selectMyCoupon: function() {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    detailinstitution.selectMyCoupon(limit,page, app.globalData.openid, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var newdatas = data.data;     
      for (let i = 0; i < newdatas.length; i++) {
        newdatas[i].startTime = newdatas[i].startTime.substring(0, 10);
        newdatas[i].endTime = newdatas[i].endTime.substring(0, 10);
     
        if (newdatas[i].couponId == vid) {
          newdatas[i].selected = true;
        } else {
          newdatas[i].selected = false;
        }
      }
      that.setData({
        hongbaoList: newdatas
      });
    }, res => {});
  },
  //优惠券加载
  selectMyCouponLoad: function () {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    detailinstitution.selectMyCoupon(limit, nextPage, app.globalData.openid, data => {
      // 隐藏加载框
      wx.hideLoading();
      hasNextPage = data.hasNextPage;
      nextPage = data.nextPage;
      var temp = that.data.hongbaoList;
      var newdatas = data.data;
      for (let i = 0; i < newdatas.length; i++) {
        newdatas[i].startTime = newdatas[i].startTime.substring(0, 10);
        newdatas[i].endTime = newdatas[i].endTime.substring(0, 10);

        if (newdatas[i].id == vid) {
          newdatas[i].selected = true;
        } else {
          newdatas[i].selected = false;
        }
        temp.push(newdatas[i]);
      }
     
    
      that.setData({
        hongbaoList: temp
      });
    }, res => { });
  },
  //跳转到订单详情
  gotoconfirmOrder: function(e) {
    var that = this;

    if (tags == 'confirmOrder') {
      var maxPrice = e.currentTarget.dataset.maxprice;
      if (Number(courseAdvancePayment) < Number(maxPrice)) {//红包金额大于课程价格
        wx.showToast({
          title: '不满足红包使用条件!',
          duration: 1000,
          icon: 'none'
        })
        return;
      } else {
        wx.showModal({
          title: '提示',
          content: '确定选择该红包吗?',
          success: function(res) {
            if (res.confirm) {
              var id = e.currentTarget.dataset.id;
              var money = e.currentTarget.dataset.money;
              wx.navigateTo({
                url: '../../pages/orders/confirmOrder/confirmOrder?id=' + id + '&money=' + money + '&tag=coupon' + '&phonedata=' + phonedata + '&courseAdvancePayment=' + courseAdvancePayment + '&courseId=' + courseId,
              })

            } else if (res.cancel) {

            }
          }
        })
      }

    }
  },
  myCatchTouch: function () {
    return;
  },
})