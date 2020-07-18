// pages/edit/edit.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
var formConfig;
var cnt = 0; //index plus with item grow
var ID, IDitem; //index of change item
Page({
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
  onLoad: function (options) {
    wx.showLoading({
      title: "加载中",
    });
    var that = this;
    let formData = {};
    this.setData({
      title: options.title,
    });
    db.collection("form")
      .where(
        _.or([
          {
            title: options.title,
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
              title: options.title,
              fieldName: options.title,
            },
          });
        } else {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].title === options.title) {
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
            title: options.title,
          })
          .get();
      })
      .then((res) => {
        if (res.data.length == 0) {
          db.collection("signUp").add({
            data: {
              title: options.title,
              list: [],
            },
          });
        }
      })
      .then(() => {
        let formLength = formData.formInfo.length;
        for (let i = 0; i < formLength; i++) {
          formData.formInfo[i].id = formData.formInfo[i].id.slice(1);
        }
        //console.log(fi)
        that.setData({
          formList: formData,
        });
        wx.hideLoading();
      });
  },
  // 打开底部按钮
  buttonOpen(e) {
    console.log("buttonChange",e.currentTarget.id);
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
    console.log(e.detail);
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
  entertd: function (e) {
    let that = this;
    let detail = e.detail.value.split("\n");
    let detLength = detail.length;
    if (detLength > that.data.la) {
      wx.showModal({
        title: "错误提示",
        content: "请确保备注个数不要大于选项个数相同，换行即为分隔",
        showCancel: false, //是否显示取消按钮
        //cancelText: "否", //默认是“取消”
        //cancelColor: 'skyblue', //取消文字的颜色
        confirmText: "我知道了", //默认是“确定”
        //confirmColor: 'skyblue', //确定文字的颜色{
      });
      return;
    }
    var addList = "formList.formInfo[" + ID + "].data";
    for (var i = 0; i < detLength; i++) {
      var addl = addList + "[" + i + "].detail";
      that.setData({
        [addl]: detail[i],
      });
    }
  },
  delete: function (e) {
    var that = this;
    let formInfo = that.data.formList.formInfo;
    //console.log('ID', ID, 'cnt', cnt)
    for (var i = ID + 1; i < cnt; i++) formInfo[i].id = formInfo[i].id - 1;
    formInfo.splice(ID, 1);
    var addList = "formList.formInfo";
    //console.log(formInfo);
    this.setData({
      [addList]: formInfo,
      checked: false,
      open: false,
      type: "",
    });
    cnt = cnt - 1;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  addAll: function (e) {
    //console.log(e.currentTarget.id);
    var additem = {
      label: "",
      type: "",
      id: "",
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
    additem.type = e.currentTarget.id;
    //记录顺位
    additem.id = cnt.toString();
    cnt = cnt + 1;
    //个性添加
    if (additem.type == "text") {
      additem.label = "输入组件";
    } else if (additem.type == "radio" || additem.type == "checkbox") {
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
      additem.data = data;
      additem.label = additem.type == "radio" ? "单选组件" : "多选组件";
    } else if (additem.type == "describe") {
      additem.text = "这是一段文本描述";
    }
    //加入现有队列，concat为拼接方法
    let list = [];
    list.push(additem);
    let formInfo = this.data.formList.formInfo;
    var addList = "formList.formInfo";
    this.setData({
      [addList]: formInfo.concat(list),
      checked: false,
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */

  onHide: function () {},
  add: function () {
    this.setData({
      checked: !this.data.checked,
    });
  },
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
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
