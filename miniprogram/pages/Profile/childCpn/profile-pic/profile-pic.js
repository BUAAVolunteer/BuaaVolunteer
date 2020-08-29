// pages/Profile/ProfilePic/ProfilePic.js
const app = getApp();
const db = wx.cloud.database();
const _ = db.command;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    headList: [], // 头像列表
    curAvatar: app.globalData.avatar,
  },
  /**
   * 组件的生命周期
   */
  created() {
    // head获取所有头像信息
    db.collection("head")
      .get()
      .then((res) => {
        let qualification = app.globalData.qualification;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].qualification == "") {
            res.data[i].isShow = true;
          } else {
            if (qualification.indexOf(res.data[i].qualification)) {
              res.data[i].isShow = false;
            }
          }
        }
        console.log(res.data);
        this.setData({
          headList: res.data,
        });
      });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 选择头像
    choosePic(e) {
      console.log(e);
      app.globalData.avatar = e.currentTarget.id;
      this.setData({
        curAvatar: e.currentTarget.id,
      });
      this.triggerEvent("closePic", e.currentTarget.id, {});
      // 缺一个，上传头像的方法
    },
    // 关闭头像页面
    closePic() {
      this.triggerEvent("closePic", "none", {});
    },
  },
});
