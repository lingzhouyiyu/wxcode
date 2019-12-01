// pages/applySuccess/applySuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModalStatus: false,
    showModalStatu: false,
    showModalStatus_share:false,
    editTag: false,
    labelArray: [{
        text: '标签一',
        selected: true
      },
      {
        text: '标签二',
        selected: true
      },
      {
        text: '标签三',
        selected: true
      },
      {
        text: '标签四',
        selected: true
      },
      {
        text: '标签五',
        selected: true
      },
      {
        text: '标签六',
        selected: true
      },
      {
        text: '标签七',
        selected: true
      },
      {
        text: '标签八',
        selected: true
      },
      {
        text: '标签九',
        selected: true
      },
    ],
    selectCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  //从业年限弹框
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
  //打call弹框
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
      showModalStatu: true
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModals: function() {
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
        showModalStatu: false
      })
    }.bind(this), 200)
  },
  //分享弹框
  //显示对话框
  showshareModal: function () {
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
      showModalStatus_share: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideshareModal: function () {
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
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus_share: false
      })
    }.bind(this), 200)
  },
  selectitem: function(e) {

    var that = this;
    var temparray = this.data.labelArray;

    for (var i = 0; i < temparray.length; i++) {
      if (temparray[i].text == e.currentTarget.dataset.select) {
        temparray[i].selected = !temparray[i].selected;
        if (temparray[i].selected == true) {
          that.setData({
            selectCount: that.data.selectCount - 1
          })
        } else {
          that.setData({
            selectCount: that.data.selectCount + 1
          })
        }
        // console.log(that.data.selectCount);
        if (that.data.selectCount > 3) {
          break;
          return;
        }

        that.setData({
          labelArray: temparray,
        })
        break;
      }
    }
  },
  editData: function() {
    var that = this;
    that.setData({
      editTag: !that.data.editTag,
    })
  },
  saveData: function() {

  },
  saveChanges: function() {
    wx.showModal({
      title: '继续开通师承推广',
      content: '您已认证成功，是否一键开通师承推广？',
      cancelText: '否',
      confirmText: '是',
      confirmColor: '#1CB2FD',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击是')
        } else {
          console.log('用户点击否')
        }

      }
    })
  },
  shareTo:function(){
    this.showshareModal();
  },
  saveImg:function(){
   
  }
})