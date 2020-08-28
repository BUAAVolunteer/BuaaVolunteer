// pages/main/main.js
let app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 页面的初始数据
   *
   */

  data: {
    mainIcon: [], // 页面招募志愿项目数据
    imageList: [], // 要传入main-swiper的对象数组
    current: {},
    refreshLoading: false
  },
  // 组件生命周期
  lifetimes: {
    // 生命周期函数，在组件实例刚刚被创建时执行
    created: function () {
      let that = this;
      wx.showLoading({
        title: "请稍后",
        mask: true,
      });
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
          return db.collection("main").get();
        })
        .then((res) => {
          console.log(res.data);
          // 获取到的地址数组
          that.setData({
            imageList: res.data,
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
          if (res.data.length === 0) {
            app.globalData.isRegister = false;
          } else {
            app.globalData.personNum = res.data[0].personNum;
            app.globalData.campus = res.data[0].campus;
            app.globalData.phone = res.data[0].phone;
            app.globalData.qqNum = res.data[0].qqNum;
            app.globalData.name = res.data[0].name;
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
          return that.initList()
        })
        .then(() => {
          console.log("志愿信息登记完成")
          wx.hideLoading();

        })
        .catch((err) => {
          console.log(err);
          wx.hideLoading();
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
    initList() {
      this.setData({
        refreshLoading: true
      })
      var that = this
      /*-----------------主页志愿招募数据-----------------------------*/
      db.collection("project")
      .get()
      .then((res) => {
        // console.log(res.data)
        let projectList = res.data
        // 对得到的项目列表进行排序，详见js中的sort函数
        projectList.sort(function (a, b) {
          if (a.date < b.date || (a.date == b.date && a.time < b.time)) {
            return -1
          } else {
            return 1
          }
        })
        that.setData({
          mainIcon: projectList,
        });
      })
      .then(() => {
        // 获取目前的服务器时间
        return wx.cloud.callFunction({
          name: "getTime"
        })
      })
      .then(res => {
        console.log(res)
        var time = res.result.time.split(' ')
        var current = {}
        current.date = time[0]
        current.time = time[1]
        app.globalData.current = current
        that.setData({
          current,
          refreshLoading: false
        })
      })
    }
  },
});
