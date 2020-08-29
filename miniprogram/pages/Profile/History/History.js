// pages/about/about.js
Component({
  /**
   * 页面的初始数据
   */
  properties: {
    history: {
      type: String,
      value: ""
    },
  },

  data: {
    historyList: [
      {
        note: "2019-01-01下午", //志愿备注
        title: "国家图书馆", // 志愿名称
        score: 1.2, // 志愿得分
        duration: 4, // 志愿时长
      },
      {
        note: "2019-01-01下午", //志愿备注
        title: "国家图书馆", // 志愿名称
        score: 1.2, // 志愿得分
        duration: 4, // 志愿时长
      },
      {
        note: "2019-01-01下午", //志愿备注
        title: "国家图书馆", // 志愿名称
        score: 1.2, // 志愿得分
        duration: 4, // 志愿时长
      },
      {
        note: "2019-01-01下午", //志愿备注
        title: "国家图书馆", // 志愿名称
        score: 1.2, // 志愿得分
        duration: 4, // 志愿时长
      },
      {
        note: "2019-01-01下午", //志愿备注
        title: "国家图书馆", // 志愿名称
        score: 1.2, // 志愿得分
        duration: 4, // 志愿时长
      },
    ],
  },

  lifetimes: {
    attached() {
      // 直接从个人界面传参过来
      var historyList = JSON.parse(this.properties.history)
      this.setData({
        historyList,
      })
    },
  },
});
