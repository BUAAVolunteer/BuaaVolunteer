// pages/list/list.js
var app = getApp();
const db = wx.cloud.database()
const _ = db.command

//请求util.js
var util = require('../../utils/util.js');
var max;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        picker: [],
        currenDate: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
        })

        //获取目前系统时间
        // 调用函数时，传入new Date()参数，返回值是日期和时间
        var currenTime = util.formatTime1(new Date());
        var currenDate = util.formatTime(new Date());
        // 再通过setData更改Page()里面的data，动态更新页面的数据

        var that = this
            //日期字符串分别赋值，然后合并
        var str = currenDate.split('-')
        let year = str[0]
        let month = str[1]
        let day = str[2]
        if (month.length == 1) {
            month = '0' + month
        }
        if (day.length == 1) {
            day = '0' + day
        }
        currenDate = year + '-' + month + '-' + day
        this.setData({
            currenDate: currenDate,
            currenTime: currenTime
        });

        var that = this;
        var pick = [];
        wx.cloud.callFunction({
            name: 'GetProject',
            success: function(res) {
                console.log(res)
                max = res.result.data.length;
                for (let i = 0; i < max; i++) {
                    let pickitem = {
                        title: res.result.data[i].title,
                        date: res.result.data[i].date,
                        qqnum: res.result.data[i].qqnum,
                        checked: false,
                        edit: res.result.data[i].check,
                        id: i
                    }
                    pick.push(pickitem);
                }
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
    openbutton: function(e) {
        console.log(e.target.id)
        for (var i = 0; i < max; i++) {
            let change = 'picker[' + i + '].checked'
            if (i == e.target.id) {
                this.setData({
                    [change]: !this.data.picker[e.target.id].checked
                })
            } else {
                this.setData({
                    [change]: false
                })
            }
        }


    },
    openconfirm: function(e) {
        console.log(e)
        var that = this;
        var ID = e.currentTarget.id;
        var picker = that.data.picker;
        console.log(picker[ID].title);
        wx.redirectTo({
            url: '../confirm/confirm?title=' + picker[ID].title,
        });
    },
    openedit: function(e) {
        console.log(e)
        var that = this;
        var ID = e.currentTarget.id;
        var picker = that.data.picker;
        console.log(picker[ID].title);
        wx.redirectTo({
            url: '../edit/edit?title=' + picker[ID].title,
        });
    },
    opentextarea: function(e) {
        console.log(e)
        var that = this;
        var ID = e.currentTarget.id;
        var picker = that.data.picker;
        console.log(picker[ID].title);
        wx.redirectTo({
            url: '../textarea/textarea?title=' + picker[ID].title,
        })
    },
    opendown: function(e) {
        var that = this;
        var ID = e.currentTarget.id;
        var picker = that.data.picker;
        var title = picker[ID].title;
        wx.navigateTo({
            url: '../download/download?title=' + picker[ID].title + '&date=' + picker[ID].date + '&qqnum=' + picker[ID].qqnum,
        })
    },
    add: function(e) {
        console.log(e)
        wx.redirectTo({
            url: '../textarea/textarea?title=' + '发布一个新志愿',
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