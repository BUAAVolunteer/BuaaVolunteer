// components/lx-button/lx-button.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loading: {
      type: Boolean,
      value: false,
    },
    content: {
      // 按钮内容
      type: String,
      value: "按钮",
    },
    color: {
      // 按钮颜色,允许的输入范围：white/blue/green/yellow/red
      type: String,
      value: "white",
    },
    width: {
      // 宽度
      type: String,
      value: "700rpx",
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {},
});
