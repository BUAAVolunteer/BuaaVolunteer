// pages/OuterLink/OuterLink.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: "", //页面所展示的外部链接
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 将传入的外链赋值给页面
    console.log(options.url);
    this.setData({
      url: options.url,
    });
  },
});
