// pages/Practice/Practice.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
let count = 0;
Component({
  /**
   * 页面的初始数据
   */
  data: {
    person: {
      name: "蓝小咕",
      personNum: 66666666,
      text: "志存高远，愿惠天下",
      score: 100,
      time: 10000,
    },
    isShowPic: false,
    isRegister: false,
    isSurprise: false,
  },
  lifetimes: {
    attached() {
      this.loading = this.selectComponent("#loading");
    },
  },
  methods: {
    onShow() {
      this.loading.showLoading();
      var that = this;
      console.log(app.globalData);
      if (app.globalData.isRegister) {
        var person = {};
        person.campus = app.globalData.campus;
        person.name = app.globalData.name;
        person.phone = app.globalData.phone;
        person.qqNum = app.globalData.qqNum;
        person.personNum = app.globalData.personNum;
        person.avatar = app.globalData.avatar;
        person.text = app.globalData.text;
        person.totalDuration = app.globalData.totalDuration;
        person.totalScore = app.globalData.totalScore.toFixed(1);
        person.history = app.globalData.history;
        var isRegister = app.globalData.isRegister;
        that.setData({
          person,
          isRegister,
        });
      } else {
        var isRegister = app.globalData.isRegister;
        that.setData({
          isRegister,
        });
      }
      this.loading.hideLoading();
    },

    changePic(e) {
      // console.log("子传父", this.data.isShowPic);
      var that = this;
      if (e.detail === "none" || typeof e.detail == "object") {
        this.setData({
          isShowPic: !this.data.isShowPic,
        });
      } else {
        this.loading.showLoading({
          isContent: false,
          content: "",
          isBig: false,
        });
        this.head = this.selectComponent("#head");
        let person = this.data.person;
        person.avatar = e.detail;
        this.head.changePic(e.detail);
        wx.cloud
          .callFunction({
            name: "answer",
            data: {
              type: "avatar",
              avatar: e.detail,
              openid: app.globalData.openid,
            },
          })
          .then(() => {
            that.setData({
              person,
            });
            that.loading.hideLoading();
          });
      }
    },
    // 打开选择头像页
    openChoose() {
      this.setData({
        isShowPic: !this.data.isShowPic,
      });
    },
    //跳转志愿历史
    toHistory: function () {
      var jsonHistory = JSON.stringify(this.data.person.history);
      wx.navigateTo({
        url: "/pages/Profile/History/History?history=" + jsonHistory,
      });
    },
    //跳转志愿地图
    toMap: function () {
      wx.navigateTo({
        url: "/pages/Profile/Map/Map",
      });
    },
    toEdit: function () {
      wx.navigateTo({
        url: "/pages/Profile/PersonEdit/PersonEdit",
      });
    },
    //志愿积分按钮
    scoreLevel: function () {
      var score = this.data.person.totalScore;
      if (score <= -10) {
        wx.showModal({
          title: "警告",
          content: "您的积分已达到惩罚线，6个月内无法继续参与蓝协志愿。",
          showCancel: false,
        });
      } else if (score > -10 && score < 0) {
        wx.showModal({
          title: "警告",
          content: "请注意志愿服务的行为规范，否则您将无法继续参与蓝协志愿。",
          showCancel: false,
        });
      } else if (score >= 0 && score <= 10) {
        wx.showModal({
          title: "志愿者星级",
          content: "恭喜您成为一星志愿者！",
          showCancel: false,
        });
      } else if (score > 10 && score <= 15) {
        wx.showModal({
          title: "志愿者星级",
          content: "恭喜您成为二星志愿者！",
          showCancel: false,
        });
      } else if (score > 15 && score <= 25) {
        wx.showModal({
          title: "志愿者星级",
          content: "恭喜您成为三星志愿者！",
          showCancel: false,
        });
      } else if (score > 25 && score <= 40) {
        wx.showModal({
          title: "志愿者星级",
          content: "恭喜您成为四星志愿者！",
          showCancel: false,
        });
      } else if (score > 40 && score <= 60) {
        wx.showModal({
          title: "志愿者星级",
          content: "恭喜您成为五星志愿者！",
          showCancel: false,
        });
      } else if (score > 60) {
        wx.showModal({
          title: "志愿者星级",
          content: "恭喜您成为六星志愿者！",
          showCancel: false,
        });
      }
    },
    //新手教程
    forNew: function () {
      wx.navigateTo({
        url: "/pages/OuterLink/OuterLink?url=",
      });
    },

    //问题反馈
    toFeedback: function () {
      wx.navigateTo({
        url: "/pages/Profile/Feedback/Feedback",
      });
    },
    //更新日志
    toLog: function () {
      wx.navigateTo({
        url: "/pages/Profile/UpdateLog/UpdateLog",
      });
    },
    //积分细则
    toRule: function () {
      wx.navigateTo({
        url:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/YDKfJv7ZASCAnOH3vgNoNw",
      });
    },
    //蓝协介绍
    toIntroduction: function () {
      wx.navigateTo({
        url:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/5bqJNvDXhH8j9iGZ5diyMw",
      });
    },
    //联系我们
    contact: function () {
      wx.navigateTo({
        url:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/cgU6BbeFxHXXsWwl5wePTw",
      });
    },

    shouldAppear: function () {
      console.log("success");
    },
    surprise() {
      count += 1;
      this.setData({
        isSurprise: true,
      });
      if (count > 3) {
        wx.showModal({
          title: "不开心",
          content: "隔壁北邮小程序都5.0了T_T",
        });
      } else {
        
        this.setData({
          isSurprise: false,
        });
      }
    },
  },
});
