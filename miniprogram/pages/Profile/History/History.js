// pages/about/about.js
Component({
  /**
   * 页面的初始数据
   */
  properties: {
    history: {
      type: String,
      value: "",
    },
  },

  data: {
    historyList: [],
  },

  lifetimes: {
    attached() {
      // 直接从个人界面传参过来
      var historyList = JSON.parse(this.properties.history);
      this.setData({
        historyList,
      });
    },
  },
});
