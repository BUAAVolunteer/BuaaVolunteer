// components/lx-hover/lx-hover.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    onShow: {
      type: Boolean,
      value: false,
    },
    title: {
      type: String,
      value: null,
    }, // 标题
    assureBtn: {
      type: String,
      value: null,
    }, // 确定按钮文字
    cancelBtn: {
      type: String,
      value: null,
    }, // 取消按钮文字
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
    submit() {
      // 触发父组件方法
    },
    cancel() {
      // 触发父组件方法
    },
  }
})