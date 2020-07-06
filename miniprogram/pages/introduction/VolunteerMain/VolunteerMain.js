// pages/detail/detail.js
var app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageSrc: "",
        title: "",
        text: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //console.log(options.id)
        var that = this
        var indexId = options.id
            //  调用login云函数获取openid
        db.collection('test').doc(options.id).get({
            success: function(res) {
                // res.data 包含该记录的数据
                //console.log(res)
                that.setData({
                    imageSrc: res.data.imageSrc,
                    title: res.data.title,
                    text: res.data.text,
                    text2: res.data.text2,
                    text3: res.data.text3,
                    text4: res.data.text4
                })
                wx.hideLoading()
            },
            //  未查到数据时调用
            fail: function(res) {
                wx.hideLoading()
                console.log(indexId)
                wx.showModal({
                    title: '错误',
                    content: '没有找到记录',
                    showCancel: false
                })
            }
        })

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