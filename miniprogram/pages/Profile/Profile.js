// pages/Practice/Practice.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
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
    isRegister: app.globalData.isRegister,
    buttonsgath: [
      {
        navigateUrl: "", // 要跳转到的页面路径    还没出现的新手教程
      },
      {
        navigateUrl: "/pages/Profile/Feedback/Feedback", //问题反馈
      },
      {
        navigateUrl: "/pages/Profile/UpdateLog/Updatelog", //更新日志
      },
      {
        navigateUrl: "", //积分细则
      },
      {
        navigateUrl:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/5bqJNvDXhH8j9iGZ5diyMw",
        //蓝协介绍
      },
      {
        navigateUrl:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/cgU6BbeFxHXXsWwl5wePTw",
        //联系我们
      },
    ],
  },
  methods: {
    showPic() {
      // console.log("子传父", this.data.isShowPic);
      this.setData({
        isShowPic: !this.data.isShowPic,
      });
    },
    //跳转志愿历史
    toHistory: function () {
      wx.navigateTo({
        url: "/pages/Profile/History/History",
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
      var score = this.data.person.score;
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
      console.log("succeess");
    },
  },
  lifetimes: {
    created() {
      wx.showLoading({
        title: "加载中",
      });
      var that = this;
      this.setData({
        isRegister: app.globalData.isRegister,
      });
      db.collection("person")
        .where({
          _openid: app.globalData.openid,
        })
        .get()
        .then((res) => {
          console.log(res.data);
          let data = res.data;
          if (data.length == 0 || !data[0].campus || !data[0].qqnum) {
            wx.hideLoading();
            that.setData({
              isRegister: 1,
            });
          } else {
            that.setData({
              isRegister: 0,
            });
            wx.hideLoading();
            that.setData({
              person_list: res.data,
              totalscore: res.data[0].score.toFixed(1),
            });
          }
        })
        .catch((err) => {
          console.log(err);
          wx.hideLoading();
          wx.showModal({
            title: "错误",
            content: "获取记录失败,请检查网络或反馈给管理员",
            showCancel: false,
          });
        });
    },
  },
});
