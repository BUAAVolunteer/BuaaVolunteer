// pages/Profile/childCpn/history-card/history-card.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    history: {
      type: Object,
      value: {
        note: "", //志愿备注
        title: "", // 志愿名称
        score: ",", // 志愿得分
        duration: 0, // 志愿时长
      },
    },
  },
  lifetimes:{
    attached() {
      console.log(this.properties.history)
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
