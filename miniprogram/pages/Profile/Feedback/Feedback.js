// miniprogram/pages/want/want.js
const db = wx.cloud.database();
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    range: [
      "小程序使用问题",
      "立水桥站区平安地铁志愿",
      "童年一课线上支教",
      "鲁迅博物馆讲解",
      "“夕阳再晨”智能手机教学（1号社区）",
      "“夕阳再晨”智能手机教学（2号社区）",
      "思源楼智能手机教学",
      "科技馆志愿",
      "国家图书馆",
      "中华世纪坛",
      "花园小课堂",
      "昌雨春童康复中心",
      "小桔灯听障儿童支教",
      "咿呀总动员",
      "CBA志愿服务",
      "中甲志愿服务",
      "天文馆志愿",
    ],
    value: null, // 当前选中
    text: "", // 反馈信息
    contact: "", // 联系方式
  },
  methods: {
    submit() {
      let title = this.data.range[this.data.value];
      let text = this.data.text;
      let contact = this.data.contact;
      let that = this;
      if (title == "") {
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
      this.loading = this.selectComponent("#loading");
      this.loading.showLoading({
        isContent: false,
        content: "",
        isBig: false,
      });
      db.collection("person")
        .where({
          _openid: app.globalData.openid,
        })
        .get()
        .then((e) => {
          console.log(e.data[0].name);
          db.collection("deefback").add({
            data: {
              name: e.data[0].name,
              title,
              text,
              check: 0,
            },
            success: function () {
              that.loading.hideLoading();
              wx.showModal({
                title: "反馈成功",
                content: "您的反馈我们已经收到，请耐心等待解答",
                showCancel: false,
                success: function () {
                  wx.switchTab({
                    url: "../main/main",
                  });
                },
              });
            },
            fail: function () {
              that.loading.hideLoading();
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
