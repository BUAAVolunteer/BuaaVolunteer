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
        isForce: false, // 是否必选
        isLimit: false, // 是否限额
        isDuration: false, // 是否有时长
        isNote: false, // 是否有备注
        option: [
          // 选项列表
          {
            id : 0,
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
    page: 0, // 展示的页数
    option : "" // 展示的选项信息
  },
  behaviors: [computedBehavior],
  observers: {
    'formItem.option' () {
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
        option
      })
    }
  },
  /**
   * 组件的计算函数
   */
  computed: {
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
      let la = chooseDetail.length;
      this.setData({
        la,
      });
      let pattern = /(( +)\d+)/g; //用于全局匹配数字
      let pattern2 = /^([\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5a-zA-Z0-9]+)( +)(\d+)( +)?$/; //用于匹配包含选项名和限额的情况
      let pattern3 = /^([\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\u4e00-\u9fa5a-zA-Z0-9]+)( +)(\d+)( +)(\d+)( +)?$/; //用于匹配包含选项名，限额和时长的情况
      let id = 0,
        flagl = 0,
        flagd = 0;
      let option = chooseDetail.reduce(function (preValue, n) {
        //reduce拼接数组
        let dataitem = {
          id,
          checked: false,
          limit: 0,
          name: "",
          duration: 0,
          detail: "",
          bookingNum: 0,
        };
        id += 1;
        let ni = n.split(" ");
        dataitem.name = ni[0];
        if (pattern2.test(n)) {
          dataitem.limit = parseInt(n.match(pattern)[0].replace(" ", ""));
          flagl = 1;
        } else if (pattern3.test(n)) {
          dataitem.limit = parseInt(n.match(pattern)[0].replace(" ", ""));
          dataitem.duration = parseInt(n.match(pattern)[1].replace(" ", ""));
          flagl = 1;
          flagd = 1;
        }
        // 错误输出
        else {
          console.log("n:", n, "匹配4");
          wx.showModal({
            title: "错误提示",
            content: "请确保选项内容与限额间，限额与时长间都只有一个空格",
            showCancel: false, //是否显示取消按钮
            //cancelText: "否", //默认是“取消”
            //cancelColor: 'skyblue', //取消文字的颜色
            confirmText: "我知道了", //默认是“确定”
            //confirmColor: 'skyblue', //确定文字的颜色{
          });
        }
        preValue.push(dataitem);
        return preValue;
      }, []);
      console.log(option);
      this.triggerEvent("optionChange", {
        ID: this.properties.formItem.ID, // 标识符
        option,
        isLimit: flagl, // 是否限额
        isDuration: flagd, // 是否有时长
      });
    },
    // 其他设定
    enter: function (e) {
      let type = e.currentTarget.id;
      let addList = "formList.formInfo[" + ID + "]";
      if (type == "title")
        //组件标题的修改
        addList =
          ID == -1
            ? "formList.fieldName"
            : "formList.formInfo[" + ID + "].label";
      else if (type == "text")
        //组件提示的修改
        addList = addList + ".text";
      else if (type == "force") {
        //必填项的添加
        //title是为了构造合法性检验时的提示
        let title = this.data.formList.formInfo[ID].label;
        let l = e.detail.value.length;
        let role = {
          msg: "",
          type: "",
          value: "",
        };
        let addl = addList + ".force";
        //l=1说明选中
        if (l == 1) {
          this.setData({
            [addl]: true,
          });
          //构造合法性检验的提示
          role.type = "notnull";
          if (title.length > 10) role.msg = "必填项不能为空";
          else role.msg = title + "不能为空";
          addl = addList + ".role";
          this.setData({
            [addl]: role,
          });
        } else {
          this.setData({
            [addl]: false,
          });
          role.type = "";
          addl = addList + ".role";
          this.setData({
            [addl]: role,
          });
        }
      } else if (type == "detailopen") {
        //备注项的开关
        addl = addList + ".detail";
        if (this.data.formList.formInfo[ID].detail) {
          this.setData({
            [addl]: false,
            detail: false,
          });
        } else {
          this.setData({
            [addl]: true,
            detail: true,
          });
        }
      }
      //对于title，text
      if (type == "title" || type == "text")
        this.setData({
          [addList]: e.detail.value,
        });
    },
    // 页面切换
    change() {
      this.setData({
        page: 1 - this.data.page,
      });
    },
  },
});
