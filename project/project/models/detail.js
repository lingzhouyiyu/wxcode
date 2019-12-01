//获取应用实例
const app = getApp();

import {
  HTTP
} from '../utils/http.js'

class DetailModel extends HTTP {
  //构造函数
  constructor() {
    super()
  }
  //获取分类详情学校数据
  selectSchoolForCategory(schoolAddress, Fdistance,Fkeyworlds,Forder, categoryId, limit, page, userLatitude, userLongitude, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_SchoolForCategory,
      data: { Authorization: app.globalData.token, Fdistance: Fdistance, schoolAddress: schoolAddress, Fkeyworlds: Fkeyworlds, Forder: Forder, categoryId: categoryId, limit: limit, page: page, userLatitude: userLatitude, userLongitude: userLongitude },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //分类详情页热门
  selectForCategoryHotCourse(Fdistance, Fkeyworlds,Forder, categoryId, limit, page, schoolAddress, userLatitude, userLongitude, success, complete){
    let params = {
      method: 'POST',
      url: app.wxApi.api_CategoryHotCourse,
      data: { Authorization: app.globalData.token, Fdistance: Fdistance, Fkeyworlds: Fkeyworlds, Forder: Forder, categoryId: categoryId, schoolAddress: schoolAddress, limit: limit, page: page, userLatitude: userLatitude, userLongitude: userLongitude },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //分类详情页教师数据
  selectCategoryTeacher(schoolAddress, Fkeyworlds, categoryId, Forder, limit, page, userLatitude, userLongitude,success, complete){
    let params = {
      method: 'POST',
      url: app.wxApi.api_CategoryTeacher,
      data: { Authorization: app.globalData.token, schoolAddress: schoolAddress, categoryId: categoryId, Forder: Forder, Fkeyworlds: Fkeyworlds, limit: limit, page: page, userLatitude: userLatitude, userLongitude: userLongitude },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //获取商圈数据
  selectShopArea(limit, page, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectShopArea,
      data: { Authorization: app.globalData.token, limit: limit, page: page},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
}

export {
  DetailModel
}