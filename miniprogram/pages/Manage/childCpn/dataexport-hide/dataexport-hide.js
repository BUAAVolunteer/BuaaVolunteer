// pages/Manage/childCpn/dataexport-hide/dataexport-hide.js
const computedBehavior = require("miniprogram-computed");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    signupTitle: {
      // 组件名
      type: Array,
      value: ["姓名", "手机号", "学号", "QQ号", "校区", "其他选项组件"],
    },
    signupItem: {
      // 组件内容
      type: Object,
      value: [],
    },
    open: {
      // 是否展开
      type: Boolean,
      value: false,
    },
  },
  behaviors: [computedBehavior], // 代表页面中可以使用computed扩展方法
  /**
   * 组件的初始数据
   */
  data: {},
  /**
   * 组件的方法列表
   */
  methods: {
    next() {
      this.triggerEvent("changeCurrent", { type: "next" });
    },
    back() {
      this.triggerEvent("changeCurrent", { type: "back" });
    },
    finish() {
      this.triggerEvent("finish");
    },
  },
});
