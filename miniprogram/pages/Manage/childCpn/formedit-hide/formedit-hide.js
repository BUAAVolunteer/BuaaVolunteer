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
        isLimit: false, // 是否限额
        isDuration: false, // 是否有时长
        isNote: false, // 是否有备注
        option: [
          // 选项列表
          {
            id: 0,
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
    option: "", // 展示的选项信息
    type:[

    ]
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
   * 监听事件，用于同步数据
   */
  observers: {
    "formItem.option"() {
      // console.log(this.properties.formItem.option)
      let that = this;
      let option = that.properties.formItem.option
        .reduce(function (preValue, n) {
          //preValue代表当前累计值，n为正要处理的数组元素
          preValue += n.name;
          //不会出现有duration无limit情况，两种同时出现按顺序拼接
          if (that.properties.formItem.isLimit) preValue += " " + n.limit;
          if (that.properties.formItem.isDuration) preValue += " " + n.duration;
          preValue += "\n";
          return preValue;
        }, "")
        .slice(0, -1);
      this.setData({
        option,
      });
    },
    formItem() {
      this.setData({
        isNote: this.properties.formItem.isNote,
      });
    },
  },
  /**
   * 组件的计算函数
   */
  computed: {
    // 根据组件类型，展示不同的数据
    // 由上至下，可展示的越来越多

    isTypeOne(data) {
      console.log(data);
      return (
        data.formItem.type == "text" ||
        data.formItem.type == "radio" ||
        data.formItem.type == "checkbox" ||
        data.formItem.type == "title"
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
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 选项输入
    enterOption(e) {
      //console.log(e.detail.value)
      if (e.detail.value == "") return;
      let chooseDetail = e.detail.value.split("\n");
      let pattern = /(( +)\d+)/g; //用于全局匹配数字
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
        dataitem.name = n.split(" ")[0];
        if (pattern2.test(n)) {
          dataitem.limit = parseInt(n.match(pattern)[0].replace(" ", ""));
          isLimit = 1;
        } else if (pattern3.test(n)) {
          dataitem.limit = parseInt(n.match(pattern)[0].replace(" ", ""));
          dataitem.duration = parseInt(n.match(pattern)[1].replace(" ", ""));
          isLimit = 1;
          isDuration = 1;
        }
        // 错误输出
        else if (!isIllLegal) {
          console.log("n:", n, "匹配4");
          isIllLegal = true;
        }
        preValue.push(dataitem);
        return preValue;
      }, []);
      console.log(option);
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
        this._trigger();
      }
    },
    _trigger() {
      this.triggerEvent("optionChange", this.data.formItem);
    },
    // 其他设定
    enterInfo: function (e) {
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
    addNote(e) {
      // 添加备注
      let checked = e.detail;
      if (checked) {
        let note = this.data.formItem.option
          .reduce((preValue, n) => {
            return preValue + n.name + "\n";
          }, "")
          .slice(0, -1);
        this.setData({
          "formItem.isNote": true,
          note,
        });
      } else {
        this.setData({
          "formItem.isNote": false,
        });
      }
      this._trigger();
    },
  },
});
