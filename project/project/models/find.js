//获取应用实例
const app = getApp()
//首页model
import {
  HTTP
} from '../utils/http.js'

class FindModel extends HTTP {
  constructor() {
    super()
  }
  //发现最新活动
  selectAllUnderActivity(limit, page,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectAllUnderActivity,
      data: { Authorization: app.globalData.token, limit: limit, page: page },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //发现活动详情
  selectUnderById(Id, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectUnderById,
      data: { Authorization: app.globalData.token, Id: Id, },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //发现新闻列表
  selectAllPlatNews(limit, page, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectAllPlatNews,
      data: { Authorization: app.globalData.token, limit: limit, page: page },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //发现新闻详情
  selectUnderNewsById(Id,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectUnderNewsById,
      data: { Authorization: app.globalData.token, Id: Id,},
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //发现新闻新增浏览量
  updateLookCount(Id, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_updateLookCount,
      data: { Authorization: app.globalData.token, Id: Id, },
      success: success,
      complete: complete
    }
    this.request(params);
  };
}

export {
  FindModel
}