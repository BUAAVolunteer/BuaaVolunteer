let app = getApp();
const db = wx.cloud.database();
Component({
  /**
   * 页面的初始数据
   *
   */

  data: {
    baseUrl:
      "/assets/image/project/",
    // 页面按钮跳转相关信息存储
    volunteerList: [
      {
        desc: "“童年一课”线上支教",
        id: "0c928181-1d01-49aa-8675-17d7ba583f51",
        onShow: true,
      },
      {
        desc: "思源楼智能手机教学",
        id: "3d6e2c29-8424-4ccc-8216-562c14651d53",
        onShow: true,
      },
      {
        desc: "夕阳再晨",
        id: "4286da57-a594-46a7-b439-a9d991cfe728",
        onShow: true,
      },
      {
        desc: "中国科学技术馆",
        id: "edd8ed51-3b74-4042-a1fc-fc217431afdc",
        onShow: true,
      },
      {
        desc: "立水桥地铁站",
        id: "05745ba8-99cf-40b3-90c5-1529faf3d5c7",
        onShow: true,
      },
      {
        desc: "鲁迅博物馆",
        id: "9dab4e62-a03d-47d9-b6b5-12f4447550b1",
        onShow: true,
      },
      {
        desc: "中华世纪坛",
        id: "2d08f525-6307-46c3-8f56-e331edb93974",
        onShow: true,
      },
      {
        desc: "国家图书馆",
        id: "9b640747-250c-42dd-8e13-7817cd9f1c95",
        onShow: true,
      },
      {
        desc: "小桔灯听障儿童支教",
        id: "783fa3c5-64ff-4ccc-aa0a-bd646933f289",
        onShow: true,
      },
      {
        desc: "咿呀总动员",
        id: "4bb622f7-8d57-4f95-b5e5-897679a00472",
        onShow: true,
      },
      {
        desc: "CBA志愿服务",
        id: "888fce93-ef0c-41fe-b3fc-a8c556ac7f63",
        onShow: true,
      },
      {
        desc: "中甲志愿者",
        id: "c4da0730-8048-4ded-8b8a-c83ac78a384e",
        onShow: true,
      },
      {
        desc: "北京天文馆",
        id: "893cc5a1-c00c-4837-a182-a31acb85fba3",
        onShow: true,
      },
    ],
  },
  /**
   * 搜索
   */
  methods: {
    search(e) {
      // 搜索方法
      let key = e.detail.value;
      let volunteerList = this.data.volunteerList;
      volunteerList = volunteerList.map((n) => {
        if (n.desc.indexOf(key) == -1) n.onShow = false;
        else n.onShow = true;
        return n;
      });
      this.setData({
        volunteerList,
      });
    },
  },
});
