// pages/orders/confirmOrder/confirmOrder.js
//获取应用实例
const app = getApp();

import {
  ConfirmOrder
} from '../../../models/confirmOrder.js'

let confirmOrder = new ConfirmOrder()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ordercounts: 1,
    courseInfo: null,
    schoolInfo: null,
    reservationsRate: 0,
    reservation: 0,
    repaymount: 0,
    cacReservation: 0, //初始预约金
    cacReservations: 0,
    cacRepaymount: 0,
    phonenum: "",
    yhqje: 0,
    yhqid: '',
    Furl: app.globalData.Serverurl,
    usewabi: true,
    usehongbao: true,
    hashongbao: true,
    finalcacReservation: 0,
    WawowCoin: 0,
    WawowCoins: 0, //初始蛙币数量
    courseAdvancePayment: 0, //课程价格
    courseList:'',
    schoolList:'',
    voucherArray:[],//红包
    isLimit:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var tags = options.tag;
    app.globalData.userPhone = options.phonedata;
    if (tags == 'detailcourse') {
      //下单电话优惠券金额id
      that.setData({
        phonenum: options.phonedata,
        yhqje: Number(options.money),
        yhqid: options.id,
        courseAdvancePayment: options.courseAdvancePayment,
        courseId: options.courseId,
      });
    } else if (tags == 'coupon') {
      that.setData({
        phonenum: options.phonedata,
        yhqje: Number(options.money),
        yhqid: options.id,
        courseAdvancePayment: options.courseAdvancePayment,
        courseId: options.courseId,
      });
    }
    //获取课程数据和学校数据
    this.selectCourseById(that.data.courseId);
    //不能使用优惠券
    if (options.money == 0 && options.id == 0) {
      that.setData({
        usehongbao: false,
        yhqje:0,
        yhqid: '',
        hashongbao: false,
      })
    }
    //获取本地缓存
    // wx.getStorage({
    //   key: "courseAndSchoolData",
    //   success: function(res) {
    //     // console.log(res.data);
    //     that.setData({
    //       courseInfo: res.data.courseData,
    //       schoolInfo: res.data.schoolData,
    //       reservationsRate: res.data.schoolData.schoolCommission,
    //       reservation: res.data.reservation,
    //       repaymount: res.data.repaymount,
    //       cacReservation: Number(res.data.reservation),
    //       cacReservations: Number(res.data.reservation),
    //       cacRepaymount: res.data.repaymount,
    //       // userPhone: "",
    //       finalcacReservation: Number(res.data.reservation),
    //     })
    //   }
    // });
    //获取红包数据
    that.selectCoupon();
    if (app.globalData.token == null) {
      app.getToken();
    }
  },
  //下拉刷新
  onPullDownRefresh: function() {
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  //上拉加载
  onReachBottom: function() {},
  //查询蛙币数量
  getTotalWawowCoin: function() {
    var that = this;
    confirmOrder.getTotalWawowCoin(app.globalData.openid, data => {
      that.setData({
        WawowCoins: Number(data.data),
        WawowCoin: Number(data.data),
      })
      // 初始化还需支付预约金
      // 红包
      if (this.data.hashongbao) {
        if (that.data.cacReservation < that.data.yhqje) { //红包金额大于预约金---不能使用红包
         
          that.setData({
            usehongbao: false,
          })
          if (that.data.WawowCoin > that.data.cacReservation) {
            that.setData({
              WawowCoin: that.data.cacReservation,
              finalcacReservation: 0,
            })
          }
        } else { //能使用红包
     
          if (this.data.usehongbao) { //用红包
         
            if (that.data.WawowCoin > (that.data.cacReservation - that.data.yhqje)) { //蛙币数量大于抵扣后的预约金
              that.setData({
                WawowCoin: that.data.cacReservation - that.data.yhqje,
                finalcacReservation: 0,
              })
            } else {
              that.setData({
                finalcacReservation: that.data.finalcacReservation - that.data.yhqje,
              })
            }
          }
        }
      }

      // 蛙币
      if (that.data.WawowCoins == 0) { //不能使用蛙币
        that.setData({
          usewabi: false,
        })
      } else { //能使用蛙币
        if (this.data.usehongbao) { //用红包
          if (this.data.usewabi) { //使用蛙币
            if (that.data.WawowCoins > (that.data.cacReservation-that.data.yhqje)) { //蛙币数量大于预约金-红包
              that.setData({
                WawowCoin: that.data.cacReservation - that.data.yhqje,
                finalcacReservation: 0,
              })
            } else { //蛙币数量小于预约金-红包
              that.setData({
                WawowCoin: that.data.WawowCoins,
                finalcacReservation: that.data.cacReservation - that.data.yhqje - that.data.WawowCoins,
              })
            }
          }
        } else {//不用红包
          if (this.data.usewabi) { //使用蛙币
            if (that.data.WawowCoins > (that.data.cacReservation)) { //蛙币数量大于预约金
              that.setData({
                WawowCoin: that.data.cacReservation,
                finalcacReservation: 0,
              })
            } else { //蛙币数量小于预约金
              that.setData({
                WawowCoin: that.data.WawowCoins,
                finalcacReservation: that.data.cacReservation - that.data.WawowCoins,
              })
            }
          }
        }

      }
      // 隐藏加载框
      wx.hideLoading();
    }, res => {});
  },
  //选择蛙币
  selectwabi: function() {
    var that = this;
    if (that.data.WawowCoins == 0) { //不能用蛙币
      wx.showToast({
        title: '您暂时没有蛙币!',
        duration: 1000,
        icon: 'none'
      })
      return;
    } else { //能用蛙币
      this.setData({
        usewabi: !this.data.usewabi
      })
      if (this.data.usewabi) { //用蛙币
        if (this.data.usehongbao) { //用红包
          if (that.data.WawowCoins > that.data.cacReservation - that.data.yhqje) { //蛙币数量大于预约金-红包
            that.setData({
              WawowCoin: that.data.cacReservation - that.data.yhqje,
              finalcacReservation: 0,
            })
          } else { //蛙币数量小于预约金-红包
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: (that.data.cacReservation - that.data.WawowCoins - that.data.yhqje).toFixed(2)
            })
          }
        } else { //不用红包
          if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
            that.setData({
              WawowCoin: that.data.cacReservation,
              finalcacReservation: 0,
            })
          } else { //蛙币数量小于预约金
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2)
            })
          }
        }
      } else { //不用蛙币
        if (this.data.usehongbao) { //用红包
          that.setData({
            finalcacReservation: that.data.cacReservation - that.data.yhqje
          })
        } else { //不用红包
          that.setData({
            finalcacReservation: that.data.cacReservation
          })
        }
      }
    }

  },
  //选择红包
  selecthongbao: function() {
    var that = this;
    if (that.data.cacReservation < that.data.yhqje) { //不能用红包
      wx.showToast({
        title: '红包金额大于预约金!',
        duration: 1000,
        icon: 'none'
      })
      this.setData({
        usehongbao: false
      })
      return;
    } else { //能用红包
      this.setData({
        usehongbao: !this.data.usehongbao
      })
      if (this.data.usehongbao) { //用红包
       
        if (this.data.usewabi) { //用蛙币
        
          if ((that.data.cacReservation - that.data.yhqje) < that.data.WawowCoins) { //红包抵扣后金额小于蛙币数量
            that.setData({
              WawowCoin: (that.data.cacReservation - that.data.yhqje).toFixed(2),
              finalcacReservation: 0
            })
          } else if ((that.data.cacReservation - that.data.yhqje) > that.data.WawowCoins) { //红包抵扣后金额大于蛙币数量
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: (that.data.cacReservation - that.data.yhqje - that.data.WawowCoin).toFixed(2),
            })
          }
        } else { //不用蛙币      
          if ((that.data.cacReservation - that.data.yhqje) < that.data.WawowCoins) { //红包抵扣后金额小于蛙币数量
            that.setData({
              WawowCoin: (that.data.cacReservation - that.data.yhqje).toFixed(2),
              finalcacReservation: (that.data.cacReservation - that.data.yhqje).toFixed(2),
            })
          } else if ((that.data.cacReservation - that.data.yhqje) > that.data.WawowCoins) { //红包抵扣后金额大于蛙币数量
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: (that.data.cacReservation - that.data.yhqje).toFixed(2),
            })
          }
        }

      } else { //不用红包
        if (this.data.usewabi) { //用蛙币
          if (that.data.WawowCoins > that.data.cacReservation) { //蛙币数量大于预约金
            that.setData({
              WawowCoin: that.data.cacReservation,
              finalcacReservation: 0
            })
          } else { //蛙币数量小于于预约金
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2),
            })
          }
        } else { //不用蛙币
          that.setData({
            WawowCoin: that.data.WawowCoins,
            finalcacReservation: that.data.cacReservation
          })
        }
      }

    }

  },
  countsub: function() { //减少数量
    var that = this;
    if (that.data.isLimit) return;
    if (that.data.ordercounts != 1) {
      that.setData({
        ordercounts: that.data.ordercounts - 1,
        cacReservation: that.data.reservation * (that.data.ordercounts - 1),
        cacRepaymount: (that.data.repaymount * (that.data.ordercounts - 1)).toFixed(2),
        finalcacReservation: that.data.reservation * (that.data.ordercounts - 1),
      })
      this.getvalue().then(res => {
        if (res[0] == 0 && res[1] == 0) {//没有红包
          that.setData({
            usehongbao: false,
            hashongbao: false,
          })
          if (this.data.usewabi) { //用蛙币
            if (that.data.WawowCoins > that.data.cacReservation) { //蛙币大于预约金
              that.setData({
                WawowCoin: that.data.cacReservation,
                finalcacReservation: 0,
              })
            } else { //蛙币小于预约金
              that.setData({
                WawowCoin: that.data.WawowCoins,
                finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2),
              })
            }
          } else { //不用用蛙币
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: that.data.cacReservation,
            })
          }
        } else {//有红包
          that.setData({
            yhqid: res[1],
            yhqje: res[0],
          })
          if (that.data.cacReservation < that.data.yhqje) {//红包不可用
            that.setData({
              usehongbao: false,
              hashongbao: false,
            })
            if (this.data.usewabi) { //用蛙币
              if (that.data.WawowCoins > that.data.cacReservation) { //蛙币大于预约金
                that.setData({
                  WawowCoin: that.data.cacReservation,
                  finalcacReservation: 0,
                })
              } else { //蛙币小于预约金
                that.setData({
                  WawowCoin: that.data.WawowCoins,
                  finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2),
                })
              }
            } else { //不用用蛙币
              that.setData({
                WawowCoin: that.data.WawowCoins,
                finalcacReservation: that.data.cacReservation,
              })
            }
          } else if (that.data.cacReservation > that.data.yhqje) {//红包可用
            that.setData({
              usehongbao: true,
              hashongbao: true,
            })
            if (this.data.usehongbao) { //用红包
              if (this.data.usewabi) { //用蛙币
                if (that.data.WawowCoins > (that.data.cacReservation - that.data.yhqje)) { //蛙币大于预约金-红包
                  that.setData({
                    WawowCoin: that.data.cacReservation - that.data.yhqje,
                    finalcacReservation: 0,
                  })
                } else { //蛙币小于预约金-红包
                  that.setData({
                    WawowCoin: that.data.WawowCoins,
                    finalcacReservation: (that.data.cacReservation - that.data.WawowCoins - that.data.yhqje).toFixed(2),
                  })
                }
              } else { //不用用蛙币
                if ((that.data.cacReservation - that.data.yhqje) < that.data.WawowCoins) { //红包抵扣后金额小于蛙币数量
                  that.setData({
                    WawowCoin: (that.data.cacReservation - that.data.yhqje).toFixed(2),
                    finalcacReservation: (that.data.cacReservation - that.data.yhqje).toFixed(2),
                  })
                } else if ((that.data.cacReservation - that.data.yhqje) > that.data.WawowCoins) { //红包抵扣后金额大于蛙币数量
                  that.setData({
                    WawowCoin: that.data.WawowCoins,
                    finalcacReservation: (that.data.cacReservation - that.data.yhqje).toFixed(2),
                  })
                }
              }
            } else { //不用红包
              if (this.data.usewabi) { //用蛙币
                if (that.data.WawowCoins > that.data.cacReservation) { //蛙币大于预约金
                  that.setData({
                    WawowCoin: that.data.cacReservation,
                    finalcacReservation: 0,
                  })
                } else { //蛙币小于预约金
                  that.setData({
                    WawowCoin: that.data.WawowCoins,
                    finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2),
                  })
                }
              } else { //不用用蛙币
                that.setData({
                  WawowCoin: that.data.WawowCoins,
                  finalcacReservation: that.data.cacReservation,
                })
              }
            }
          }
        }
      })

    } else {
      return;
    }

  },
  countadd: function() { //增加数量
    var that = this;
    if (that.data.isLimit) return;
    that.setData({
      ordercounts: that.data.ordercounts + 1,
      cacReservation: (that.data.reservation * (that.data.ordercounts + 1)).toFixed(2),
      cacRepaymount: (that.data.repaymount * (that.data.ordercounts + 1)).toFixed(2),

    })
    this.getvalue().then(res => {
      if (res[0] == 0 && res[1] == 0) {//没有红包
        that.setData({
          usehongbao: false,
          hashongbao: false,
        })
        if (this.data.usewabi) { //用蛙币
          if (that.data.WawowCoins > that.data.cacReservation) { //蛙币大于预约金
            that.setData({
              WawowCoin: that.data.cacReservation,
              finalcacReservation: 0,
            })
          } else { //蛙币小于预约金
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2),
            })
          }
        } else { //不用用蛙币
          that.setData({
            WawowCoin: that.data.WawowCoins,
            finalcacReservation: that.data.cacReservation,
          })
        }
      } else {//有红包
        that.setData({
          yhqid: res[1],
          yhqje: res[0],
        })
        if (that.data.cacReservation < that.data.yhqje) {//红包不可用
          that.setData({
            usehongbao: false,
            hashongbao: false,
          })
          if (this.data.usewabi) { //用蛙币
            if (that.data.WawowCoins > that.data.cacReservation) { //蛙币大于预约金
              that.setData({
                WawowCoin: that.data.cacReservation,
                finalcacReservation: 0,
              })
            } else { //蛙币小于预约金
              that.setData({
                WawowCoin: that.data.WawowCoins,
                finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2),
              })
            }
          } else { //不用用蛙币
            that.setData({
              WawowCoin: that.data.WawowCoins,
              finalcacReservation: that.data.cacReservation,
            })
          }
        } else if (that.data.cacReservation > that.data.yhqje) {//红包可用
          that.setData({
            usehongbao: true,
            hashongbao: true,
          })
          if (this.data.usehongbao) { //用红包
            if (this.data.usewabi) { //用蛙币
              if (that.data.WawowCoins > (that.data.cacReservation - that.data.yhqje)) { //蛙币大于预约金-红包
                that.setData({
                  WawowCoin: that.data.cacReservation - that.data.yhqje,
                  finalcacReservation: 0,
                })
              } else { //蛙币小于预约金-红包
                that.setData({
                  WawowCoin: that.data.WawowCoins,
                  finalcacReservation: (that.data.cacReservation - that.data.WawowCoins - that.data.yhqje).toFixed(2),
                })
              }
            } else { //不用用蛙币
              if ((that.data.cacReservation - that.data.yhqje) < that.data.WawowCoins) { //红包抵扣后金额小于蛙币数量
                that.setData({
                  WawowCoin: (that.data.cacReservation - that.data.yhqje).toFixed(2),
                  finalcacReservation: (that.data.cacReservation - that.data.yhqje).toFixed(2),
                })
              } else if ((that.data.cacReservation - that.data.yhqje) > that.data.WawowCoins) { //红包抵扣后金额大于蛙币数量
                that.setData({
                  WawowCoin: that.data.WawowCoins,
                  finalcacReservation: (that.data.cacReservation - that.data.yhqje).toFixed(2),
                })
              }
            }
          } else { //不用红包
            if (this.data.usewabi) { //用蛙币
              if (that.data.WawowCoins > that.data.cacReservation) { //蛙币大于预约金
                that.setData({
                  WawowCoin: that.data.cacReservation,
                  finalcacReservation: 0,
                })
              } else { //蛙币小于预约金
                that.setData({
                  WawowCoin: that.data.WawowCoins,
                  finalcacReservation: (that.data.cacReservation - that.data.WawowCoins).toFixed(2),
                })
              }
            } else { //不用用蛙币
              that.setData({
                WawowCoin: that.data.WawowCoins,
                finalcacReservation: that.data.cacReservation,
              })
            }
          }
        }
      }
    })
   
  

  },
  // userPhoneBlur: function(e) {
  //   this.setData({
  //     userPhone: e.detail.value
  //   })
  // },
  ordercounts: function(e) {
    this.setData({
      ordercounts: e.detail.value
    })
  },
  downOrder: function(e) {
    var that = this;
    var courseInfo = that.data.courseInfo;

    var regexp = /^1[34578]\d{9}$/;
    if (!regexp.test(that.data.phonenum)) {
      wx.showToast({
        title: '手机号不正确！',
        icon: 'loading',
      })
      return;
    }
    //是否使用红包
    if (that.data.usehongbao) {
      that.setData({
        useCouponis: '1'
      })
    } else {
      that.setData({
        useCouponis: '2'
      })
    }
    //是否使用蛙币
    if (that.data.usewabi) {
      that.setData({
        useWaCoin: '1'
      })
    } else {
      that.setData({
        useWaCoin: '2'
      })
    }
    var data = {
      courseId: courseInfo.courseId,
      orderCount: that.data.ordercounts,
      userId: app.globalData.openid, //openid
      userPhone: that.data.phonenum,
      couponId: that.data.yhqid,
      useWaCoin: that.data.useWaCoin,
      useCouponis: that.data.useCouponis,
      authUserId :app.globalData.openid
    }
    confirmOrder.downOrder(data).then(res => {
      var orderNo = "",
        amount = "",
        orderRepaymount = '';
      var respData = res.data;
      if (respData.status == 200) {
        if (respData.data) {
          orderNo = respData.data.orderNo;
          amount = respData.data.amount;
          orderRepaymount = respData.data.orderRepaymount;
        }
        wx.navigateTo({
          url: '../../../pages/orders/pay/pay?orderNo=' + orderNo + "&amount=" + amount + "&orderRepaymount=" + orderRepaymount + '&tag=course',
        })
      } else {
        wx.showToast({
          title: '下单失败！',
          icon: 'loading',
        })
      }
    });

  },
  //选择红包
  gotocoupon: function(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../../pages/coupon/coupon?id=' + id + '&tag=confirmOrder' + '&phonedata=' + this.data.phonenum + '&courseAdvancePayment=' + that.data.courseAdvancePayment + '&courseId=' + that.data.courseId,
    })
  },
  //获取红包数据
  selectCoupon: function () {
    var that = this;
    var limits=100;
    var pages=1;
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    confirmOrder.selectCoupon(limits, pages, app.globalData.openid, data => {
      var temp = data.data;
      var array = [];
      for (let i = 0; i < data.data.length; i++) {
        temp[i].startTime = temp[i].startTime.substring(0, 10);
        temp[i].endTime = temp[i].endTime.substring(0, 10);
        if (temp[i].hasGet == 1) {
          array.push(temp[i]);
        }
      }
      that.setData({
        voucherArray: array,
      });
      // 隐藏导航栏加载框
      wx.hideNavigationBarLoading();
    }, res => { });
  },
  //计算优惠券金额
  getvalue: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      var datas = [];
      for (let k = 0; k < that.data.voucherArray.length; k++) {
        if (that.data.voucherArray[k].hasGet == 1) {
          datas.push(that.data.voucherArray[k]);
        }
      }
      var data = datas;
      var temp = [];
      for (let j = 0; j < data.length; j++) {
        if ((that.data.cacReservation) > data[j].maxPrice) {
          temp.push(data[j]);
        }
      }
      if (temp.length == 0) {
        var temps = [];
        temps.push(0);
        temps.push(0);
        resolve(temps);
      } else {
        var Maxmoney = temp[0].price;
        var Maxid = temp[0].id;

        for (let i = 0; i < temp.length; i++) {
          if (temp[i].hasGet == 1) {
            if (temp[i].price > Maxmoney) {
              Maxmoney = temp[i].price;
              Maxid = temp[i].id;
            }
          }
        }
        var temps = [];
        temps.push(Maxmoney);
        temps.push(Maxid);
        resolve(temps);
      }
    })
  },
  //获取课程详情
  selectCourseById: function (courseId) {
    var that = this;
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    confirmOrder.selectCourseById(app.globalData.openid, courseId, data => {
      //获取学校数据
      var schoolId = data.data.schoolId;
      that.selectSchoolById(schoolId);
     
      var temp = data.data;
      if (temp.courseImg != '' && temp.courseImg != null) {
        temp.newImg = temp.courseImg.split(',');
      }
         
      that.setData({
        courseList: temp,
      });
      if (that.data.courseList.purchaseLimit == 1) {
        that.setData({
          isLimit: true
        })
      } 
      console.log(that.data.courseList);
    }, res => { });
  },
  //获取课程所在学校的数据
  selectSchoolById: function (schoolId) {
    var that = this;
    confirmOrder.selectSchoolById(schoolId, data => {
      that.setData({
        schoolList: data.data,
      })
      that.setData({
        courseInfo: that.data.courseList,
        schoolInfo: that.data.schoolList,
        reservationsRate: that.data.schoolList.schoolCommission,              
      })
      if (that.data.courseList.courseAdvancePayment && that.data.schoolList.schoolCommission) {
        that.setData({
          //预约金
          reservation: (that.data.courseList.courseAdvancePayment * (that.data.schoolList.schoolCommission * 0.01)).toFixed(2),
          //到院再付金
          repaymount: (that.data.courseList.courseAdvancePayment - (that.data.courseList.courseAdvancePayment * (that.data.schoolList.schoolCommission * 0.01))).toFixed(2),    
          cacReservation: Number(that.data.courseList.courseAdvancePayment * (that.data.schoolList.schoolCommission * 0.01)).toFixed(2),
          cacReservations: Number(that.data.courseList.courseAdvancePayment * (that.data.schoolList.schoolCommission * 0.01)).toFixed(2),
          cacRepaymount: (that.data.courseList.courseAdvancePayment - (that.data.courseList.courseAdvancePayment * (that.data.schoolList.schoolCommission * 0.01))).toFixed(2),
          finalcacReservation: Number(that.data.courseList.courseAdvancePayment * (that.data.schoolList.schoolCommission * 0.01)).toFixed(2),
        });
      }
      //获取蛙币数量
      this.getTotalWawowCoin();
    }, res => { });
  },
})