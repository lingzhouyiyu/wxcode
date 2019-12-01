//获取应用实例
const app = getApp()
//活动model
import {
  HTTP
} from '../utils/http.js'
class Vote extends HTTP {
  constructor() {
    super()
  }
  //获取个人投票列表
  getJoinList(Fkeyworlds,limit, page, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getJoinList,
      data: { Authorization: app.globalData.token, Fkeyworlds: Fkeyworlds, limit: limit, page: page },
      success: success,
      complete: complete
    }

    this.request(params);
  };
  //获取学校投票列表
  signUpSchoolList(Fkeyworlds,limit, page, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_signUpSchoolList,
      data: { Authorization: app.globalData.token, Fkeyworlds: Fkeyworlds, limit: limit, page: page },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //学校投票
  vote(id, userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_vote,
      data: { Authorization: app.globalData.token, id: id, userId: userId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //个人投票
  addPersonalVote(id, userId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addPersonalVote,
      data: { Authorization: app.globalData.token, personId: id, openId: userId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //所有学校活动信息返回
  getSchoolCount(success, complete) {
    let params = {
      method: 'GET',
      url: app.wxApi.api_getSchoolCount,
      data: { Authorization: app.globalData.token },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //个人报名人数
  getJoinCount( success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getJoinCount,
      data: { Authorization: app.globalData.token},
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //个人投票人数
  getVoteCount(success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getVoteCount,
      data: { Authorization: app.globalData.token },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //个人浏览量
  getPersonalCount(activityId,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getPersonalCount,
      data: { Authorization: app.globalData.token, activityId: activityId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //增加浏览量
  addPersonalCount(activityId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addPersonalCount,
      data: { Authorization: app.globalData.token, activityId: activityId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //个人报名
  addJoinActivity(image, introduce, name, phone, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addJoinActivity,
      data: { Authorization: app.globalData.token, image: image, introduce: introduce, name: name, phone: phone },
      success: success,
      complete: complete
    }

    this.request(params);
  };
  //学校报名
  signUpSchool(schoolAddress, schoolIntroduce, schoolName, schoolPhone, schoolPicture, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_signUpSchool,
      data: { Authorization: app.globalData.token, schoolAddress: schoolAddress, schoolIntroduce: schoolIntroduce, schoolName: schoolName, schoolPhone: schoolPhone, schoolPicture: schoolPicture },
      success: success,
      complete: complete
    }

    this.request(params);
  };
  //获取学校/个人投票活动图、时间
  getVoteActivity(activeId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getVoteActivity,
      data: { Authorization: app.globalData.token, activeId: activeId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取个人排行榜初始化数据
  getJoinListByPHB(limit, page, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getJoinListByPHB,
      data: { Authorization: app.globalData.token, limit: limit, page: page },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取学校排行榜初始化数据
  mostPopularSchoolRanking(limit, page, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_mostPopularSchoolRanking,
      data: { Authorization: app.globalData.token, limit: limit, page: page },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取学校详情
  schoolDetail(id,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_schoolDetail,
      data: { Authorization: app.globalData.token, id: id},
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取个人详情
  getUserInfo(id, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getUserInfo,
      data: { Authorization: app.globalData.token, id: id },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //分享给好友生成预约码
  personalShare(openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_personalShare,
      data: { Authorization: app.globalData.token, openId: openId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //是否订阅(关注)公众号
  isSubscribe(openid, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_isSubscribe,
      data: { Authorization: app.globalData.token, openid: openid },
      success: success,
      complete: complete
    }
    this.request(params);
  };

}
export {
  Vote
}