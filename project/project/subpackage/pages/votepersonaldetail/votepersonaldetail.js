import {
  Vote
} from '../../models/vote.js'

let vote = new Vote();

//获取应用实例
const app = getApp()
// pages/votepersonaldetail/votepersonaldetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personaldata:[],
    Furl: app.globalData.Serverurl,
    id:'',
    moreimg:true,
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options.scene) {
      console.log("has scene");
      var scene = decodeURIComponent(options.scene);
      console.log("scene is ", scene);
      var arrPara = scene.split(",");
      
      this.setData({
        id: arrPara[1]
      })
      this.getUserInfo(arrPara[1]);
    } else {
      this.getUserInfo(options.id);
      this.setData({
        id: options.id
      })
    }
  
    
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
    this.getUserInfo(this.data.id);
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
  gotoindex: function () {
    wx.redirectTo({
      url: '../../../subpackage/pages/vote/vote',
    })
  },
  gotovoteshare:function(){
    var that=this;
    wx.navigateTo({
      url: '../../pages/voteshare/voteshare?tag=personalshare' + '&name=' + that.data.personaldata.name + '&number=' + that.data.personaldata.id,
    })
  },
  //获取个人详情
  getUserInfo: function (id) {
    var that = this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    vote.getUserInfo(id, data => {
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      if (data.status == 200) {
        data.data.headerimg = data.data.image.split(',')[0];
        data.data.image=data.data.image.split(',')
      
        data.data.introduce = data.data.introduce.replace(/\r\n/g, "");
        data.data.introduce = data.data.introduce.replace(/\n/g, "");
        data.data.introduce = data.data.introduce.replace(/\s/g, "");
    
        if (data.data.image.length==2){
            
            that.setData({
              moreimg:false
            })
        }
        that.setData({
          personaldata: data.data
        })
      }
    }, res => { })
  },
  //个人投票
  addPersonalVote: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    vote.addPersonalVote(id, app.globalData.openid, data => {   
     
        if (data.msg =='909'){
            wx.showToast({
              title: '今日已经投票！',
              icon:'none',
              duration:1000
            })
            setTimeout(function(){
              wx.navigateTo({
                url: '../../../subpackage/pages/vote/vote',
              })
            },1000);
           
        } else if (data.msg == '200' || data.msg == '910'){
          wx.showToast({
            title: '投票成功',
          })
          that.getUserInfo(that.data.id);
          setTimeout(function () {
            wx.navigateTo({
              url: '../../../subpackage/pages/vote/vote',
            })
          }, 2000);
        }      
      
    }, res => { });
  },
  // 图片预览
  previewImage: function (e) {
    var that=this;
    var current = e.target.dataset.src
    var temp = that.data.personaldata.image;
    for (let i = 0; i < temp.length;i++){
      temp[i] = that.data.Furl+temp[i];
    }
    wx.previewImage({
      current: current,
      urls: temp
    })
  },
  signDetail: function () {
    var that = this;
    that.setData({
      showModal: true
    })
  },
  //关闭活动弹框
  close_mask: function () {
    this.setData({
      showModal: false
    })
  },
})