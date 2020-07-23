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
  methods: {
    radioChange: function (e) {
      //返回一个二维数组
      //第一行是组件id，第二行是选项数组
      //第三行是时长
      let ID = parseInt(this.properties.formInfo.ID);
      let v = e.detail.value;
      let a = v.split(",");
      let choose = [];
      let chooseItem = {};
      let input_text = [];
      input_text.push(a[0]);
      chooseItem.input_text = a[0];
      chooseItem.value = parseInt(a[1]);
      chooseItem.ID = ID;
      chooseItem.duration = parseInt(a[2]) ? parseInt(a[2]) : 0;
      choose.push(chooseItem);
      console.log("ID", ID, input_text, choose);
      this.triggerEvent("radio", {
        type: "radio",
        ID,
        input_text,
        choose,
      });
    },
  },
});
