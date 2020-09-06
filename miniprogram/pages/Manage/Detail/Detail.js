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
    originTitle: "北航一日游",
    place: "",
    time: "12:00",
    date: "2020-1-1",
    qqNum: "",
    detail: "", // 活动内容
    people: "", // 招募人数
    assure: "", // 志愿者保障
    require: "", // 特别提醒
    response: "", // 负责人联系方式
    showText: true, // 展示textarea的内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached() {
      let that = this;
      let title = this.properties.title;

      this.loading = this.selectComponent("#loading");
      this.loading.showLoading();

      this.setData({
        title,
        originTitle: title,
      }); //传参到wxml
      db.collection("project")
        .where({
          title,
        }) //查询条件
        .get({
          //更新数据库的操作
          success: function (res) {
            console.log(res); //把data里的信息赋给download？
            if (res.data.length == 0) {
              that.loading.hideLoading();
              return;
            }
            var download = res.data[0];
            that.setData({
              time: download.time, //一坨数据存在云端
              date: download.date,
              textarea: download.textarea,
              assure: download.assure, //拼接的用于屏幕输出的字符串
              detail: download.detail, //同名就不用再写一遍赋值
              require: download.require,
              response: download.response,
              people: download.people,
              place: download.place,
              qqNum: download.qqNum,
            });
            that.loading.hideLoading();
          },
        });
    },
  },
  methods: {
    illegalCheck(that) {
      //console.log(that)
      var success = true
      console.log("qqNum", that.data.qqNum);
      if (that.data.title === "发布一个新志愿") {
        wx.showModal({
          title: "缺少信息",
          content: "请填写活动名称",
          showCancel: false,
        });
        success = false;
      }else if (
        that.data.originTitle === "发布一个新志愿" &&
        that.data.place === ""
      ) {
        wx.showModal({
          title: "缺少信息",
          content: "请填写活动地点",
          showCancel: false,
        });
        success = success && false;
      }else if (!that.data.textarea || that.data.textarea === "") {
        wx.showModal({
          title: "缺少信息",
          content: "请填写志愿开展日期",
          showCancel: false,
        });
        success = success && false;
      }else if (!that.data.qqNum || that.data.qqNum === "") {
        wx.showModal({
          title: "缺少信息",
          content: "请填写志愿QQ群号",
          showCancel: false,
        });
        success = success && false;
      }

      console.log(that.data.date);
      return new Promise((resolve, reject) => {
        resolve();
      })
        .then(() => {
          return wx.cloud.callFunction({
            name: "getTime",
          });
        })
        .then((res) => {
          console.log(res);
          //返回值是日期和时间
          var time = res.result.time.split(" ");
          var currentTime = time[1];
          var currentDate = time[0];
          if (
            currentDate > that.data.date ||
            (currentDate === that.data.date && currentTime > that.data.time)
          ) {
            console.log(0);
            wx.showModal({
              title: "信息错误",
              content: "志愿发布时间不能在当前时间之前",
              showCancel: false,
            });
            success = success && false;
          } else {
            console.log(currentDate);
            console.log(that.data.date);
            success = success && true;
          }
        })
        .then(() => {
          return success
        })
    },

    upload: function (e) {
      let that = this;
      this.loading.showLoading({
        isContent: false,
        content: "",
        isBig: false,
      });
      this.setData({
        showText: false,
      });
      //合法性校验
      console.log(that);
      console.log(that.__proto__);
      that.illegalCheck(that).then((res) => {
        console.log(res);
        if (!res) {
          that.loading.hideLoading();
          that.setData({
            showText: true
          })
          return;
        } else {
          //上传详细信息
          wx.cloud.callFunction({
            //调用这个云函数
            name: "uploadvolun",
            data: {
              originTitle: that.data.originTitle,
              title: that.data.title,
              date: that.data.date,
              time: that.data.time,
              textarea: that.data.textarea,
              place: that.data.place,
              people: that.data.people,
              assure: that.data.assure,
              detail: that.data.detail,
              require: that.data.require,
              response: that.data.response,
              innerList: [],
              signupList: [],
              qqNum: that.data.qqNum,
            },
            success: function (e) {
              console.log(e);
              that.loading.hideLoading();
              that.setData({
                showText: true
              })
              wx.showModal({
                title: "发布成功",
                content: "志愿发布成功，请编辑报名表单",
                showCancel: false, //去掉取消按钮
                success: function (res) {
                  //如果成功调用showModal成功，则跳转至链接
                  wx.redirectTo({
                    url: "/pages/Admin/Admin",
                  });
                },
              });
            },
            fail: function (e) {
              that.loading.hideLoading();
              that.setData({
                showText: true
              })
              console.log(e);
              wx.showModal({
                title: "发布失败",
                content: "有错误发生，发布失败",
                showCancel: false,
              });
            },
          });
        }
      });
    },
  },
});
