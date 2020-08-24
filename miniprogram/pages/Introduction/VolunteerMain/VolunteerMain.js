// pages/detail/detail.js
var app = getApp();
const db = wx.cloud.database();
Component({
  properties: {
    id: {
      type: String,
      value: "",
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    baseUrl:
      "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i-1300053277/志愿项目-内部展示/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  attached() {
    //console.log(options.id)
    let that = this;
    let id = this.properties.id;
    //  调用login云函数获取openid
    db.collection("introduction")
      .doc(id)
      .get()
      .then((res) => {
        //console.log(res)
        that.setData({
          imageSrc: res.data.imageSrc,
          title: res.data.title,
          text: res.data.text,
          text2: res.data.text2,
          text3: res.data.text3,
          text4: res.data.text4,
        });
        wx.hideLoading();
      })
      .catch((err) => {
        console.log(err);
        wx.hideLoading();
        wx.showModal({
          title: "错误",
          content: "没有找到记录",
          showCancel: false,
        });
      });
  },
});
