//index.js
//获取应用实例
var app = getApp();
var interval = null;
var loginTypeList = [
  { name: '0', value: '学生定制'},
  { name: '1', value: '农村客运'},
  { name: '2', value: '出租'},
  { name: '3', value: '公交'}
];
Page({
  data: {
    logined: false,
    loginTypeIndex: '',
    userName:'',
    manage:'',
    items: loginTypeList,
    UsernameInputValue: "",   //"15187999420",   13529161292  15087793795  13408876550   15012385958
    PasswordInputValue: "",   //"999420,   123456  123456

    //以下为出租车专用
    locationRes:null,
    TaxiRuning: false,//运营状态
    TaxiFull: true    //满载状态
  },

  onLoad: function () {

    //设置屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });

    var that = this;
    var key = wx.getStorageSync('key');
    var username = wx.getStorageSync('username');
    if (username && username != '') {
      this.setData({
        UsernameInputValue: username
      });
    }

    var temploginTypeList = loginTypeList;
    if (key && key != '') {
      for (var i = 0; i < loginTypeList.length; i++) {
        if (temploginTypeList[i].name == key) {
          temploginTypeList[i].checked = "true";
        }
      }
      this.setData({
        loginTypeIndex: key,
        items: temploginTypeList
      });
    } else {

    }

  },

  onShow: function () {
    console.log("index onshow");
  },

  loginbuttontap: function (e) {
    var that = this;
    if (that.data.UsernameInputValue.length == 0 || that.data.PasswordInputValue.length == 0) {
      wx.showToast({
        title: '用户名和密码不能为空',
        icon: 'none',
        mask: true,
        duration: 2000
      })
    }
    else{
      if (this.data.loginTypeIndex==""){
        wx.showToast({
          title: '请选择登录类型',
          icon: 'none',
          duration: 2000
        })
      }
      else{
        wx.setStorageSync("username", that.data.UsernameInputValue);
        //学生定制司机登录
        if (that.data.loginTypeIndex == "0") {
          wx.showToast({
            title: '正在加载数据',
            icon: 'loading',
            mask: true
          })
          wx.request({
            url: app.XSDZhostUrl + 'AppTeachersManage/PublicInterface/API_StudentTraLogin',
            method: 'POST',
            data: {              
              account: that.data.UsernameInputValue,
              password: that.data.PasswordInputValue
            },
            success: function (res) {
              console.log(res);
              if (res.data.type=='1') {
                app.XSDZOBJ = res.data.resultdata;
                wx.setStorageSync("key", that.data.loginTypeIndex);
                that.setData({
                  manage: res.data.resultdata.Manage,
                  userName: res.data.resultdata.UserName,
                  account: res.data.resultdata.Account,
                  logined: true,
                })
                wx.hideToast();
              }
              else if (res.data.message){               
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
              else{
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 2000
                })
              }
              
            },
            fail: function (res) {
              //console.log(res);
              wx.hideToast();
              wx.showToast({
                title: '调用接口失败', icon: 'none', duration: 2000
              })
            }
          })
        }
         //农客司机登录
        else if (that.data.loginTypeIndex == "1"){
          console.log('农客司机登录');
          wx.showToast({
            title: '正在加载数据',
            icon: 'loading',
            mask: true
          })
          wx.request({
            url: app.NKhostUrl + 'NKOrderManage/NK_Driver/API_DriverLogin',
            method: 'POST',
            data: {
              account: that.data.UsernameInputValue,
              password: that.data.PasswordInputValue
            },
            success: function (res) {
              console.log('农客司机登录请求成功');
              if (res.data.type=="1") {
                var jsonRes = JSON.parse(res.data.resultdata);
                app.NKOBJ = jsonRes;
                console.log(jsonRes);
                wx.setStorageSync("key", that.data.loginTypeIndex);
                that.setData({
                  manage: jsonRes.AccountType,
                  userName: jsonRes.UserName,
                  logined: true,
                })
                wx.hideToast();
              }
              else if (res.data.message) {
                wx.showToast({
                  title: res.data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
              else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showToast({
                title: '调用接口失败', icon: 'none', duration: 2000
              })
            }
          })
        }
        //出租司机登录
        else if (that.data.loginTypeIndex=="2"){

          wx.showToast({
            title: '暂未开通出租车司机端登陆',
            icon: 'none',
            duration: 2000
          })
          return;


          wx.showToast({
            title: '正在加载数据',
            icon: 'loading',
            mask: true
          })
          wx.request({
            url: app.TAXIhostUrl + 'Login/LoginAndroid',
            method: 'POST',
            data: {
              Account: that.data.UsernameInputValue,
              Password: that.data.PasswordInputValue
            },
            success: function (res) {
              console.log(res);
              if (res.data.resultdata){
                var jsonRes = JSON.parse(res.data.resultdata);
                app.TAXIOBJ = jsonRes;
                console.log(jsonRes);
                wx.setStorageSync("key", that.data.loginTypeIndex);
                that.setData({
                  userName: jsonRes.UserName,
                  logined: true,
                })
                wx.hideToast();
              }
              else{
                wx.showToast({
                  title: '用户名或密码错误',
                  icon: 'none',
                  duration: 2000
                })
              }
              
            },
            fail: function (res) {
              wx.hideToast();
              wx.showToast({
                title: '调用接口失败', icon: 'none', duration: 2000
              })
            }
          })
        }


        //公交司机登录
        else if (that.data.loginTypeIndex == "3") {
          console.log('公交司机登录');
          wx.showToast({
            title: '正在加载数据',
            icon: 'loading',
            mask: true
          })
          wx.request({
            url: app.GJhostUrl + 'BusAPIManage/DriverApi/BusDriverLogin',
            method: 'POST',
            data: {
              account: that.data.UsernameInputValue,
              password: that.data.PasswordInputValue
            },
            success: function (res) {
              console.log('公交司机登录请求成功');
              console.log(res.data.result);
              if (res.data.error_code == "0") {
                var jsonRes = JSON.parse(res.data.result);
                app.GJOBJ = jsonRes;
                console.log(jsonRes);
                wx.setStorageSync("key", that.data.loginTypeIndex);
                console.log(jsonRes.UserName);
                that.setData({
                  userName: jsonRes.UserName,
                  logined: true,
                })
                wx.hideToast();
              }
              else if (res.data.reason) {
                wx.showToast({
                  title: res.data.reason,
                  icon: 'none',
                  duration: 2000
                })
              }
              else {
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 2000
                })
              }
            },
            fail: function (res) {
              wx.hideToast();
              wx.showToast({
                title: '调用接口失败', icon: 'none', duration: 2000
              })
            }
          })
        }
        else{
          wx.setStorageSync("key", that.data.loginTypeIndex);
          that.setData({
            logined: true,
          })
        }
      }      
    }    
  },

  /**
 * 用户名输入
 */
  bindUsernameInput: function (e) {
    this.setData({
      UsernameInputValue: e.detail.value
    })
  },

  /**
* 确认新密码输入
*/
  bindPasswordInput: function (e) {
    this.setData({
     PasswordInputValue: e.detail.value
    })
  },

 //选择登录类型
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      loginTypeIndex: e.detail.value
    });
  },
  
  //以下为出租车专用

  //开始运营
  turnOnRun: function () {
    console.log("turnOnRun");
    this.runGetLocation();
    var that = this;
    that.setData({
      TaxiRuning: true
    })
  },
  //停止运营
  turnOffRun: function () {
    console.log("turnOffRun");
    clearInterval(interval);
    var that = this;
    that.setData({
      TaxiRuning: false,
      locationRes: null
    })
  },

  //满载
  turnOnFull: function () {
    console.log("turnOnRun");
    var that = this;
    that.setData({
      TaxiFull: true
    })
  },
  //空载
  turnOffFull: function () {
    console.log("turnOffRun");
    var that = this;
    that.setData({
      TaxiFull: false
    })
  },


  runGetLocation:function(){
      var that = this;
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        that.setData({
          locationRes: res
        })
      }
    })
      clearInterval(interval);
      interval = setInterval(function () {
        wx.getLocation({
          type: 'wgs84',
          success(res) {
            console.log(res);
            that.setData({
              locationRes: res
            })

            wx.request({
              url: app.TAXIhostUrl + 'Login/SendLocation',
              method: 'POST',
              data: {
                Latitude: ""+res.latitude,
                Longitude: "" +res.longitude,
                UserId: app.TAXIOBJ.UserId,
                //Account: app.TAXIOBJ.Account,
                //CarColor: app.TAXIOBJ.CarColor,
                //CarNumber: app.TAXIOBJ.CarNumber,
                //CarType: app.TAXIOBJ.CarType,
                Speed: res.Speed,
                Direction: res.Direction,
                RunStatus:'接单',
                CarryStatus: '可载'  //满载
              },
              success: function (qres) {
                console.log(qres);                
              },
              complete: function (res) {
                console.log(res);
              }
            })
          }
        })
      }, 5000);
  },


  busScanCode: function () {
   // wx.navigateTo({ url: "../transport/index?id=35FDDB39-EE48-4E74-884A-8B75E7E1FEC2" })
   // return;
    var that = this;
    var show;
    wx.scanCode({      
      success: (res) => {
        console.log(res);
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })   
        var jsonRes = JSON.parse(res.result);
        wx.navigateTo({ url: "../transport/index?id=" + jsonRes.UserId})
      },
      fail: (res) => {
        wx.showToast({
          title: '扫码失败',
          icon: 'success',
          duration: 2000
        })
      },
      complete: (res) => {
      }
    })
  }  
})
