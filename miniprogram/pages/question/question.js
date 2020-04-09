    // miniprogram/pages/want/want.js
    const db = wx.cloud.database()
    Page({

        /**
         * 页面的初始数据
         */
        data: {
            picker: ["立水桥站区平安地铁志愿", "童年一课线上支教", "鲁迅博物馆讲解",
                "“夕阳再晨”智能手机教学（1号社区）", "“夕阳再晨”智能手机教学（2号社区）", "思源楼智能手机教学",
                "科技馆志愿", "国家图书馆", "中华世纪坛",
                "花园小课堂", "昌雨春童康复中心",
                "小桔灯听障儿童支教", "咿呀总动员", "CBA志愿服务",
                "中甲志愿服务", "天文馆志愿"
            ],
            index: null
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function(options) {

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function() {},

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

        },
        PickerChange(e) {
            console.log(e);
            this.setData({
                index: e.detail.value
            })
        },
        order_submit: function(e) {
            if (e.detail.value.name == "") {
                wx.showModal({
                    title: '错误',
                    content: '请填写昵称',
                    showCancel: false,
                })
                return
            }
            console.log(e.detail.value.title)
            if (isNaN(e.detail.value.title)) {
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
                    content: '请详细描述问题',
                    showCancel: false,
                })
                return
            }

            var picker = ["小程序使用问题", "立水桥站区平安地铁志愿", "童年一课线上支教", "鲁迅博物馆讲解",
                "“夕阳再晨”智能手机教学", "思源楼智能手机教学",
                "科技馆志愿", "国家图书馆", "中华世纪坛",
                "花园小课堂", "昌雨春童康复中心",
                "小桔灯听障儿童支教", "咿呀总动员", "CBA志愿服务",
                "中甲志愿服务", "天文馆志愿"
            ]
            wx.showLoading({
                title: '请稍后',
                mask: 'true',
            })
            db.collection('question').add({
                data: {
                    name: e.detail.value.name,
                    title: picker[e.detail.value.title],
                    textarea: e.detail.value.textarea,
                    check: 0
                },
                success: function() {
                    wx.hideLoading()
                    wx.showModal({
                        title: '反馈成功',
                        content: '您的反馈我们已经收到，请耐心等待解答',
                        showCancel: false,
                        success: function() {
                            wx.switchTab({
                                url: '../main/main',
                            })
                        },

                    })
                },
                fail: function() {
                    wx.hideLoading()
                    wx.showModal({
                        title: '错误',
                        content: '没有找到记录',
                        showCancel: false
                    })
                }
            })
        }

    })