// pages/nk/task/qrcode.js
var QRCode = require('../../../utils/weapp-qrcode.js')

var qrcode;

Page({
  data: {
    image: ''
  },
  onLoad: function (options) {

    qrcode = new QRCode('canvas', {
      // usingIn: this,
      text: '{"vehicleId": "' + options.ClassesId+'"}',
      image: '/images/bg.jpg',
      width: 150,
      height: 150,
      colorDark: "#000000",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
})