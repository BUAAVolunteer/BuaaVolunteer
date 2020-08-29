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

  },

  methods: {
    volunteer() {
      var ID = this.properties.iconInf.ID
      this.triggerEvent("cardClick", ID, {});
    },
  },

  /**
   * 生命周期函数--监听页面显示
   */
  lifetimes:{
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
