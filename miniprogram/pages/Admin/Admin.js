// pages/Admin/Admin.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    currentTab: 0, // 初始tab设定
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 滚动切换标签样式
    switchTab(e) {
      this.setData({
        currentTab: e.detail.current,
      });
    },
    // 点击标题切换当前页时改变样式
    swichNav(e) {
      var cur = e.target.dataset.current;
      if (this.data.currentTaB == cur) {
        return false;
      } else {
        this.setData({
          currentTab: cur,
        });
      }
    },
  },
});
