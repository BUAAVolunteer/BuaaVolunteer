// pages/Main/childCpn/main-icon.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //传入的页面数据对象
    iconInf: {
      type: Object,
      value: {},
    },
  },
  data: {
    button: [
      {
        ID: 1,
        name: "assure",
        text: "立即报名",
        isAblePress: true,
      },
      {
        ID: 2,
        name: "more",
        text: "更多信息",
        isAblePress: true,
      },
    ],
  },
  methods: {
    volunteer() {
      wx.showLoading({
        mask: true,
      });
      var that = this;
      let hover = this.selectComponent("#msg");
      hover.showHover({
        isMaskCancel: false,
        title: that.properties.iconInf.title,
        // content:
        //   "○ 活动时间：\n" +
        //   that.properties.iconInf.textarea +
        //   "\n○ 活动地点：\n " +
        //   that.properties.iconInf.place +
        //   "\n○ 活动内容：\n " +
        //   that.properties.iconInf.detail +
        //   "○ 招募人数：\n" +
        //   that.properties.iconInf.people +
        //   "○ 志愿保障：\n" +
        //   that.properties.iconInf.assure +
        //   "○ 特别提醒：\n" +
        //   that.properties.iconInf.require +
        //   "○ 负责人联系方式：\n" +
        //   that.properties.iconInf.response,
        button: that.data.button,
      });
      wx.hideLoading();
    },
    //进入报名表单
    signup: function () {
      var that = this;
      var id = this.data.id;
      for (let i = 0; i < that.data.volunteer_list[id].signuplist.length; i++) {
        if (
          app.globalData.openid === that.data.volunteer_list[id].signuplist[i]
        ) {
          wx.showToast({
            title: "请勿重复报名",
            icon: "none",
          });
          return;
        }
      }

      wx.requestSubscribeMessage({
        tmplIds: ["Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w"],
        success: (res) => {
          if (res["Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w"] === "accept") {
            var id = that.data.id;
            var title = that.data.volunteer_list[id].title;
            wx.navigateTo({
              url: "../forms/forms?title=" + title,
            });
          } else {
            wx.showToast({
              title: "订阅后才能报名志愿~",
              duration: 1000,
              success(data) {
                //成功
              },
            });
          }
        },
        fail(err) {
          //失败
          console.error(err);
          reject();
        },
      });
    },
    //进入更多信息页面
    program_open: function (event) {
      var that = this;
      var id = that.data.id;
      var title = that.data.volunteer_list[id].title;

      //从test中找到项目名称相同的对象
      db.collection("test")
        .where({
          title: title,
        })
        .get({
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            var target_id = res.data[0]._id;
            wx.navigateTo({
              url: "../detail/detail?id=" + target_id,
            });
          },
          fail: function (res) {
            console.log(res);
            wx.showModal({
              title: "错误",
              content: "获取记录失败",
              showCancel: false,
            });
          },
        });
    },
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // lifetimes:{
  //   created() {
  //     var that = this;
  //     db.collection("person")
  //       .where({
  //         _openid: app.globalData.openid,
  //       })
  //       .get({
  //         success: function (res) {
  //           console.log(res);
  //           //未来在这里加入对志愿积分合法性的判断
  //           if (res.data.length == 0) {
  //             wx.showModal({
  //               title: "您尚未注册",
  //               content: "请先填写必要信息后再接取志愿",
  //               showCancel: false,
  //               success: function () {
  //                 wx.switchTab({
  //                   url: "../Admin/Admin",
  //                 });
  //               },
  //             });
  //           } else {
  //             //admin集合存储管理员信息
  //             console.log(res.data);
  //             if (res.data[0].score <= -10) {
  //               wx.showModal({
  //                 title: "您没有报名权限",
  //                 content: "您的积分已达到惩罚线，6个月内无法继续参与蓝协志愿。",
  //                 showCancel: false,
  //                 success: function () {
  //                   wx.switchTab({
  //                     url: "../Admin/Admin",
  //                   });
  //                 },
  //               });
  //             }
  //             db.collection("admin")
  //               .where({
  //                 _openid: app.globalData.openid,
  //               })
  //               .get({
  //                 success: function (res) {
  //                   wx.hideLoading();
  //                   if (res.data.length == 0) {
  //                     that.setData({
  //                       admin: 0,
  //                     });
  //                   } else {
  //                     that.setData({
  //                       admin: 1,
  //                     });
  //                   }
  //                   //initList是页面下拉刷新函数
  //                   that.initList();
  //                 },
  //               });
  //           }
  //         },
  //       });
  //   },
  // },
});
