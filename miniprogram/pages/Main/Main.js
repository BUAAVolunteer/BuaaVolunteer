// pages/main/main.js
let app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 页面的初始数据
   *
   */

  data: {
    // 页面按钮跳转相关信息存储
    mainSwiper:[
      {
        url:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s?__biz=MzA4MDQ2ODMwMw==&mid=2652708504&idx=1&sn=a0af393f663c3554eb06a7fc58d1db94&chksm=844a7eb8b33df7ae14ee0e9763a456b83bb2e1bb60f939a506aff3cc1a48a3fb60239b8c2634&scene=0&xtrack=1&key=018eb7afa591f40fccfeb16f0e2a32df5a951d0c4c63d2d07b96159af72022547096017de7ac53396976e0a91d4aec86ec244cac9c810181a5d72a10cc1b68175b817ef349a71518b9b4285614f079ccba38164d50cf90f0e64df45aa1ff2b239f7e80ce7f1fb25f24fb9d043ca20e4fea9fecda53408bca2fefcef492cf2568&ascene=1&uin=NzI5NjQ2MDM2&devicetype=Windows+10+x64&version=62090538&lang=zh_CN&exportkey=A4T77KOQpVu4gEIIdWCJUFo%3D&pass_ticket=PQW3o8mOxW56DUXXaODw2ykhePJD%2Frew3UzQ1ChEoAyZ%2B1WJamSZqfHTd4kEBWqS",
        src:"cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/手拉手.png",
      },
      {
        url:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s?__biz=MzA4MDQ2ODMwMw==&mid=2652708764&idx=1&sn=af13db33af6850c6680723326def9547&chksm=844a7fbcb33df6aae905490bfd03a32e0fd825184cf5b264c80443d3469e641eef3d19e35421&scene=0&xtrack=1&key=25b7ee6511d12c93262f1bd673a72caa14ffc2fdc790494ae125de956b0b8de40decdef5b331ec1cee56884e91a7e158976890c239dd26525aeb9f09d4cceb2a8a9e053c921b54e9ba441698294b5e331832354329b1f8451bdf2d255bff1b8538f14e69553a00288e90f474fb330e1cb7445202d26fdd193a0633ef081c141d&ascene=1&uin=NzI5NjQ2MDM2&devicetype=Windows+10+x64&version=62090538&lang=zh_CN&exportkey=A5TDwRyQYwaLTONP%2Bf7vMaM%3D&pass_ticket=PQW3o8mOxW56DUXXaODw2ykhePJD%2Frew3UzQ1ChEoAyZ%2B1WJamSZqfHTd4kEBWqS",
        src:"cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/蓝协.png",
      },
      {
        url:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s?__biz=MzA4MDQ2ODMwMw==&mid=2652708514&idx=1&sn=4992a45c3d522797446cdd0b8cc18c64&chksm=844a7e82b33df7940f3b5f98f8ff9c18c946c56f9ebb9923fc85d1fc874b8763b15394a9baf2&scene=0&xtrack=1&key=f87c13d2d4a2ca88b6c7ad1e1f8f80ccb1e95526bd5df4bc0d4d6af64fd1ff935e29ac915cb4005a42258abf9b98a74d551fa9b529a6b98fb7796091e3b3a0a578aa40bacad4a703a5395635a05d6ae8679eca7383d1e6c896cde1de18e7fe05dbe1b24fc0d6ce4b149a359555d2b0762356679b3ad5c33e46aec4c70a56fddd&ascene=1&uin=NzI5NjQ2MDM2&devicetype=Windows+10+x64&version=62090538&lang=zh_CN&exportkey=Az3I9d%2BJThOPq%2FHciOnUnzA%3D&pass_ticket=PQW3o8mOxW56DUXXaODw2ykhePJD%2Frew3UzQ1ChEoAyZ%2B1WJamSZqfHTd4kEBWqS",
        src:"cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/余汉明.png",
      },
      {
        url:
          "/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s?__biz=MzA4MDQ2ODMwMw==&mid=2652708781&idx=1&sn=35d5d1ff04aba8a50f46d1d336580a03&chksm=844a7f8db33df69bde9b6888b54b760c87be14325a65b23072588617b48297ec19db8725526e&scene=0&xtrack=1&key=6121756d4ad9fd3cad16186fcf9f6088cdf9c0a0c7f61460ad59a3ac5304b1f2c48c51aa03cc3b83f1d0c4336e3d1c2bddf1e41652c5640b189e8d2ba6c1ef02fd7ec96ceb8127490c5afd7a17bfc6f3d74697da25e0d3f0883f198e9bbc9662e192b0f81170768eac0a79761b2257d261a305b416a7b141cd1e747f44d38794&ascene=1&uin=NzI5NjQ2MDM2&devicetype=Windows+10+x64&version=62090538&lang=zh_CN&exportkey=A6UyZRfUqffKpBgdfuLsYjk%3D&pass_ticket=PQW3o8mOxW56DUXXaODw2ykhePJD%2Frew3UzQ1ChEoAyZ%2B1WJamSZqfHTd4kEBWqS",
        src:"cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/志愿北京.png",
      },
    ],
    mainIcon: [
      {
        navigateUrl: "/pages/Main/Activity/Activity", // 要跳转到的页面路径
        imgsrc: "cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/预告有投影.png", // 按钮图标的路径
        iconText: "鲁迅博物馆", // 按钮的文本
        picsrc:"cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/鲁迅博物馆2.jpg", //图片的路径
      },
      {
        navigateUrl: "/pages/Main/Activity/Activity", // 要跳转到的页面路径
        imgsrc: "cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/预告有投影.png", // 按钮图标的路径
        iconText: "童年一课", // 按钮的文本
        picsrc:"cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/童年一课4.jpg", //图片的路径
      },
      {
        navigateUrl: "/pages/Main/FeedBack/FeedBack",
        picsrc: "cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/思源楼1.png",
        imgsrc: "cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/预告有投影.png",
        iconText: "思源楼",
      },
      {
        navigateUrl:"/pages/OuterLink/OuterLink?url=https://mp.weixin.qq.com/s/5bqJNvDXhH8j9iGZ5diyMw",
        picsrc: "cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/十年梦享活动照片1.jpg",
        imgsrc: "cloud://buaalx-w5aor.6275-buaalx-w5aor-1300053277/main/预告有投影.png",
        iconText: "十年梦享",
      },
    ],
    imageList: [], // 要传入main-swiper的对象数组
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
      wx.cloud.callFunction({
        name: "login",
        data: {},
      }).then(res => {
        //获取openid并赋值给全局变量
        app.globalData.openid = res.result.openid;
        console.log(app.globalData);
      }).then(() =>{
        //主页轮播图地址
          return db.collection("main")
          .get()
      })
      .then(res => {
        console.log(res.data);
        //获取到的地址数组
        that.setData({
          imageList: res.data,
        });
      })
      .then(() =>{
        return db.collection('person')
          .where({
            _openid: app.globalData.openid
          })
          .get()
      }).then(res =>{
        // console.log(res.data)
        if (res.data.length === 0){
          app.globalData.isRegister = false
        }else{
          app.globalData.personNum = res.data[0].personNum;
          app.globalData.campus = res.data[0].campus;
          app.globalData.phone = res.data[0].phone;
          app.globalData.qqNum = res.data[0].qqNum;
          app.globalData.name = res.data[0].name;
          app.globalData.isRegister = true
        }
      }).then(() =>{
        return db.collection('admin')
          .where({
            _openid: app.globalData.openid
          })
          .get()
      }).then(res =>{
        // console.log(res.data)
        if (res.data.length){
          app.globalData.isAdmin = true
        }else{
          app.globalData.isAdmin = false
        }
        console.log("个人信息登记完成")
        wx.hideLoading();
      })
      .catch((err) => {
        console.log(err)
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
  },
});
