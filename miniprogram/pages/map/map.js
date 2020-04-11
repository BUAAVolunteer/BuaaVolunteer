// pages/map/map.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        admin: 6
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        wx.showLoading({
            title: '加载中',
        })
        let that = this
        db.collection('person').where({
                _openid: app.globalData.openid,
            })
            .get({
                success: function(res) {
                    let time = 0
                    let admin = 0
                    let score = 0
                        /**获取个人信息 */
                    console.log(score)
                    console.log(res.data[0])

                    score = res.data[0].score.toFixed(1)
                    if (score >= 0 && score <= 10)
                        admin = 1
                    else if (score > 10 && score <= 15)
                        admin = 2
                    else if (score > 15 && score <= 25)
                        admin = 3
                    else if (score > 25 && score <= 40)
                        admin = 4
                    else if (score > 40 && score <= 60)
                        admin = 5
                    else if (score > 60)
                        admin = 6
                    that.setData({
                        admin: admin
                    })
                    wx.hideLoading()



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