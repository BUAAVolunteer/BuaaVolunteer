// pages/map/map.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Component({
  properties: {  },
  /**
   * 页面的初始数据
   */
  data: {
    admin: 0,
  },
  lifetimes: {
    attached() {
      // console.log(this.properties)
      let score = app.globalData.totalScore;
      let admin = 0;
      if (score >= 0 && score <= 10) admin = 1;
      else if (score > 10 && score <= 15) admin = 2;
      else if (score > 15 && score <= 25) admin = 3;
      else if (score > 25 && score <= 40) admin = 4;
      else if (score > 40 && score <= 60) admin = 5;
      else if (score > 60) admin = 6;
      this.setData({
        admin,
      });
    },
  },
  methods: {
    openIntro() {
      this.hover = this.selectComponent("#msg");
      this.hover.showHover({
        title: "解锁规则",
        isContent: true,
        content: "参与更多志愿活动\n积累志愿积分\n提升志愿星级\n一起探索新的志愿地图！",
        button: [
          {
            ID: 0,
            name: "assure",
            text: "确认",
            isAblePress: true,
          },
        ],
        success: function (res) {
          console.log(res);
        },
      });
    },
  },
});
