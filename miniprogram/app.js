//app.js
App({ 
  onLaunch: function () {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: "volunteer-platform-1v92i",
        // env: 'buaalx-w5aor',
        traceUser: true,
      });
    }

    this.globalData = {
      avatar:
        "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/头像照片/common/common-1.png",
      openid: "",
      name: "",
      phone: "",
      personNum: "",
      text: "",
      qqNum: "",
      history: [],
      campus: "南校区",
      totalDuration: 0,
      totalScore: 0,
      isRegister: false,
      isAdmin: false,
      qualification: [""],
    };
  },
});
