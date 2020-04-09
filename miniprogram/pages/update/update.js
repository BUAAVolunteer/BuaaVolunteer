// pages/about/about.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    diarydetail: [

      {
        date: '2020.03.08',
        text: '1.全面升级小程序UI和动画\n2.上线志愿招募功能\n3.完善个人信息的收集，简化报名流程\n4.管理员端上线志愿信息编辑，表单编辑，志愿发布，导出时长表功能\n（可以通过小程序报名啦！）',
        title: 'V2.2.0'
      },
      {
        date: '2019.12.03',
        text: '1.增加志愿积分，志愿地图功能\n2.增加志愿招募预告功能\n3.优化个人页面UI\n4.整合管理员入口，增加管理员端发布预告、审核反馈、操作积分、处理缺勤功能\n（小程序上线啦！）',
        title: 'V1.1.1'
      },
      {
        date: '2019.08.31',
        text: '实现了信息录入、推送展示、志愿历史和基础的反馈功能\n（小程序出生啦！）',
        title: 'V1.0.0',
      },
      {
        date: ' ',
        text: '\n马瀚元，柯瑞奇，何梓心，朴宣夷，李欣悦',
        title: '开发\n者们'
      },

    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})