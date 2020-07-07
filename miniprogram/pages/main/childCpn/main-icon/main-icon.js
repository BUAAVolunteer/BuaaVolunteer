// pages/Main/childCpn/main-icon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 要跳转到的页面路径
    navigateUrl: {
      type: String,
      value: "",
    },
    // 按钮图标的路径
    iconSrc: {
      type: String,
      value: "",
    },
    // 按钮的文本
    iconText: {
      type: String,
      value: "",
    },
    // 决定了icon的样式
    iconClass:{
      type: String,
      value: "",
    }
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
