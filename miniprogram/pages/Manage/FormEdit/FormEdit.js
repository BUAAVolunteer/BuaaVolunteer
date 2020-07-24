// pages/edit/edit.js
import Util from "../../../utils/util";
const computedBehavior = require("miniprogram-computed");
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
var cnt = 0; //index plus with item grow
var ID; //index of change item
var formLinkedList; //表单对应链表
Component({
  properties: {
    title: {
      type: String,
      value: "",
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    formList: {},
    title: "",
    infotitle: "立水桥",
    formItem: {
      ID: 0, // 标识符
      type: "", // 类型
      label: "", // 标题
      describe: "", // 描述
      isForce: false, // 是否必选
      isLimit: false, // 是否限额
      isDuration: false, // 是否有时长
      isNote: false, // 是否有备注
      option: [], // 选项列表
    },
    open: false,
    checked: false,
    button: false, // 底部按钮状态
    texta: "",
    textl: "",
    textd: "",
    dat: "",
  },
  behaviors: [computedBehavior],
  computed: {
    scrollHeight() {
      return wx.getSystemInfoSync().windowHeight - 82 + "px";
    },
  },
  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached() {
      let title = this.properties.title;
      //console.log(title)
      wx.showLoading({
        title: "加载中",
      });
      var that = this;
      let formData = {};
      this.setData({
        title,
      });
      db.collection("form")
        .where(
          _.or([
            {
              title,
            },
            {
              title: "发布一个新志愿",
            },
          ])
        )
        .get()
        .then((res) => {
          if (res.data.length == 1) {
            formData = res.data[0];
            db.collection("form").add({
              data: {
                formInfo: [],
                title,
                fieldName: title,
              },
            });
          } else {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].title === title) {
                formData = res.data[i];
                break;
              }
            }
          }
        })
        .then(() => {
          return db
            .collection("signUp")
            .where({
              title,
            })
            .get();
        })
        .then((res) => {
          if (res.data.length == 0) {
            db.collection("signUp").add({
              data: {
                title,
                list: [],
              },
            });
          }
        })
        .then(() => {
          let formLength = formData.formInfo.length;
          if ("id" in formData.formInfo[0]) {
            for (let i = 0; i < formLength; i++) {
              delete formData.formInfo[i].id;
            }
          }
          if ("data" in formData.formInfo[0]) {
            for (let i = 0; i < formLength; i++) {
              formData.formInfo[i].option = formData.formInfo[i].data;
              delete formData.formInfo[i].data;
            }
          }
          if ("text" in formData.formInfo[0]) {
            for (let i = 0; i < formLength; i++) {
              formData.formInfo[i].describe = formData.formInfo[i].text;
              delete formData.formInfo[i].text;
            }
          }
          if ("force" in formData.formInfo[0]) {
            for (let i = 0; i < formLength; i++) {
              formData.formInfo[i].isForce = formData.formInfo[i].force;
              delete formData.formInfo[i].force;
            }
          }
          if ("limit" in formData.formInfo[0]) {
            for (let i = 0; i < formLength; i++) {
              formData.formInfo[i].isLimit = formData.formInfo[i].limit;
              delete formData.formInfo[i].limit;
            }
          }
          if ("duration" in formData.formInfo[0]) {
            for (let i = 0; i < formLength; i++) {
              formData.formInfo[i].isDuration = formData.formInfo[i].duration;
              delete formData.formInfo[i].duration;
            }
          }
          if ("detail" in formData.formInfo[0]) {
            for (let i = 0; i < formLength; i++) {
              formData.formInfo[i].isNote = formData.formInfo[i].detail;
              delete formData.formInfo[i].detail;
            }
          }
          formLinkedList = Util.toLinkedList(formData.formInfo);
          formData.formInfo = formLinkedList.toList();
          cnt = formLinkedList.length;
          //console.log(fi)
          that.setData({
            formList: formData,
          });
          wx.hideLoading();
        });
    },
  },
  methods: {
    // 打开底部按钮
    buttonOpen(e) {
      console.log("buttonChange", e.currentTarget.id);
      ID = e.currentTarget.id;
      this.setData({
        button: true,
      });
    },
    buttonClose() {
      this.setData({
        button: false,
      });
    },
    //左侧导航的开关函数
    offCanvas: function (e) {
      //console.log(e.currentTarget.id);
      let formItem = {
        ID: 0,
        type: "",
        label: "",
        text: "",
        force: false,
        detail: "",
        page: 0,
      };
      this.setData({
        open: !this.data.open,
      });
      if (e.currentTarget.id == -1) {
        formItem.ID = parseInt(e.currentTarget.id);
        formItem.type = "title";
        formItem.label = this.data.formList.fieldName;
        formItem.option = [];
        this.setData({
          formItem,
        });
        return;
      }
      //console.log(this.data.formList.formInfo)
      if (this.data.open) {
        ID = parseInt(e.currentTarget.id);
        this.setData({
          ID,
        });
        console.log(ID);
        formItem = this.data.formList.formInfo[ID];
        this.setData({
          formItem,
        });
        if (formItem.type == "radio" || formItem.type == "checkbox") {
          //拼接两个textarea框
          let data = this.data.formList.formInfo[ID].option;
          if (formItem.detail) {
            let textd = data
              .reduce(function (preValue, n) {
                //若存在备注则拼接
                preValue += n.detail ? n.detail : "备注";
                preValue += "\n";
                return preValue;
              }, "")
              .slice(0, -1);
            this.setData({
              textd,
            });
          }
        }
      }
    },

    /**
     * 组件相关函数--子传父触发
     */

    // 1.监听选项修改
    optionChange(e) {
      // e.detail中存放子传父的数据
      var that = this;
      console.log(e.detail);
      let data = e.detail;
      delete data.ID;
      formLinkedList.update(ID, data);
      let formInfo = formLinkedList.toList();
      console.log(formInfo);
      let addList = "formList.formInfo";
      this.setData({
        [addList]: formInfo,
      });
    },

    /*
  第二层按钮的四个方法
  */
    up: function (e) {
      console.log("ID", ID, "cnt", cnt);
      formLinkedList.goUp(ID);
      let formInfo = formLinkedList.toList();
      var addList = "formList.formInfo";
      //console.log(formInfo);
      this.setData({
        [addList]: formInfo,
      });
      ID = ID - 1;
    },

    down: function (e) {
      console.log("ID", ID, "cnt", cnt);
      formLinkedList.goDown(ID);
      let formInfo = formLinkedList.toList();
      var addList = "formList.formInfo";
      //console.log(formInfo);
      this.setData({
        [addList]: formInfo,
      });
      ID = ID + 1;
    },

    copy: function (e) {
      console.log("ID", ID, "cnt", cnt);
      formLinkedList.copy(ID);
      let formInfo = formLinkedList.toList();
      var addList = "formList.formInfo";
      //console.log(formInfo);
      this.setData({
        [addList]: formInfo,
      });
      cnt = formLinkedList.length;
    },

    delete: function (e) {
      console.log("ID", ID, "cnt", cnt);
      formLinkedList.removeAt(ID);
      let formInfo = formLinkedList.toList();
      var addList = "formList.formInfo";
      //console.log(formInfo);
      this.setData({
        [addList]: formInfo,
        button: false,
      });
      cnt = formLinkedList.length;
    },
    /*
  向表单末尾添加组件
  */
    addAll: function (e) {
      //console.log(e.currentTarget.id);
      var addItem = {
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
        option: [], // 选项列表
      };
      //添加种类
      addItem.type = e.currentTarget.id;
      //个性添加
      if (addItem.type == "text") {
        addItem.label = "输入组件";
      } else if (addItem.type == "radio" || addItem.type == "checkbox") {
        var data = [
          {
            ID: 0,
            checked: false,
            limit: 0,
            duration: 0,
            detail: "",
            bookingNum: 0,
            name: "选项一",
          },
          {
            ID: 1,
            checked: false,
            limit: 0,
            duration: 0,
            detail: "",
            bookingNum: 0,
            name: "选项二",
          },
        ];
        addItem.option = data;
        addItem.label = addItem.type == "radio" ? "单选组件" : "多选组件";
      } else if (addItem.type == "describe") {
        addItem.label = "这是一段文本描述";
      }
      //加入现有队列，concat为拼接方法
      formLinkedList.append(addItem);
      let formInfo = formLinkedList.toList();
      var addList = "formList.formInfo";
      this.setData({
        [addList]: formInfo,
        checked: false,
      });
    },

    /*
  展开添加组件选项
  */
    add: function () {
      this.setData({
        checked: !this.data.checked,
      });
    },

    /*
  提交编辑好的表单
  */
    submit: function () {
      var that = this;
      wx.showModal({
        title: "提交表单",
        content: "确定要提交表单吗？",
        showCancel: true, //是否显示取消按钮
        cancelText: "否", //默认是“取消”
        //cancelColor: 'skyblue', //取消文字的颜色
        confirmText: "是", //默认是“确定”
        //confirmColor: 'skyblue', //确定文字的颜色
        success: function (res) {
          if (res.cancel) {
            //点击取消,默认隐藏弹框
          } else {
            //点击确定
            wx.showLoading({
              title: "加载中",
            });
            let inf = that.data.formList.formInfo;
            var initList = [["姓名", "手机号", "学号", "QQ号", "校区"]];
            for (let i = 0; i < cnt; i++) {
              if (
                inf[i].type === "text" ||
                inf[i].type === "radio" ||
                inf[i].type === "checkbox"
              ) {
                initList[0].push(inf[i].label);
              }
            }
            initList[0].push("openid");
            initList[0].push("志愿时长");
            initList[0].push("备注");
            //console.log(initList)
            wx.cloud.callFunction({
              name: "uploadform",
              data: {
                formInfo: inf,
                title: that.data.title,
                fieldName: that.data.formList.fieldName,
              },
              success: function (res) {
                //console.log(res)
                wx.cloud.callFunction({
                  name: "InitSignUp",
                  data: {
                    title: that.data.title,
                    list: initList,
                  },
                  success: function (res) {
                    wx.hideLoading();
                    wx.showModal({
                      title: "发布成功",
                      content: "成功发布表单",
                      showCancel: false,
                      success: function (res) {
                        wx.redirectTo({
                          url: "../Manage",
                        });
                      },
                    });
                  },
                  fail: function (res) {
                    wx.hideLoading();
                    wx.showModal({
                      title: "发布失败",
                      content: "数据库初始化失败",
                      showCancel: false,
                    });
                  },
                });
              },
            });
          }
        },
        fail: function (res) {}, //接口调用失败的回调函数
        complete: function (res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
      });
    },
  },
});
