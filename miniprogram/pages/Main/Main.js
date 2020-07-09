// pages/main/main.js
let app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 页面的初始数据
   *
   */

  data: {
    // 页面按钮跳转相关信息存储
    mainIcon: [
      {
        navigateUrl: "/pages/Main/Activity/Activity",  // 要跳转到的页面路径
        iconSrc: "/assests/icons/1.png",               // 按钮图标的路径
        iconText: "近期活动",                           // 按钮的文本
        width: '724.64rpx',                            // 按钮的宽度
        backgroundColor: '#22a2c3',                    // 按钮的背景颜色
        zIndex:5                                       // 按钮的层级
      },
      {
        navigateUrl: "/pages/Introduction/Introduction",
        iconSrc: "/assests/icons/2.png",
        iconText: "近期活动",
        width: '656.64rpx',
        backgroundColor: '#5fc1c7',
        zIndex:4
      },
      {
        navigateUrl: "/pages/Main/FeedBack/FeedBack",
        iconSrc: "/assests/icons/3.png",
        iconText: "问题反馈",
        width: '588.64rpx',
        backgroundColor: '#f9d770',
        zIndex:3
      },
      {
        navigateUrl:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/5bqJNvDXhH8j9iGZ5diyMw",
        iconSrc: "/assests/icons/4.png",
        iconText: "蓝协介绍",
        width: '520.64rpx',
        backgroundColor: '#f68c60',
        zIndex:2
      },
      {
        navigateUrl:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/cgU6BbeFxHXXsWwl5wePTw",
        iconSrc: "/assests/icons/5.png",
        iconText: "联系我们",
        width: '452.64rpx',
        backgroundColor: '#f07c82',
        zIndex:1
      },
    ],
  },
  // 组件生命周期
  lifetimes: {
    // 生命周期函数，在组件实例刚刚被创建时执行
    created: function () {
      let that = this;
      wx.showLoading({
        title: "请稍后",
        mask: true,
      });
      // 调用登录云函数
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
              console.log(res.data); //获取到的地址数组
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
  // 组件自己的方法
  methods: {
    
  },
});