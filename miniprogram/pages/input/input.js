const app = getApp()
    // pages/purchase/purchase.js
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */

    data: {
        picker: [],
        index: null,
        date1: '2019-8-28',
        date2: '2019-8-28',
        time1: '12:00'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var pick = [];
        wx.showLoading({
                title: '请稍后',
                mask: true,
            })
            /**管理员身份认证 */
        wx.cloud.callFunction({
            name: 'GetProject',
            success: function(res) {
                console.log(res)
                for (let i = 0; i < res.result.data.length; i++) {
                    pick.push(res.result.data[i].title);
                }
                pick.push("发布一个新志愿");
                that.setData({
                    picker: pick
                })
                wx.hideLoading();
            },
            fail: function(res) {
                console.log(res)
            }
        })
    },
    PickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value
        })
    },
    TimeChange(e) {
        this.setData({
            time1: e.detail.value
        })
    },
    TimeChange1(e) {
        this.setData({
            time2: e.detail.value
        })
    },
    DateChange(e) {
        this.setData({
            date1: e.detail.value
        })
    },
    DateChange1(e) {
        this.setData({
            date2: e.detail.value
        })
    },
    order_submit: function(e) {
        console.log(this.data.index)
        if (this.data.index == null) {
            console.log(e.detail.value.title)
            wx.showModal({
                title: '错误',
                content: '请选择项目名称',
                showCancel: false,
            })
            return
        }
        if (e.detail.value.textarea == "") {
            wx.showModal({
                title: '错误',
                content: '请填写志愿开展日期',
                showCancel: false,
            })
            return
        }
        var picker = this.data.picker
        wx.showLoading({
                title: '请稍后',
                mask: 'true',
            })
            //日期字符串分别赋值，然后合并
        var str = this.data.date1.split('-')
        let year = str[0]
        let month = str[1]
        let day = str[2]

        if (month.length == 1) {
            month = '0' + month
        }
        if (day.length == 1) {
            day = '0' + day
        }

        var date3 = year + '-' + month + '-' + day

        var info = {}
        info.title = picker[e.detail.value.title]
        info.date = date3
        info.time = this.data.time1
        info.textarea = e.detail.value.textarea
        console.log(info)
        let pstr = JSON.stringify(info);
        wx.redirectTo({
            url: '../textarea/textarea?jsonstr=' + pstr,
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