// pages/detail/detail.js
var app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        /*imageSrc: "",
        title: "",
        text: "",*/
        imageSrc: "cloud://volunteer-platform-1v92i.766f-volunteer-platform-1v92i/志愿项目/夕阳再晨.jpg",
        title: "夕阳再晨",
        text: "夕阳再晨三大怪：上课手机放在外，听课学生头发白，着急下课去做菜。没错，“夕阳再晨”科技助老项目就是一个为老年人打造的以教授智能手机操作为主要内容的项目！当老人边看你演示手机操作边记笔记时，你好像看到了你自己在数分课上慌忙却认真的样子，也能深刻感受到他们真正是需要得到帮助的人。我们付出的不仅是手机教学的时间，还有和老人们沟通的真挚耐心；收获的不仅是老人们的一句感谢，更有他们走过多少风雨之后指引我们学习与生活的暖心话语。新的一年，学院路、沙河两校区的志愿活动中心各负责一个社区运行，所以不论你身处哪个校区，都来加入我们吧！"

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        /*
        console.log(options.id)
        var that = this
        var indexId = options.id
        //  调用login云函数获取openid
        db.collection('test').doc(options.id).get({
          success: function (res) {
            // res.data 包含该记录的数据
            console.log(res)
            that.setData({
              imageSrc: res.data.imageSrc,
              title: res.data.title,
              text: res.data.text
            })
            wx.hideLoading()
          },
          //  未查到数据时调用
          fail: function (res) {
            wx.hideLoading()
            console.log(indexId)
            wx.showModal({
              title: '错误',
              content: '没有找到记录',
              showCancel: false
            })
          }
        })*/

    },

    /*获取页面*/
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})