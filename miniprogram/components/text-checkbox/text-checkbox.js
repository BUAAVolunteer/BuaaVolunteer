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
    checkboxChange: function (e) {
      //返回一个二维数组
      //第一行是组件id，第二行是选项数组
      //第三行是时长
      console.log(e);
      let ID = parseInt(this.properties.formInfo.ID);
      console.log("ID", ID);
      let v = e.detail.value;
      let l = v.length;
      let input_text = [];
      let choose = [];
      for (var i = 0; i < l; i++) {
        let chooseItem = {};
        let a = v[i].split(",");
        input_text.push(a[0]);
        chooseItem.ID = ID;
        chooseItem.input_text = a[0];
        chooseItem.value = parseInt(a[1]);
        chooseItem.duration = parseInt(a[2]) ? parseInt(a[2]) : 0;
        choose.push(chooseItem);
      }
      console.log(choose);
      this.triggerEvent("checkbox", {
        type: "checkbox",
        ID,
        input_text,
        choose,
      });
    },
  },
});
