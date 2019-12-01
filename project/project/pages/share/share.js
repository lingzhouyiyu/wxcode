import {
  Mine
} from '../../models/mine.js'
let mine = new Mine()
//获取应用实例
const app = getApp()
// pages/share/share.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    Furl: app.globalData.Serverurl,
    codeimgurl:'',
    windowWidth:0,
    windowHeight:0,
    scale:0,
    imgurl:'',
    hide:false,
    shareCount:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      windowWidth:wx.getSystemInfoSync().windowWidth,
      windowHeight: wx.getSystemInfoSync().windowHeight,
    })
    if (app.globalData.openid == null || app.globalData.openid == '') {
      this.getToken().then(res => {
        //获取用户分享次数
        this.userIsAuth();
        // 获取二维码
        this.wxcode();
      })
    } else {
      //获取用户分享次数
      this.userIsAuth();
      // 获取二维码
      this.wxcode();
    }

  },
  //用户登录
  getToken: function () {
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
          }, data => { })
        }
      })
    })
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
    this.userIsAuth();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
    * 用户点击右上角分享
    */
  onShareAppMessage: function (options) {
    var that = this;
    var openid=app.globalData.openid;
    var shareobj = {
      title: "蛙涡教育",
      path: 'pages/index/index?openid=' + openid,
      imgUrl: '',
      withShareTicket: true    
    };
    return shareobj;
  },
  userIsAuth:function(){
    var that=this;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    mine.userIsAuth(app.globalData.openid,data=>{
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
      // 停止下拉动作
      wx.stopPullDownRefresh();
      that.setData({
        shareCount: data.data.shareCount
      })
    },res=>{});
  },
  wxcode:function(){
    var that=this;
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    //获取小程序码
    mine.wxcodeparm(app.globalData.openid, 'pages/index/index','',data=>{
      console.log(data);
      //获取小程序码临时路径
      wx.downloadFile({
        url:that.data.Furl+data.msg,
        success:function(res){             
          that.setData({           
            codeimgurl: res.tempFilePath
          })
          //开始绘制图片
          that.drawImage();
      
          setTimeout(function () {
            that.canvasToImage()
          }, 2000)

        }
      })
    },res=>{})
  },
  drawImage() {
    //绘制canvas图片
    var that = this
    const ctx = wx.createCanvasContext('myCanvas')
    var bgPath = '../../images/share/share.jpg'
    // var portraitPath = that.data.portrait_temp
    var hostNickname = app.globalData.userInfo.nickName

    var qrPath = that.data.codeimgurl;
    var windowWidth = that.data.windowWidth;
    var windowHeight = that.data.windowHeight;
    that.setData({
      scale: 1.6
    })
    //设置边框
    ctx.lineWidth = 1;//设置边框大写
    ctx.strokeStyle = "#bcbcbc";//填充边框颜色
    ctx.fillStyle = "#fff";//填充实体颜色
    ctx.strokeRect(1, 0, windowWidth * 0.765, windowHeight * 0.645);//对边框的设置
    ctx.fillRect(1, 0, windowWidth*0.765, windowHeight * 0.645);//对内容的设置
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth*0.77, windowHeight*0.65*0.78)

    //绘制头像
    // ctx.save()
    // ctx.beginPath()
    // ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    // ctx.clip()
    // ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    // ctx.restore()
    // 绘制第一段文本
    ctx.setFillStyle('#4a4a4a')
    ctx.setFontSize(12)
    ctx.setTextAlign('left')
    ctx.fillText('我是' + hostNickname, 10, windowHeight * 0.65 * 0.85)
    //绘制第二段文本
    ctx.setFillStyle('#4a4a4a')
    ctx.setFontSize(12)
    ctx.setTextAlign('left')
    ctx.fillText('邀请你一起学习啦~', 10, windowHeight * 0.65 * 0.9)
    //绘制二维码
    ctx.drawImage(qrPath, windowWidth * 0.6, windowHeight * 0.65 * 0.81, windowWidth * 0.15, windowWidth * 0.15)
    //绘制第三段文本
    ctx.setFillStyle('#4a4a4a')
    ctx.setFontSize(10)
    ctx.setTextAlign('left')
    ctx.fillText('识别小程序二维码，精选好课程', 10, windowHeight * 0.65 * 0.95)
    ctx.draw();
  },
  //绘制完图片后还要把它转化成图片
  canvasToImage() {
    var that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: that.data.windowWidth * 0.77 * 15,
      height: that.data.windowHeight * 0.65 * 15,
      destWidth: that.data.windowWidth * 0.77*15,
      destHeight: that.data.windowHeight * 0.65*15,
      canvasId: 'myCanvas',
      success: function (res) {
        
        that.setData({
          imgurl: res.tempFilePath        
        })
        setTimeout(function () {
          that.setData({
            hide: true
          })
        }, 1000)
        
      
        // 隐藏加载框
        wx.hideLoading();
      },
      fail: function (err) {
      
      }
    })
  },
  previewImage:function(){
    var that=this;
    wx.previewImage({
      current: that.data.codeimgurl, // 当前显示图片的http链接
      urls: [that.data.codeimgurl] // 需要预览的图片http链接列表
    })
  },
  saveImg:function(){
    var that=this;
    wx.showLoading({
      title: '图片保存中',
    })
   wx.getSetting({
     success:function(res){
       wx.authorize({
         scope: 'scope.writePhotosAlbum',
         success:function(e){
            wx.saveImageToPhotosAlbum({
              filePath: that.data.imgurl,
              success:function(r){
                 wx.showToast({
                   title: '保存成功!',
                   duration: 1500,
                   icon: 'success'
                 })
                setTimeout(function () {
                  // 隐藏加载框
                  wx.hideLoading();
                }, 1000)
              }
            })
         }
       })
     }
   })
  },
})