// pages/Admin/Score/Score.js
const db = wx.cloud.database();
const _ = db.command;

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    projectPicker: [],
    operatePicker: [],
    operateList: [],
    volunteerName: "",
    volunteerPhone: "",
    volunteerDate: "",
    projectIndex: 0,
    operateIndex: 0,
    isScoreOperate: false,
    isNeedName: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    submit: function () {
      var that = this
      var project = this.data.projectPicker[this.data.projectIndex]
      var operate = this.data.operatePicker[this.data.operateIndex]
      console.log(this.data.projectIndex)
      console.log(this.data.operateIndex)
      this.hover = this.selectComponent("#msg")
      if (this.data.phone == "" || this.data.phone.length != 11) {
        that.hover.showHover({
          isMaskCancel: false,
          title:"信息错误",
          content:"请填入正确格式的手机号",
          button:[
            {
              ID: 0,
              name: "confirm",
              text: "确认",
              isAblePress: true
            }
          ]
        })
        return
      }
      if (operate == "添加内部名额") {
        this._addInnerSign(project)
      } else if (!that.data.isScoreOperate && that.data.volunteerDate == "") {
        that.hover.showHover({
          isMaskCancel: false,
          title:"选择志愿日期",
          content:"请选择对应志愿招募的日期",
          button:[
            {
              ID: 0,
              name: "confirm",
              text: "确认",
              isAblePress: true
            }
          ],
          success: res => {
            that.setData({
              isScoreOperate: !that.data.isScoreOperate
            })
          }
        })
      } else {
        this._operateScore(project, operate)
      }
      return
      wx.showLoading({
        mask: true,
      });
      var vtime = "";
      var vscore = "";
      var finding = 0;
      var that = this;
      var projectPicker = this.data.projectPicker;
      db.collection("person")
        .where({
          //根据电话和项目名称查询志愿
          phone: this.data.volunteerPhone,
        })
        .get({
          success: function (res) {
            //console.log(res)
            wx.hideLoading();
            if (res.data.length == 0) {
              wx.showModal({
                title: "未能找到志愿者",
                content: "请输入正确的志愿者和项目信息",
                showCancel: false,
              });
            } else {
              that.setData({
                volunteerName: res.data[0].name,
                volunteerPhone: res.data[0].phone,
                volunteerTime: res.data[0].duration,
                volunteerScore: res.data[0].score,
                volunteerID: res.data[0]._openid,
              });
              this.hover.showHover({
                isMaskCancel: false,
                title:"信息确认",
                content:"志愿者信息：",
                button:[
                  {
                    ID: 0,
                    name: "cancel",
                    text: "确认",
                    isAblePress: true  
                  },
                  {
                    ID: 1,
                    name: "assure",
                    text: "取消",
                    isAblePress: true
                  }
                ]
              })
            }
            wx.hideLoading();
          },
          fail: function (res) { },
        });
    },

    _addInnerSign(project) {
      var that = this
      db.collection('person').where({
        phone: that.data.volunteerPhone
      })
      .get()
      .then(res => {
        if (res.data.length == 0 || !("_openid" in res.data[0] || res.data[0].openid == "")) {
          that.hover.showHover({
            isMaskCancel: false,
            title:"志愿者未注册",
            content:"请提醒志愿者在小程序进行注册\n注册后再进行内部名额的添加",
            button:[
              {
                ID: 0,
                name: "confirm",
                text: "确认",
                isAblePress: true
              }
            ]
          })
        } else {
          that.hover.showHover({
            isMaskCancel: false,
            title:"加入内部名额",
            content:"姓名：" + res.data[0].name + "\n手机号：" + res.data[0].phone + "\n\n确定将其加入\n" + project +"\n的内部名额吗？",
            button:[
              {
                ID: 0,
                name: "yes",
                text: "是",
                isAblePress: true
              },
              {
                ID: 1,
                name: "no",
                text: "否",
                isAblePress: true
              }
            ],
            success: function(res) {
              if (res == "no") {
                return
              } else {
                wx.cloud.callFunction({
                  name: "innerSign",
                  data: {
                    title: project,
                    openid: res.data[0]._openid
                  }
                })
              }
            }
          })
        }
      })
    },

    _operateScore(project, operate) {
      var that = this
      db.collection('person').where({
        phone: that.data.volunteerPhone
      })
      .get()
      .then(res => {
        if (res.data.length == 0 && !that.data.isNeedName) {
          that.hover.showHover({
            isMaskCancel: false,
            title:"未找到志愿者",
            content:"请填写志愿者的姓名以添加志愿者",
            button:[
              {
                ID: 0,
                name: "confirm",
                text: "确认",
                isAblePress: true
              }
            ],
            success: () => {
              that.setData({
                isNeedName: true
              })
            }
          })
          return false
        } else if (that.data.isNeedName && that.data.volunteerName == "") {
          that.hover.showHover({
            isMaskCancel: false,
            title:"信息确实",
            content:"请填写志愿者的姓名",
            button:[
              {
                ID: 0,
                name: "confirm",
                text: "确认",
                isAblePress: true
              }
            ]
          })
          return false
        } else {
          let name = that.data.isNeedName ? that.data.volunteerName : res.data[0].name
          that.hover.showHover({
            isMaskCancel: false,
            title:"进行积分变动操作",
            content:"姓名：" + name + "\n手机号：" + res.data[0].phone + "\n志愿项目：" + project + "\n招募时间：" + that.data.volunteerDate + "\n积分变动：" + operate + "\n\n确认进行积分变动吗？",
            button:[
              {
                ID: 0,
                name: "yes",
                text: "是",
                isAblePress: true
              },
              {
                ID: 1,
                name: "no",
                text: "否",
                isAblePress: true
              }
            ],
            success: function(res) {
              if (res == "no") {
                return
              } else {
                let scoreOperate = that.data.operateList[that.data.operateIndex]
                wx.cloud.callFunction({
                  name: "plus",
                  data: {
                    title: project,
                    type: scoreOperate.type,
                    score: scoreOperate.score,
                    isBlackList: scoreOperate.isBlackList,
                    date: that.data.volunteerDate,
                    phone: res.data[0].phone,
                    name: name,
                    isNeedName: that.data.isNeedName,
                    date: that.data.volunteerDate
                  }
                })
              }
            }
          })
        }
      })
    },
  },

  lifetimes: {
    created() {
      wx.showLoading({
        mask: true,
      });
      var projectPicker = [];
      var that = this;
      this.hover = this.selectComponent("#msg");
      db.collection("project")
      .get()
      .then(res => {
        for (let i = 0; i < res.data.length; i++) {
          projectPicker.push(res.data[i].title);
        }
        that.setData({
          projectPicker,
        });
      })
      .then(() => {
        return db.collection('blacklist').where({
          name: "积分规则"
        })
        .get()
      })
      .then(res => {
        let operatePicker = ["添加内部名额"]
        for (let i = 0; i < res.data[0].role.length; i++) {
          operatePicker.push(res.data[0].role[i].type)
        }
        that.setData({
          operateList: res.data[0]
        })
        return operatePicker
      })
      .then(res => {
        that.setData({
          operatePicker: res,
        })
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err)
        wx.showModal({
          title: "错误",
          content: "网络出现异常，请返回上一页面后再尝试进入此页面",
          showCancel: false
        })
      })
    },
  },
});
