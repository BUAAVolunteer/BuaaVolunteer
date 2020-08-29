// miniprogram/pages/ConfirmHistory/ConfirmHistory.js
const db = wx.cloud.database();
var isRecord = 0; //该项目是否有存在的确认历史记录
Component({
  /**
   * 页面的初始数据
   */
  properties: {
    title: {
      type: String,
      value: "",
    },
  },
  data: {
    ConfirmList: [],
  },
  lifetimes: {
    attached() {
      wx.showLoading({
        title: "加载中",
      });
      var that = this;
      console.log(that.properties.title);
      // 获取目前系统时间
      db.collection("confirm")
        .where({
          title: that.properties.title,
        })
        .get()
        .then((res) => {
          if (res.data.length) {
            isRecord = 1;
            let ConfirmList = res.data[0].historyList;
            console.log(ConfirmList);
            for (let i = 0; i < ConfirmList.length; i++) {
              ConfirmList[i].ID = i;
            }
            ConfirmList = ConfirmList.reverse();
            that.setData({
              ConfirmList,
            });
          } else {
            isRecord = 0;
            wx.showModal({
              title: "错误",
              content: "没有该志愿的确认记录，请先导出报名表",
              showCancel: false,
            });
          }
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
  /**
   * 组件方法
   */
  methods: {
    //  打开Confirm列表，方法名可以改
    openNav: function (e) {
      console.log(e.currentTarget.id);
      let ID = e.currentTarget.id;
      var confirmList_json = this.data.ConfirmList[ID];
      wx.navigateTo({
        url: "Confirm/Confirm?confirmList=" + JSON.stringify(confirmList_json),
      });
    },
  },
});