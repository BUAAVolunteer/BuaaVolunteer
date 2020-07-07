// pages/about/about.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        person_list: [{}],
        volunteer_list: [{}],
        admin: 0
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
        var that = this
        db.collection('person').where({
                _openid: app.globalData.openid,
            })
            .get({
                success: function(res) {
                    if (res.data.length == 0) {
                        wx.hideLoading()
                        wx.showModal({
                            title: '您尚未注册',
                            content: '请先填写必要信息后再查看个人信息',
                            showCancel: false,
                            success: function() {
                                wx.redirectTo({
                                    url: '../person/person',
                                })
                            },

                        })
                    } else {
                        /**获取个人信息 */
                        //console.log(res.data[0])
                        wx.hideLoading()
                        var a = res.data[0].history.reverse()
                        that.setData({
                            volunteer_list: a
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