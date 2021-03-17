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
    baseUrl: "http://buaa-volunteer.gitee.io/buaalx/projectpic/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  attached() {
    //console.log(options.id)
    this.loading = this.selectComponent("#loading");
    this.loading.showLoading();
    let that = this;
    let id = this.properties.id;
    //  调用login云函数获取openid
    db.collection("introduction")
      .doc(id)
      .get()
      .then((res) => {
        // console.log(res);
        if (res.data.title.length > 10)
          res.data.title = res.data.title.slice(0, 10);
        let imageList = res.data.imageSrc.split("/");
        let imageSrc = that.data.baseUrl + imageList[imageList.length - 1];
        that.setData({
          imageSrc: imageSrc,
          title: res.data.title,
          text: res.data.text,
          text2: res.data.text2,
          text3: res.data.text3,
          text4: res.data.text4,
        });
        that.loading.hideLoading();
      })
      .catch((err) => {
        console.log(err);
        that.loading.hideLoading();
        wx.showModal({
          title: "错误",
          content: "没有找到记录",
          showCancel: false,
        });
      });
  },
});
