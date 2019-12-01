//
const util = require('../../utils/util.js')
import {
  Classification
} from '../../models/classification.js'
let classification = new Classification()
//获取应用实例
const app = getApp()

// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Furl: app.globalData.Serverurl,
    itemselect: 0,
    childData: [],
    classificationArray: [],
    bannersimages: ['../../images/test.jpg', '../../images/test.jpg', '../../images/test.jpg', '../../images/test.jpg'],
    cateID: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that=this;
    this.getTree();
    that.setData({
      itemselect: 0,
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
  gotonotice: function() {
    wx.navigateTo({
      url: '../../pages/notice/notice',
    })
  },
  tabSelect: function(e) {
    var that = this;
    var danceCategoryId = e.currentTarget.dataset.dancecategoryid;
    // this.getimg(danceCategoryId);

    that.setData({ //把选中值放入判断值
      itemselect: e.currentTarget.dataset.select,
      childData: e.currentTarget.dataset.child
    })

  },
  gotoDetail: function(e) {
    // console.log(e.currentTarget.dataset.dancecategoryid);
    var danceCategoryId = e.currentTarget.dataset.dancecategoryid;
    wx.navigateTo({
      url: '../../pages/details/details?danceCategoryId=' + danceCategoryId,
    })
  },
  gotoactive: function(e) {
    var activeId = '1000000687007292';
    var activeType = 6;
    wx.navigateTo({
      url: '../../pages/activity_buy/activity_buy?activeId=' + activeId + '&activeType=' + activeType,
    })
  },
  //获取分类树形数据
  getTree: function() {
    classification.getTree(data => {

      this.getimg(data[0].danceCategoryId);
      this.setData({
        classificationArray: data,
        childData: data[0].childList,
      });
    }, res => {});
  },
  //获取轮播图
  getimg: function(categoryId) {
    var that = this;
    classification.getimg(categoryId, data => {
      var temp = data.data;
      for (let i = 0; i < temp.length; i++) {
        temp[i].imgarray = temp[i].imgurl.split(',');
      }
      // console.log(temp);
      that.setData({
        bannersimages: temp,
      });
      // console.log(temp);
    }, res => {});
  },
  //分类页轮播图详情数据
  selectAdvertingById: function(Id) {

    classification.selectAdvertingById('', data => {
    }, res => {});
  },
})