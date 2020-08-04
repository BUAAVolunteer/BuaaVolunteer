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
    index: null,
    campus: ["南校区", "北校区"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    created() {
      var that = this;
      db.collection("person")
        .where({
          _openid: app.globalData.openid,
        })
        .get({
          success: function (res) {
            //console.log(res)
            if (res.data.length != 0) {
              that.setData({
                name: res.data[0].name,
                phone: res.data[0].phone,
                personNum: res.data[0].personNum,
                text: res.data[0].text,
                qqNum: res.data[0].qqNum,
              });
              if (res.data[0].campus === "北校区")
                that.setData({
                  index: 1,
                });
              else if (res.data[0].campus === "南校区")
                that.setData({
                  index: 0,
                });
            }
          },
          fail: function (res) {
            wx.showToast({
              title: "获取信息失败",
            });
          },
        });
    },
  },
  methods: {
    submit() {
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
      //console.log(e.detail.value.qqnum)
      //console.log(e.detail.value.campus)

      wx.cloud.callFunction({
        // 云函数名称
        name: "answer",
        // 传给云函数的参数
        data: {
          id: app.globalData.openid,
          name: e.detail.value.name,
          phone: e.detail.value.phone,
          personNum: e.detail.value.personnum,
          text: e.detail.value.text,
          qqNum: e.detail.value.qqnum,
          campus: picker[e.detail.value.campus],
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading();
          wx.showModal({
            title: "信息更新成功",
            content: "欢迎加入志愿者大家庭",
            showCancel: false,
            success: function () {
              wx.switchTab({
                url: "../about/about",
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
