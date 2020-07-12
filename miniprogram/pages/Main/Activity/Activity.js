// pages/Main/Activity/Activity.js
const db = wx.cloud.database();
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

  },
  //生命周期
  lifetimes: {
    created() {
        let that = this
        wx.showLoading({
          title: '请稍后',
          mask: 'true',
      })   
      db.collection('push').get({
        success: function(res) {
            var a = res.data.reverse()
                //console.log(a)
                // res.data 包含该记录的数据
            that.setData({
                list: a
            })
            wx.hideLoading()
        },
        //  未查到数据时调用
        fail: function(res) {
            wx.hideLoading();
            wx.showModal({
                title: '错误',
                content: '没有找到记录，请检查网络或重启小程序',
                showCancel: false
            })
        }
    })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
