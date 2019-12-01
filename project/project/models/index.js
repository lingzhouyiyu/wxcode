//获取应用实例
const app = getApp()
//首页model
import {
  HTTP
} from '../utils/http.js'
class IndexModel extends HTTP {
  constructor() {
    super()
  }
  //获取首页分类
  getIndexCategory(success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_indexCategory,
      data: { Authorization:app.globalData.token},
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //首页本周优选
  selectThisWeek(success, complete){
    let params = {
      method: 'POST',
      url: app.wxApi.api_thisWeek,
      data: { Authorization: app.globalData.token },
      success: success,
      complete: complete
    }
    this.request(params);
  };
 //首页学校
  selectIndexSchool(Fkeyworlds,categoryId,limit, page, userLatitude, userLongitude,success, complete){

    let params={
      method:'POST',
      url:app.wxApi.api_indexSchool,
      data: { Authorization: app.globalData.token, Fkeyworlds: Fkeyworlds, fkeyworlds: Fkeyworlds, categoryId: categoryId,  limit: limit, page: page, userLatitude: userLatitude, userLongitude: userLongitude},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //名师推荐
  selectGoodsTeacher(success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_GoodsTeacher,
      data: { Authorization: app.globalData.token },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //轮播图
  selectIndexActive(success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_IndexActive,
      data: { Authorization: app.globalData.token },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //所有分类
  selectCategory(success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_Category,
      data: { Authorization: app.globalData.token },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //更新用户信息
  updateUser(ncImages, ncName, openId,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_updateUser,
      data: { Authorization: app.globalData.token, ncImages: ncImages, ncName: ncName, openId: openId },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //通知
  selectAllNotice(limit, page, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectAllNotice,
      data: { Authorization: app.globalData.token, limit: limit, page: page },
      success: success,
      complete: complete
    }

    this.request(params);
  };
  //私信
  selectAllCantact(limit, page, openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectAllCantact,
      data: { Authorization: app.globalData.token, limit: limit, page: page, openId: openId },
      success: success,
      complete: complete
    }
 
    this.request(params);
  };
  //获取用户信息
  userIsAuth( openId, success, complete) {
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
  //查询当前用户是否助力过
  listShareCount(helpId, shareId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_listShareCount,
      data: { Authorization: app.globalData.token, helpId: helpId, shareId: shareId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //增加分享者的分享次数
  updateWxUserShareCount(helpId, shareId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_updateWxUserShareCount,
      data: { Authorization: app.globalData.token, helpId: helpId, shareId: shareId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //增加分享者的蛙币
  generateCoinOrderShare(money, userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_generateCoinOrderShare,
      data: { Authorization: app.globalData.token, money: money, userId: userId, authUserId: app.globalData.openid },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //搜索历史新增
  addSearch(keyWorlds, openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addSearch,
      data: { Authorization: app.globalData.token, keyWorlds: keyWorlds, openId: openId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取个人搜索历史纪录
  selectHistory(limit, page, openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectHistory,
      data: { Authorization: app.globalData.token, limit: limit, page: page, openId: openId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //删除全部历史记录
  deleteAll(openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_deleteAll,
      data: { Authorization: app.globalData.token,openId: openId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //删除一条历史记录
  deleteAlong(id,openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_deleteAlong,
      data: { Authorization: app.globalData.token,id:id, openId: openId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //热搜
  hotSearch(success, complete) {
    let params = {
      method: 'GET',
      url: app.wxApi.api_hotSearch,
      data: { Authorization: app.globalData.token},
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //搜索页面课程信息
  selectSearchCourse(Fkeyworlds, Forder, limit, page, schoolAddress, userLatitude, userLongitude , success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectSearchCourse,
      data: { Authorization: app.globalData.token, Fkeyworlds: Fkeyworlds, Forder: Forder, limit: limit, page: page, schoolAddress: schoolAddress, userLatitude: userLatitude, userLongitude: userLongitude,},
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
}
export {
  IndexModel
}