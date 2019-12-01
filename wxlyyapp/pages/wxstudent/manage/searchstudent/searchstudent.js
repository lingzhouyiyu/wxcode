// pages/wxstudent/manage/searchstudent/searchstudent.js
const app = getApp();
Page({
  data: {
    taskList: [], //任务列表
    loaded: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

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
    this.loadtask(); //调用湖区任务列表
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  searchFace: function(imgresdata) {
    var that = this;

    that.setData({
      studentinfo: null,
      facelibaryinfo: null
    });
    var postdata = {
      image: imgresdata,
      image_type: 'BASE64',
      group_id_list: 'daguanxianyuelezhongxue',
      max_user_num: 1
    };
    wx.request({
      url: app.XSDZhostUrl + "AppTeachersManage/AppTeachers/BaiDu_Search",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: {
        parmJson: JSON.stringify(postdata)
      },
      success: function(checkres) {
        console.log('人脸验证结果：');
        console.log(checkres);
        if (checkres.data.resultdata.result) {
          if (checkres.data.resultdata.result.user_list[0].score > 80) {
            that.loadStudentInfo(checkres.data.resultdata.result.user_list[0].user_id);
          }
          that.setData({
            facelibaryinfo: checkres.data.resultdata.result.user_list[0]
          })
        } else {
          that.setData({
            facelibaryinfo: null
          })
        }
      },
      fail: function(e) {
        console.log('人脸验证出错：');
        console.log(e);
      }
    });

  },

  bindRegist: function() {
    var that = this;
    wx.chooseImage({
      // 设置最多可以选择的图片张数，默认9,如果我们设置了多张,那么接收时//就不在是单个变量了,
      count: 1,
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        // 获取成功,将获取到的地址赋值给临时变量
        var tempFilePaths = res.tempFilePaths;
        that.setData({
          //将临时变量赋值给已经在data中定义好的变量
          avatarUrl: tempFilePaths[0]
        });

        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: imgres => { //成功的回调
            console.log('获取照片数据成功。');
            console.log('照片字符长度:' + imgres.data.length);
            //console.log('data:image/png;base64,' + imgres.data)
            if (imgres.data.length > 500000) {
              console.log(500000 / imgres.data.length);
              wx.compressImage({
                src: tempFilePaths[0], // 图片路径
                quality: 500000/imgres.data.length*100, // 压缩质量
                success: function (sucres) {
                  console.log(sucres);
                  wx.getFileSystemManager().readFile({
                    filePath: sucres.tempFilePath, //选择图片返回的相对路径
                    encoding: 'base64', //编码格式
                    success: newimgres => { //成功的回调
                      console.log('新的照片');
                      console.log(newimgres);
                      console.log('新的照片字符长度:' + newimgres.data.length);
                      that.searchFace(newimgres.data);
                    },
                    fail: failres => { //成功的回调
                      console.log(failres);
                    }
                  })
                },
                fail: function (failres) {
                  console.log(failres);
                }
              })
            }
            else
              that.searchFace(imgres.data);       
          }
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  loadStudentInfo: function(sourceidStr) {
    var that = this;
    wx.request({
      url: app.XSDZhostUrl + 'AppTeachersManage/AppTeachers/SJ_StudentInfo?queryJson={"StudentId":"' + sourceidStr + '"}',
      method: 'GET',
      header: {
        'content-type': 'application/json', // 默认值
        'LyyUserToken': app.XSDZOBJ.Token
      },
      data: {},
      success: function(checkres) {
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
      fail: function(e) {
        console.log('人脸验证出错：');
        console.log(e);
      }
    });

  },

  //还原格式uid
  formatUnid: function(sourceStr) {
    return sourceStr.substr(0, 8) + '-' + sourceStr.substr(8, 4) + '-' + sourceStr.substr(12, 4) + '-' + sourceStr.substr(16, 4) + '-' + sourceStr.substr(20, 12)
  }

})