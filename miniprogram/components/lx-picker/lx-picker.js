// components/lx-picker/lx-picker.js
const computedBehavior = require("miniprogram-computed");
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
    mode: {
      // 模式
      type: String,
      value: "",
    },
    content: {
      // 当mode为date和time时，表示选中的内容
      type: String,
      value: "",
    },
    range: {
      // 当mode为selector时，表示待选的范围数组
      type: Array,
      value: [],
    },
    value: {
      // 当mode为selecotor时，双向绑定选中的下角标
      type: Number,
      value: null,
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
  behaviors: [computedBehavior], // 代表页面中可以使用computed扩展方法
  computed: {
    isSelector(data) {
      return data.mode == "selector";
    },
    isSpecial(data) {
      return data.mode == "time" || data.mode == "date";
    },
  },
});
