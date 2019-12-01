// pages/nk/task/task.js
var task_id = null;  //任务id
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {    
    ClassesInfo: {},
    TicketList: [],
    TaskID:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    task_id = options.id;
    this.setData({ TaskID: task_id})
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
    this.loadTaskInfo();
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
    this.loadTaskInfo();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },



  //1.任务确认
  optionSure: function () {
    var that = this;
    wx.showModal({
      title: '温馨提示：',
      content: '确认开始此任务吗？',
      cancelText: '稍后再说',
      confirmText: '马上开始',
      confirmColor: '#3cc51f',
      success(res) {
        if (res.confirm) {
          that.ModifyStatus(1);
        } else if (res.cancel) {

        }
      }
    })
  },
  //2.发车确认
  optionStart: function () {
    var that = this;
    wx.showModal({
      title: '温馨提示：',
      content: '确认发车吗？',
      cancelText: '稍后再说',
      confirmText: '马上开始',
      confirmColor: '#3cc51f',
      success(res) {
        if (res.confirm) {
          that.ModifyStatus(2);
        } else if (res.cancel) {
        }
      }
    })
  },
  //3.任务完成确认
  optionEnd: function () {
    var that = this;
    wx.showModal({
      title: '温馨提示：',
      content: '确认此任务已完成吗？',
      cancelText: '稍后再说',
      confirmText: '确认完成',
      confirmColor: '#3cc51f',
      success(res) {
        if (res.confirm) {
          that.ModifyStatus(3);
        } else if (res.cancel) {
        }
      }
    })
  },

 //点击订单条目
  clickOrder: function (event) {
    var indexStr = event.currentTarget.dataset.index;
    var ticketObj = this.data.TicketList[indexStr];
    var optionList;
    var itemList;

    if (this.data.ClassesInfo.Status == 0) {
      return;
    }
    else if (this.data.ClassesInfo.Status == 1) {
      if (ticketObj.PaymentStatus == '0') { //未支付
        return;
      }
      else if (ticketObj.PaymentStatus == '2') { //已退款
        return;
      }
      else if (ticketObj.Checked == '0') { //未检票
        if (app.NKOBJ.Account == ticketObj.UserId) {
          optionList = [{ 'name': '设置为已检票', 'value': '1' }, { 'name': '退票', 'value': 'refundorder' }];
          itemList = ['设置为已检票', '退票'];
        }
        else {
          optionList = [{ 'name': '设置为已检票', 'value': '1' }];
          itemList = ['设置为已检票'];
          //optionList = [{ 'name': '设置为已检票', 'value': '1' }, { 'name': '取消', 'value': 'cancel' }];
          //itemList = ['设置为已检票', '取消'];
        }
      }
      else if (ticketObj.Checked == '2') { //已下车
        return;
      }
    }
    else if (this.data.ClassesInfo.Status == 2){
      if (ticketObj.Checked == '1') { //已检票
        //optionList = [{ 'name': '设置为已下车', 'value': '2' }, { 'name': '设置为未检票', 'value': '0' }];
        //itemList = ['设置为已下车', '设置为未检票'];
        optionList = [{ 'name': '设置为已下车', 'value': '2' }];
        itemList = ['设置为已下车'];
      }
      else if (ticketObj.Checked == '0') { //未检票
        if (app.NKOBJ.Account == ticketObj.UserId) {
          optionList = [{ 'name': '设置为已检票', 'value': '1' }, { 'name': '退票', 'value': 'refundorder' }];
          itemList = ['设置为已检票', '退票'];
        }
        else {
          optionList = [{ 'name': '设置为已检票', 'value': '1' }];
          itemList = ['设置为已检票'];
          //optionList = [{ 'name': '设置为已检票', 'value': '1' }, { 'name': '关闭菜单', 'value': 'cancel' }];
          //itemList = ['设置为已检票', '关闭菜单'];
        }
      }
      else{
        return;
      }
   
    }
    else{
      return;
    }


   
    
    wx.getSystemInfo({
      success(res) {
        if (res.platform=="android"){
          optionList[optionList.length] = { 'name': '关闭菜单', 'value': 'cancel' };
          itemList[itemList.length] = '关闭菜单'
        }
      }
    })
    var that = this;
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        console.log(optionList[res.tapIndex].name);
        console.log(optionList[res.tapIndex].value);
        var ticketNo = event.currentTarget.id;        

        var targetStatus = optionList[res.tapIndex].value;
        if (targetStatus == 'cancel'){  //取消

        }
        else if (targetStatus == 'refundorder'){ //退票
          that.RefundOrder(ticketNo);
        }
        else{ //其他改变订单状态操作
          that.ModifyOrderStatus(ticketNo, targetStatus, indexStr);
        }
          
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },


  //退票操作
  RefundOrder: function(ticketNo, targetStatus, indexStr){
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_OrderList/API_RefundOrderByDriver',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: app.XSDZOBJ.Account,  //账号
        ticketNo: ticketNo, //票号
        fee:0
      },
      success: function (res) {
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }

        wx.hideToast();
        //登录超时处理结束    
        if (res.data.type == '1') {
          that.loadTaskInfo();
        }
        else {
          wx.showToast({
            title: res.data.message, icon: 'none', duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.hideToast();
        //console.log(res);
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {

      }
    })

  },

//读取任务信息
  loadTaskInfo:function(){
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_getClassDetail',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: app.NKOBJ.Account,  //账号
        classesId: task_id, //班次编号
      },
      success: function (res) {
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束


        if (res.data.resultdata) {
          var tempClassInfo = res.data.resultdata.ClassesInfo;
          tempClassInfo.UseDate = res.data.resultdata.ClassesInfo.UseDate.substr(0, 10);
          that.setData({
            ClassesInfo: tempClassInfo,
            TicketList: res.data.resultdata.TicketList,
          })
        }
        else {
          wx.showToast({
            title: '获取数据失败', icon: 'none', duration: 2000
          })
        }
        wx.hideToast();
      },
      fail: function (res) {
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
      }
    })
  },

  //修改班次状态
  ModifyStatus: function (targetStatus) {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_ModifyStatus',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: app.XSDZOBJ.Account,  //账号
        classesId: task_id, //班次编号
        status:targetStatus
      },
      success: function (res) {
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }

        wx.hideToast();
        //登录超时处理结束    
        if (res.data.type=='1'){
          that.loadTaskInfo();  
        }
        else{
          wx.showToast({
            title: res.data.message, icon: 'none', duration: 2000
          })
        }
  

      },
      fail: function (res) {
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
        
      }
    })


  },

//3.17.	检票及下车
  ModifyOrderStatus: function (ticketNo, targetStatus, indexStr) {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_OrderList/API_CheckTicket',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: '',  //账号
        ticketNo: ticketNo, //票号
        status: targetStatus
      },
      success: function (res) {
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束


        if (res.data.type=='1') {
          //that.setData({
          //  ClassesInfo: res.data.resultdata.ClassesInfo,
          //  TicketList: res.data.resultdata.TicketList,
          //})   
          that.loadTaskInfo();
          wx.hideToast();
        }
        else {          
          wx.showToast({
            title: res.data.message, icon: 'none', duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.hideToast();
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
      }
    })
  }
})