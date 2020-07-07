// pages/comment/comment.js
const db = wx.cloud.database()
const com = db.command
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        comment_list: [{}],
        answer: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /*回复触发函数 */
    answer: function() {
        this.setData({
            answer: 1
        })
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
        db.collection('question')
            .get().then(e => {
                //console.log(e.data.title);
                this.setData({
                    comment_list: e.data
                })
                wx.hideLoading()
            })
    },
    answer: function() {

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