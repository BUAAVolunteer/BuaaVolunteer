// components/lx-input/lx-input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      // 组件标题
      type: String,
      value: "",
    },
    content: {
      // 内容
      type: String,
      value: "",
    },
    placeholder: {
      // 默认提示
      type: String,
      value: "",
    },
    type: {
      // 区分textarea和input
      type: String,
      value: "input",
    },
    isForce: {
      // 是否展示必填标记
      type: Boolean,
      value: true,
    },
    showText: {
      type: Boolean,
      value: true,
    },
    width: {
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
