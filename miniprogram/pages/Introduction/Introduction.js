let app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 页面的初始数据
   *
   */

  data: {
    currentTab: 0,
    // 页面按钮跳转相关信息存储
    volunteerIcon: [{
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/小桔灯.jpg",
        desc: "小桔灯支教",
        id: "783fa3c5-64ff-4ccc-aa0a-bd646933f289"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/咿呀总动员.jpg",
        desc: "咿呀总动员",
        id: "4bb622f7-8d57-4f95-b5e5-897679a00472"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i/志愿项目/CBA.jpg",
        desc: "CBA志愿服务",
        id: "888fce93-ef0c-41fe-b3fc-a8c556ac7f63"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i/志愿项目/中甲.jpg",
        desc: "中甲志愿服务",
        id: "c4da0730-8048-4ded-8b8a-c83ac78a384e"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/天文馆.jpg",
        desc: "北京天文馆",
        id: "893cc5a1-c00c-4837-a182-a31acb85fba3"
      },
    ],
    volunteerIcon2: [{
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/思源楼.jpg",
        desc: "思源楼教学",
        id: "3d6e2c29-8424-4ccc-8216-562c14651d53"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i/志愿项目/夕阳再晨.jpg",
        desc: "夕阳再晨",
        id: "4286da57-a594-46a7-b439-a9d991cfe728"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/科技馆.jpg",
        desc: "中国科技馆",
        id: "edd8ed51-3b74-4042-a1fc-fc217431afdc"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/立水桥地铁站.jpg",
        desc: "立水桥地铁站",
        id: "05745ba8-99cf-40b3-90c5-1529faf3d5c7"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/鲁迅博物馆.jpg",
        desc: "鲁迅博物馆",
        id: "9dab4e62-a03d-47d9-b6b5-12f4447550b1"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/中华世纪坛.jpg",
        desc: "中华世纪坛",
        id: "2d08f525-6307-46c3-8f56-e331edb93974"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/国家图书馆.jpg",
        desc: "国家图书馆",
        id: "9b640747-250c-42dd-8e13-7817cd9f1c95"
      },
      {
        imgSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目/童年一课.jpg",
        desc: "“童年一课”",
        id: "0c928181-1d01-49aa-8675-17d7ba583f51"
      },
    ],
    imageList: [], // 要传入volunteer-swiper的对象数组
  },
  /**
   * 搜索
   */
  methods: {
    // 方法要放到methods
    clickTab: function(e) {
      var that = this;
      if (this.data.currentTab === e.target.dataset.current) {
        return false;
      } else {
        that.setData({
          currentTab: e.target.dataset.current
        })
      }
    },
    // 切换动画
    swiperTab: function(e) {
      var that = this;
      that.setData({
        currentTab: e.detail.current
      });
    },
  },
})