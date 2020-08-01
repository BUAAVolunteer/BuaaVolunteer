// pages/Admin/Score/Score.js
const db = wx.cloud.database();
const _ = db.command

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    tele: "", //输入的手机号
    pickname: "", //选定的志愿名称
    picker: ["立水桥站区平安地铁志愿", "童年一课线上支教", "鲁迅博物馆讲解",
      "“夕阳再晨”智能手机教学（1号社区）", "“夕阳再晨”智能手机教学（2号社区）", "思源楼智能手机教学",
      "科技馆志愿", "国家图书馆", "中华世纪坛",
      "花园小课堂", "昌雨春童康复中心",
      "小桔灯听障儿童支教", "咿呀总动员", "CBA志愿服务",
      "中甲志愿服务", "天文馆志愿"
    ],
    volun_name: "",
    volun_phone: "",
    volun_time: "",
    volun_score: 0,
    volun_id: "",
    person_list: [{}],
    index: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    PickerChange(e) {
      //console.log(e);
      this.setData({
        index: this.data.pickname
      })
    },

    identify: function (e) {
      wx.showLoading({
        mask: true
      })
      var vtime = "";
      var vscore = "";
      var finding = 0;
      var that = this;
      var picker = this.data.picker

      db.collection('person').where({
          //根据电话和项目名称查询志愿
          phone: e.detail.value.phone
        })
        .get({
          success: function (res) {
            //console.log(res)
            wx.hideLoading()
            if (res.data.length == 0) {
              wx.showModal({
                title: '未能找到志愿者',
                content: '请输入正确的志愿者和项目信息',
                showCancel: false
              })
            } else {
              that.setData({
                'volun_name': res.data[0].name,
                'volun_phone': res.data[0].phone,
                'volun_time': res.data[0].duration,
                'volun_score': res.data[0].score,
                'volun_id': res.data[0]._openid,
              })
            }
            wx.hideLoading()
          },
          fail: function (res) {

          }
        })
    },

    plus1: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: 0.5
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '增加积分',
            content: '积分增加成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    plus2: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: 1
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '增加积分',
            content: '积分增加成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    plus3: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: 1
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '增加积分',
            content: '积分增加成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    minus1: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: -5
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '扣除积分',
            content: '积分扣除成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    minus2: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: -8
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '扣除积分',
            content: '积分扣除成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    minus3: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: -15
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '扣除积分',
            content: '积分扣除成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    minus4: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: -4
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '扣除积分',
            content: '积分扣除成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    minus5: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'plus',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
          p: -2
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '扣除积分',
            content: '积分扣除成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    },

    minus6: function (e) {
      var _id = this.data.volun_id
      var sc = this.data.volun_score
      var pl = 0
      wx.showActionSheet({
        itemList: ['1', '2', '3', '4', '5', '6'],
        success: function (res) {
          wx.showLoading({
            title: '请稍后',
            mask: 'true',
          })
          pl = 0 - pl - res.tapIndex - 1
          //console.log(pl)
          wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
              id: _id,
              basic: sc,
              p: pl
            },
            success: function (res) {
              wx.hideLoading()
              //console.log(res)
              wx.showModal({
                title: '扣除积分',
                content: '积分扣除成功',
                showCancel: false
              })
            },
            fail: console.error
          })
        },
        fail: function (res) {
          //console.log(res.errMsg)
          wx.hideLoading()
          //console.log(res)

        }
      })
    },

    inner: function (e) {
      wx.showLoading({
        title: '请稍后',
        mask: 'true',
      })
      var _id = this.data.volun_id
      var picker = this.data.picker
      var title = picker[this.data.index]
      wx.cloud.callFunction({
        // 云函数名称
        name: 'innerSign',
        // 传给云函数的参数
        data: {
          openid: _id,
          title: title,
        },
        success: function (res) {
          //console.log(res)
          wx.hideLoading()
          wx.showModal({
            title: '内部名额',
            content: '内部名额添加成功',
            showCancel: false
          })
        },
        fail: console.error
      })
    }
  },

  lifetimes: {
    created() {
      wx.showLoading({
        mask: true
      })
      var picker = [];
      var that = this;
      db.collection('project').get({
        success: function (res) {

          for (let i = 0; i < res.data.length; i++) {
            picker.push(res.data[i].title)
          }

          that.setData({
            picker: picker
          })
          wx.hideLoading()
        }
      })
    }
  }
})