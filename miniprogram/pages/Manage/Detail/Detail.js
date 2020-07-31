// pages/textarea/textarea.js
const db = wx.cloud.database();
Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    etitle: "北航一日游",
    place: "",
    time: "12:00",
    date: "2020-1-1",
    qqnum: "",
    detail: "", // 活动内容
    people: "", // 招募人数
    assure: "", // 志愿者保障
    require: "", // 特别提醒
    response: "", // 负责人联系方式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached() {
      let that = this;
      let title = this.properties.title
      wx.showLoading();
      this.setData({
        title,
        etitle: title,
      }); //传参到wxml
      db.collection("project")
        .where({
          title,
        }) //查询条件
        .get({
          //更新数据库的操作
          success: function (res) {
            let download = res.data[0]; //把data里的信息赋给download？

            let assure = download.assure
              .reduce(function (preValue, n) {
                return preValue + n + "\n";
              }, "")
              .slice(0, -1);

            let detail = download.detail
              .reduce(function (preValue, n) {
                return preValue + n + "\n";
              }, "")
              .slice(0, -1);

            let require = download.require
              .reduce(function (preValue, n) {
                return preValue + n + "\n";
              }, "")
              .slice(0, -1);

            let response = download.response
              .reduce(function (preValue, n) {
                return preValue + n + "\n";
              }, "")
              .slice(0, -1);

            let people = download.people
              .reduce(function (preValue, n) {
                return preValue + n + "\n";
              }, "")
              .slice(0, -1);
            that.setData({
              time: download.time, //一坨数据存在云端
              date: download.date,
              textarea: download.textarea,
              assure, //拼接的用于屏幕输出的字符串
              detail, //同名就不用再写一遍赋值
              require,
              response,
              people,
              place: download.place,
              qqnum: download.qqnum,
            });
            wx.hideLoading();
          },
        });
    },
  },
  methods: {
    upload: function (e) {
      let that = this;
      let array = this.data.array;
      //检测信息缺失
      for (let i in array) {
        if (!array[i].data || array[i].list == "") {
          wx.showModal({
            title: "缺少信息",
            content: "请填写" + array[i].content,
            showCancel: false,
          });
          return;
        }
      }

      if (that.data.etitle === "发布一个新志愿" && that.data.title === "") {
        wx.showModal({
          title: "缺少信息",
          content: "请填写活动名称",
          showCancel: false,
        });
        return;
      }
      if (that.data.etitle === "发布一个新志愿" && that.data.place === "") {
        wx.showModal({
          title: "缺少信息",
          content: "请填写活动地点",
          showCancel: false,
        });
        return;
      }
      if (!that.data.textarea || that.data.textarea === "") {
        wx.showModal({
          title: "缺少信息",
          content: "请填写志愿开展日期",
          showCancel: false,
        });
        return;
      }
      console.log("qqNum", that.data.qqnum);
      if (!that.data.qqnum || that.data.qqnum === "") {
        wx.showModal({
          title: "缺少信息",
          content: "请填写志愿QQ群号",
          showCancel: false,
        });
        return;
      }
      wx.cloud.callFunction({
        name: "getTime",
        success: function (res) {
          //console.log(res)
          //返回值是日期和时间
          var time = res.result.time.split(" ");
          var currenTime = time[1];
          var currenDate = time[0];
          if (
            currenDate > that.data.date ||
            (currenDate == that.data.date && currenTime > that.data.time)
          ) {
            wx.showModal({
              title: "信息错误",
              content: "志愿发布时间不能在当前时间之前",
              showCancel: false,
            });
            return;
          }
          wx.showLoading({
            title: "加载中",
          }); //一个延时显示
          //上传详细信息
          wx.cloud.callFunction({
            //调用这个云函数
            name: "uploadvolun",
            data: {
              etitle: that.data.etitle,
              title: that.data.title,
              date: that.data.date,
              time: that.data.time,
              textarea: that.data.textarea,
              place: that.data.place,
              people: that.data.people.split("\n"),
              requireList: that.data.require.split("\n"),
              assureList: that.data.assure.split("\n"),
              detailList: that.data.detail.split("\n"),
              requireList: that.data.require.split("\n"),
              responseList: that.data.response.split("\n"),
              innerList: [],
              signuplist: [],
              qqnum: that.data.qqnum,
            },
            success: function (e) {
              console.log(e);
              wx.hideLoading();
              wx.showModal({
                title: "发布成功",
                content: "志愿发布成功，请编辑报名表单",
                showCancel: false, //去掉取消按钮
                success: function (res) {
                  //如果成功调用showModal成功，则跳转至链接
                  wx.redirectTo({
                    url: "../list/list",
                  });
                },
              });
            },
            fail: function (e) {
              wx.hideLoading();
              console.log(e);
              wx.showModal({
                title: "发布失败",
                content: "有错误发生，发布失败",
                showCancel: false,
              });
            },
          });
        },
      });
    },
  },
});
