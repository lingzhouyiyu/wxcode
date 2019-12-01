import {
  ConfirmOrder
} from '../../../models/confirmOrder.js'
let refund = new ConfirmOrder()

//获取应用实例
const app = getApp()

var refundType=0;
// pages/orders/refund/refund.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNo: "",
    showTag: false,
    showschoolTag: false,
    // optionpanelItem: ['使用红包重新下单', '太忙了没时间', '个人身体原因', '距离远，不想做', '订单已过期', '商品拍错/拍多', '想更换其他老师/学校', '反馈其他原因',],
    optionpanelItem: [{ text: '使用红包重新下单', selected: false }, { text: '太忙了没时间', selected: false }, { text: '个人身体原因', selected: false }, { text: '距离远，不想做', selected: false }, { text: '订单已过期', selected: false }, { text: '商品拍错/拍多', selected: false }, { text: '想更换其他老师/学校', selected: false }],
    schoolpanelItem: [{ text: '学校距离太远', selected: false }, { text: '师资匮乏', selected: false }, { text: '课程僵化', selected: false }, { text: '没有自主开发的中心课程', selected: false }, { text: '缺乏针对性和系统性', selected: false }, { text: '没有办学许可证', selected: false }, { text: '学费太贵', selected: false }],
    selectTag:'',
    refundReason: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderNo: options.orderNo,
    });
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
  showoption: function() {
    refundType=0;
    var that = this;
    that.setData({
      showTag: !that.data.showTag,
      showschoolTag: false,
    })
  },
  showschool:function(){
    refundType = 1;
    var that = this; 
    that.setData({
      showschoolTag: !that.data.showschoolTag,
      showTag: false,
    })
  },
  selectoption:function(e){

    var that = this;
    let index = e.currentTarget.dataset.select;
    let arrs = this.data.optionpanelItem;
    if (arrs[index].selected == false) {
      arrs[index].selected = true;
    } else {
      arrs[index].selected = false;
    }
    this.setData({
      optionpanelItem: arrs
    })

    that.setData({
      selectTag: e.currentTarget.dataset.select,
    })
  },
  selectschool: function (e) {

    var that = this;
    let index = e.currentTarget.dataset.select;
    let arrs = this.data.schoolpanelItem;
    if (arrs[index].selected == false) {
      arrs[index].selected = true;
    } else {
      arrs[index].selected = false;
    }
    this.setData({
      schoolpanelItem: arrs
    })

    that.setData({
      selectTag: e.currentTarget.dataset.select,
    })
  },

  //获取个人原因
  getPersonalReason:function(){
    return new Promise((resove, reject) => {

      var PersonalReason = "";
      var that = this;
      for (let i = 0; i < this.data.optionpanelItem.length; i++) {
        if (that.data.optionpanelItem[i].selected) {
          PersonalReason = PersonalReason + that.data.optionpanelItem[i].text + ',';
        }
      }
      var res = PersonalReason.substring(0, PersonalReason.length - 1);
      resove(res);
    })
    
  },
  //获取学校原因
  getSchoolReason: function () {
    return new Promise((resove, reject) => {
      var SchoolReason = "";
      var that = this;
      for (let i = 0; i < this.data.schoolpanelItem.length; i++) {
        if (that.data.schoolpanelItem[i].selected) {
          SchoolReason = SchoolReason + that.data.schoolpanelItem[i].text + ',';
        }
      }
      var res = SchoolReason.substring(0, SchoolReason.length - 1);
      resove(res);
    })
    
  },
  //提交
  applicationRefund: function () {
     var that=this;
    var userId = app.globalData.openid;
    // refundReason
    if (refundType == 0){
      this.getPersonalReason().then(res => {
     
        refund.applicationRefund(userId,that.data.orderNo, res, refundType, data => {
          wx.showToast({
            title: '申请成功!',
            duration: 1500,
          })         
          setTimeout(function () {
            wx.navigateTo({
              url: '../../../pages/orders/myOrder/myOrder?optselect=listfour',
            })
          }, 1500)
        }, res => { });
      })
    }else{
      this.getSchoolReason().then(res => {

        refund.applicationRefund(userId, that.data.orderNo, res, refundType, data => {
          wx.showToast({
            title: '申请成功!',
            duration:1500,            
          })
          setTimeout(function () {
            wx.navigateTo({
              url: '../../../pages/orders/myOrder/myOrder?optselect=listfour',
            })
          }, 1500)
        }, res => { });
      })
    }
    
  },

})