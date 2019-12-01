import {
  Evaluate
} from '../../models/evaluate.js'
let evaluate = new Evaluate()

//获取应用实例
const app = getApp()
//不满意数据
var discontent="";
//满意数据
var uperContent="";
//图片路径
var imageStr = "";
//提交按钮是否可用
var isdisable=false;
// pages/evaluate/evaluate.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    pics: [],
    isShow: true,
    path: '',
    tapcurrent: 0,
    selectTag: true,
    textcontent: "",
    textcontents:"",
    schoolStar: ["star", "star", "star", "star", "star"],
    schoolScore: 5,
    teacherStar: ["star", "star", "star", "star", "star"],
    teacherScore: 5,
    datas:[],
    schoolPicture:"",
    Furl: app.globalData.Serverurl,
    labelArray: [{ text: '联系沟通困难', selected: false }, { text: '服务差', selected: false }, { text: '态度不好', selected: false }],
    userInfo: app.globalData.userInfo,
    orderId:"",
    showText:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options);
    this.selectTeacherAndSchoolForComment(options.courseId, options.orderId);
    this.setData({
      userInfo: app.globalData.userInfo,
      orderId: options.orderId
    });
    // console.log(this.data.userInfo);
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
    // 停止下拉动作
    wx.stopPullDownRefresh();
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
  //学校评分
  schoolselect: function(e) {   
    var that = this;
    var number = e.currentTarget.dataset.select;
    switch (number) {
      case 0:
        that.setData({
          schoolStar: ["star", "stars", "stars", "stars", "stars"],
          schoolScore:1,
        });
        break;
      case 1:
        that.setData({
          schoolStar: ["star", "star", "stars", "stars", "stars"],
          schoolScore: 2,
        });
        break;
      case 2:
        that.setData({
          schoolStar: ["star", "star", "star", "stars", "stars"],
          schoolScore: 3,
        });
        break;
      case 3:
        that.setData({
          schoolStar: ["star", "star", "star", "star", "stars"],
          schoolScore: 4,
        });
        break;
      case 4:
        that.setData({
          schoolStar: ["star", "star", "star", "star", "star"],
          schoolScore: 5,
        });
        break;
      default:
        that.setData({
          schoolStar: ["star", "star", "star", "star", "star"],
          schoolScore: 5,
        });
        break;
    }
    // console.log(that.data.schoolScore);
  },
  //教师评分
  teacherselect: function(e) {
    var that = this;
    var number = e.currentTarget.dataset.select;
    switch (number) {
      case 0:
        that.setData({
          teacherStar: ["star", "stars", "stars", "stars", "stars"],
          teacherScore:1,
        });
        break;
      case 1:
        that.setData({
          teacherStar: ["star", "star", "stars", "stars", "stars"],
          teacherScore: 2,
        });
        break;
      case 2:
        that.setData({
          teacherStar: ["star", "star", "star", "stars", "stars"],
          teacherScore: 3,
        });
        break;
      case 3:
        that.setData({
          teacherStar: ["star", "star", "star", "star", "stars"],
          teacherScore: 4,
        });
        break;
      case 4:
        that.setData({
          teacherStar: ["star", "star", "star", "star", "star"],
          teacherScore: 5,
        });
        break;
      default:
        that.setData({
          teacherStar: ["star", "star", "star", "star", "star"],
          teacherScore: 5,
        });
        break;
    }
    // console.log(that.data.teacherScore);
  },
  //不满意选择
  selectitem: function (e) {
    discontent="";
    var that=this;
    let index = e.currentTarget.dataset.select;
    let arrs = this.data.labelArray;
    if (arrs[index].selected == false) {
      arrs[index].selected = true;
    } else {
      arrs[index].selected = false;
    }
    this.setData({
      labelArray: arrs
    })
    // console.log(this.data.labelArray);
       
  },
  menutap: function(e) {
    this.setData({
      tapcurrent: e.currentTarget.dataset.current
    });
  },
  isselect: function() {
    var that = this;
    this.setData({
      selectTag: !that.data.selectTag,
    });
  },
  chooseImg: function() {
    var that = this;
    that.setData({
      showText:false,
    });
     var pics = that.data.pics;
    wx.chooseImage({
      count: 9 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var imgSrc = res.tempFilePaths;
        pics = pics.concat(imgSrc);
        // 控制触发添加图片的最多时隐藏
        if (pics.length >= 9) {
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
        // console.log(that.data.pics);
      },
    })
  },

  // 图片预览
  previewImage: function(e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.pics
    })
  },
  //删除图片
  subImg: function(e) {
    var index = e.target.dataset.numbers;
    var temp = this.data.pics;
    temp.splice(index, 1);
    this.setData({
      pics: temp,
    });
    if (this.data.pics.length < 9) {
      this.setData({
        isShow: true,
      })
    }
    if (this.data.pics.length == 0) {
      this.setData({
        showText: true,
      })
    }
    // console.log(this.data.pics.length);
  },
  //下面的评价内容
  bindTextAreaBlur: function(e) {
    this.setData({
      textcontent: e.detail.value
    })
  },
  getschoolReasonText:function(e){
    this.setData({
      textcontent: e.detail.value
    })
  },
  //满意的评价
  bindTextAreaBlurs: function (e) {
    this.setData({
      textcontents: e.detail.value
    })
  },
  getReasonText:function(e){
    this.setData({
      textcontents: e.detail.value
    })
  },
    //提交评论数据
  submitData: function() {
    var that=this;
    if (isdisable) return;
    isdisable=true;
    var lowercontent = this.data.textcontent;
    if (lowercontent==''){
      wx.showToast({
        title: '请您输入评价内容!',
        icon:'none'
      })
      isdisable = false;
      return;
    }
    // 上传图片
    imageStr = "";
    var pics = this.data.path;
    if (pics == '' || pics==null){//没有图片
     that.addComment();
    }else{
      this.uploadimg({
        url: getApp().globalData.Serverurl + "wxapi/v1/wxUploadMulti",//这里是你图片上传的接口
        path: pics//这里是选取的图片的地址数组
      });
    }
  },
  //提交评论
  addComment: function () {
    var that = this;
    //满意/不满意
    var contents = "";
    if (this.data.tapcurrent == 0) {
      //获取不满意的值
      discontent = "";
      for (let i = 0; i < this.data.labelArray.length; i++) {
        if (that.data.labelArray[i].selected) {
          discontent = discontent + that.data.labelArray[i].text + ',';
        }
      }
      contents = discontent.substring(0, discontent.length - 1);
    } else {
      //满意的评价内容
      uperContent = this.data.textcontents;
      contents = uperContent;
    }
    // console.log(contents);   
    //下面的评价内容
    var lowerContent = this.data.textcontent;
    //老师评分teacherScore
    //学校评分schoolScore
    //是否匿名
    var isShowName = 0;
    if (that.data.selectTag) {
      isShowName = 0;
    } else {
      isShowName = 1;
    }
    var schoolCommentarray = [];
    var schoolStr = {};
    //课程ID
    schoolStr.courseId = that.data.datas.courseId;
    // //创建时间
    // schoolStr.createTime = "";
    // //id
    // schoolStr.id = "";
    //0:显示名字 1:匿名提交
    schoolStr.nameShowStatus = isShowName;
    //用户昵称
    schoolStr.nickName = that.data.userInfo.nickName;
    //用户图片
    schoolStr.nickPicture = that.data.userInfo.avatarUrl;
    //评论用户id
    schoolStr.openId = app.globalData.openid;
    //订单id
    schoolStr.orderId = that.data.orderId;
    //评论图片
    schoolStr.picture = imageStr;
    //学校id
    schoolStr.schoolId = that.data.datas.schoolId;
    //评论内容
    schoolStr.schoolReasonText = that.data.textcontent;
    //学校得分
    schoolStr.schoolScore = that.data.schoolScore;
    schoolCommentarray.push(schoolStr);
    // console.log(schoolCommentarray);
    // console.log(JSON.stringify(schoolCommentarray));

    var teacherCommentarray = [];
    var teacherStr = {};
    teacherStr.courseId = that.data.datas.courseId;
    // //创建时间
    // schoolStr.createTime = "";
    // //id
    // schoolStr.id = "";
    teacherStr.nameShowStatus = isShowName;
    teacherStr.nickName = that.data.userInfo.nickName;
    teacherStr.nickPicture = that.data.userInfo.avatarUrl;
    teacherStr.openId = app.globalData.openid;
    teacherStr.picture = imageStr;
    teacherStr.teacherId = that.data.datas.teacherId;
    teacherStr.teacherReasonText = contents;
    teacherStr.teacherScore = that.data.teacherScore;
    teacherCommentarray.push(teacherStr);

    //上传参数
    var schoolComment = JSON.stringify(schoolCommentarray);
    var teacherComment = JSON.stringify(teacherCommentarray);
    // console.log(schoolComment);
    // console.log(teacherComment);   
    evaluate.addComment(schoolComment, teacherComment, data => {
      console.log(data);
      isdisable=false;
      wx.navigateTo({
        url: '../../pages/orders/myOrder/myOrder?optselect=listone',
      })
    }, res => { });
  },

  //多张图片上传
  uploadimg: function (data) {
    var that = this,
      i = data.i ? data.i : 0,//当前上传的哪张图片
      success = data.success ? data.success : 0,//上传成功的个数
      fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: data.url,
      filePath: data.path[i],
      name: 'file',//这里根据自己的实际情况改
      formData: null,//这里是上传图片时一起上传的数据
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1
        // console.log(resp.data);
        imageStr += resp.data+",";
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
      },
      complete: () => {

        i++;//这个图片执行完上传后，开始上传下一张
        if (i == data.path.length) {   //当图片传完时，停止调用     
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          that.addComment();
        } else {//若图片还没有传完，则继续调用函数
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  //获取评论初始化数据
  selectTeacherAndSchoolForComment: function (courseId, mainId){
    var that=this;
    evaluate.selectTeacherAndSchoolForComment(courseId, mainId,data=>{
        // console.log(data.data[0]);
      that.setData({
        datas:data.data[0],
        schoolPicture: data.data[0].schoolPicture.split(',')[0],
      });
    },res=>{});
  },

})