const app = getApp();
// pages/purchase/purchase.js
const db = wx.cloud.database();
var openid = app.globalData.openid;
Component({
  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    personNum: "",
    phone: "",
    qqNum: "",
    text: "",
    index: 0,
    campus: ["南校区", "北校区"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached() {
      var that = this;
      console.log(app.globalData)
      var name = app.globalData.name
      var phone = app.globalData.phone
      var personNum = app.globalData.personNum
      var text = app.globalData.text
      var qqNum = app.globalData.qqNum
      var index = app.globalData.campus == '南校区' ? 0 : 1
      this.setData({
        name,
        phone,
        personNum,
        text,
        qqNum,
        index
      })
    },
  },
  methods: {
    submit() {
      var that = this;
      var picker = ["南校区", "北校区"];
      if (this.data.name.length >= 2) {
      } else {
        wx.showModal({
          title: "错误",
          content: "请填写正确的姓名",
          showCancel: false,
        });
        return;
      }
      if (
        this.data.personNum.length == 9 ||
        this.data.personNum.length == 8
      ) {
      } else {
        wx.showModal({
          title: "错误",
          content: "请填写正确格式的学号\n本科生8位，研究生9位",
          showCancel: false,
        });
        return;
      }
      if (
        this.data.qqNum.length < 5 ||
        this.data.qqNum.length > 11 ||
        isNaN(this.data.qqNum)
      ) {
        wx.showModal({
          title: "错误",
          content: "请填写正确的QQ号",
          showCancel: false,
        });
        return;
      }

      if (this.data.phone.length != 11 || isNaN(this.data.phone)) {
        wx.showModal({
          title: "错误",
          content: "请填写正确的手机号",
          showCancel: false,
        });
        return;
      }

      if (this.data.text.length >= 18) {
        wx.showModal({
          title: "错误",
          content: "请填写18个字以内的个性签名~",
          showCancel: false,
        });
        return;
      }

      wx.showLoading({
        title: "请稍后",
        mask: "true",
      });
      //console.log(app.globalData.openid)
      //console.log(e.detail.value.qqNum)
      //console.log(e.detail.value.campus)

      wx.cloud.callFunction({
        // 云函数名称
        name: "answer",
        // 传给云函数的参数
        data: {
          type: "detail",
          id: app.globalData.openid,
          name:that.data.name,
          phone: that.data.phone,
          personNum: that.data.personNum,
          text: that.data.text,
          qqNum: that.data.qqNum,
          campus: picker[that.data.index],
        },
        success: function (res) {
          console.log('1',res)
          console.log('2',app.globalData)
          app.globalData.name = that.data.name
          app.globalData.phone = that.data.phone
          app.globalData.personNum = that.data.personNum
          app.globalData.qqNum = that.data.qqNum
          app.globalData.campus = picker[that.data.index]
          app.globalData.text = that.data.text
          app.globalData.isRegister = true
          console.log('3.',that.data)
          wx.hideLoading();
          wx.showModal({
            title: "信息更新成功",
            content: "欢迎加入志愿者大家庭",
            showCancel: false,
            success: function () {
              wx.switchTab({
                url: "../Profile",
              });
            },
          });
        },
        fail: function () {
          wx.hideLoading();
          wx.showModal({
            title: "错误",
            content: "请重新填写或反馈管理员",
            showCancel: false,
          });
        },
      });
    },
  },
});
