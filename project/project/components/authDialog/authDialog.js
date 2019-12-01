
import {
  IndexModel
} from '../../models/index.js'
let indexModel = new IndexModel()
// components/authDialog/authDialog.js
const app = getApp()
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 模态窗
    /**
     * 弹出框蒙层截断touchmove事件
     */
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showModal: false
      });
    },
    //显示对话框
    showModal: function () {

      this.setData({
        showModal: true
      });
    },
    /**
     * 对话框取消按钮点击事件
     */
    onCancel: function () {
      this.hideModal();
    },
    /**
     * 对话框确认按钮点击事件
     */
    onConfirm: function () {      
      this.hideModal();
    },
    bindGetUserInfo:function(){
      var that=this;
      that.hideModal();
      this.setData({
        showModal: false
      });
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            app.globalData.hasAuth = true;
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                app.globalData.userInfo = res.userInfo
                //点击后给父组件可以通过bindcitytap事件，获取到cityname的值，这是子组件给父组件传值和触发事件的方法
                that.triggerEvent('myevent', {
                  userInfo: res.userInfo,              
                });
                indexModel.updateUser(res.userInfo.avatarUrl, res.userInfo.nickName, app.globalData.openid ,data=>{
                },res=>{});
                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }else{
            app.globalData.hasAuth = false;
          }

        }
      })
    }
  }
})
