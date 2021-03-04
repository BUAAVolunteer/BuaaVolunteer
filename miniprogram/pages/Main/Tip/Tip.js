// miniprogram/pages/Tip.js
var qqNum;
Component({
  properties: {
    qqNum: {
      type: String,
      value: "",
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    
  },

  lifetimes: {
    attached() {
      qqNum = this.properties.qqNum;
    }
  },

  methods: {
    
  },
})