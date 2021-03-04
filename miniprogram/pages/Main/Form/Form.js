// pages/forms/forms.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
let watcher = null; //监听事件
let getName, getPhone, getPersonNum, getQQNum, getCampus; //person集合获取的信息
let uploadList = [], //总上传数据
  listItem = []; //一个人的信息
let qqNum;
let isPress = false;
Component({
  properties: {
    qqNum: {
      type: String,
      value: "",
    },
    title: {
      type: String,
      value: "",
    },
    signUpTime: {
      type: String,
      value: "",
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    formList: {},
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  lifetimes: {
    attached() {
      this.loading = this.selectComponent("#loading");
      this.loading.showLoading();
      console.log(this.properties);
      //console.log(properties.title, properties.signUpTime)
      qqNum = this.properties.qqNum;
      console.log("flag");
      console.log(qqNum);
      //console.log(qqNum)
      let that = this;
      // -----------获取个人信息--------------
      getName = app.globalData.name;
      getPhone = app.globalData.phone;
      getPersonNum = app.globalData.personNum;
      getQQNum = app.globalData.qqNum;
      getCampus = app.globalData.campus;
      // -----------获取表单数据-----------
      db.collection("form")
        .where({
          title: this.properties.title,
        })
        .get()
        .then((res) => {
          console.log(res.data);
          that.loading.hideLoading();
          // -----------表单数据增加字段-----------
          res.data[0].formInfo = res.data[0].formInfo.map(function (n) {
            n.choose = [];
            n.input_text = [];
            return n;
          });
          that.setData({
            formList: res.data[0],
          });
          // -----------同步调用了监听方法-----------
          that.watch();
        })
        .catch((err) => {
          that.loading.hideLoading();
          wx.showModal({
            title: "错误",
            content: "获取记录失败,请检查网络或反馈给管理员",
            showCancel: false,
          });
        });
    },
  },
  methods: {
    watch: function () {
      // -----------watcher是一个页面监听事件-----------
      // -----------目的是实时修改页面中选项的“剩余数量”-----------
      let that = this;
      watcher = db
        .collection("form")
        .where({
          title: that.data.formList.title,
        })
        .watch({
          onChange: function (snapshot) {
            let download = snapshot.docs[0];
            //修改页面中
            let itemi = download.formInfo;
            let di = itemi.length;
            for (let j = 0; j < di; j++) {
              let itemj = itemi[j];
              if (itemj.limit) {
                let itemk = itemj.data;
                let kl = itemk.length;
                for (let k = 0; k < kl; k++) {
                  let limit = itemk[k].limit;
                  let target =
                    `formList.formInfo[` + j + `].data[` + k + `].limit`;
                  that.setData({
                    [target]: limit,
                  });
                }
              }
            }
          },
          onError: function (err) {
            wx.showModal({
              title: "错误",
              content: "获取记录失败,请检查网络或反馈给管理员",
              showCancel: false,
            });
          },
        });
    },
    childChange: function (e) {
      // 当组件内容改变时运行的方法，即文本框输入与单选多选
      // console.log(e)
      let type = e.detail.type;
      let input_text = e.detail.input_text;
      let ID = e.detail.ID;
      let addList = "formList.formInfo[" + ID + "].";
      if (type == "checkbox" || type == "radio") {
        let choose = e.detail.choose;
        let addPath = addList + "choose";
        this.setData({
          [addPath]: choose,
        });
      }
      let addPath = addList + "input_text";
      this.setData({
        [addPath]: input_text,
      });
    },
    getInputValue: function () {
      if (isPress) {
        return
      }
      isPress = true
      // -----------最后进行数据处理并且上传的方法-----------
      this.setData({
        loading: true,
      });
      this.loading._showLoading()

      // -----------个人信息的push-----------
      listItem = []
      listItem.push(getName);
      listItem.push(getPhone);
      listItem.push(getPersonNum);
      listItem.push(getQQNum);
      listItem.push(getCampus);

      // -----------初始化上传列表-----------
      let that = this;
      uploadList = [];  
      let duration = 0; // 时长
      let detail = ""; // 备注
      let limit = [[], [], []];

      // -----------开始校验-----------
      for (let key in that.data.formList.formInfo) {
        let v = that.data.formList.formInfo[key]; // 页面组件item
        console.log("v", v);
        console.log("choose", v.choose);
        if (v.limit && (v.type === "radio" || v.type === "checkbox"))
          // -----------有限制的进行筛选-----------
          v.choose = v.choose.filter(function (n) {
            let k = n.value;
            return v.data[k].limit > 0;
          });
        console.log("choose", v.choose);
        // -----------判断是否必填项为空-----------
        if (that._formValidate(v)) {
          // -----------合法情况-----------
          //console.log(v.choose)
          let input = v.input_text;
          if (v.type === "div" || v.type === "describe") continue;
          // -----------选项拼接-----------
          else if (v.type === "radio" || v.type === "checkbox") {
            if (v.isLimit) {
              console.log(limit);
              limit[0] = limit[0].concat(
                v.choose.reduce(function (preValue, n) {
                  preValue.push(n.ID);
                  return preValue;
                }, [])
              );
              limit[1] = limit[1].concat(
                v.choose.reduce(function (preValue, n) {
                  preValue.push(n.value);
                  return preValue;
                }, [])
              );
              limit[2] = limit[2].concat(
                v.choose.reduce(function (preValue, n) {
                  preValue.push(n.duration);
                  return preValue;
                }, [])
              );
            }
            // -----------转化拼接多选-----------
            if (v.choose && (v.type === "checkbox" || v.type === "radio")) {
              let instr = v.choose.reduce(function (preValue, n) {
                return preValue + n.input_text + ";";
              }, "");
              listItem.push(instr);
            }
          } //对于input组件
          else listItem.push(input);

          //计算时长，添加时间备注
          if (v.isDuration)
            duration += v.choose.reduce(function (preValue, n) {
              return preValue + n.duration;
            }, 0);

          if (v.isNote) {
            for (let i = 0; i < v.choose.length; i++) {
              let m = v.choose[i].value;
              detail = detail + v.option[m].detail + ";";
            }
          }
        } else {
          //不合法情况
          //页面初始化
          that.setData({
            loading: false,
          });
          listItem = [];
          return 0;
        }
      }
      //合法性检验完毕
      //本地防线，如果没有时长则不允许提交（删除）
      console.log(listItem);
      // if (duration == 0) {
      //   that.setData({
      //     loading: false,
      //   });
      //   wx.showModal({
      //     title: "错误",
      //     content: "必选项不能为空",
      //     showCancel: false,
      //   });
      //   listItem = [];
      //   //that.watch();
      //   this.loading.hideLoading()
      //   return;
      // }
      listItem.push(app.globalData.openid);
      listItem.push(duration);
      listItem.push(detail);
      console.log(limit);
      console.log(listItem);
      uploadList.push(listItem);
      wx.cloud.callFunction({
        name: "uploadData",
        data: {
          title: that.data.formList.title,
          signUpTime: that.data.signUpTime,
          list: uploadList,
          limit: limit,
        },
        success: function (res) {
          //console.log(res)
          uploadList = [];
          console.log(res);
          if (res.result === "error") {
            wx.showModal({
              title: "错误",
              content: "您所选择的部分名额已满，请重新选择！！",
              showCancel: false,
              success: function (res) {
                that.setData({
                  loading: false,
                });
              },
            });
            //that.watch();
            isPress = false
            that.loading.hideLoading()
            return;
          } else {
            //发送订阅消息
            wx.cloud.callFunction({
              name: "Signup",
              data: {
                title: that.data.formList.title,
                openid: app.globalData.openid,
                date: detail,
                detail: "QQ群" + qqNum,
              },
              success: function (res) {
                that.setData({
                  loading: false,
                });
                that.loading.hideLoading()
                isPress = false,
                //成功提示
                wx.redirectTo({
                  url: "/pages/Main/Tip/Tip?qqNum=" + qqNum,
                });
              /*
                wx.showModal({
                  title: "提交成功",
                  content:
                    "请留意微信消息，并加入\nqq群:" + qqNum + "\n以便志愿开展",
                  showCancel: false,
                  
                  success: function () {
                    wx.redirectTo({
                      url: "/pages/Main/Tip/Tip?qqNum=" + qqNum,
                    });
                  },
                });*/
              },
            });
          }
        },
        fail: function () {
          that.setData({
            loading: false,
          });
          wx.showModal({
            title: "上传信息错误",
            content: "请检查网络或重新提交",
            showCancel: false,
          });
          uploadList = [];
          //that.watch();
        },
      });
    },
    _formValidate: function (item) {
      //-----------进行输入校验-----------
      if (item.isForce) {
        //-----------获取验证类型和验证方式-----------
        let { type, value } = item.role;
        //console.log('value', value);
        if (type === "reg") {
          //正则表达式
          value = util.vbind(value);
          return false;
          if (value.test(item.input_text)) {
            return true;
          } else {
            let { msg } = item.role;
            if (!msg) {
              msg = item.label + "不合法";
            }
            console.log(msg);
            wx.showToast({
              title: msg,
              icon: "none",
            });
            return false;
          }
        }
        //-----------目前只会判断非空，此时input_text格外有用-----------
        if (type === "notnull") {
          if (item.input_text.length == 0) {
            let { msg } = item.role;
            if (!msg) {
              msg = item.label + "不为空";
            }
            wx.showToast({
              title: msg,
              icon: "none",
            });
            return false;
          } else return true;
        }
      }
      return true;
    },
  },
});
