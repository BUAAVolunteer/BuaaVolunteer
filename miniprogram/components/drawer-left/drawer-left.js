// components/drawer-left/drawer-left.js
const computedBehavior = require("miniprogram-computed");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    open: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},
  behaviors: [computedBehavior],
  computed: {
    // 返回页面高度
    scrollHeight() {
      return wx.getSystemInfoSync().windowHeight + "px";
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {},
});
