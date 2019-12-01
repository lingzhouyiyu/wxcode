const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//小数的四舍五入，传输被处理的小数，小点后的保留位数， 返回四舍五入处理后的小数
var floatRound =function (Dight, How) {
  Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
  return Dight;
}

var Rad = function (d) {
  return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}

//获取两个中标点的距离-数据低一点lat,lng 第二点lat,lng，返回距离单位km
var getDistance = function (lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  //s=s.toFixed(4);
  return s;
}


var pointCorrect = function (Points, longitude, latitude, dis) {
  //Points被比较的坐标坐标点[{longitude:"104.163883",latitude:"28.247961"}]  
  //longitude  比较点的经度
  //latitude  比较点的纬度
  //dis 千米距离



  //先计算查询点的经纬度范围  
  var r = 6378.137;//地球半径千米    
  var dlng = 2 * Math.asin(Math.sin(dis / (2 * r)) / Math.cos(latitude * Math.PI / 180));
  dlng = dlng * 180 / Math.PI;//角度转为弧度  
  var dlat = dis / r;
  dlat = dlat * 180 / Math.PI;

  console.log('--------');
  console.log('中心点坐标：' + latitude + "-" + longitude);
  console.log('搜寻范围：' + dis);

  var minlat = floatRound(latitude - dlat, 6);
  var maxlat = floatRound(latitude + dlat, 6);
  var minlng = floatRound(longitude - dlng, 6);
  var maxlng = floatRound(longitude + dlng, 6);

  console.log('最大点坐标：' + maxlat + "-" + maxlng);
  console.log('最小点坐标：' + minlat + "-" + minlng);


  for (var i = 0; i < Points.length; i++) {
    var tlongitude = parseFloat(Points[i].longitude);
    var tlatitude = parseFloat(Points[i].latitude);

    // console.log('被比较点点坐标：' + tlatitude + "-" + tlongitude);
    if ((tlongitude > minlng || tlongitude == minlng) && (tlongitude < maxlng || tlongitude == maxlng) && (tlatitude > minlat || tlatitude == minlat) && (tlatitude < maxlat || tlatitude == maxlat)) {
      console.log('符合条件的点:' + i);
      console.log(getDistance(tlatitude, tlongitude, latitude, longitude));
    }
    else {
    }
  }
}

module.exports = {
  formatTime: formatTime,
  getDistance: getDistance,//获取两个中标点的距离-数据低一点lat,lng 第二点lat,lng，返回距离单位km
  floatRound: floatRound,  //小数的四舍五入，传输被处理的小数，小点后的保留位数， 返回四舍五入处理后的小数
  pointCorrect: pointCorrect
}
