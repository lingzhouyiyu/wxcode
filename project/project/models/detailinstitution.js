//获取应用实例
const app=getApp();

import{
  HTTP
} from '../utils/http.js'

class Detailinstitution extends HTTP{
  constructor(){
    super();
  }

  //获取学校对应的课程
  selectCourseForSchool(categoryID,limit, page, schoolId,latitude, longitude, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CourseForSchool,
      data: { Authorization: app.globalData.token, categoryId: categoryID, limit: limit, page: page, schoolId: schoolId, userLatitude: latitude, userLongitude:longitude },
      success: success,
      complete: complete
    }

    this.request(params);
  };
  //获取学校数据
  selectSchoolMainById(schoolId, success, complete){
    let params = {
      method: 'POST',
      url: app.wxApi.api_SchoolMainById,
      data: { Authorization: app.globalData.token, schoolId: schoolId},
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取课程对应的学校数据
  selectSchoolById(schoolId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectSchoolById,
      data: {schoolId: schoolId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取课程详情
  selectCourseById(openId,courseId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CourseById,
      data: { Authorization: app.globalData.token, openId: openId, courseId: courseId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //课程下单次数
  getUserBuyCount(courseId,openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_getUserBuyCount,
      data: { Authorization: app.globalData.token, userId: openId, courseId: courseId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //学校详情页分类
  selectCategoryBySchoolId(schoolId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CategoryBySchoolId,
      data: { Authorization: app.globalData.token, schoolId: schoolId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //学校详情页教师团队
  selectTeacherBySchoolId(schoolId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_TeacherBySchoolId,
      data: { Authorization: app.globalData.token, schoolId: schoolId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //学校评论
  selectSchoolCommentList(limit, page,schoolId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectSchoolCommentList,
      data: { Authorization: app.globalData.token, schoolId: schoolId, limit: limit, page: page },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //收藏课程
  addWxCourseCollection(courseId, openId, schoolId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CourseCollection,
      data: { Authorization: app.globalData.token, courseId: courseId, openId: openId, schoolId: schoolId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //取消收藏课程
  cancelCourse(courseId, openId, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_cancelCourse,
      data: { Authorization: app.globalData.token, courseId: courseId, openId: openId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取评论
  selectCourseCommentList(courseId, limit, page,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_CourseCommentList,
      data: { Authorization: app.globalData.token, courseId: courseId, limit: limit, page: page },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取课程详情页面红包
  selectCoupon(limit, page,openId,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectCoupon,
      data: { Authorization: app.globalData.token, limit: limit, page: page, openId: openId },
      success: success,
      complete: complete
    }

    this.request(params);
  };
  //领取红包
  addCouponUse(couponId, openId , success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addCouponUse,
      data: { Authorization: app.globalData.token, couponId: couponId, openId: openId },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //获取优惠券
  selectMyCoupon(limit, page, openId,  success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectMyCoupon,
      data: { Authorization: app.globalData.token, limit: limit, openId: openId, page: page },
      success: success,
      complete: complete
    }

    this.request(params);
  };
  //添加私信
  addControect(openId, schoolId, schoolImg, schoolName, success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_addControect,
      data: { Authorization: app.globalData.token, openId: openId, schoolId: schoolId, schoolImg: schoolImg, schoolName: schoolName },
      success: success,
      complete: complete
    }
    this.request(params);
  };
  //课程详情页教师列表
  selectTeacherByCourseId(schoolId,success, complete) {
    let params = {
      method: 'POST',
      url: app.wxApi.api_selectTeacherByCourseId,
      data: { Authorization: app.globalData.token, schoolId: schoolId, },
      success: success,
      complete: complete
    }
    this.request(params);
  };
}

export{
  Detailinstitution
}