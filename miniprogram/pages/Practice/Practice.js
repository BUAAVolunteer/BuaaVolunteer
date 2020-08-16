// pages/Practice/Practice.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Component({
  /**
   * 页面的初始数据
   */
  data: {
    person: {
      name: "蓝小咕",
      personNum: 66666666,
      text: "志存高远，愿惠天下",
      score: 100,
      time: 10000,
    },
  },
  methods:{
    

  },
  lifetimes: {
    created: function(){
      wx.showLoading({
        title: '加载中',
      });
      var that = this
      this.setData({
        isRegister: app.globalData.isRegister
      })
      db.collection('person').where({
        _openid: app.globalData.openid,
      })
      .get({
        success: function(res) {
          console.log(res.data)
          let data = res.data
          if (data.length == 0 || !data[0].campus || !data[0].qqnum) {
            wx.hideLoading()
            that.setData({
            isRegister: 1
            })
          } else {
            that.setData({
              isRegister: 0
            })
            wx.hideLoading()
            that.setData({
              person_list: res.data,
              totalscore: res.data[0].score.toFixed(1)
            })
          }
        },
        fail: function(res) {
          wx.hideLoading()
          wx.showModal({
            title: '错误',
            content: '获取记录失败,请检查网络或反馈给管理员',
            showCancel: false,
            })
        }
      })
    }
  }
});
