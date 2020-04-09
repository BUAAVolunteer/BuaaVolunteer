const app = getApp()
    // pages/purchase/purchase.js
const db = wx.cloud.database()
var openid = app.globalData.openid;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:"",
        personnum:"",
        phone:"",
        qqnum:"",
        picker:["南校区","北校区"],
        text:"",
        index:0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        db.collection('person').where({
            _openid: app.globalData.openid
        }).get({
            success:function(res){
                console.log(res)
                if (res.data.length != 0){
                    that.setData({
                        name: res.data[0].name,
                        phone: res.data[0].phone,
                        personnum: res.data[0].personnum,
                        text: res.data[0].text,
                        qqnum: res.data[0].qqnum
                    })
                    if(res.data[0].campus === "北校区"){
                        that.setData({
                            index: 1
                        })
                    }else{
                        that.setData({
                            index: 0
                        })
                    }
                }
            },fail:function(res){
                wx.showToast({
                  title: '获取信息失败',
                })
            }
        })

    },
    PickerChange(e) {
        console.log(e);
        this.setData({
            index: e.detail.value
        })
    },
    order_submit: function(e) {
        var picker = ["南校区","北校区"]
        if (e.detail.value.name.length >= 2) {

        } else {
            wx.showModal({
                title: '错误',
                content: '请填写正确的姓名',
                showCancel: false,
            })
            return
        }
        if (e.detail.value.personnum.length == 9 || e.detail.value.personnum.length == 8) {} else {

            wx.showModal({
                title: '错误',
                content: '请填写正确格式的学号\n本科生8位，研究生9位',
                showCancel: false,
            })
            return
        }
        if (e.detail.value.qqnum.length < 5 || e.detail.value.qqnum.length > 11 || isNaN(e.detail.value.phone)) {
            wx.showModal({
                title: '错误',
                content: '请填写正确的QQ号',
                showCancel: false,
            })
            return
        }

        if (e.detail.value.phone.length != 11 || isNaN(e.detail.value.phone)) {
            wx.showModal({
                title: '错误',
                content: '请填写正确的手机号',
                showCancel: false,
            })
            return
        }

        if (e.detail.value.text.length >= 18) {
            wx.showModal({
                title: '错误',
                content: '请填写18个字以内的个性签名~',
                showCancel: false,
            })
            return
        }

        wx.showLoading({
            title: '请稍后',
            mask: 'true',
        })
        console.log(app.globalData.openid)
        console.log(e.detail.value.qqnum)
        console.log(e.detail.value.campus)


        wx.cloud.callFunction({
            // 云函数名称
            name: 'answer',
            // 传给云函数的参数
            data: {
                id: app.globalData.openid,
                name: e.detail.value.name,
                phone: e.detail.value.phone,
                personnum: e.detail.value.personnum,
                text: e.detail.value.text,
                qqnum: e.detail.value.qqnum,
                campus: picker[e.detail.value.campus]
            },
            success: function(res) {
                        console.log(res)
                        wx.hideLoading()
                        wx.showModal({
                            title: '信息更新成功',
                            content: '欢迎加入志愿者大家庭',
                            showCancel: false,
                            success: function() {
                                wx.switchTab({
                                    url: '../about/about',
                                })
                            },

                        })
                    },
            fail: function() {
                wx.hideLoading()
                wx.showModal({
                    title: '错误',
                    content: '请重新填写或反馈管理员',
                    showCancel: false
                })
            }
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