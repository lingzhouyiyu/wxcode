//app.js
const appid = 'wxece512ce2484e638'
const secret = '536f05f1c1e9dd5f54601234ac2c3e7e'
const util = require('utils/util.js')

App({
  globalData: {
    userInfo: null,
    // Serverurl: "http://47.106.237.52:8090/",
    // Serverurl: "http://localhost:8089/",
    Serverurl: "https://www.hiwawow.com/",
    token:null,
    openid:null,
    hasAuth:false,
    latitude: 25.11624,
    longitude: 102.75205,
    address:null,
    userPhone:null,
    phoneNumber:'087168505116',
    showActive:false,
  },
  wxApi: {
    //首页分类滑动列表
    api_indexCategory: "wxapi/v1/getIndexCategory",
    //登录
    api_wxLogin:"wxapi/v1/wxLogin",
    //首页本周优选
    api_thisWeek: "wxapi/v1/selectThisWeek",
    //首页学校列表
    api_indexSchool:'wxapi/v1/selectIndexSchool',
    //分类树形数据
    api_classification:'wxapi/v1/getTree',
    //分类轮播图
    api_classificationImg:'wxapi/v1/selectAdvertingByCategoryId',
    //学校课程
    api_CourseForSchool:'wxapi/v1/selectCourseForSchool',
    //学校主页 --> 学校数据
    api_SchoolMainById:'wxapi/v1/selectSchoolMainById',
    //课程详情学校查询
    api_selectSchoolById:'wxapi/v1/selectSchoolById',
    //名师推荐
    api_GoodsTeacher:'wxapi/v1/selectGoodsTeacher',
    //轮播图
    api_IndexActive:'wxapi/v1/selectIndexActive',
    //所有分类
    api_Category:'wxapi/v1/selectCategory',
    //首页轮播图详情
    api_selectActive:'wxapi/v1/selectActiveById',
    //教师详情页学校列表
    api_SchoolForTeacher:'wxapi/v1/selectSchoolForTeacher',
    //教师详情页教师数据
    api_selectTeacherById:'wxapi/v1/selectTeacherById',
    //课程详情
    api_CourseById:'wxapi/v1/selectCourseById',
    //学校详情页分类
    api_CategoryBySchoolId:'wxapi/v1/selectCategoryBySchoolId',
    //教师详情页分类
    api_CategoryByTeacherId:'wxapi/v1/selectCategoryByTeacherId',
    //分类详情页学校列表
    api_SchoolForCategory:'wxapi/v1/selectSchoolForCategory',
    //教师详情页课程
    api_CourseForTeacherById:'wxapi/v1/selectCourseForTeacherById',
    //分类页轮播图详情数据
    api_selectAdvertingById:'wxapi/v1/selectAdvertingById',
    //课程下订单
    api_downOrder:'wxapi/order/generateOrder',
    //学校详情页教师列表
    api_TeacherBySchoolId:'wxapi/v1/selectTeacherBySchoolId',
    //发现最新活动
    api_selectAllUnderActivity:'wxapi/v1/selectAllUnderActivity',
    //发现新闻列表
    api_selectAllPlatNews:'wxapi/v1/selectAllPlatNews',
    //发现新闻详情
    api_selectUnderNewsById: 'wxapi/v1/selectUnderNewsById',
    //发现活动详情
    api_selectUnderById: 'wxapi/v1/selectUnderById',
    //分类详情页热门
    api_CategoryHotCourse: 'wxapi/v1/selectForCategoryHotCourse',
    //分类详情页教师数据
    api_CategoryTeacher:'wxapi/v1/selectCategoryTeacher',
    //订单评论初始化数据
    api_TeacherAndSchoolForComment:'wxapi/v1/selectTeacherAndSchoolForComment',
    //添加评论
    api_addComment:'wxapi/v1/addComment',
    //教师评论列表
    api_TeacherCommentList:'wxapi/v1/selectTeacherCommentList',
    //订单详情
    api_selectOrderDetail:'wxapi/order/selectOrderDetail',
    // 学校评论
    api_selectSchoolCommentList:'wxapi/v1/selectSchoolCommentList',
    //申请退款
    api_applicationRefund:'wxapi/order/applicationRefund',
    //收藏课程
    api_CourseCollection: 'wxapi/v1/addWxCourseCollection',
    //收藏老师
    api_TeacherCollection:'wxapi/v1/addWxTeacherCollection',
    //获取课程评论
    api_CourseCommentList:'wxapi/v1/selectCourseCommentList',
    //获取课程详情页面红包
    api_selectCoupon:'wxapi/v1/selectCoupon',
    //领取红包
    api_addCouponUse:'wxapi/v1/addCouponUse',
    //我的红包列表
    api_selectMyCoupon:'wxapi/v1/selectMyCoupon',
    //我的收藏教师列表
    api_CollectionsTeacher:'wxapi/v1/selectCollectionsTeacher',
    //我的收藏课程列表
    api_CollectCourseList:'wxapi/v1/selectCollectCourseList',
    //申请成为机构
    api_addSchoolInfo:'wxapi/v1/addSchoolInfo',
    //申请成为老师
    api_addTeacherInfo: 'wxapi/v1/addTeacherInfo',
    //更新用户信息
    api_updateUser: 'wxapi/v1/updateUser',
    //获取验证码
    api_getSmsCode:'wxapi/v1/getSmsCode',
    //验证验证码
    api_smsCodeAuth:'wxapi/v1/smsCodeAuth',
    // 取消收藏课程
    api_cancelCourse:'wxapi/v1/cancelCourse',
    // 取消收藏老师
    api_cancelWxTeacherCollection: 'wxapi/v1/cancelWxTeacherCollection',
    //教师排行榜
    api_selectTeacherPHB: 'wxapi/v1/selectTeacherPHB',
    //通知
    api_selectAllNotice:'wxapi/v1/selectAllNotice',
    //私信
    api_selectAllCantact: 'wxapi/v1/selectAllCantact',
    //添加私信
    api_addControect:'wxapi/v1/addControect',
    //本周优选课程
    api_selectMadeCourse:'wxapi/v1/selectMadeCourse',
    //充值
    api_generateOrder:'wxapi/coinorder/generateCoinOrder',
    //充值比例
    api_getRate:'wxapi/coinorder/getRate',
    //获取用户信息
    api_userIsAuth:'wxapi/v1/userIsAuth',
    //获取蛙币数量
    api_getTotalWawowCoin:'wxapi/coinorder/getTotalWawowCoin',
    //充值页面明细查询
    api_getWawowCoinOrder:'wxapi/coinorder/getWawowCoinOrder',
    //课程详情页获取教师列表
    api_selectTeacherByCourseId:'wxapi/v1/selectTeacherByCourseId',
    //活动下单
    api_generateActivityOrder:'wxapi/order/generateActivityOrder',
    // //发现新闻新增浏览量
    api_updateLookCount:'wxapi/v1/updateLookCount',
    //我的报名
    api_selectActiveOrder:'wxapi/v1/selectActiveOrder',
    //活动订单详情
    api_selectActiveOrderDetail:'wxapi/v1/selectActiveOrderDetail',
    //使用预约码
    api_useOrderCode:'wxapi/order/useOrderCode',
    //0预约金支付
    api_payWithNoWx:'wxapi/wxPay/payWithNoWx',
    //获取二维码
    api_wxcode:'wxapi/v1/wxcode',
    //获取二维码
    api_wxcodeparm: 'wxapi/v1/wxcodeparm',
    //领取体验券
    api_sureOrderCode:'wxapi/order/sureOrderCode',
    //查询当前用户是否助力过
    api_listShareCount:'wxapi/v1/listShareCount',
    //查询当前用户是否助力过
    api_updateWxUserShareCount: 'wxapi/v1/updateWxUserShareCount',
    //课程下单次数
    api_getUserBuyCount:'wxapi/v1/getUserBuyCount',
    //增加分享者的蛙币
    api_generateCoinOrderShare:'wxapi/coinorder/generateCoinOrderShare',
    //获取个人投票列表
    api_getJoinList:'wxapi/personal/getJoinList',
    //获取学校投票列表
    api_signUpSchoolList: 'wxapi/voteschool/signUpSchoolList',
    //学校投票
    api_vote:'wxapi/voteschool/vote',
    //个人投票
    api_addPersonalVote:'wxapi/personal/addPersonalVote',
    //所有学校活动信息返回(报名人数、浏览量、访问量)
    api_getSchoolCount:'wxapi/voteschool/getSchoolCount',
    //个人报名人数
    api_getJoinCount:'wxapi/personal/getJoinCount',
    //个人浏览量
    api_getPersonalCount:'wxapi/personal/getPersonalCount',
    //个人投票人数
    api_getVoteCount:'wxapi/personal/getVoteCount',
    //增加浏览量
    api_addPersonalCount:'wxapi/personal/addPersonalCount',
    //个人报名
    api_addJoinActivity:'wxapi/personal/addJoinActivity',
    //学校报名
    api_signUpSchool: 'wxapi/voteschool/signUpSchool',
    //获取学校/个人投票活动图、时间
    api_getVoteActivity:'wxapi/voteschool/getVoteActivity',
    //获取个人排行榜初始化数据
    api_getJoinListByPHB:'wxapi/personal/getJoinListByPHB',
    //获取学校排行榜初始化数据
    api_mostPopularSchoolRanking: 'wxapi/voteschool/mostPopularSchoolRanking',
    //获取学校详情
    api_schoolDetail:'wxapi/voteschool/schoolDetail',
    //获取学校详情
    api_getUserInfo: 'wxapi/personal/getUserInfo',
    //分享给好友生成预约码
    api_personalShare: 'wxapi/personal/personalShare',
    //是否订阅(关注)公众号
    api_isSubscribe:'wxapi/v1/isSubscribe',
    //搜索历史新增
    api_addSearch:'wxapi/v1/addSearch',
    //获取个人搜索历史纪录
    api_selectHistory: 'wxapi/v1/selectHistory',
    //删除全部历史记录
    api_deleteAll: 'wxapi/v1/deleteAll',
    //删除一条历史记录
    api_deleteAlong: 'wxapi/v1/deleteAlong',
    //热搜
    api_hotSearch:'wxapi/v1/hotSearch',
    //获取商圈数据
    api_selectShopArea:'wxapi/v1/selectShopArea',
    //搜索页面课程数据
    api_selectSearchCourse:'wxapi/v1/selectSearchCourse'
  },
  //用户登录
  getToken:function(){  
     return new Promise((resolve, reject) => {
      // 登录
       wx.login({
         success: res => {         
           
           var url = this.wxApi.api_wxLogin;
           var params = {
             code: res.code
           }; 
           console.log(res.code);
           util.wxRequest(url, params, data => {    
              
             if (data.status == 200) {
               this.globalData.openid = data.data.openid;
               this.globalData.token = data.data.token;
               var respam = {
                 openid: data.data.openid,
                 token: data.data.token
               }          
               resolve(respam)
             } else {
                this.getToken();
             }  
           }, data => {
            //  reject();
            }, data => { })
         }
       })
    })    
  },

  getuserMsg: function () {
    var that = this;
    wx.getSetting({
      success: res => {
        wx.getUserInfo({
          withCredentials: true,
          success: res => {                
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo;            
            // // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回, 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          },
          fail: function () {
            
          }
        })
      }
    })
  },
 
  //版本更新
  update:function(){
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  onLaunch: function () {
    // 登录
    // this.getToken();
    // this.getuserMsg();
    this.update();

    // wx.getUpdateManager 在 1.9.90 才可用，请注意兼容
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否马上重启小程序？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })

  },
})