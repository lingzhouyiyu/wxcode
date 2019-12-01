import {
  Mine
} from '../../models/mine.js'
let recharge = new Mine()
//获取应用实例
const app = getApp()

var phonedata='';
var moneyValue='';
var rate='';
var newrate=1;
// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {   
    optionsArray: [{ text: 50, selected: false, rate: 10 }, { text: 100, selected: false, rate: 15 }, { text: 200, selected: false, rate: 17 }, { text: 500, selected: false, rate: 20 }, { text: 1000, selected: false, rate: 25 }, { text: 3000, selected: false, rate: 40 }],
    inputValue:'',//其他金额
    rates:1,
    agree:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    phonedata = options.phonedata;
   
    app.globalData.userPhone = options.phonedata;

    this.getRate();
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
    // 停止下拉动作
    wx.stopPullDownRefresh();
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
  selectitem:function(e){
    var that=this;
    var index = e.currentTarget.dataset.index;
    var arrs = that.data.optionsArray;

    for(let i=0;i<arrs.length;i++){
      if(index==i){
        arrs[i].selected = !arrs[i].selected;
      }else{
        arrs[i].selected = false;
      }
    }  
    that.setData({
      optionsArray: arrs,
      inputValue:''
    })
    that.getSelectedValue().then(res => {
      moneyValue = res[0];
      newrate = res[1];
    })
  },
  tapselect:function(){
    var that=this;
    that.setData({
      agree: !that.data.agree
    })
  },
  // 充值说明弹框
  submit: function () {
    this.setData({
      showModal: true
    })
  },
  preventTouchMove: function () {
    return;
  },
  close_mask: function () {
    this.setData({
      showModal: false
    })
  },
  //获取输入框值
  getvalue:function(e){
    var that=this;  
    moneyValue = e.detail.value;
    var temp = that.data.optionsArray;
    for (let i = 0; i < temp.length; i++) {
      temp[i].selected=false;   
    }
    this.setData({
      inputValue: e.detail.value,
      optionsArray:temp
    })
  },
  //选择的充值金额
  getSelectedValue:function(){
    return new Promise((resove, reject)=>{
       //充值金额
      var selectedValue = "";
        //充值比例
      var selectedrate=1;
      var that = this;
      for (let i = 0; i < this.data.optionsArray.length; i++) {
        if (that.data.optionsArray[i].selected) {
          selectedValue = selectedValue + that.data.optionsArray[i].text + ',';
          selectedrate = that.data.optionsArray[i].rate;
          break;
        }
      }     
      var res = selectedValue.substring(0, selectedValue.length - 1);
      var temp=[];
      temp.push(res);
      temp.push(selectedrate);
      resove(temp);
    })
  },
  //获取充值比例
  getRate:function(){
    recharge.getRate(data=>{     
      rate = data.data.rate;
      this.setData({
        rates:data.data.rate
      })
    },res=>{})
  },
  //充值
  toPay:function(){
    var that=this;
 
    if (parseInt(moneyValue) > 50000) {
      wx.showToast({
        title: '充值金额不能超过5万!',
        duration: 1000,
        icon: 'none'
      })
      return;
    }
    if (moneyValue == '') {
      wx.showToast({
        title: '请选择或输入充值金额!',
        duration: 1000,
        icon: 'none'
      })
      return;
     
    }
    if (!that.data.agree) {
      wx.showToast({
        title: '请点击同意充值协议!',
        duration: 2000,
        icon: 'none'
      })
      return;
    } 
      recharge.generateOrder(moneyValue, newrate, app.globalData.openid, phonedata, data => {
        // console.log(data);
        if (data.status==200){        
          this.wxPayment(data.data);
        }
      }, res => {});
           
  },
  /**
  * 调用微信支付
  */
  wxPayment: function (options) {
    var that = this;
    wx.requestPayment({
      'timeStamp': options.timeStamp,
      'nonceStr': options.nonceStr,
      'package': options.package,
      'signType': options.signType,
      'paySign': options.paySign,
      'success': function (res) {
        if (res.errMsg == "requestPayment:ok") {
          //支付成功
          wx.showToast({
            title: '充值成功',
            duration: 1000,
            icon: 'success',
            success:function(){
              wx.switchTab({
                url: '../../pages/mine/mine',
              })
            }
          });         
        }
      },
      'fail': function (res) {
       
      },
      'complete': function (res) {
        
      }
    })
  },

  //查询明细
  getWawowCoinOrder:function(){
    wx.navigateTo({
      url: '../../pages/coinOrderDetail/coinOrderDetail',
    })
  },
  //充值协议
  gotorechargeProtocol:function(){
    wx.navigateTo({
      url: '../../pages/rechargeProtocol/rechargeProtocol',
    })
  },
})