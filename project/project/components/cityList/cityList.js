const app = getApp();
//腾讯位置
const QQMapWX = require('../../common/JS/qqmap-wx-jssdk.min.js');
// 腾讯位置实例化API核心类
const qqmapsdk = new QQMapWX({
  key: 'P2QBZ-3KUCI-4T7G6-5J54I-3TIFS-KKFZF'
});

// components/cityList/cityList.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    styles: { //这个是可以自定义最外层的view的样式
      type: String,
      value: 'width: 100%;height:100%;',
      observer: function(newval, oldval) {
        // 监听改变
        console.log(newval, oldval);
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    //下面是字母排序
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    cityListId: '',
    //下面是城市列表信息，这里只是模拟数据
    citylist: [{
      "letter": "K",
      "data": [{
        "id": "v10",
        "cityName": "昆明市"
      }]
    }, {
      "letter": "Q",
      "data": [{
        "id": "v15",
        "cityName": "曲靖市"
      }]
    }],
    //下面是热门城市数据，模拟数据
    newcity: ['北京', '上海', '广州', '深圳', '成都', '杭州'],
    // citySel: '全国',
    locateCity: app.globalData.address,
    lng:'',
    lat: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //点击城市
    cityTap(e) {
      const val = e.currentTarget.dataset.val || '',
        types = e.currentTarget.dataset.types || '',
        Index = e.currentTarget.dataset.index || '',
        that = this;
      let city = this.data.citySel;
      switch (types) {
        case 'locate':
          //定位内容
          city = this.data.locateCity;
          break;
        case 'national':
          //全国
          city = '全国';
          break;
        case 'new':
          //热门城市
          city = val;
          break;
        case 'list':
          //城市列表
          city = val.cityName;
          break;
      }
      if (city) {
        qqmapsdk.geocoder({
          address: city,
          complete: res => {
            // console.log(res.result); //经纬度对象           
           that.setData({
            lng:res.result.location.lng,
            lat:res.result.location.lat            
           })            
            //点击后给父组件可以通过bindcitytap事件，获取到cityname的值，这是子组件给父组件传值和触发事件的方法
            this.triggerEvent('myevent', {
              cityname: city,
              lng: res.result.location.lng,
              lat: res.result.location.lat   
            });
          }
        });   

      } else {
        this.getLocate();
      }

    },
    //点击城市字母
    letterTap(e) {
      const Item = e.currentTarget.dataset.item;
      this.setData({
        cityListId: Item
      });
      // console.log(this.data.cityListId);
    },
    //调用定位
    getLocate() {
      var that = this;
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          const latitude = res.latitude
          const longitude = res.longitude
          const speed = res.speed
          const accuracy = res.accuracy
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })

          //地址解析
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: latitude,
              longitude: longitude
            },
            success: function(res) {
              // console.log(res);
              //获得地址
              that.setData({
                locateCity: res.result.address_component.city
              })

            },
            fail: function(res) {

            },
            complete: function(res) {
              //获得地址
              that.setData({
                locateCity: res.result.address_component.city
              })
            }
          });
        }
      })
    }


  },
  ready() {
    this.getLocate();
  },
})