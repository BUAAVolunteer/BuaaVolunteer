// miniprogram/pages/score/score.js
const db = wx.cloud.database();
const _ = db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        volun_name: "",
        volun_phone: "",
        volun_time: "",
        volun_score: 0,
        volun_id: "",
        person_list: [{}],
        index: null,
        picker: ["立水桥站区平安地铁志愿",  "童年一课线上支教",  "鲁迅博物馆讲解",                 "“夕阳再晨”科技助老活动",  "思源楼智能手机教学",                 "科技馆志愿",  "国家图书馆",  "中华世纪坛",                 "花园小课堂",  "昌雨春童康复中心",  "微澜图书馆",                 "小桔灯听障儿童支教",  "咿呀总动员",  "CBA志愿服务",                 "中甲志愿服务",  "天文馆志愿"            ]

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

    },

    PickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value
        })
    },

    identify: function(e) {
        var vtime = "";
        var vscore = "";
        var finding = 0;
        var that = this;
        var picker = ["立水桥站区平安地铁志愿", "童年一课线上支教", "鲁迅博物馆讲解",
            "“夕阳再晨”科技助老活动", "思源楼智能手机教学",
            "科技馆志愿", "国家图书馆", "中华世纪坛",
            "花园小课堂", "昌雨春童康复中心", "微澜图书馆",
            "小桔灯听障儿童支教", "咿呀总动员", "CBA志愿服务",
            "中甲志愿服务", "天文馆志愿"
        ]

        db.collection('list').where({
                //根据电话和项目名称查询志愿
                p: e.detail.value.phone - '0',
                v: picker[e.detail.value.title]
            })
            .get({
                success: function(res) {
                    console.log(res)
                    wx.hideLoading()
                    if (res.data.length == 0) {
                        wx.showModal({
                            title: '未能找到志愿者',
                            content: '请输入正确的志愿者和项目信息',
                            showCancel: false
                        })
                    } else {
                        that.setData({
                            'volun_name': res.data[res.data.length - 1].v,
                            'volun_phone': res.data[res.data.length - 1].p,
                            'volun_time': res.data[res.data.length - 1].a,
                            'volun_score': res.data[res.data.length - 1].s - '0',
                            'volun_id': res.data[res.data.length - 1]._id,
                        })
                    }
                },
                fail: function(res) {

                }
            })
    },

    plus1: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: 0.5
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '增加积分',
                    content: '积分增加成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    plus2: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: 1
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '增加积分',
                    content: '积分增加成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    plus3: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: 1
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '增加积分',
                    content: '积分增加成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    minus1: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score - '0'
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: -5
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '扣除积分',
                    content: '积分扣除成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    minus2: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: -8
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '扣除积分',
                    content: '积分扣除成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    minus3: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: -15
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '扣除积分',
                    content: '积分扣除成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    minus4: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: -4
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '扣除积分',
                    content: '积分扣除成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    minus5: function(e) {
        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        wx.cloud.callFunction({
            // 云函数名称
            name: 'plus',
            // 传给云函数的参数
            data: {
                id: _id,
                basic: sc,
                p: -2
            },
            success: function(res) {
                console.log(res)
                wx.hideLoading()
                wx.showModal({
                    title: '扣除积分',
                    content: '积分扣除成功',
                    showCancel: false
                })
            },
            fail: console.error
        })
    },

    minus6: function(e) {
        var _id = this.data.volun_id
        var sc = this.data.volun_score
        var pl = 0
        wx.showActionSheet({
            itemList: ['1', '2', '3', '4', '5', '6'],
            success: function(res) {
                wx.showLoading({
                    title: '请稍后',
                    mask: 'true',
                })
                pl = 0 - pl - res.tapIndex - 1
                console.log(pl)
                wx.cloud.callFunction({
                    // 云函数名称
                    name: 'plus',
                    // 传给云函数的参数
                    data: {
                        id: _id,
                        basic: sc,
                        p: pl
                    },
                    success: function(res) {
                        wx.hideLoading()
                        console.log(res)
                        wx.showModal({
                            title: '扣除积分',
                            content: '积分扣除成功',
                            showCancel: false
                        })
                    },
                    fail: console.error
                })
            },
            fail: function(res) {
                console.log(res.errMsg)
                wx.hideLoading()
                console.log(res)

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