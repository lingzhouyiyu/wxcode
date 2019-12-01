import {
  Mine
} from '../../models/mine.js'
const mine = new Mine()
//获取应用实例
const app = getApp()

// pages/applyInstitution/applyInstitution.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  selectTag:true,
    dropdownboxArray: ['50人以下','50-100人','100人以上'],
    selectData:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  selectguimo:function(){
    var that=this;
    that.setData({
      selectTag: !this.data.selectTag,
    })
  },
  selectitem:function(e){
    var that = this;
    that.setData({
      selectData: e.currentTarget.dataset.select,
    })
    // console.log(this.data.selectTag);
  },
  //保存数据
  submitdata:function(e){

    var that = this;
    var schoolAddress = e.detail.value.schoolAddress;
    var schoolLeader = e.detail.value.schoolLeader;
    var schoolName = e.detail.value.schoolName;
    var schoolPhone = e.detail.value.schoolPhone;
    var schoolScale = e.detail.value.schoolScale;
    if (schoolName == '') {
      wx.showToast({
        title: '学校名称不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (schoolScale == '') {
      wx.showToast({
        title: '规模不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (schoolLeader == '') {
      wx.showToast({
        title: '负责人不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (schoolPhone == '') {
      wx.showToast({
        title: '联系电话不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(schoolPhone))) {
      wx.showToast({
        title: '联系电话有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (schoolPhone.length > 11) {
      wx.showToast({
        title: '联系电话有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (schoolAddress == '') {
      wx.showToast({
        title: '地址不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    mine.addSchoolInfo(schoolAddress, schoolLeader, schoolName, schoolPhone, schoolScale, data => {
      console.log(data);  
      wx.showToast({
        title: '申请已提交!',
        duration:1500,
      }) 

      setTimeout(function () {
        wx.navigateBack();
      }, 1500)
     
    }, res => {});
  },
})