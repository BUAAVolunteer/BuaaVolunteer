const db = wx.cloud.database();
var max, iv;
var limlist = [{}];
var date = "";
const computedBehavior = require("miniprogram-computed");
Component({
  properties: {
    title: {      // 志愿标题
      type: String,
      value: "",
    },
    date: {       // 志愿日期
      type: String,
      value: "",
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    signUpList: [],   // 总的报名记录
    signupTitle: [],  // 组件的标题列表
    open: false,      // 是否打开展开页面
    index: -1,        // 当前选中的报名数据
  },
  behaviors: [computedBehavior], // 代表页面中可以使用computed扩展方法
  computed: {
    signupItem(data) {
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
      date = this.properties.date;
      console.log(title);
      wx.showLoading({
        title: "加载中",
      });
      var that = this;
      this.setData({
        title,
      });
      wx.cloud.callFunction({
        name: "GetSignUp",
        data: {
          title,
        },
        success: function (res) {
          let signUpList = res.result.data[0].list.slice(1);
          let signupTitle = res.result.data[0].list[0];
          that.setData({
            signUpList,
            signupTitle,
          });
          wx.hideLoading();
        },
        fail: function (res) {
          console.log(res);
        },
      });
      var interval = setInterval(function () {
        db.collection("form")
          .where({
            title: title,
          })
          .field({
            formInfo: true,
            over: true,
          })
          .get({
            success: function (res) {
              //console.log(res)
              limlist = res.data[0].formInfo;
              let over = 0;
              let len = 0;
              if (res.data[0].over == 1) {
                for (let i = 0; i < limlist.length && over == 0; i++) {
                  if (limlist[i].limit == true) {
                    for (let j = 0; j < limlist[i].data.length; j++) {
                      if (limlist[i].data[j] > 0) {
                        over = 1;
                        break;
                      }
                    }
                  } else {
                    len++;
                  }
                }
                if (over == 0 && len < limlist.length) {
                  wx.cloud.callFunction({
                    name: "overForm",
                    data: {
                      title: title,
                    },
                    success: function (res) {
                      console.log(res);
                    },
                  });
                }
              }
            },
          });
      }, 1000);
      iv = interval;
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
    changeCurrent(e) {
      console.log(e.detail.type);
      let type = e.detail.type;
      let index = this.data.index;
      if (type == "next") index = min(this.data.SignUpList.length, index + 1);
      else if (type == "back") index = max(index - 1, 0);
      this.setData({
        index,
      });
    },
    delete: function () {
      let formInfo = this.data.signUpList;
      formInfo.splice(this.data.index, 1);
      this.setData({
        signUpList: formInfo,
      });
      this.offcanvas()
    },

    download: function (e) {
      var that = this;
      var DownloadList = [];
      let slist = that.data.SignUpList;
      let flist = that.data.FormList;
      DownloadList.push(flist);
      for (let i = 0; i < slist.length; i++) {
        DownloadList.push(slist[i].list);
      }
      //console.log(DownloadList)
      db.collection("project")
        .where({
          title: that.data.title,
        })
        .field({
          check: true,
        })
        .get({
          success: function (res) {
            if (res.data[0].check != -1) {
              wx.showModal({
                title: "报名未完成",
                content: "报名尚未完成，请等待完成后再导出",
                showCancel: false,
              });
              return;
            } else {
              //下载导出数据
              wx.cloud.callFunction({
                name: "DownloadSignUp",
                data: {
                  title: that.data.title,
                  time: date,
                  list: DownloadList,
                },
                success: function (res) {
                  //console.log(res)
                  wx.cloud.downloadFile({
                    fileID: res.result.fileID,
                    success: function (res) {
                      //console.log(res)
                      wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: function (res) {
                          wx.openDocument({
                            filePath: res.savedFilePath,
                            success: function () {
                              wx.showModal({
                                title: "导出成功",
                                content: "已成功导出,请在自动打开后尽快另存",
                                showCancel: false,
                                success: function () {
                                  wx.redirectTo({
                                    url: "../list/list",
                                  });
                                },
                              });
                            },
                          });
                        },
                      });
                    },
                    fail: function (res) {
                      console.log(res);
                      wx.showModal({
                        title: "导出失败",
                        content: "导出失败，请联系管理员",
                        showCancel: false,
                      });
                    },
                  });
                },
              });
            }
          },
        });
    },
    sift: function () {
      clearInterval(iv);
      var that = this;
      let slist = that.data.SignUpList;
      console.log(slist);
      for (let i = 0; i < limlist.length; i++) {
        if (limlist[i].limit == true) {
          console.log(i);
          for (let j = 0; j < limlist[i].data.length; j++) {
            if (limlist[i].data[j].limit < 0) {
              console.log(j);
              for (
                let k = slist.length - 1;
                k >= 0 && limlist[i].data[j].limit < 0;
                k--
              ) {
                if (
                  slist[k].list[i + 4].indexOf(limlist[i].data[j].name) >= 0
                ) {
                  console.log(k);
                  let rp = limlist[i].data[j].name + ";";
                  console.log(rp);
                  slist[k].list[i + 4] = slist[k].list[i + 4].replace(rp, "");
                  limlist[i].data[j].limit++;
                }
              }
            }
          }
        }
      }

      for (let i = slist.length - 1; i >= 0; i--) {
        console.log(slist.length);
        console.log(i);
        for (let j = 0; j < limlist.length; j++) {
          if (limlist[j].force == true && slist[i].list[j + 4] === "") {
            slist.splice(i, 1);
            break;
          }
        }
      }
      console.log(limlist);
      console.log(slist);
      this.setData({
        SignUpList: slist,
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
