// pages/Manage/childCpn/manage-icon/manage-icon.js
const computedBehavior = require("miniprogram-computed");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    project: {
      type: Object,
      value: {
        title: "", // 标题
        date: "", // 招募日期
        time: "", // 招募时间
        qqNum: "", // qq群号
        open: "", // 是否打开
        check: "", // 状态判断（详见下一节流程图）
      },
    },
    currentDate: {
      type: String,
      value: "",
    },
    currentTime: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的计算属性
   */
  behaviors: [computedBehavior],
  computed: {
    isPreparing(data) {
      return (
        data.project.check == 1 &&
        (data.currentDate < data.project.date ||
          (data.currentDate == data.project.date &&
            data.currentTime < data.project.time))
      );
    },
    isRecruit(data) {
      return (
        data.project.check == 1 &&
        (data.currentDate > data.project.date ||
          (data.currentDate == data.project.date &&
            data.currentTime >= data.project.time))
      );
    },
    isFinish(data) {
      return (
        data.project.check < 1 ||
        (data.project.check == 1 &&
          (data.currentDate < data.project.date ||
            (data.currentDate == data.project.date &&
              data.currentTime < data.project.time)))
      );
    },
  },
  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    openConfirm() {
      console.log('嘤嘤嘤')
      wx.navigateTo({
        url: "../ConfirmHistory/ConfirmHistory?title=" + this.properties.project.title,
      });
    },
  },
});
