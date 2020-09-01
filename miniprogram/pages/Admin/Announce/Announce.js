// pages/Admin/Announce/Announce.js
const db = wx.cloud.database();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    announce: "", // 公告内容
  },
  methods: {
    submit() {
      let that = this;
      let text = that.data.announce;
      if (text == "") {
        wx.showToast({
          title: "请填写公告内容",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      this.loading = this.selectComponent("#loading");
      this.loading.showLoading({
        isContent: false,
        content: "",
        isBig: false,
      });
      db.collection("notice")
        .add({
          data: {
            text,
          },
        })
        .then((res) => {
          that.loading.hideLoading();
          wx.navigateTo({
            url: "/pages/Main/Bulletin/Bulletin",
          });
        })
        .catch((err) => {
          console.log(err);
          that.loading.hideLoading();
          wx.showModal({
            title: "错误",
            content: "网络出现异常，请返回上一页面后再尝试进入此页面",
            showCancel: false,
          });
        });
    },
  },
});
