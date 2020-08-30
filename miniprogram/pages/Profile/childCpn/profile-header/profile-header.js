// pages/Profile/childCpn/profile-header/profile-header.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    person: {
      type: Object,
      value: {
        name: "",
        personNum: 0,
        text: "",
        score: 0,
        time: 0,
        avatar: ""
      },
    },
    isRegister: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //小飞机管理员入口
    admin: function () {
      if (app.globalData.isAdmin) {
        wx.navigateTo({
          url: "../Admin/Admin",
        });
      } else {
        wx.showToast({
          title: "意外发现小咕的秘密基地\n但是你不能进来啦！",
          icon: "none",
        });
      }
    },
    toEdit: function () {
      wx.navigateTo({
        url: "/pages/Profile/PersonEdit/PersonEdit",
      });
    },
    // 子传父
    callPic: function () {
      // console.log("try");
      this.triggerEvent("appearance");
    },
    changePic(src) {
      var picPath = 'person.avatar'
      this.setData({
        [picPath]: src
      })
    }
  },
});
