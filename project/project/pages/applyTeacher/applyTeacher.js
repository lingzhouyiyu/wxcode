import {
  Mine
} from '../../models/mine.js'
const mine = new Mine()
//获取应用实例
const app = getApp()
// pages/applyTeacher/applyTeacher.js
//证书图片路径
var imageStr = "";
//证书图片路径
var headerimageStr = "";
//上传参数
var goodsWork = '';
var graduateSchool = '';
var schoolName = '';
var teacherMotto = '';
var teacherName = '';
var teacherPhone = '';
var workAge = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    path: '',
    headerpics: [],
    headerpath: '',
    hasImg: false,
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
  //头像图片选择
  selectHeaderimg: function() {
    var _this = this,
      headerpics = [];
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgSrc = res.tempFilePaths;
        headerpics = headerpics.concat(imgSrc);

        _this.setData({
          headerpics: headerpics
        })
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          headerpath: tempFilePaths,
          hasImg: true
        })
        // console.log(_this.data.headerpics);
      },
    })
  },
  //头像图片上传
  headeruploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.headerpath[i],
      name: 'file', //这里根据自己的实际情况改
      formData: null, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        // console.log(resp.data);
        headerimageStr += resp.data + ",";
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
      },
      complete: () => {

        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.headerpath.length) { //当图片传完时，停止调用     
          console.log('头像执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          // console.log(headerimageStr);
          // 上传证书图片
          imageStr = "";
          var pics = that.data.path;         
          that.uploadimg({
            url: getApp().globalData.Serverurl + "wxapi/v1/wxUploadMulti", //这里是你图片上传的接口
            path: pics //这里是选取的图片的地址数组
          });
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.headeruploadimg(data);
        }
      }
    });
  },
  //证书图片选择
  selectimg: function() {
    var _this = this,
      pics = this.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        if (pics.length >= 9) {
          _this.setData({
            isShow: (!_this.data.isShow)
          })
        } else {
          _this.setData({
            isShow: (_this.data.isShow)
          })
        }
        _this.setData({
          pics: pics
        })
        var tempFilePaths = res.tempFilePaths;
        _this.setData({
          path: tempFilePaths
        })
        // console.log(_this.data.pics);
      },
    })
  },
  //证书多张图片上传
  uploadimg: function(data) {
    var that = this,
      i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file', //这里根据自己的实际情况改
      formData: null, //这里是上传图片时一起上传的数据
      success: (resp) => {
        success++; //图片上传成功，图片上传成功的变量+1
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        // console.log(resp.data);
        imageStr += resp.data + ",";
      },
      fail: (res) => {
        fail++; //图片上传失败，图片上传失败的变量+1
      },
      complete: () => {

        i++; //这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) { //当图片传完时，停止调用     
          console.log('证书执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          // console.log(imageStr);
          that.saveData();
        } else { //若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  //保存数据
  submitdata: function(e) {
    goodsWork = e.detail.value.goodsWork;
    graduateSchool = e.detail.value.graduateSchool;
    schoolName = e.detail.value.schoolName;
    teacherMotto = e.detail.value.teacherMotto;
    teacherName = e.detail.value.teacherName;
    teacherPhone = e.detail.value.teacherPhone;
    workAge = e.detail.value.workAge;
    // 上传头像图片
    headerimageStr = "";
    var headerpics = this.data.headerpath;
    if (headerpics == '' || headerpics == null) {
      wx.showToast({
        title: '请上传头像!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    
    if (teacherName == '') {
      wx.showToast({
        title: '姓名不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (schoolName == '') {
      wx.showToast({
        title: '服务机构不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (teacherPhone == '') {
      wx.showToast({
        title: '联系电话不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (!(/^1[34578]\d{9}$/.test(teacherPhone))) {
      wx.showToast({
        title: '联系电话有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (teacherPhone.length > 11) {
      wx.showToast({
        title: '联系电话有误!',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    if (goodsWork == '') {
      wx.showToast({
        title: '擅长不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (graduateSchool == '') {
      wx.showToast({
        title: '毕业学校不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (workAge == '') {
      wx.showToast({
        title: '从业年限不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    var pics = this.data.path;
    if (pics == '' || pics == null) {
      wx.showToast({
        title: '请上传证书!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
    if (teacherMotto == '') {
      wx.showToast({
        title: '个人签名不能为空!',
        icon: 'none',
        duration: 1000,
      })
      return;
    }
   
    
    // 显示加载图标
    wx.showLoading({
      title: '数据提交中',
    })
    this.headeruploadimg({
      url: getApp().globalData.Serverurl + "wxapi/v1/wxUploadMulti", //这里是你图片上传的接口
      headerpath: headerpics //这里是选取的图片的地址数组
    });

  },
  //提交保存
  saveData: function() {
    var that = this;
    var imgsCertificate = imageStr.substring(0, imageStr.length - 1);
    var headerimg = headerimageStr.substring(0, headerimageStr.length - 1);
    
    mine.addTeacherInfo(goodsWork, graduateSchool, schoolName, imgsCertificate, teacherMotto, teacherName, teacherPhone, workAge, data => {
      // 隐藏加载框
      wx.hideLoading();
      // console.log(data);
      wx.showToast({
        title: '申请已提交!',
        duration: 1500,
      })
      setTimeout(function () {
        wx.navigateBack();
      }, 1500)
    }, res => {});
  },

})