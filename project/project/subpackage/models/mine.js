//获取应用实例
const app = getApp()
//首页model
import {
  HTTP
} from '../utils/http.js'
class Mine extends HTTP {
  constructor() {
    super()
  }
  //获取我的收藏课程列表
  selectCollectCourseList(limit, openId, page, userLatitude, userLongitude ,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CollectCourseList,
      data: { Authorization: app.globalData.token, limit: limit, openId: openId, page: page, userLatitude: userLatitude, userLongitude: userLongitude },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取我的收藏教师列表
  selectCollectionsTeacher(Forder ,limit, openId, page, userLatitude, userLongitude, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CollectionsTeacher,
      data: { Authorization: app.globalData.token, Forder: Forder , limit: limit, openId: openId, page: page, userLatitude: userLatitude, userLongitude: userLongitude },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
 //申请成为机构
  addSchoolInfo(schoolAddress, schoolLeader, schoolName, schoolPhone, schoolScale , success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addSchoolInfo,
      data: { Authorization: app.globalData.token, schoolAddress: schoolAddress, schoolLeader: schoolLeader, schoolName: schoolName, schoolPhone: schoolPhone, schoolScale: schoolScale , },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //申请成为机构
  addTeacherInfo(goodsWork, graduateSchool, schoolName, teacherCertificate, teacherMotto, teacherName, teacherPhone, workAge,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addTeacherInfo,
      data: { Authorization: app.globalData.token, goodsWork: goodsWork, graduateSchool: graduateSchool, schoolName: schoolName, teacherCertificate: teacherCertificate, teacherMotto: teacherMotto, teacherName: teacherName, teacherPhone: teacherPhone, workAge: workAge},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //蛙币数量
  getTotalWawowCoin(userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getTotalWawowCoin,
      data: { Authorization: app.globalData.token, userId: userId},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //充值比例
  getRate(success, complete) {
    let params = {
      method: 'Get',
      url: app.wxApi.api_getRate,
      data: { Authorization: app.globalData.token, authUserId :app.globalData.openid },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //充值
  generateOrder(money, rate, userId, userPhone, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_generateOrder,
      data: { Authorization: app.globalData.token, money: money, rate: rate, userId: userId, userPhone: userPhone, authUserId:app.globalData.openid},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //查询明细
  getWawowCoinOrder(limit, page,userId,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getWawowCoinOrder,
      data: { Authorization: app.globalData.token, limit: limit, page: page, userId: userId, authUserId:app.globalData.openid},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //我的报名
  selectActiveOrder(limit, page, openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectActiveOrder,
      data: { Authorization: app.globalData.token, limit: limit, page: page, openId: openId },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //0预约金支付
  payWithNoWx(orderNum, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_payWithNoWx,
      data: { Authorization: app.globalData.token, orderNum: orderNum, authUserId :app.globalData.openid},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //获取用户信息
  userIsAuth(openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_userIsAuth,
      data: { Authorization: app.globalData.token, openId: openId },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //获取二维码
  wxcode(openId, success, complete) {
    let params = {
      method: 'GET',
      url: app.wxApi.api_wxcode,
      data: { Authorization: app.globalData.token, openId: openId },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //获取二维码
  wxcodeparm(openId, pageurl,id, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_wxcodeparm,
      data: { Authorization: app.globalData.token, openId: openId, pageUrl: pageurl,id:id },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //领取体验券
  sureOrderCode(orderNo, userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_sureOrderCode,
      data: { Authorization: app.globalData.token, userId: userId, orderNo: orderNo, authUserId :app.globalData.openid },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取用户信息
  userIsAuth(openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_userIsAuth,
      data: { Authorization: app.globalData.token, openId: openId },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
}
export {
  Mine
}