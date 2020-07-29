// components/lx-picker/lx-picker.js
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
      // 选中的内容
      type: String,
      value: "",
    },
    mode: {
      // 模式
      type: String,
      value: "",
    },
    isForce: {
      // 是否展示必填标记
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
  lifetimes: {
    created() {
      console.log(this.properties.content);
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {},
});
