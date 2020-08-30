// components/lx-loading/lx-loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onShow: {
      type: Boolean,
      value: false,
    },
    isContent: {
      type: Boolean,
      value: true,
    },
    content: {
      type: String,
      value: "Loading...",
    },
    isBig: {
      type: Boolean,
      value: true,
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
    showLoading({ isContent = false, content = "", isBig = true } = {}) {
      this.setData({
        isBig,
        isContent,
        content,
        onShow: true,
      });
    },
    hideLoading() {
      this.setData({
        onShow: false,
      });
    },
  },
});
