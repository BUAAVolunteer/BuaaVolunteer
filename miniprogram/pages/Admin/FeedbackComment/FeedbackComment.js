// pages/Admin/FeedbackComment/FeedbackComment.js
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

  /**
   * 组件的方法列表
   */
  methods: {

  },

  lifetimes: {
    created() {
      db.collection('feedback')
        .get().then(e => {
          console.log(e)//奇奇怪怪不能引用
          this.setData({
            comment_list: e.data
          })
        })
    }
  }
})
