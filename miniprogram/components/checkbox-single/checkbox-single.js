// components/checkbox-single/checkbox-single.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checked: {
      type: Boolean,
      value: false,
    },
    content: {
      type: String,
      value: "",
    },
  },

  /**
   * 组件的初始数据
   */
  created() {
    console.log(this.properties)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    enter(e) {
      let checked = e.detail.value.length == 1;
      // console.log(checked)
      this.triggerEvent("checkboxChange", checked);
    },
  },
});
