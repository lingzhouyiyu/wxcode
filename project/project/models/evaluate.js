//获取应用实例
const app = getApp();

import {
  HTTP
} from '../utils/http.js'

class Evaluate extends HTTP {
  constructor() {
    super();
  }
  //订单评论初始化数据
  selectTeacherAndSchoolForComment(courseId, mainId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_TeacherAndSchoolForComment,
      data: { Authorization: app.globalData.token, courseId: courseId, mainId: mainId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //提交评论数据
  addComment(schoolComment, teacherComment, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addComment,
      data: { Authorization: app.globalData.token, schoolComment: schoolComment, teacherComment: teacherComment },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };

}

export {
  Evaluate
}
