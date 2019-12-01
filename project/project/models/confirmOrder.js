//获取应用实例
const app = getApp();

import {
  HTTP
} from '../utils/http.js'

class ConfirmOrder extends HTTP {
  constructor() {
    super();
  }

  //获取学校数据
  selectSchoolMainById(schoolId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_SchoolMainById,
      data: { Authorization: app.globalData.token, schoolId: schoolId },
      success: success,
      complete: complete
    }
    this.request(params);
  };

  //课程下单
  downOrder(data) {
    let params = {
      method: 'POST',
      data: data
    }
    // console.log(params);
    return this.reAjax(app.wxApi.api_downOrder, params);
  };
  //订单详情
  selectOrderDetail(orderNo, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectOrderDetail,
      data: { Authorization: app.globalData.token, orderNo: orderNo,authUserId:app.globalData.openid },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //活动订单详情
  selectActiveOrderDetail(orderNo, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectActiveOrderDetail,
      data: { Authorization: app.globalData.token, orderNo: orderNo },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //申请退款
  applicationRefund(userId,orderNo, refundReason, refundType, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_applicationRefund,
      data: { Authorization: app.globalData.token, userId: userId, orderNo: orderNo, refundReason: refundReason, refundType: refundType,authUserId:app.globalData.openid},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //获取验证码
  getSmsCode(mobile, userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getSmsCode,
      data: { Authorization: app.globalData.token, mobile: mobile, userId: userId, authUserId :app.globalData.openid},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //验证验证码
  smsCodeAuth(mobile, smsCode, userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_smsCodeAuth,
      data: { Authorization: app.globalData.token, mobile: mobile, smsCode: smsCode, userId: userId, authUserId:app.globalData.openid },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //活动下单
  generateActivityOrder(activeId, orderCount, useWaCoin, userId, userPhone, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_generateActivityOrder,
      data: { Authorization: app.globalData.token, activeId: activeId, useWaCoin: useWaCoin, orderCount: orderCount, userId: userId, userPhone: userPhone, authUserId: app.globalData.openid },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //获取活动详情
  selectActiveById(activeId, activeType, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectActive,
      data: {
        Authorization: app.globalData.token,
        activeId: activeId,
        activeType: activeType
      },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //蛙币数量
  getTotalWawowCoin(userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getTotalWawowCoin,
      data: { Authorization: app.globalData.token, userId: userId },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //使用预约码
  useOrderCode(orderCodeImgUrl, orderNo, userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_useOrderCode,
      data: { Authorization: app.globalData.token, orderCodeImgUrl: orderCodeImgUrl, orderNo: orderNo, userId: userId, authUserId: app.globalData.openid },
      success: success,
      complete: complete
    }
    console.log(params.data);
    this.request(params);
  };
  //获取课程对应的学校数据
  selectSchoolById(schoolId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectSchoolById,
      data: { schoolId: schoolId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取课程详情
  selectCourseById(openId, courseId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CourseById,
      data: { Authorization: app.globalData.token, openId: openId, courseId: courseId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取课程详情页面红包
  selectCoupon(limit, page, openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectCoupon,
      data: { Authorization: app.globalData.token, limit: limit, page: page, openId: openId },
      success: success,
      complete: complete
    }

    this.request(params);
  };
}

export {
  ConfirmOrder
}