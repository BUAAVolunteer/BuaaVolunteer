// pages/Main/childCpn/activity-events/activity-events.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    //传入页面的数据对象
    eventInf: {
      type: Object,
      value: {
        navigateUrl: "",     // 要跳转到的页面路径
        titleText: "",       // 推送名称
        tag: "",             // 下方水印（每个都一样
        photoSrc: "",        // 右方图片
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
  methods: {

  }
})
