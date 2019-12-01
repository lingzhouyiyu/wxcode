import {
  Vote
} from '../../models/vote.js'

let vote = new Vote();

//获取应用实例
const app = getApp()

var schoolAddress  ='';//地址
var schoolIntroduce  = '';//介绍
var schoolName  = '';//名称
var schoolPhone  = '';//电话
var imageStr = '';//图片
var isdisable = false;
// pages/voteschoolsignup/voteschoolsignup.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    path: '',
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
  //地址
  getschoolAddress: function (e) {
    schoolAddress = e.detail.value;
  },
  //介绍
  getschoolIntroduce: function (e) {
    schoolIntroduce = e.detail.value;
  },
  //名称
  getschoolName: function (e) {
    schoolName = e.detail.value;
  },
  //电话
  getschoolPhone: function (e) {
    schoolPhone = e.detail.value;
  },
  //提交点击事件
  gotovotesignupsuccess: function () {
    var that = this;
    if (isdisable) return;
    isdisable = true;
    if (schoolAddress == '') {
      wx.showToast({
        title: '请您输入学校地址!',
        icon: 'none'
      })
      isdisable = false;
      return;
    }
    if (schoolIntroduce  == '') {
      wx.showToast({
        title: '请您输入学校介绍!',
        icon: 'none'
      })
      isdisable = false;
      return;
    }
    if (schoolName  == '') {
      wx.showToast({
        title: '请您输入学校名称!',
        icon: 'none'
      })
      isdisable = false;
      return;
    }
    if (schoolPhone  == '') {
      wx.showToast({
        title: '请您输入学校电话!',
        icon: 'none'
      })
      isdisable = false;
      return;
    }
    // 上传图片
    imageStr = "";
    var pics = this.data.path;
    if (pics == '' || pics == null) {//没有图片
      wx.showToast({
        title: '请您上传学校图片',
        icon: 'none'
      })
      isdisable = false;
      return;
    } else {
      // 显示加载图标
      wx.showLoading({
        title: '正在提交数据...',
      })
      this.uploadimg({
        url: getApp().globalData.Serverurl + "wxapi/v1/wxUploadMulti",//这里是你图片上传的接口
        path: pics//这里是选取的图片的地址数组
      });
    }
  },
  //个人报名
  signUpSchool: function () {
    vote.signUpSchool(schoolAddress, schoolIntroduce, schoolName, schoolPhone,imageStr,data => {
     console.log(data);
      isdisable= false;
     
      if (data.msg == 200) {
        // 隐藏加载框
        wx.hideLoading();
        wx.showToast({
          title: '报名成功！',
          icon: 'success'
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../../pages/voteshare/voteshare?tag=schoolshare' + '&name=' + data.data.schoolName + '&number=' + data.data.id,
          })
        }, 1000) //延迟时间 这里是1秒
      } else if (data.msg == 908) {
        // 隐藏加载框
        wx.hideLoading();
        wx.showToast({
          title: '报名成功！',
          icon: 'success'
        })
        setTimeout(function () {
          wx.navigateTo({
            url: '../../pages/voteshare/voteshare?tag=schoolshare' + '&name=' + data.data.schoolName + '&number=' + data.data.id,
          })
        }, 1000) //延迟时间 这里是1秒
      }
    }, res => { });
  },
  //选择图片
  chooseImg: function () {
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 3 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var tempFilesSize = res.tempFiles[0].size;
        if (tempFilesSize <= 2097152) {//图片小于2M(2097152)
          var imgSrc = res.tempFilePaths;
          pics = pics.concat(imgSrc);
          // 控制触发添加图片的最多时隐藏
          if (pics.length >= 3) {
            that.setData({
              isShow: (!that.data.isShow)
            })
          } else {
            that.setData({
              isShow: (that.data.isShow)
            })
          }
          that.setData({
            pics: pics
          })
          var tempFilePaths = res.tempFilePaths;
          that.setData({
            path: tempFilePaths
          })
        }else{        
          wx.showToast({
            title: '上传图片不能大于2M!',  //标题
            icon: 'none',
            duration: 1500      //图标 none不使用图标，详情看官方文档
          })
        }
       
      },
    })
  },

  // 图片预览
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  },
  //多张图片上传
  uploadimg: function (data) {
    // console.log(data);

    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数

      // console.log("i: " + i);
      // console.log("success: " + success);
      // console.log("fail: " + fail);

      // console.log("data.url: " + data.url);
      // console.log("data.path[" + i + "]: " + data.path[i]);

      wx.uploadFile({
        url: data.url,
        filePath: data.path[i],
        name: 'file',//这里根据自己的实际情况改
        formData: null,//这里是上传图片时一起上传的数据
        success: (resp) => {
          // console.log(33333);

          // console.log(resp);

          if (resp.statusCode != 200 || resp.data == "") {
            fail++;
            wx.showToast({
              title: '图片过大，上传失败！',  //标题
              icon: 'none',
              duration: 1500      //图标 none不使用图标，详情看官方文档
            })
            return;
          }

          success++;//图片上传成功，图片上传成功的变量+1
          //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
          // console.log(resp.data);
          imageStr += resp.data + ",";
        },
        fail: (res) => {
          // console.log(2323);
          // console.log(res);

          fail++;//图片上传失败，图片上传失败的变量+1
        },
        complete: () => {
          // console.log(444455);

          i++;//这个图片执行完上传后，开始上传下一张
          // console.log("fail：" + fail);
          if (fail > 0) {
            // console.log("上传失败了！！！别挣扎了！！！");
            return;
          }

          if (i == data.path.length && i == success) {
            //所有图片均上传成功
            // console.log('执行完毕');
            // console.log('成功：' + success + " 失败：" + fail);
            that.signUpSchool();
          } else {
            data.i = i;
            data.success = success;
            data.fail = fail;
            that.uploadimg(data);
          }

          // if (i == data.path.length) {   //当图片传完时，停止调用     
          //   console.log('执行完毕');
          //   console.log('成功：' + success + " 失败：" + fail);
          //   that.signUpSchool();
          // } else {//若图片还没有传完，则继续调用函数
          //   data.i = i;
          //   data.success = success;
          //   data.fail = fail;
          //   that.uploadimg(data);
          // }
        }
      });
  },
})