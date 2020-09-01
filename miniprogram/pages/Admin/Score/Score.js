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
   * 组件的生命周期
   */
  lifetimes: {
    created() {
      this.loading = this.selectComponent('#loading')
      this.loading.showLoading();
      var projectPicker = [];
      var that = this;
      this.hover = this.selectComponent("#msg");
      wx.cloud.callFunction({
        name: "GetProject",
        data: {}
      })
      .then(res => {
        for (let i = 0; i < res.result.data.length; i++) {
          projectPicker.push(res.result.data[i].title);
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
          operateList: res.data[0].role
        })
        return operatePicker
      })
      .then(res => {
        that.setData({
          operatePicker: res,
        })
        that.loading.hideLoading();
      })
      .catch(err => {
        console.log(err)
        that.loading.hideLoading()
        wx.showModal({
          title: "错误",
          content: "网络出现异常，请返回上一页面后再尝试进入此页面",
          showCancel: false
        })
      })
    },
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
      if (this.data.volunteerPhone == "" || this.data.volunteerPhone.length != 11) {
        wx.showToast({
          title: '请填入正确格式的手机号',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return
      }
      if (operate == "添加内部名额") {
        this._addInnerSign(project)
      } else if (!that.data.isScoreOperate && that.data.volunteerDate == "") {
        wx.showToast({
          title: '请选择对应志愿招募的日期',
          icon: 'none',
          duration: 1500,
          mask: false,
          success: res => {
            that.setData({
              isScoreOperate: !that.data.isScoreOperate
            })
          }
        });
      } else if (that.data.isNeedName && that.data.volunteerName == "") {
        wx.showToast({
          title: '请填写志愿者的姓名',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        return false
      } else {
        this._operateScore(project, operate)
      }
    },

    _addInnerSign(project) {
      var that = this
      this.loading._showLoading()
      db.collection('person').where({
        phone: that.data.volunteerPhone
      })
      .get()
      .then(res => {
        if (res.data.length == 0 || !("_openid" in res.data[0] || res.data[0].openid == "")) {
          that.loading.hideLoading()
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
          that.loading.hideLoading()
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
            success: function(answer) {
              if (answer == "no") {
                return
              } else {
                that.loading._showLoading()
                wx.cloud.callFunction({
                  name: "innerSign",
                  data: {
                    title: project,
                    openid: res.data[0]._openid
                  }
                })
                .then(() => {
                  that.loading.hideLoading()
                  wx.showToast({
                    title: '已成功加入内部名额',
                    icon: 'none',
                    duration: 2000,
                    mask: false,
                  });
                })
                .catch(err => {
                  console.log(err)
                  that.loading.hideLoading()
                  that.hover.showHover({
                    isMaskCancel: false,
                    title:"加入内部名额",
                    content:"加入内部名额失败\n请检查网络并重试",
                    button:[
                      {
                        ID: 0,
                        name: "confirm",
                        text: "确认",
                        isAblePress: true
                      }
                    ],
                  })
                })
              }
            }
          })
        }
      })
    },

    _operateScore(project, operate) {
      var that = this
      this.loading._showLoading()
      db.collection('person').where({
        phone: that.data.volunteerPhone
      })
      .get()
      .then(res => {
        if (res.data.length == 0 && !that.data.isNeedName) {
          that.loading.hideLoading()
          that.hover.showHover({
            isMaskCancel: false,
            title:"未找到志愿者",
            content:"确认志愿者手机号填写无误吗？",
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
            success: res => {
              if (res === "no") {
                return
              } else {
                wx.showToast({
                  title: '请填写志愿者姓名',
                  icon: 'none',
                  duration: 2000,
                  mask: false,
                  success: () => {
                    that.setData({
                      isNeedName: true
                    })
                  }
                });
              }
            }
          })
          return false
        } else {
          that.loading.hideLoading()
          let name = that.data.isNeedName ? that.data.volunteerName : res.data[0].name
          that.hover.showHover({
            isMaskCancel: false,
            title:"进行积分变动操作",
            content:"姓名：" + name + "\n手机号：" + that.data.volunteerPhone + "\n志愿项目：" + project + "\n招募时间：" + that.data.volunteerDate + "\n积分变动：" + operate + "\n\n确认进行积分变动吗？",
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
            success: function(answer) {
              if (answer == "no") {
                return
              } else {
                that.loading._showLoading()
                let scoreOperate = that.data.operateList[that.data.operateIndex - 1]
                console.log(that.data.operateList)
                console.log(that.data.operateIndex)
                console.log(scoreOperate)
                wx.cloud.callFunction({
                  name: "plus",
                  data: {
                    title: project,
                    type: scoreOperate.type,
                    score: scoreOperate.score,
                    isBlackList: scoreOperate.isBlackList,
                    date: that.data.volunteerDate,
                    phone: that.data.volunteerPhone,
                    name: name,
                    isNeedName: that.data.isNeedName,
                    date: that.data.volunteerDate
                  }
                })
                .then(() => {
                  that.loading.hideLoading()
                  wx.showToast({
                    title: '积分变动操作成功！',
                    icon: 'none',
                    duration: 2000,
                    mask: false
                  });
                })
                .catch(err => {
                  console.log(err)
                  that.loading.hideLoading()
                  that.hover.showHover({
                    isMaskCancel: false,
                    title:"积分变动",
                    content:"积分变动失败\n请检查网络并重试",
                    button:[
                      {
                        ID: 0,
                        name: "confirm",
                        text: "确认",
                        isAblePress: true
                      }
                    ],
                  })
                })
              }
            }
          })
        }
      })
    },
  },
});
