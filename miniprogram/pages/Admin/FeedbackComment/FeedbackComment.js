// pages/Admin/FeedbackComment/FeedbackComment.js
const db = wx.cloud.database();
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    comment_list: [],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    deleteItem(e) {
      let index = parseInt(e.currentTarget.id);
      let _id = this.data.comment_list[index]._id;
      let list = this.data.comment_list;
      list.splice(index, 1);
      db.collection("feedback")
        .doc(_id)
        .remove()
        .then((e) => {
          this.setData({
            comment_list: list,
          });
        });
    },
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    created() {
      db.collection("feedback")
        .get()
        .then((e) => {
          let comment_list = e.data.map((n) => {
            n.open = false;
            return n;
          });
        // console.log(comment_list);
          this.setData({
            comment_list,
          });
        });
    },
  },
});
