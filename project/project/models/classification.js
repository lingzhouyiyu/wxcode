//获取应用实例
const app=getApp();

import{
  HTTP
}from '../utils/http.js'

class Classification extends HTTP{
  //构造函数
  constructor() {
    super()
  }
  //获取分类数据
  getTree(success, complete) {
    let params = {
      method: 'GET',
      url: app.wxApi.api_classification,
      data: { Authorization: app.globalData.token },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取分类顶部轮播图
  getimg(categoryId,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_classificationImg,
      data: { Authorization: app.globalData.token, categoryId: categoryId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //分类页轮播图详情数据
  selectAdvertingById(Id, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectAdvertingById,
      data: { Authorization: app.globalData.token, Id: Id },
      success: success,
      complete: complete
    }
    this.request(params);
  };
}

export{
  Classification
}