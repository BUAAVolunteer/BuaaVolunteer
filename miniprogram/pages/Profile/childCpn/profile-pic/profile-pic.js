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
    curAvator: app.globalData.avator,
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
            let flag = 1;
            for (let j = 0; j < qualification.length; j++) {
              if (qualification[j] == res.data[i].qualification) {
                res.data[i].isShow = true;
                flag = 0;
                break;
              }
            }
            if (flag) {
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
      app.globalData.avator = e.currentTarget.id;
      this.setData({
        curAvator: e.currentTarget.id,
      });
      // 缺一个，上传头像的方法
    },
  },
});
