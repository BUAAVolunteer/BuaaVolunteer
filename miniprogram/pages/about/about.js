// pages/about/about.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
// num表示需要四舍五入的小数
// s表示需要保留几位小数
function toFixed(num, s) {
    var times = Math.pow(10, s);
    if (num < 0) {
        num = Math.abs(num); //先把负数转为正数，然后四舍五入之后再转为负数
        var des = parseInt((num * times + 0.5), 10) / times;
        return -des;
    } else {
        var des = parseInt((num * times + 0.5), 10) / times;
        return des;
    }
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        person_list: [{}],
        volunteer_list: [{}],
        admin: 0,
        totaltime: 0,
        totalscore: 0,
        current: 0,
        register: 0
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
                    //console.log(res.data)
                    let data = res.data
                    if (data.length == 0 || !data[0].campus || !data[0].qqnum) {
                        wx.hideLoading()
                        that.setData({
                                register: 1
                            })
                            //console.log("reg", that.data.register)
                    } else {
                        that.setData({
                            register: 0
                        })
                        var time = 0
                        var score = 0
                            //管理员判断
                            // console.log(score)
                            // db.collection('admin').where({
                            //         _openid: app.globalData.openid,
                            //     })
                            //     .get({
                            //         success: function(res) {
                            //             
                            //             if (res.data.length == 0) {
                            //                 that.setData({
                            //                     admin: 0
                            //                 })
                            //             } else {
                            //                 that.setData({
                            //                     admin: 1
                            //                 })
                            //             }

                        //         }
                        //     })
                        wx.hideLoading()
                        that.setData({
                            person_list: res.data,
                            totalscore: res.data[0].score.toFixed(1),
                            totaltime: res.data[0].time
                        })

                        //console.log(res.data[0].phone - '0')



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
    admin: function() {
        db.collection('admin').where({
                _openid: app.globalData.openid,
            })
            .get({
                success: function(res) {
                    if (res.data.length == 0) {
                        wx.showToast({
                            title: '这里是小咕的秘密基地哦！不能让你进来的啦QAQ',
                            icon: 'none'
                        })
                    } else {
                        wx.navigateTo({
                            url: '../admin/admin',
                            success: (result) => {

                            },
                            fail: () => {},
                            complete: () => {}
                        });
                    }
                }
            })
    },
    program_open: function() {
        var that = this;
        that.setData({
            current: 1 - this.data.current
        });
    },
    secret: function() {
        db.collection('admin').where({
                _openid: app.globalData.openid,
            })
            .get({
                success: function(res) {
                    if (res.data.length == 0) {
                        wx.showToast({
                            title: '这里也是小咕的秘密基地！',
                            icon: 'none'
                        })
                    } else {
                        wx.navigateTo({
                            url: '../secret/secret',
                            success: (result) => {

                            },
                            fail: () => {},
                            complete: () => {}
                        });
                    }
                }
            })

    },
    surprise: function() {
        wx.showModal({
            title: '这也许是一个彩蛋',
            content: '隔壁北邮小程序都5.0了\n不开心！T_T',
            showCancel: false,
        })
    },
    score: function() {
        var score = this.data.totalscore
        if (score <= -10) {
            wx.showModal({
                title: '警告',
                content: '您的积分已达到惩罚线，6个月内无法继续参与蓝协志愿。',
                showCancel: false,
            })
        } else if (score > -10 && score < 0) {
            wx.showModal({
                title: '警告',
                content: '请注意志愿服务的行为规范，否则您将无法继续参与蓝协志愿。',
                showCancel: false,
            })
        } else if (score >= 0 && score <= 10) {
            wx.showModal({
                title: '志愿者星级',
                content: '恭喜您成为一星志愿者！',
                showCancel: false,
            })
        } else if (score > 10 && score <= 15) {
            wx.showModal({
                title: '志愿者星级',
                content: '恭喜您成为二星志愿者！',
                showCancel: false,
            })
        } else if (score > 15 && score <= 25) {
            wx.showModal({
                title: '志愿者星级',
                content: '恭喜您成为三星志愿者！',
                showCancel: false,
            })
        } else if (score > 25 && score <= 40) {
            wx.showModal({
                title: '志愿者星级',
                content: '恭喜您成为四星志愿者！',
                showCancel: false,
            })
        } else if (score > 40 && score <= 60) {
            wx.showModal({
                title: '志愿者星级',
                content: '恭喜您成为五星志愿者！',
                showCancel: false,
            })
        } else if (score > 60) {
            wx.showModal({
                title: '志愿者星级',
                content: '恭喜您成为六星志愿者！',
                showCancel: false,
            })
        }

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