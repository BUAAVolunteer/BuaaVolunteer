const db = wx.cloud.database();
var iv;
var watcher = null;
const computedBehavior = require("miniprogram-computed");
const Util = require("../../../utils/util");
Component({
  properties: {
    title: {
      // 志愿标题
      type: String,
      value: "",
    },
    date: {
      // 志愿日期
      type: String,
      value: "",
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    signUpList: [], // 总的报名记录
    signUpTitle: [], // 组件的标题列表
    open: false, // 是否打开展开页面
    index: -1, // 当前选中的报名数据
  },
  behaviors: [computedBehavior], // 代表页面中可以使用computed扩展方法
  computed: {
    signUpItem(data) {
      if (data.index == -1) return [];
      else return data.signUpList[data.index].slice(0, -3);
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached() {
      var title = this.properties.title;
      console.log(title);
      this.loading = this.selectComponent("#loading");
      this.loading.showLoading();
      var that = this;
      this.setData({
        title,
      });
      watcher = db
        .collection("signUp")
        .where({
          title: that.properties.title,
        })
        .watch({
          onChange: function (snapshot) {
            let download = snapshot.docs[0];
            //修改页面中
            console.log(download);
            let signUpList = download.list.slice(1);
            let signUpTitle = download.list[0];
            that.setData({
              signUpList,
              signUpTitle,
            });
          },
          onError: function (err) {
            console.log(err);
            wx.showModal({
              title: "错误",
              content: "获取记录失败,请检查网络或反馈给管理员",
              showCancel: false,
            });
          },
        });
      that.loading.hideLoading();
    },
  },
  methods: {
    offcanvas: function () {
      this.setData({
        open: !this.data.open,
      });
    },
    openbutton(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        index,
      });
      this.setData({
        open: true,
      });
    },
    changeItem(e) {
      console.log(e.detail.type);
      let type = e.detail.type;
      let index = this.data.index;
      if (type == "next")
        index = Math.min(this.data.signUpList.length - 1, index + 1);
      else if (type == "back") index = Math.max(index - 1, 0);
      this.setData({
        index,
      });
    },
    download: function (e) {
      var that = this;
      var DownloadList = [];
      DownloadList.push(that.data.signUpTitle);
      for (let i = 0; i < that.data.signUpList.length; i++) {
        DownloadList.push(that.data.signUpList[i]);
      }
      console.log(that.properties.date);
      //console.log(DownloadList)
      return db.collection("project")
        .where({
          title: that.data.title,
        })
        .field({
          check: true,
        })
        .get()
        .then((res) => {
          console.log(res)
          if (res.data[0].check != 2) {
            wx.showModal({
              title: "报名未完成",
              content: "报名尚未完成，请等待完成后再导出",
              showCancel: false,
            });
            return "not over";
          } else {
            //下载导出数据
            let formInfo = {};
            formInfo.title = that.data.title;
            formInfo.fileName = that.data.title + " 报名信息表格";
            formInfo.downloadList = DownloadList;
            console.log(formInfo);
            wx.cloud
              .callFunction({
                name: "DownloadSignUp",
                data: {
                  title: that.data.title,
                  time: that.properties.date,
                  list: DownloadList,
                },
              })
              .then((res) => {
                console.log("DownloadRes", res);
                if (res.result === "success") {
                  return Util.default.exportToExcel(formInfo);
                } else {
                  console.log(res);
                  return "data-trans fail";
                }
              })
              .then((res) => {
                console.log(res);
                if (res === "data-trans fail") {
                  wx.showModal({
                    title: "数据转移失败",
                    content: "数据转移失败，请联系管理员",
                    showCancel: false,
                  });
                } else if (res.success) {
                  console.log(res);
                  wx.showModal({
                    title: "导出成功",
                    content: "已成功导出,请在自动打开后尽快另存",
                    showCancel: false,
                    success: function () {
                      wx.redirectTo({
                        url: "/pages/Admin/Admin",
                      });
                    },
                  });
                } else {
                  console.log(res);
                  wx.showModal({
                    title: "导出失败",
                    content: "导出失败，请联系管理员",
                    showCancel: false,
                  });
                }
              });
          }
        });
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      clearInterval(iv);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      clearInterval(iv);
    },
  },
});
