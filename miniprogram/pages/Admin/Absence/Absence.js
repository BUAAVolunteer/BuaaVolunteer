// pages/Admin/Absence/Absence.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    picker: ["立水桥站区平安地铁志愿", "童年一课线上支教", "鲁迅博物馆讲解",
      "“夕阳再晨”智能手机教学（1号社区）", "“夕阳再晨”智能手机教学（2号社区）", "思源楼智能手机教学",
      "科技馆志愿", "国家图书馆", "中华世纪坛",
      "花园小课堂", "昌雨春童康复中心",
      "小桔灯听障儿童支教", "咿呀总动员", "CBA志愿服务",
      "中甲志愿服务", "天文馆志愿"
    ],
    picker2: ["缺勤但提前说明", "缺勤但未提前说明", "缺勤且未说明"],
    name: "", // 失信志愿者名字
    tele: "", //失信志愿者电话
    pickname: "", //项目名称
    index: null,
    index2: null,//失信方式
    date1: '2019-8-28',//志愿开展的日期
    date2: '2019-8-28',
    time1: '12:00'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 这个方法要改 数据获取
    order_submit: function (e) {
      //console.log(e.detail.value)
      if (this.data.pickname == null) {
        //console.log(e.detail.value.title)
        wx.showModal({
          title: '错误',
          content: '请选择项目名称',
          showCancel: false,
        })
        return
      }
      // 就这里的变量名，都改成现在用的data里的
      if (this.data.date1 == "") {
        wx.showModal({
          title: '错误',
          content: '请填写志愿开展日期',
          showCancel: false,
        })
        return
      }
      var picker = ["立水桥站区平安地铁志愿", "童年一课线上支教", "鲁迅博物馆讲解",
        "“夕阳再晨”智能手机教学（1号社区）", "“夕阳再晨”智能手机教学（2号社区）", "思源楼智能手机教学",
        "科技馆志愿", "国家图书馆", "中华世纪坛",
        "花园小课堂", "昌雨春童康复中心",
        "小桔灯听障儿童支教", "咿呀总动员", "CBA志愿服务",
        "中甲志愿服务", "天文馆志愿"
      ]
      var picker2 = ["-5", "-8", "-15"]
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      db.collection('blacklist').add({
        data: {
          name: this.data.name,
          phone: this.data.tele,
          title: this.data.picker[this.data.pickname],
          time: this.data.date1,
          score: this.data.picker2[thid.data.index2]
        },
        success: function () {

        },
        fail: function () {
          wx.hideLoading()
          wx.showModal({
            title: '错误',
            content: '请检查网络或联系管理员',
            showCancel: false
          })
        }
      })

      db.collection('list').add({
        data: {
          a: "0",
          p: this.data.tele,
          v: this.data.picker[this.data.pickname],
          t: this.data.date1,
          s: this.data.picker2[thid.data.index2]
        },
        success: function () {
          wx.hideLoading()
          wx.showModal({
            title: '添加成功',
            content: '黑名单已添加',
            showCancel: false,
          })
        },
        fail: function () {
          wx.hideLoading()
          wx.showModal({
            title: '错误',
            content: '请检查网络或联系管理员',
            showCancel: false
          })
        }
      })
    },
  }
})