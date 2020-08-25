// components/lx-loading/lx-loading.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onShow: {
      type: Boolean,
      value: false
    },
    isContent: {
      type: Boolean,
      value: true
    },
    content: {
      type: String,
      value: 'Loading...'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showLoading({
      isContent = false,
      content = ""
    } = {}) {
      this.setData({
        isContent,
        content,
        onShow: true
      })
    },
    hideLoading() {
      this.setData({
        onShow: false
      })
    }
  }
})
