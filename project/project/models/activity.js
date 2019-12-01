//获取应用实例
const app = getApp();

import {
  HTTP
} from '../utils/http.js'

class Activity extends HTTP {
  constructor() {
    super();
  }
  //获取首页顶部轮播图详情
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
  //获取分类数据
  getTree(success, complete) {
    let params = {
      method: 'GET',
      url: app.wxApi.api_classification,
      data: {
        Authorization: app.globalData.token
      },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取课程数据
  selectMadeCourse(fdistance,categoryId,Forder, activeId, limit, page, userLatitude, userLongitude, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectMadeCourse,
      data: {
        Authorization: app.globalData.token,
        Forder: Forder,
        activeId: activeId,
        limit: limit,
        page: page,
        userLatitude: userLatitude,
        userLongitude: userLongitude,
        categoryId: categoryId,
        fdistance: fdistance
      },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //分享免费领券下单
  generateActivityOrder(activeId, orderCount, useWaCoin, userId, userPhone, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_generateActivityOrder,
      data: { Authorization: app.globalData.token, activeId: activeId, useWaCoin: useWaCoin, orderCount: orderCount, userId: userId, userPhone: userPhone, authUserId: app.globalData.openid},
      success: success,
      complete: complete
    }
    console.log(params.data);
    this.request(params);
  };
  //分享免费领券下单支付
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
}

export {
  Activity
}