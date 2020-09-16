// pages/main/main.js
let app = getApp();
const db = wx.cloud.database();
var projectList = []; // 页面招募志愿项目数据
var current = {}; // 服务器时间
var ID; //打开的悬浮窗信息在数组中的位置
Component({
  /**
   * 页面的初始数据
   *
   */

  data: {
    recruitList: [],
    fillList: [],
    isOdd: [],
    preList: [],
    imageList: [], // 要传入main-swiper的对象数组
    refreshLoading: false,
    hoverDetail: {
      isMaskCancel: true,
      isTitle: false,
      title: "",
      isContent: false,
      type: "show",
      button: [
        {
          ID: 0,
          name: "signUpNow",
          text: "等待发布",
          isAblePress: false,
        },
        {
          ID: 1,
          name: "moreInformation",
          text: "更多信息",
          isAblePress: true,
        },
      ],
    },
    isSurprise: false, // 彩蛋
  },
  // 组件生命周期
  lifetimes: {
    // 生命周期函数，在组件实例刚刚被创建时执行
    created: function () {
      wx.hideTabBar({
        animation: false,
      });
      this.loading = this.selectComponent("#loading");
      this.loading.showLoading();
      let that = this;
      // 调用登录云函数
      wx.cloud
        .callFunction({
          name: "login",
          data: {},
        })
        .then((res) => {
          //获取openid并赋值给全局变量
          app.globalData.openid = res.result.openid;
          console.log(app.globalData);
        })
        /*-----------------主页轮播图地址-----------------------------*/
        .then(() => {
          return db
            .collection("official")
            .where({
              name: "首页展示",
            })
            .get();
        })
        .then((res) => {
          console.log(res.data[0].main);
          // 获取到的地址数组
          that.setData({
            imageList: res.data[0].main,
          });
        })
        .then(() => {
          /*-----------------个人信息登记------------------------------*/
          return db
            .collection("person")
            .where({
              _openid: app.globalData.openid,
            })
            .get();
        })
        .then((res) => {
          // console.log(res.data)
          if (res.data.length == 0) {
            app.globalData.isRegister = false;
            wx.showModal({
              title: "未注册",
              content: "您尚未注册，请前往个人页面进行注册",
              showCancel: false,
            });
          } else {
            app.globalData.personNum = res.data[0].personNum;
            app.globalData.campus = res.data[0].campus;
            app.globalData.phone = res.data[0].phone;
            app.globalData.qqNum = res.data[0].qqNum;
            app.globalData.name = res.data[0].name;
            if ("avatar" in res.data[0] || res.data[0].avatar == "") {
              app.globalData.avatar = res.data[0].avatar;
            }
            app.globalData.text = res.data[0].text;
            app.globalData.totalDuration = res.data[0].totalDuration;
            app.globalData.totalScore = res.data[0].totalScore;
            app.globalData.history = res.data[0].history;
            if ("qualification" in res.data[0]) {
              app.globalData.qualification = res.data[0].qualification;
            }
            app.globalData.isRegister = true;
          }
        })
        .then(() => {
          return db
            .collection("admin")
            .where({
              _openid: app.globalData.openid,
            })
            .get();
        })
        .then((res) => {
          // console.log(res.data)
          if (res.data.length) {
            app.globalData.isAdmin = true;
          } else {
            app.globalData.isAdmin = false;
          }
          console.log("个人信息登记完成");
        })
        .then(() => {
          return that.initList();
        })
        .then(() => {
          console.log("志愿信息登记完成");
          wx.showTabBar({
            animation: false,
          });
          that.loading.hideLoading();
        })
        .catch((err) => {
          console.log(err);
          that.loading.hideLoading();
          wx.showModal({
            title: "错误",
            content: "没有找到记录，请检查网络或重启小程序",
            showCancel: false,
          });
        });
    },
  },
  // 组件自己的方法
  methods: {
    onShow() {
      this.initList();
    },
    initList() {
      this.setData({
        refreshLoading: true,
      });
      var that = this;
      /*-----------------主页志愿招募数据-----------------------------*/
      wx.cloud
        .callFunction({
          name: "GetProject",
          data: {},
        })
        .then((res) => {
          // console.log(res)
          var initList = res.result.data;
          // 对得到的项目列表进行排序，详见js中的sort函数
          initList.sort(function (a, b) {
            if (a.date < b.date || (a.date == b.date && a.time < b.time)) {
              return -1;
            } else {
              return 1;
            }
          });
          projectList = [];
          for (let i = 0; i < initList.length; i++) {
            if (initList[i].check == 1) {
              projectList.push(initList[i]);
            }
          }
        })
        .then(() => {
          // 获取目前的服务器时间
          return wx.cloud.callFunction({
            name: "getTime",
          });
        })
        .then((res) => {
          console.log(res);
          var time = res.result.time.split(" ");
          current.date = time[0];
          current.time = time[1];
          app.globalData.current = current;
        })
        .then(() => {
          var isOdd = false;
          var recruitList = [];
          var fillList = [];
          var preList = [];
          for (let i = 0; i < projectList.length; i++) {
            var isPre = false;
            var currentDate = current.date;
            var currentTime = current.time;
            var postDate = projectList[i].date;
            var postTime = projectList[i].time;
            if (
              currentDate < postDate ||
              (currentDate == postDate && currentTime < postTime)
            ) {
              isPre = true;
            }
            var isInner = false;
            if (projectList[i].innerList.indexOf(app.globalData.openid) != -1) {
              isInner = true;
            }
            projectList[i].pre = isPre;
            projectList[i].isInner = isInner;
            projectList[i].ID = i;
            if (!isPre) {
              recruitList.push(projectList[i]);
              isOdd = !isOdd;
            } else if (fillList.length == 2) {
              preList.push(projectList[i]);
            } else if (isOdd) {
              fillList.push(projectList[i]);
            } else {
              preList.push(projectList[i]);
            }
          }
          that.setData({
            recruitList,
            fillList,
            isOdd,
            preList,
            refreshLoading: false,
          });
        })
        .then(() => {
          that.hover = that.selectComponent("#hover");
        });
    },

    openHover(e) {
      ID = e.detail;
      var hoverDetail = this.data.hoverDetail;
      hoverDetail.button[0].isAblePress =
        !projectList[ID].pre || projectList[ID].isInner;
      if (projectList[ID].pre) {
        hoverDetail.button[0].text = "等待发布";
      } else {
        hoverDetail.button[0].text = "立即报名";
      }
      this.setData({
        showDetail: projectList[ID],
        hoverDetail,
      });
      this.hover.stateChange();
    },

    buttonPress(e) {
      var press = e.detail;
      console.log(press);
      var that = this;
      if (press === "signUpNow") {
        //进入报名表单
        if (!that._judge()) {
          return;
        }
        console.log(projectList[ID]);
        wx.requestSubscribeMessage({
          tmplIds: ["Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w"],
          success: (res) => {
            if (
              res["Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w"] === "accept"
            ) {
              wx.navigateTo({
                url:
                  "./Form/Form?title=" +
                  projectList[ID].title +
                  "&qqNum=" +
                  projectList[ID].qqNum +
                  "&signUpTime=" +
                  projectList[ID].date,
              });
            } else {
              wx.showToast({
                title: "订阅后才能报名志愿~",
                duration: 1000,
                success(data) {
                  //成功
                },
              });
            }
          },
          fail(err) {
            //失败
            console.error(err);
          },
        });
      } else if (press === "moreInformation") {
        //进入更多信息页面
        db.collection("introduction")
          .where({
            title: projectList[ID].title,
          })
          .get()
          .then((res) => {
            console.log(res);
            wx.hideLoading();
            if (res.data.length == 0) {
              wx.showModal({
                title: "临时志愿",
                content: "非常抱歉，临时志愿没有详细介绍",
                showCancel: false,
              });
              return;
            }
            var target_id = res.data[0]._id;
            wx.navigateTo({
              url:
                "../Introduction/VolunteerMain/VolunteerMain?id=" + target_id,
            });
          })
          .catch((err) => {
            console.log(err);
            wx.showModal({
              title: "错误",
              content: "获取记录失败",
              showCancel: false,
            });
          });
      }
    },
    surprise() {
      let that = this;
      this.setData({
        isSurprise: true,
      });
      setTimeout(function () {
        that.setData({
          isSurprise: false,
        });
      }, 1000);
    },
    _judge() {
      //用户的合法性检验,以后可加入积分的判断
      var that = this;
      // 是否注册
      if (!app.globalData.isRegister) {
        wx.showModal({
          title: "您尚未注册",
          content: "请先填写必要信息后再接取志愿",
          showCancel: false,
          success: function () {
            wx.switchTab({
              url: "../Profile/Profile",
            });
          },
        });
        return false;
      }
      if (app.globalData.totalScore <= -10) {
        wx.showToast({
          title: "志愿积分过低",
          icon: "none",
        });
      }
      // 重复报名
      for (let i = 0; i < projectList[ID].signupList.length; i++) {
        if (app.globalData.openid === projectList[ID].signupList[i]) {
          wx.showToast({
            title: "请勿重复报名",
            icon: "none",
          });
          return false;
        }
      }
      return true;
    },
  },
});
