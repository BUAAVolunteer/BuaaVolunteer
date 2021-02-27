// miniprogram/pages/want/want.js
const db = wx.cloud.database();
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    range: ["小程序使用问题"],
    value: 0, // 当前选中
    text: "", // 反馈信息
    contact: "", // 联系方式
    showText: true, // 是否展示textarea
  },

  lifetimes: {
    attached() {
      var that = this;
      this.loading = this.selectComponent("#loading");
      this.loading.showLoading();
      this.setData({
        showText: false,
      });
      wx.cloud
        .callFunction({
          name: "GetProject",
        })
        .then((res) => {
          console.log(res);
          var range = ["小程序使用问题"];
          for (let i = 0; i < res.result.data.length; i++) {
            range.push(res.result.data[i].title);
          }
          console.log(range);
          that.setData({
            range,
          });
          that.loading.hideLoading();
          that.setData({
            showText: true,
          });
        })
        .catch((err) => {
          console.log(err);
          that.loading.hideLoading();
          that.setData({
            showText: true,
          });
          wx.showModal({
            title: "错误",
            content: "发生错误，请检查网络并重新进入页面",
            showCancel: false,
          });
        });
    },
  },

  methods: {
    submit() {
      let title = this.data.range[this.data.value];
      let text = this.data.text;
      let contact = this.data.contact;
      let that = this;
      let day = new Date().getFullYear();
      let month = new Date().getMonth();
      let date = new Date().getDate();
      let hour = new Date().getHours();
      let minute = new Date().getMinutes();
      let time = day + "-" + month + "-" + date + " " + hour + ":" + minute;
      if (title == "小程序使用问题") {
        wx.showModal({
          title: "错误",
          content: "请选择要反馈的项目~",
          showCancel: false,
        });
        return;
      }
      if (text == "") {
        wx.showModal({
          title: "错误",
          content: "请输入反馈内容~",
          showCancel: false,
        });
        return;
      }
      this.loading.showLoading({
        isContent: false,
        content: "",
        isBig: false,
      });
      this.setData({
        showText: false,
      });
      db.collection("person")
        .where({
          _openid: app.globalData.openid,
        })
        .get()
        .then((e) => {
        //  console.log(e.data[0].name);
          db.collection("feedback").add({
            data: {
              name: e.data[0].name,
              phone: e.data[0].phone,
              title,
              textarea: text,
              contact,
              check: false,
              time: time,
            },
            success: function () {
              that.loading.hideLoading();
              that.setData({
                showText: true,
              });
              wx.showModal({
                title: "反馈成功",
                content: "您的反馈我们已经收到，请耐心等待解答",
                showCancel: false,
                success: function () {
                  wx.switchTab({
                    url: "../../Main/Main",
                  });
                },
              });
            },
            fail: function () {
              that.loading.hideLoading();
              that.setData({
                showText: true,
              });
              wx.showModal({
                title: "错误",
                content: "提交失败，请检查网络或重启小程序",
                showCancel: false,
              });
            },
          });
        });
    },
  },
});
