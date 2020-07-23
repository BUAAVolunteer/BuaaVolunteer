// pages/edit/edit.js
import Util from "../../../utils/util";
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
var formConfig;
var cnt = 0; //index plus with item grow
var ID, IDitem; //index of change item
var formLinkedList; //表单对应链表
Component({
  properties:{
    title:{
      type:String,
      value: ''
    }
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

  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    created() {
      let title = this.properties.title
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
      if (e.currentTarget.id == -1) {
        formItem.ID = parseInt(e.currentTarget.id);
        formItem.type = "title";
        formItem.label = this.data.formList.fieldName;
        formItem.open = true;
        this.setData({
          formItem,
        });
        return;
      }
      this.setData({
        open: !this.data.open,
      });
      //console.log(this.data.formList.formInfo)
      if (this.data.open) {
        ID = parseInt(e.currentTarget.id);
        this.setData({
          ID,
        });
        console.log(ID);
        formItem.type = this.data.formList.formInfo[ID].type;
        formItem.label = this.data.formList.formInfo[ID].label;
        formItem.describe = this.data.formList.formInfo[ID].text;
        formItem.isForce = this.data.formList.formInfo[ID].force;
        formItem.isLimit = this.data.formList.formInfo[ID].limit;
        formItem.isDuration = this.data.formList.formInfo[ID].duration;
        formItem.isNote = this.data.formList.formInfo[ID].detail;
        formItem.option = this.data.formList.formInfo[ID].data;
        this.setData({
          formItem,
        });
        if (formItem.type == "radio" || formItem.type == "checkbox") {
          //拼接两个textarea框
          let data = this.data.formList.formInfo[ID].data;
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
      data.data = data.option;
      delete data.option;
      formLinkedList.update(ID, data);
      let formInfo = formLinkedList.toList();
      console.log(formInfo);
      let addList = "formList.formInfo";
      this.setData({
        [addList]: formInfo,
      });
      // 这是原本的改变代码，仅供参考
      /*let addList = "formList.formInfo[" + ID + "].";
      addl = addList + "data";
      this.setData({
        [addl]: data,
      });
      let addl = addList + "limit";
      if (flagl)
        this.setData({
          [addl]: true,
        });
      else
        this.setData({
          [addl]: false,
        });
      addl = addList + "duration";
      if (flagd)
        this.setData({
          [addl]: true,
        });
      else
        this.setData({
          [addl]: false,
        }); */
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
        label: "",
        type: "",
        text: "",
        placeholder: "",
        data: [],
        role: {
          type: "",
          value: "",
          msg: "",
        },
        force: false,
        limit: false,
        duration: false,
        detail: false,
      };
      //添加种类
      addItem.type = e.currentTarget.id;
      //个性添加
      if (addItem.type == "text") {
        addItem.label = "输入组件";
      } else if (addItem.type == "radio" || addItem.type == "checkbox") {
        var data = [
          {
            id: 0,
            checked: false,
            limit: 0,
            duration: 0,
            detail: "",
            bookingNum: 0,
            name: "选项一",
          },
          {
            id: 1,
            checked: false,
            limit: 0,
            duration: 0,
            detail: "",
            bookingNum: 0,
            name: "选项二",
          },
        ];
        addItem.data = data;
        addItem.label = addItem.type == "radio" ? "单选组件" : "多选组件";
      } else if (addItem.type == "describe") {
        addItem.text = "这是一段文本描述";
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
            for (let i = 0; i < cnt; i++) {
              inf[i].id = "t" + inf[i].id;
            }
            var inlist = [["姓名", "手机号", "学号", "QQ号", "校区"]];
            for (let i = 0; i < cnt; i++) {
              if (
                inf[i].type === "text" ||
                inf[i].type === "radio" ||
                inf[i].type === "checkbox"
              ) {
                inlist[0].push(inf[i].label);
              }
            }
            inlist[0].push("openid");
            inlist[0].push("志愿时长");
            inlist[0].push("备注");
            //console.log(inlist)
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
                    list: inlist,
                  },
                  success: function (res) {
                    wx.hideLoading();
                    wx.showModal({
                      title: "发布成功",
                      content: "成功发布表单",
                      showCancel: false,
                      success: function (res) {
                        wx.redirectTo({
                          url: "../list/list",
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
