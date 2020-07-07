// pages/Main/childCpn/main-icon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //传入的页面数据对象
    iconInf: {
      type: Object,
      value: {
        navigateUrl: "", // 要跳转到的页面路径
        iconSrc: "", // 按钮图标的路径
        iconText: "", // 按钮的文本
        iconClass: "", // 决定了icon的样式
      },
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
