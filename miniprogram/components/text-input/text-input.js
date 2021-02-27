// components/my-form/my-input.js
Component({
  /**
   * 组件的初始数据
   */
  properties: {
    formInfo: {
      type: Object,
      value: {},
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    enterValue: function (e) {
      console.log(e.detail.value);
      let input_text = e.detail.value;
      let ID = parseInt(this.properties.formInfo.ID);
      //  子传父事件，将输入数据回传
      this.triggerEvent("input", {
        type: "input",
        ID,
        input_text,
      });
    },
  },
});
