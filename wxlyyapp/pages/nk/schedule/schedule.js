// pages/nk/schedule/schedule.js

var utils = require('../../../utils/util.js')
const todydate = utils.getFormatDate(new Date());
var d = new Date()
d.setMonth(d.getMonth() + 1);
const enddate = utils.getFormatDate(d);

var app = getApp();
Page({
  /* 页面的初始数据 */
  data: {
    windowHeight: app.devheight,
    date: todydate,
    startSelsctDate:'2018-11-01',
    endSelsctDate: enddate,
    taskList: [],
    routeList: [],
    routeArray: [],
    routeIndex: 0,
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
    this.loadRoutesAndClass(); //获取区线路信息和班次信息    
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
    this.loadClass(); //读取班次信息
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


  //线路选择
  bindRouteChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      routeIndex: e.detail.value
    })
    this.loadClass();
  },

  //日期选择
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  //前一天
  preDay: function(){
    
    var d = new Date(this.data.date);
    var sd = new Date(this.data.startSelsctDate);
    if (sd < d){
      d.setDate(d.getDate() - 1);
      this.setData({
        date: utils.getFormatDate(d)
      });
      this.loadClass(); //读取班次信息
    }
    else{
      wx.showToast({
        title: '日期已最早,不能早了！',
        icon: 'none',
        duration: 2000
      })
    }

  },

  //后一天
  nextDay: function(){
    var d = new Date(this.data.date)
    d.setDate(d.getDate() + 1);
    this.setData({
      date: utils.getFormatDate(d)
    });
    this.loadClass(); //读取班次信息
  },

  //删除操作
  deleteOption: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset.id);
    wx.showModal({
      title: '温馨提示：',
      content: '删除后不能恢复，确认删除此班次吗？',
      cancelText: '稍后再说',
      confirmText: '立即删除',
      confirmColor: '#3cc51f',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          that.doDelete(e.currentTarget.dataset.id, that.loadClass);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //发送删除请求
  doDelete: function (classes_Id,fn) {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_DeleteClasses',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        Account: app.NKOBJ.Account,  //账号
        classesId: classes_Id, //班次编号
      },
      success: function (res) {
        wx.hideToast();
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        wx.showToast({
          title: res.data.message, icon: 'none', duration: 2000
        });
        
        fn();//执行回调
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

 //上移操作
  putindexOption: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.id);
    console.log(event.currentTarget.id);
    var valueList=[-9999,         -1,         -2,        -5,         -10,        0];
    var nameList=['上移置顶', '上移1班', '上移2班', '上移5班', '上移10班', '取消'];
    wx.showActionSheet({
      itemList: nameList,
      success: function (res) {
        if (valueList[res.tapIndex] != 0) {
          console.log(valueList[res.tapIndex]);
          console.log(nameList[res.tapIndex]);
          that.doModifySort(valueList[res.tapIndex], event.currentTarget.dataset.id, that.loadClass);
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

//下移操作
  downindexOption: function (event) {
    var that = this;
    console.log(event.currentTarget.dataset.id);
    console.log(event.currentTarget.id);
    var valueList=[9999,         1,        2,         5,        10,       0];
    var nameList=['下移置底', '下移1班', '下移2班', '下移5班', '下移10班', '取消'];
    wx.showActionSheet({
      itemList: nameList,
      success: function (res) {       
        if (valueList[res.tapIndex] != 0) {
          console.log(valueList[res.tapIndex]);
          console.log(nameList[res.tapIndex]);
          that.doModifySort(valueList[res.tapIndex], event.currentTarget.dataset.id, that.loadClass);
        }

      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  //发送修改顺序请求
  doModifySort: function (move_count,classes_Id, fn) {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    var postDatajson = [{
      ClassID: classes_Id, //班次编号
      MoveCount: move_count
    }];

    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_ModifySort',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        SortListJson: JSON.stringify(postDatajson)
        
      },
      success: function (res) {
        wx.hideToast();
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        wx.showToast({
          title: res.data.message, icon: 'none', duration: 2000
        });

        fn();//执行回调
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

  editOption: function (e) {
    console.log(e.currentTarget.dataset.id);
  },

  //读取班次信息
  loadClass: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Classes/API_getClassList',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
        RouteID: that.data.routeArray[that.data.routeIndex].id,  //线路Id
        beginData: that.data.date, //不传默认为当天yyyy-MM-dd HH:mm:ss
        endDate: that.data.date, //不传默认为当天yyyy-MM-dd HH:mm:ss
        status: '',  //状态，多状态以英文逗号分隔，0=等确认；1=待发班；2=已发班；3=已完成；
      },
      success: function (res) {
        wx.hideToast();
        //console.log(res);
        //登录超时处理
        if (res.statusCode == 401) {
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
        //登录超时处理结束
        if (res.data.resultdata) {
          //var tasklist = res.data.resultdata;
          //排序班次列表
          //tasklist.sort(utils.sortBy('SortNo', true))
          //console.log(tasklist);

          that.setData({
            taskList: res.data.resultdata,
          })
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

  //读取线路信息
  loadRoutesAndClass: function () {
    var that = this;
    wx.showToast({
      title: '正在加载数据',
      icon: 'loading',
      mask: true
    })
    var defaultRouteID = null;
    wx.request({
      url: app.NKhostUrl + 'NKOrderManage/NK_Route/API_GetAllRoute',
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.NKOBJ.Token
      },
      data: {
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
          console.log(res.data.resultdata);
          var temprouteList = [];
          for (var i = 0; i < res.data.resultdata.length; i++) {
            console.log(res.data.resultdata);
            temprouteList[i] = res.data.resultdata[i].RouteName
          }
          that.setData({
            routeList: temprouteList,
            routeArray: res.data.resultdata
          })
          that.loadClass(); //读取班次信息
        }
        else {
          wx.showToast({
            title: res.data.message, icon: 'none', duration: 2000
          })
        }
      },
      fail: function (res) {
        //console.log(res);
        wx.showToast({
          title: '调用接口失败', icon: 'none', duration: 2000
        })
      },
      complete: function (res) {
      }
    })
  }


})