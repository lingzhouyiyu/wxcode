//获取应用实例
const app = getApp()
//教师详情页model
import {
  HTTP
} from '../utils/http.js'
class DetailTeacher extends HTTP {
  constructor() {
    super()
  }
  //获取教师详情学校列表
  selectSchoolForTeacher(teacherId, userLatitude, userLongitude, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_SchoolForTeacher,
      data: {
        Authorization: app.globalData.token,
        teacherId: teacherId,
        userLatitude: userLatitude,
        userLongitude: userLongitude
      },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取教师详情教师数据
  selectTeacherById(openId,teacherId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectTeacherById,
      data: {
        Authorization: app.globalData.token,
        teacherId: teacherId,
        openId: openId
      },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //教师详情页分类
  selectCategoryByTeacherId(teacherId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CategoryByTeacherId,
      data: {
        Authorization: app.globalData.token,
        teacherId: teacherId
      },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取教师详情页课程
  selectCourseForTeacherById(categoryId,limit, page, teacherId, userLatitude, userLongitude, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CourseForTeacherById,
      data: {
        Authorization: app.globalData.token,
        teacherId: teacherId,
        limit: limit,
        page: page,
        userLatitude: userLatitude,
        userLongitude: userLongitude,
        categoryId: categoryId
      },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //教师详情页评论
  selectTeacherCommentList(limit, page,teacherId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_TeacherCommentList,
      data: {
        Authorization: app.globalData.token,
        teacherId: teacherId,
        limit: limit,
        page:page
      },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //收藏教师
  addWxTeacherCollection(openId, schoolId, teacherId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_TeacherCollection,
      data: {
        Authorization: app.globalData.token,
        openId: openId,
        schoolId: schoolId,
        teacherId: teacherId
      },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //取消收藏教师
  cancelWxTeacherCollection(openId, teacherId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_cancelWxTeacherCollection,
      data: {
        Authorization: app.globalData.token,
        openId: openId,
        teacherId: teacherId
      },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
  //教师排行榜
  selectTeacherPHB(Forder, limit, page,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectTeacherPHB,
      data: {
        Authorization: app.globalData.token,
        Forder: Forder,
        limit: limit,
        page: page
      },
      success: success,
      complete: complete
    }
    // console.log(params.data);
    this.request(params);
  };
}
export {
  DetailTeacher
}