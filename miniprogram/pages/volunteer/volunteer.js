// pages/volunteer/volunteer.js
var app = getApp();
const db = wx.cloud.database()
const _ = db.command

//请求util.js
var util = require('../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        volunteer_list: [],
        openid: "",
        open: false,
        current_v: {},
        id: -1,
        loading: false, //上拉加载更多的loading
        refreshLoading: false, //下拉刷新页面的loading
        currenDate: "",
        currenTime: "",
        signup: false, //重填标准
        secret: false //内部名额
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        let that = this
        db.collection('person').where({
                _openid: app.globalData.openid,
            })
            .get({
                success: function(res) {
                    //console.log(res)
                    //未来在这里加入对志愿积分合法性的判断
                    if (res.data.length == 0) {
                        wx.showModal({
                            title: '您尚未注册',
                            content: '请先填写必要信息后再接取志愿',
                            showCancel: false,
                            success: function() {
                                wx.switchTab({
                                    url: '../person/person',
                                })
                            },

                        })
                    } else {
                        //console.log(res.data)
                        if (res.data[0].score <= -10) {
                            wx.showModal({
                                title: '您没有报名权限',
                                content: '您的积分已达到惩罚线，6个月内无法继续参与蓝协志愿。',
                                showCancel: false,
                                success: function() {
                                    wx.switchTab({
                                        url: '../about/about',
                                    })
                                },

                            })
                        }
                    }
                    that.initList();
                }
            })
    },
    //下拉刷新拟态效果触发函数
    initList: function() {
        this.setData({
            refreshLoading: true,
        })
        var that = this
            //延时触发，直接看后面的大括号的内容即可
        setTimeout(() => {
            let time = []
                //获取目前系统时间
            wx.cloud.callFunction({
                name: 'getTime',
                success: function(res) {
                    //console.log(res)
                    //返回值是日期和时间
                    time = res.result.time.split(" ");
                    var currenTime = time[1];
                    var currenDate = time[0];
                    // 再通过setData更改Page()里面的data，动态更新页面的数据
                    that.setData({
                        currenDate: currenDate,
                        currenTime: currenTime
                    });
                    db.collection('project').where({
                            // gte 方法用于指定一个 "大于等于" 条件
                            check: 1
                        })
                        .get({
                            success: function(res) {
                                //console.log(res)
                                //console.log(res.data)

                                var dat = res.data
                                    //排序函数，按照日期时间排序，从近到远渲染页面
                                dat.sort(function(a, b) {
                                    if (a.date < b.date || (a.date === b.date && a.time < b.time)) {
                                        return -1;
                                    } else if (a.date === b.date && a.time === b.time) {
                                        return 0;
                                    } else {
                                        return 1;
                                    }
                                });
                                // console.log('dat', dat)
                                //dat是一个对象（类似结构体）
                                var ldat = dat.length;
                                for (var i = 0; i < ldat; i++) {
                                    //计数
                                    dat[i].cnt = i;
                                    //底下几个实际上都是重复的，是字符串的拼接
                                    //目的是把数组中的各个字符串拼起来，并且加入换行符
                                    //assure
                                    var temp = "";
                                    var assure = dat[i].assure;
                                    var l = assure.length;
                                    for (var j = 0; j < l; j++) {
                                        temp = temp + assure[j] + '\n';
                                    }
                                    dat[i].assure = temp;

                                    //detail
                                    temp = "";
                                    var detail = dat[i].detail;
                                    l = detail.length;
                                    for (var j = 0; j < l; j++) {
                                        temp = temp + detail[j] + '\n';
                                    }
                                    dat[i].detail = temp;

                                    //require
                                    temp = "";
                                    var require = dat[i].require;
                                    l = require.length;
                                    for (var j = 0; j < l; j++) {
                                        temp = temp + require[j] + '\n';
                                    }
                                    dat[i].require = temp;

                                    //response
                                    temp = "";
                                    var response = dat[i].response;
                                    l = response.length;
                                    for (var j = 0; j < l; j++) {
                                        temp = temp + response[j] + '\n';
                                    }
                                    dat[i].response = temp;

                                    //people
                                    temp = "";
                                    var people = dat[i].people;
                                    l = people.length;
                                    for (var j = 0; j < l; j++) {
                                        temp = temp + people[j] + '\n';
                                    }
                                    dat[i].people = temp;
                                }
                                //volunteer_list是页面展示出来的悬浮窗上的数据
                                that.setData({
                                        volunteer_list: dat
                                    })
                                    // console.log(currenDate);
                                    //console.log(currenTime);
                                that.setData({
                                    refreshLoading: false,
                                })
                            },
                            fail: function(res) {
                                //console.log(res)
                                wx.showModal({
                                    title: '错误',
                                    content: '获取记录失败，请检查网络或联系管理员',
                                    showCancel: false,
                                })
                                that.setData({
                                    refreshLoading: false,
                                })
                            }
                        })
                }
            })
        }, 1000)
    },
    //打开悬浮窗
    opendetail: function(e) {
        var that = this;
        //console.log(e.currentTarget.id)
        var id = e.currentTarget.id;
        var current = that.data.volunteer_list[id];
        that.setData({
            open: true,
            current_v: current,
            id: id
        })
        var id = that.data.id;
        let l = that.data.volunteer_list[id].signuplist.length;
        //console.log(that.data.volunteer_list[id].signuplist)
        for (let i = 0; i < l; i++) {
            if (app.globalData.openid === that.data.volunteer_list[id].signuplist[i]) {
                wx.showToast({
                    title: '请勿重复报名',
                    icon: 'none'
                })
                that.setData({
                    signup: true,
                    secret: false
                })
                return
            }
        }
        that.setData({
            signup: false
        })
        l = that.data.volunteer_list[id].innerList.length;

        for (let i = 0; i < l; i++) {
            if (app.globalData.openid === that.data.volunteer_list[id].innerList[i]) {
                that.setData({
                    secret: true
                })
                return
            }
        }
        that.setData({
            secret: false
        })
    },
    //关闭悬浮窗
    offcanvas: function(e) {
        this.setData({
            open: false,
            id: -1
        })
    },
    //进入报名表单
    signup: function() {
        var that = this;

        wx.requestSubscribeMessage({
            tmplIds: ["Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w"],
            success: (res) => {
                if (res['Ynia8PHxf3L_uWFvZxtPiI-V8hE-wcErHpe0Ygh8O9w'] === 'accept') {
                    var id = that.data.id;
                    var title = that.data.volunteer_list[id].title
                    wx.navigateTo({
                        url: '../forms/forms?title=' + title + '&stime=' + that.data.currenDate,
                    })
                } else {
                    wx.showToast({
                        title: '订阅后才能报名志愿~',
                        duration: 1000,
                        success(data) {
                            //成功
                        }
                    })
                }
            },
            fail(err) {
                //失败
                console.error(err);
                reject()
            }
        })

    },
    //进入更多信息页面
    program_open: function(event) {
        var that = this;
        var id = that.data.id;
        var title = that.data.volunteer_list[id].title

        //从test中找到项目名称相同的对象
        db.collection('test').where({
                title: title
            })
            .get({
                success: function(res) {
                    //console.log(res)
                    wx.hideLoading()
                    var target_id = res.data[0]._id
                    wx.navigateTo({
                        url: '../detail/detail?id=' + target_id,
                    })

                },
                fail: function(res) {
                    //console.log(res)
                    wx.showModal({
                        title: '错误',
                        content: '获取记录失败',
                        showCancel: false,
                    })
                }
            })
    },

    /*
    loadmore: function() {
        //过长的list需要做二维数组，因为setData一次只能设置1024kb的数据量，如果过大的时候，就会报错
        //二维数组每次只设置其中一维，所以没有这个问题
        let nowList = `list[${this.data.list.length}]`
        let demoList = this.getList(10)
        this.setData({
            [nowList]: demoList,
            loading: true
        })
    },
    /**
     * 每次吸入num条数据
     
    getList(num) {
        let list = []
        for (let i = 0; i < num; i++) {
            list.push({
                height: this.getRadomHeight()
            })
        }
        return list
    },
    /**
     * 生成随机(100, 400)高度
     
    getRadomHeight() {
        return parseInt(Math.random() * 300 + 100)
    },*/

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        this.setData({
            open: false,
            id: -1
        })
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
        //刷新完成后停止下拉刷新动效

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