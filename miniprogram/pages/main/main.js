// pages/main/main.js
var app = getApp();
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     * 
     */

    data: {
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        wx.showLoading({
            title: '请稍后',
            mask: true,
        })
        wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
                //获取openid并赋值给全局变量
                app.globalData.openid = res.result.openid
                console.log(app.globalData)
                    //主页轮播图地址
                db.collection('main')
                    .get({
                        success: function(res) {
                            //console.log(res.data)
                            that.setData({
                                list: res.data
                            })
                            wx.hideLoading()
                        },
                        //  未查到数据时调用
                        fail: function(res) {
                            wx.hideLoading();
                            wx.showModal({
                                title: '错误',
                                content: '没有找到记录，请检查网络或重启小程序',
                                showCancel: false
                            })
                        }
                    })
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败，请检查网络或重启小程序', err)
                wx.hideLoading()
            }
        })


    },
    update: function(e) {
        wx.navigateTo({
            url: '../update/update',
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
        });
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