// pages/main/main.js
Page({
  /**
   * 页面的初始数据
   *
   */

  data: {
    // 页面按钮跳转相关信息存储
    mainIcon: [
      {
        navigateUrl: "/pages/Main/Activity/Activity",
        iconSrc: "/assests/icons/1.png",
        iconText: "近期活动",
        iconClass: "middle1",
      },
      {
        navigateUrl: "/pages/Introduction/Introduction",
        iconSrc: "/assests/icons/2.png",
        iconText: "近期活动",
        iconClass: "middle2",
      },
      {
        navigateUrl: "/pages/Main/FeedBack/FeedBack",
        iconSrc: "/assests/icons/3.png",
        iconText: "问题反馈",
        iconClass: "middle3",
      },
      {
        navigateUrl:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/5bqJNvDXhH8j9iGZ5diyMw",
        iconSrc: "/assests/icons/4.png",
        iconText: "蓝协介绍",
        iconClass: "middle4",
      },
      {
        navigateUrl:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/cgU6BbeFxHXXsWwl5wePTw",
        iconSrc: "/assests/icons/5.png",
        iconText: "联系我们",
        iconClass: "middle5",
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
