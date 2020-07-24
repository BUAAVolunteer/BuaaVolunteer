// pages/Manage/childCpn/formedit-hide/formedit-hide.js
const computedBehavior = require("miniprogram-computed");
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    formItem: {
      type: Object,
      value: {
        ID: 0, // 标识符
        type: "", // 类型
        label: "", // 标题
        describe: "", // 描述
        role: {
          // 选项的合法性检验
          msg: "", // 选项违背type原则时，弹出的提示消息
          type: "", // 选项类型，一般为notnull表示非空
          value: "",
        },
        isForce: false, // 是否必选
        isNumber: false, // 是否自动加编号
        isLimit: false, // 是否限额
        isDuration: false, // 是否有时长
        isNote: false, // 是否有备注
        option: [
          // 选项列表
          {
            ID: 0,
            checked: false,
            limit: 0,
            name: "",
            duration: 0,
            detail: "",
            bookingNum: 0,
          },
        ],
      },
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    typePicker: [
      // 展示和切换的选项类型
      {
        type: "text",
        show: "文本输入",
      },
      {
        type: "radio",
        show: "单选",
      },
      {
        type: "checkbox",
        show: "多选",
      },
      {
        type: "div",
        show: "分割线",
      },
      {
        type: "describe",
        show: "文本描述",
      },
    ],
  },
  behaviors: [computedBehavior],
  /**
   * 监听事件，用于同步数据
   */
  lifetimes: {
    created() {
      this.setData({
        formItem: this.properties.formItem,
      });
    },
  },
  /**
   * 组件的计算函数
   */
  computed: {
    // 根据组件类型，展示不同的数据
    // 由上至下，可展示的越来越多
    isTypeZero(data) {
      return (
        data.formItem.type == "text" ||
        data.formItem.type == "radio" ||
        data.formItem.type == "checkbox" ||
        data.formItem.type == "title" ||
        data.formItem.type == "describe"
      );
    },
    isTypeOne(data) {
      return (
        data.formItem.type == "text" ||
        data.formItem.type == "radio" ||
        data.formItem.type == "checkbox" ||
        data.formItem.type == "describe" ||
        data.formItem.type == "div"
      );
    },
    isTypeTwo(data) {
      return (
        data.formItem.type == "text" ||
        data.formItem.type == "radio" ||
        data.formItem.type == "checkbox"
      );
    },
    isTypeThree(data) {
      return data.formItem.type == "radio" || data.formItem.type == "checkbox";
    },
    // picker的选中值
    pickerValue(data) {
      switch (data.formItem.type) {
        case "text":
          return 0;
        case "radio":
          return 1;
        case "checkbox":
          return 2;
        case "div":
          return 3;
        case "describe":
          return 4;
      }
    },
    typeValue(data) {
      switch (data.formItem.type) {
        case "text":
          return "文本输入";
        case "radio":
          return "单选";
        case "checkbox":
          return "多选";
        case "div":
          return "分割线";
        case "describe":
          return "文本描述";
      }
    },
    note(data) {
      return data.formItem.option
        .reduce((preValue, n) => {
          return preValue + n.detail + "\n";
        }, "")
        .slice(0, -1);
    },
    option(data) {
      return data.formItem.option
        .reduce(function (preValue, n) {
          //preValue代表当前累计值，n为正要处理的数组元素
          preValue += n.name;
          //不会出现有duration无limit情况，两种同时出现按顺序拼接
          if (data.formItem.isLimit) preValue += " " + n.limit;
          if (data.formItem.isDuration) preValue += " " + n.duration;
          preValue += "\n";
          return preValue;
        }, "")
        .slice(0, -1);
    },
    // 返回页面高度
    scrollHeight() {
      return wx.getSystemInfoSync().windowHeight + "px";
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 收起组件
    offCanvas() {
      this.triggerEvent("finish");
    },
    // 选项输入，将数据解析为选项名，时长和限额
    enterOption(e) {
      //console.log(e.detail.value)
      if (e.detail.value == "") return;
      let chooseDetail = e.detail.value.split("\n");
      let pattern = /(( +)\d+)/g; //用于全局匹配数字
      let pattern1 = /^([\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5a-zA-Z0-9]+)( +)?$/; //用于匹配只包含选项名的情况
      let pattern2 = /^([\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5a-zA-Z0-9]+)( +)(\d+)( +)?$/; //用于匹配包含选项名和限额的情况
      let pattern3 = /^([\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5a-zA-Z0-9]+)( +)(\d+)( +)(\d+)( +)?$/; //用于匹配包含选项名，限额和时长的情况
      let ID = 0,
        isLimit = false,
        isDuration = false;
      let isIllLegal = false;
      let option = chooseDetail.reduce(function (preValue, n) {
        // reduce拼接数组
        let dataitem = {
          ID,
          checked: false,
          limit: 0,
          name: "",
          duration: 0,
          detail: "",
          bookingNum: 0,
        };
        ID += 1;
        // 选项名
        dataitem.name = n.split(" ")[0];
        if (pattern1.test(n)) {
          // 选项名已经取出，什么都不用做
        } else if (pattern2.test(n)) {
          // 取出限额limit
          dataitem.limit = parseInt(n.match(pattern)[0].replace(" ", ""));
          isLimit = 1;
        } else if (pattern3.test(n)) {
          // 取出时长duration
          dataitem.limit = parseInt(n.match(pattern)[0].replace(" ", ""));
          dataitem.duration = parseInt(n.match(pattern)[1].replace(" ", ""));
          isLimit = 1;
          isDuration = 1;
        }
        // 错误判断
        else if (!isIllLegal) {
          console.log("n:", n, "匹配4");
          isIllLegal = true;
        }
        preValue.push(dataitem);
        return preValue;
      }, []);
      // console.log(option);
      if (isIllLegal) {
        wx.showModal({
          title: "错误提示",
          content: "请确保选项内容与限额间，限额与时长间都只有一个空格",
          showCancel: false,
          confirmText: "我知道了",
        });
      } else {
        this.setData({
          "formItem.option": option, // 选项内容数组
          "formItem.isLimit": isLimit, // 是否限额
          "formItem.isDuration": isDuration, // 是否有时长
        });
        // 内部更新方法
        this._trigger();
      }
    },
    // 备注输入
    enterNote(e) {
      // 将备注按行切分录入选项数组
      let noteDetail = e.detail.value.split("\n");
      let option = this.data.formItem.option;
      for (let i = 0; i < option.length; i++) {
        option[i].detail = noteDetail[i];
      }
      this.setData({
        "formItem.option": option,
      });
      this._trigger();
    },
    // 组件类型更改
    typeChange(e) {
      // console.log('选中数据',parseInt(e.detail.value))
      console.log(
        "赋值数据",
        this.data.typePicker[parseInt(e.detail.value)].type
      );
      let type = this.data.typePicker[parseInt(e.detail.value)].type;
      this.setData({
        "formItem.type": type,
      });
      this._trigger();
    },
    // 修改标题和提示信息
    enterInfo: function (e) {
      // 根据type区分要改的是标题还是提示信息
      let type = e.currentTarget.id;
      console.log(e.detail.value, e.currentTarget.id);
      if (type == "label") {
        //组件标题的修改
        this.setData({
          "formItem.label": e.detail.value,
        });
      } else if (type == "describe") {
        //组件提示的修改
        this.setData({
          "formItem.describe": e.detail.value,
        });
      }
      this._trigger();
    },
    // 其他设定，均与全局组件checkbox-single有关，返回值e.detail为Boolean值表示是否选中
    addForce(e) {
      // 是否必填
      console.log(e.detail);
      let checked = e.detail;
      if (checked) {
        let title = this.data.formItem.label;
        let role = {
          msg: "",
          type: "",
          value: "",
        };
        role.msg = title.length > 10 ? "必填项不能为空" : title + "不能为空";
        this.setData({
          "formItem.role": role,
          "formItem.isForce": true,
        });
      } else
        this.setData({
          "formItem.isForce": false,
        });
      this._trigger();
    },
    addNumber(e) {
      // 自动加选项编号
      let checked = e.detail;
      let option = this.data.formItem.option;
      if (checked) {
        let count = 64;
        option = option.map((n) => {
          count++;
          n.name = String.fromCharCode(count) + "." + n.name;
          return n;
        });
        this.setData({
          "formItem.option": option,
          "formItem.isNumber": true,
        });
      } else {
        option = this.data.formItem.option.map((n) => {
          n.name = n.name.slice(2);
          return n;
        });
        this.setData({
          "formItem.option": option,
          "formItem.isNumber": false,
        });
      }
      // console.log(option);
      this._trigger();
    },
    // 添加备注
    addNote(e) {
      let checked = e.detail;
      if (checked) {
        let option = this.data.formItem.option.map((n) => {
          n.detail = n.name;
          return n;
        });
        this.setData({
          "formItem.isNote": true,
          "formItem.option": option,
        });
      } else {
        this.setData({
          "formItem.isNote": false,
        });
      }
      this._trigger();
    },
    // 自定义事件子传父，传递更新后的数据
    _trigger() {
      this.triggerEvent("optionChange", this.data.formItem);
    },
  },
});
