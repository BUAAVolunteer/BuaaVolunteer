// pages/textarea/textarea.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
//请求util.js
var util = require('../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        etitle: "北航一日游",
        place: "",
        placep: "北京航空航天大学东南西北校区",
        time: "12:00",
        date: "2020-1-1",
        qqnum: "",
        array: {
            detail: {
                type: 'detail',
                content: "活动内容",
                data: "",
                placeholder: "1、参观北航的南校区和北校区。\n 2、进行入学报到。\n 3、入住宿舍"
            },
            people: {
                type: 'people',
                content: "招募人数",
                data: "",
                placeholder: "全体新生"
            },
            assure: {
                type: 'assure',
                content: "志愿者保障",
                data: "",
                placeholder: "获得在北航学习机会"
            },
            require: {
                type: 'require',
                content: "特别提醒",
                data: "",
                placeholder: "1.特别提醒一\n2.特别提醒二\n3.特别提醒三"
            },
            response: {
                type: 'response',
                content: "负责人联系方式",
                data: "",
                placeholder: "曹老师 电话：12312312312"
            }
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        wx.showLoading()
        this.setData({
            title: options.title,
            etitle: options.title
        }) //传参到wxml
        db.collection('project')
            .where({
                title: options.title
            }) //查询条件
            .get({ //更新数据库的操作
                success: function (res) {
                    let download = res.data[0]; //把data里的信息赋给download？

                    let assure = download.assure.reduce(function (preValue, n) {
                        return preValue + n + '\n';
                    }, "").slice(0, -1)

                    let detail = download.detail.reduce(function (preValue, n) {
                        return preValue + n + '\n';
                    }, "").slice(0, -1)

                    let require = download.require.reduce(function (preValue, n) {
                        return preValue + n + '\n';
                    }, "").slice(0, -1)

                    let response = download.response.reduce(function (preValue, n) {
                        return preValue + n + '\n';
                    }, "").slice(0, -1)

                    let people = download.people.reduce(function (preValue, n) {
                        return preValue + n + '\n';
                    }, "").slice(0, -1)

                    let assureData = 'array.assure.data'
                    let requireData = 'array.require.data'
                    let detailData = 'array.detail.data'
                    let responseData = 'array.response.data'
                    let peopleData = 'array.people.data'
                    that.setData({
                        time: download.time,//一坨数据存在云端
                        date: download.date,
                        textarea: download.textarea,
                        [assureData]: assure, //拼接的用于屏幕输出的字符串
                        [detailData]: detail, //同名就不用再写一遍赋值
                        [requireData]: require,
                        [responseData]: response,
                        [peopleData]: people,
                        place: download.place,
                        qqnum: download.qqnum
                    })
                    wx.hideLoading()
                }
            })

    },
    /*bindchange=  --->current 改变时会触发change事件
    我觉得是 相当于 弹出picker选定时间或输入框内容改变 value获取的input对象 然后可以成功触发 改变对应的值
    */
    enterTextarea: function (e) {
        let type = e.currentTarget.id;
        // console.log('type',type)
        let value = e.detail.value;
        // console.log(value)
        let addList = 'array.' + type + '.data'
        this.setData({
            [addList] : value
        })
    },
    upload: function (e) {
        let that = this;
        let array = this.data.array;
        //检测信息缺失
        for (let i in array){
            let addList = 'array.' + array[i].type + '.list'
            if (!array[i].data || array[i].list == "") {
                wx.showModal({
                    title: '缺少信息',
                    content: '请填写' + array[i].content,
                    showCancel: false,
                })
                return;
            }
        }
            
        if (that.data.etitle === "发布一个新志愿" && that.data.title === "") {
            wx.showModal({
                title: '缺少信息',
                content: '请填写活动名称',
                showCancel: false,
            })
            return;
        }
        if (that.data.etitle === "发布一个新志愿" && that.data.place === "") {
            wx.showModal({
                title: '缺少信息',
                content: '请填写活动地点',
                showCancel: false,
            })
            return;
        }
        if (!that.data.textarea || that.data.textarea === "") {
            wx.showModal({
                title: '缺少信息',
                content: '请填写志愿开展日期',
                showCancel: false,
            })
            return
        }
        console.log('qqNum', that.data.qqnum)
        if (!that.data.qqnum || that.data.qqnum === "") {
            wx.showModal({
                title: '缺少信息',
                content: '请填写志愿QQ群号',
                showCancel: false,
            })
            return
        }
        wx.cloud.callFunction({
            name: 'getTime',
            success: function (res) {
                //console.log(res)
                //返回值是日期和时间
                var time = res.result.time.split(" ");
                var currenTime = time[1];
                var currenDate = time[0];
                if (currenDate>that.data.date || currenDate == that.data.date && currenTime>that.data.time){
                    wx.showModal({
                        title: '信息错误',
                        content: '志愿发布时间不能在当前时间之前',
                        showCancel: false,
                    })
                    return
                }
                wx.showLoading({
                    title: '加载中',
                }) //一个延时显示
                //上传详细信息
                wx.cloud.callFunction({ //调用这个云函数
                    name: 'uploadvolun',
                    data: {
                        etitle: that.data.etitle,
                        title: that.data.title,
                        date: that.data.date,
                        time: that.data.time,
                        textarea: that.data.textarea,
                        place: that.data.place,
                        people: array.people.data.split('\n'),
                        requireList: array.require.data.split('\n'),
                        assureList:  array.assure.data.split('\n'),
                        detailList:  array.detail.data.split('\n'),
                        requireList: array.require.data.split('\n'),
                        responseList:array.response.data.split('\n'),
                        innerList: [],
                        signuplist: [],
                        qqnum: that.data.qqnum
                    },
                    success: function (e) {
                        console.log(e)
                        wx.hideLoading();
                        wx.showModal({
                            title: "发布成功",
                            content: "志愿发布成功，请编辑报名表单",
                            showCancel: false, //去掉取消按钮
                            success: function (res) { //如果成功调用showModal成功，则跳转至链接
                                wx.redirectTo({
                                    url: '../list/list',
                                })
                            }
                        })
        
                    },
                    fail: function (e) {
                        wx.hideLoading();
                        console.log(e)
                        wx.showModal({
                            title: "发布失败",
                            content: "有错误发生，发布失败",
                            showCancel: false
                        })
                    }
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})