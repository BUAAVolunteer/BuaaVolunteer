// pages/Main/childCpn/main-swiper/main-swiper.js
let app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageList: [],// 轮播图内容列表
  },
  lifetimes: {
    attached: function () {
      let that = this;
      wx.showLoading({
        title: "请稍后",
        mask: true,
      });
      wx.cloud.callFunction({
        name: "login",
        data: {},
        success: (res) => {
          //获取openid并赋值给全局变量
          app.globalData.openid = res.result.openid;
          console.log(app.globalData);
          //主页轮播图地址
          db.collection("main").get({
            success: function (res) {
              console.log(res.data) //获取到的地址数组
              that.setData({
                imageList: res.data,
              });
              wx.hideLoading();
            },
            //  未查到数据时调用
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: "错误",
                content: "没有找到记录，请检查网络或重启小程序",
                showCancel: false,
              });
            },
          });
        },
        fail: (err) => {
          console.error(
            "[云函数] [login] 调用失败，请检查网络或重启小程序",
            err
          );
          wx.hideLoading();
        },
      });
    },
  },
});
