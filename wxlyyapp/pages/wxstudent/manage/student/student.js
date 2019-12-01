// pages/wxstudent/manage/student/student.js
var app = getApp();
var studentID = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ClassesInfo: new Object,
    TicketList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    studentID = options.id.replace(/-/g, '');

    console.log(this.data.taskList);
    this.setData({
      windowHeight: app.devheight,
      options: options
    });

    this.loadStudentInfo(studentID);
    this.loadTasks();

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
    this.loadTasks();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  //更新替换人脸
  bindUpdateface: function (imgpath) {
    var that = this;
    imgpath = this.data.avatarUrl;
    console.log('开始人脸上传过程' + imgpath);

    wx.getFileSystemManager().readFile({
      filePath: imgpath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: imgres => { //成功的回调
        console.log('获取照片数据成功。');
        console.log('照片字符长度:' + imgres.data.length);
        wx.showToast({
          title: '正在加载数据',
          icon: 'loading',
          mask: true,
          duration: 20000
        });
        var postdata = {
          image: imgres.data,
            image_type: 'BASE64',
              group_id: 'daguanxianyuelezhongxue',
                user_id: studentID,
                  quality_control: 'HIGH',
                  //  user_info: that.data.options.name + '--' + that.data.options.sex + '--' + that.data.options.class
        };
        wx.request({
          url: app.XSDZhostUrl + "AppTeachersManage/AppTeachers/BaiDu_Update",
          method: 'POST',
          header: {
            'Content-Type': 'application/json', // 默认值
          },
          data: {
            parmJson: JSON.stringify(postdata)
          },
          success: function (res) {
            that.loadTasks();
            that.setData({
              avatarUrl: null,
              error_msg: res.data.resultdata.error_msg
            })
          },
          fail: function (e) {
            console.log(e);
          },
          complete: function (res) {
            wx.hideToast();
          }
        })
      }
    })
  },

  bindAddface: function (imgpath) {
    var that = this;
    imgpath = this.data.avatarUrl;
    wx.getFileSystemManager().readFile({
      filePath: imgpath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: imgres => { //成功的回调
        console.log('获取照片数据成功。');
        console.log('照片字符长度:' + imgres.data.length);
        //console.log('data:image/png;base64,' + imgres.data)
        wx.showToast({
          title: '正在加载数据',
          icon: 'loading',
          mask: true,
          duration: 20000
        })
        var postdata = {
          image: imgres.data,
          image_type: 'BASE64',
          group_id: 'daguanxianyuelezhongxue',
          user_id: studentID,
          quality_control: 'HIGH',
          //user_info: that.data.options.name + '--' + that.data.options.sex + '--' + that.data.options.class
        };
        wx.request({
          url: app.XSDZhostUrl + "AppTeachersManage/AppTeachers/BaiDu_Add",
          method: 'POST',
          header: {
            'Content-Type': 'application/json', // 默认值
          },
          data: {
            parmJson: JSON.stringify(postdata)
          },
          success: function (res) {
            that.loadTasks();
            console.log('=============');
            console.log(res);
            that.setData({
              avatarUrl:null,
              error_msg: res.data.resultdata.error_msg
            })
          },
          fail: function (e) {
            console.log(e);
          },
          complete: function (res) {
            wx.hideToast();
          }
        })
      }
    })
  },

  bindRegist: function () {
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          //将临时变量赋值给已经在data中定义好的变量
          avatarUrl: tempFilePaths[0]
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  loadTasks: function () {
    var that = this;
      wx.showToast({
        title: '正在加载数据',
        icon: 'loading',
        mask: true
      })

      //获取用户信息
      var postdata = {
        user_id: studentID,
        group_id: 'daguanxianyuelezhongxue'
      };
      wx.request({
        url: app.XSDZhostUrl + "AppTeachersManage/AppTeachers/BaiDu_Get",
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          parmJson: JSON.stringify(postdata)
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

          //if (res.data.resultdata) {
          that.setData({
            ClassesInfo: res.data.resultdata.result.user_list[0]
          })
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
      var postdata = {
        user_id: studentID,
        group_id: 'daguanxianyuelezhongxue'
      };
      //获取人脸列表
      wx.request({
        url: app.XSDZhostUrl + "AppTeachersManage/AppTeachers/BaiDu_GetList",
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        data: {
          parmJson: JSON.stringify(postdata)
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

          //if (res.data.resultdata) {
          that.setData({
            TicketList: res.data.resultdata.result.face_list
          })
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
  loadStudentInfo: function (sourceidStr) {
    var that = this;
    wx.request({
      url: app.XSDZhostUrl + 'AppTeachersManage/AppTeachers/SJ_StudentInfo?queryJson={"StudentId":"' + sourceidStr + '"}',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.XSDZOBJ.Token
      },
      data: {},
      success: function (checkres) {
        console.log('系统内的学生信息：');
        console.log(checkres);
        if (checkres.data.resultdata) {
          that.setData({
            studentinfo: checkres.data.resultdata
          })
        } else {
          that.setData({
            studentinfo: null
          })
        }
      },
      fail: function (e) {
        console.log('人脸验证出错：');
        console.log(e);
      }
    });

  }

})