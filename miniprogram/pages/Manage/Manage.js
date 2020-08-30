// pages/list/list.js
Component({
  /**
   * 页面的初始数据
   */
  data: {
    picker: [],
    currentDate: "",
    currentTime: "",
  },
  lifetimes: {
    created() {
      this.loading = this.selectComponent("#loading");
      this.loading.showLoading();
      let that = this;
      // 获取目前系统时间
      wx.cloud
        .callFunction({
          name: "getTime",
        })
        .then((res) => {
          console.log(res);
          let current = res.result.time.split(" ");
          that.setData({
            currentDate: current[0],
            currentTime: current[1],
          });
        });
      wx.cloud.callFunction({
        name: "GetProject",
        success: function (res) {
          let projectList = res.result.data.map((n) => {
            n.open = false;
            return n;
          });
          that.setData({
            projectList,
          });
          that.loading.hideLoading();
        },
        fail: function (res) {
          //console.log(res)
          that.loading.hideLoading();
          wx.showModal({
            title: "错误",
            content: "没有找到记录，请检查网络或重启小程序",
            showCancel: false,
          });
        },
      });
    },
  },
  /**
   * 组件方法
   */
  methods: {
    //  打开对应的导航栏
    openNav: function (e) {
      // console.log(e.target.id);
      let projectList = this.data.projectList.map((n) => {
        n.open = false;
        return n;
      });
      projectList[e.target.id].open = true;
      this.setData({
        projectList,
      });
    },
  },
});
