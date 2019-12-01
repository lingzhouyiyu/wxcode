
//https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=mnvjQDv7OXc3iBnb9XQ4ksVZ&client_secret=hm2bUaHb4MQwIwFn493ReSAiXedeNnHL&
var task_id = null;  //任务id
var check_Type = null;
var app = getApp();
Page({
  data: {
    deviceposition: 'back'
  },
  onLoad(options) {
    this.ctx = wx.createCameraContext();
    task_id = options.taskid;
    check_Type = options.Type;
    console.log(options);
  },

  
  takePhoto: function () {
    var that = this;
    this.ctx.takePhoto({
      quality: 'low', //'high' 'normal' 'low',
      success: (res) => {
        console.log('拍照成功');

        this.setData({
          src: res.tempImagePath
        })

        that.checkface('' + res.tempImagePath);
      }
    })
  },
  checkAgain: function () {
    this.setData({
      src: '',
      checkMessage:'',
      checkResult:null
    })
  },

  changeCamera: function () {
    if (this.data.deviceposition == 'front') {
      this.setData({
        deviceposition: 'back'
      })
    }
    else {
      this.setData({
        deviceposition: 'front'
      })
    }

  },

  error: function (e) {
    console.log(e.detail)
  },

  playUpOKVoice:function(){
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/images/checkupok.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  playDownOKVoice: function () {
    const innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '/images/checkdownok.mp3'
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  checkface: function (imgpath) {
    var that = this;
    console.log('开始人脸识别过程' + imgpath);

    wx.getFileSystemManager().readFile({
      filePath: imgpath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: imgres => { //成功的回调
        wx.showToast({
          title: '正在加载数据',
          icon: 'loading',
          mask: true,
          duration: 20000
        });
        console.log('获取照片数据成功。');
        console.log('照片字符长度:' + imgres.data.length);
        //console.log('data:image/png;base64,' + imgres.data)
        var postimgdata = imgres.data;
        if (imgres.data.length > 30000) {
          console.log(30000 / imgres.data.length);
          wx.compressImage({
            src: imgpath, // 图片路径
            quality: 30000 / imgres.data.length * 100, // 压缩质量
            success: function (sucres) {
              console.log(sucres);
              wx.getFileSystemManager().readFile({
                filePath: sucres.tempFilePath, //选择图片返回的相对路径
                encoding: 'base64', //编码格式
                success: newimgres => { //成功的回调
                  console.log('新的照片');
                  console.log(newimgres);
                  console.log('新的照片字符长度:' + newimgres.data.length);
                   postimgdata = newimgres.data;
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


 

        wx.getLocation({
          type: 'wgs84',
          success(res) {
            //console.log(res.latitude);
            //console.log(res.longitude);
          },
          complete(res) {
            console.log(res.latitude);
            console.log(res.longitude);
            var latitude = '';
            var longitude = '';
            if (res.latitude && res.longitude){
              latitude = res.latitude;
              longitude = res.longitude;
            }

            wx.request({
              url: app.XSDZhostUrl + 'AppTeachersManage/AppTeachers/SJ_OnOrOffCar',
              //?queryJson={"TaskId":"' + task_id+'","UseDate":"","Type":"On","Img64":"' + imgres.data+'"}
              method: 'POST',
              header: {
                'content-type': 'application/json', // 默认值
                'LyyUserToken': app.XSDZOBJ.Token
              },
              data: {
                queryJson: "{'TaskId': '" + task_id + "','Type': '" + check_Type + "', 'Img64': '" + imgres.data + "','Lon': '" + longitude + "','Lat': '" + latitude + "'}",
              },
              success: function (res) {
                if (check_Type == 'On') {
                  if (res.data.type == '1') {
                    that.playUpOKVoice();
                  }
                  else {
                    wx.vibrateLong()
                  }

                }
                else if (check_Type == 'Off') {
                  if (res.data.type == '1') {
                    that.playDownOKVoice();
                  }
                  else {
                    wx.vibrateLong()
                  }

                }

                that.setData({
                  checkMessage: res.data.message,
                  checkResult: res.data.resultdata,
                })


              },
              fail: function (e) {
                that.setData({
                  checkMessage: '人脸登录验证错误'
                })
              },
              complete: function (res) {
                wx.hideToast();
              }
            })

          }
        })

      }
  })
  }

})