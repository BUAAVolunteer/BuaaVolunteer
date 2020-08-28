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
    currentTime: {
      type: Object,
      value: {},
    }
  },
  data: {
    pre: true,
    hoverDetail: {
      isMaskCancel: true,
      isTitle: true,
      title: '',
      isContent:false,
      type: "show",
      button: [
        {
          ID: 0,
          name: "signUpNow",
          text: "立即报名",
          isAblePress: true,
        },
        {
          ID: 1,
          name: "moreInformation",
          text: "更多信息",
          isAblePress: true,
        },
      ],
    }
  },
  methods: {
    volunteer() {
      wx.showLoading({
        mask: true,
      });
      var that = this;
      let hover = this.selectComponent("#msg");
      hover.stateChange()
      wx.hideLoading();
    },

    buttonPress(e) {
      var press = e.detail
      console.log(press)
      var that = this
      var title = that.properties.iconInf.title;
      if (press === "signUpNow") {
        //进入报名表单
        if(!(that._judge())) {
          return
        }
        wx.requestSubscribeMessage({
          tmplIds: ["Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w"],
          success: (res) => {
            if (res["Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w"] === "accept") {
              wx.navigateTo({
                url: "../Recruit/Form/Form?title=" + title,
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
        })
      } else if (press === "moreInformation") {
        //进入更多信息页面
        db.collection("introduction")
        .where({
          title: title,
        })
        .get()
        .then(res => {
          console.log(res);
          wx.hideLoading();
          var target_id = res.data[0]._id;
          wx.navigateTo({
            url: "../Introduction/VolunteerMain/VolunteerMain?id=" + target_id,
          });
        })
        .catch(err => {
          console.log(err);
          wx.showModal({
            title: "错误",
            content: "获取记录失败",
            showCancel: false,
          });
        })
      }
    },

    _judge() {
      //用户的合法性检验,以后可加入积分的判断
      var that = this
      for (let i = 0; i < that.properties.iconInf.signupList.length; i++) {
        if (
          app.globalData.openid === that.properties.iconInf.signupList[i]
        ) {
          wx.showToast({
            title: "请勿重复报名",
            icon: "none",
          });
          return false
        }
      }
      return true
    },
  },

  /**
   * 生命周期函数--监听页面显示
   */
  lifetimes:{
    attached() {
      var that = this
      var detail = this.data.hoverDetail
      detail.title = that.properties.iconInf.title
      var isPre = true
      var currentDate = that.properties.currentTime.date
      var currentTime = that.properties.currentTime.time
      var postDate = that.properties.iconInf.date
      var postTime = that.properties.iconInf.time
      if ( currentDate < postDate || (currentDate == postDate && currentTime < postTime)) {
        isPre = false
      }
      // console.log(that.properties.iconInf.title + isPre)
      detail.button[0].isAblePress = !isPre
      this.setData({
        pre: isPre,
        hoverDetail:detail
      })
    }
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
  },
});
