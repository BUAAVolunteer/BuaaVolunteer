// pages/textarea/textarea.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        etitle: "北航一日游",
        assure: "",
        assurep: "获得在北航学习机会",
        assureList: [],
        detail: "",
        detailp: "1、参观北航的南校区和北校区。\n 2、进行入学报到。\n 3、入住宿舍",
        detailList: [],
        response: "",
        responsep: "曹老师 电话：12312312312",
        responseList: [],
        require: "",
        requirep: "1.特别提醒一\n2.特别提醒二\n3.特别提醒三",
        requireList: [],
        people: "",
        peoplep: "全体新生",
        place: "",
        placep: "北京航空航天大学东南西北校区",
        time: "12:00",
        date: "2020-1-1",
        qqnum: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
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
                    var download = res.data[0]; //把data里的信息赋给download？

                    var ass = download.assure;
                    var l = ass.length;
                    var assure = "";
                    for (var i = 0; i < l; i++) {
                        assure = assure + ass[i] + '\n';
                    }
                    l = assure.length;
                    assure = assure.substr(0, l - 1); //substr获取字符 参数指定的是子串的开始位置和长度(start long)

                    var det = download.detail;
                    l = det.length;
                    var detail = "";
                    for (var i = 0; i < l; i++) {
                        detail = detail + det[i] + '\n';
                    }
                    l = detail.length;
                    detail = detail.substr(0, l - 1);

                    var req = download.require;
                    l = req.length;
                    var require = "";
                    for (var i = 0; i < l; i++) {
                        require = require + req[i] + '\n';
                    }
                    l = require.length;
                    require = require.substr(0, l - 1);

                    var res = download.response;
                    l = res.length;
                    var response = "";
                    for (var i = 0; i < l; i++) {
                        response = response + res[i] + '\n';
                    }
                    l = response.length;
                    response = response.substr(0, l - 1);

                    that.setData({
                        assureList: download.assure, //一坨数据存在云端
                        detailList: download.detail,
                        requireList: download.require,
                        responseList: download.response,
                        time: download.time,
                        date: download.date,
                        textarea: download.textarea,
                        assure, //拼接的用于屏幕输出的字符串
                        detail, //同名就不用再写一遍赋值
                        require,
                        response,
                        people: download.people,
                        place: download.place,
                        qqnum: download.qqnum
                    })

                }
            })

    },
    /*bindchange=  --->current 改变时会触发change事件
    我觉得是 相当于 弹出picker选定时间或输入框内容改变 value获取的input对象 然后可以成功触发 改变对应的值
    */
    assure: function (e) {
        console.log('run')
        var tavalue = e.detail.value;
        var a = tavalue.split('\n'); //内容用\n分隔赋值
        var la = a.length;
        var data = [];
        for (var i = 0; i < la; i++) {
            data.push(a[i]); //可向数组的末尾添加一个或多个元素，并返回新的长度
        } //向data数组赋新的值
        this.setData({
            assureList: data
        }) //向assureList赋值
        console.log('assurelist:', this.data.assureList)

    },
    detail: function (e) {
        var tavalue = e.detail.value;
        var a = tavalue.split('\n');
        var la = a.length;
        var data = [];
        for (var i = 0; i < la; i++) {
            data.push(a[i]);
        }
        this.setData({
            detailList: data
        })
    },
    entertext: function (e) {
        var tavalue = e.detail.value;
        var a = tavalue.split('\n');
        var la = a.length;
        var data = [];
        for (var i = 0; i < la; i++) {
            data.push(a[i]);
        }
        var addList = 'people';
        this.setData({
            [addList]: data
        }); //setData的特殊用法 如果要将嵌套数据付给字符串则用[]
        //but马佬说这里没嵌套式写习惯了emmmm
    },
    require: function (e) {
        var tavalue = e.detail.value;
        var a = tavalue.split('\n');
        var la = a.length;
        var data = [];
        for (var i = 0; i < la; i++) {
            data.push(a[i]);
        }
        this.setData({
            requireList: data
        })
    },
    response: function (e) {
        var tavalue = e.detail.value;
        var a = tavalue.split('\n');
        var la = a.length;
        var data = [];
        for (var i = 0; i < la; i++) {
            data.push(a[i]);
        }
        this.setData({
            responseList: data
        })
    },
    upload: function (e) {
        let that = this;

        //检测信息缺失
        if (!that.data.people || that.data.people === "") { //如果没填人数 则出弹框 下同
            wx.showModal({
                title: '缺少信息',
                content: '请填写招募人数',
                showCancel: false,
            })
            return;
        }
        if (!that.data.detailList || that.data.detailList == []) {
            wx.showModal({
                title: '缺少信息',
                content: '请填写活动内容',
                showCancel: false,
            })
            return;
        }
        if (!that.data.responseList || that.data.responseList == []) {
            wx.showModal({
                title: '缺少信息',
                content: '请填写负责人联系方式',
                showCancel: false,
            })
            return;
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
        wx.showLoading({
            title: '加载中',
        }) //一个延时显示
        //转换日期格式
        var str = this.data.date.split('-') //date用-分隔
        let year = str[0]
        let month = str[1]
        let day = str[2]
        if (month.length == 1) {
            month = '0' + month
        } //如果month是1-9就要转换 day同理
        if (day.length == 1) {
            day = '0' + day
        }
        var date3 = year + '-' + month + '-' + day




        //上传详细信息
        wx.cloud.callFunction({ //调用这个云函数
            name: 'uploadvolun',
            data: {
                etitle: that.data.etitle,
                title: that.data.title,
                date: date3,
                time: that.data.time,
                textarea: that.data.textarea,
                place: that.data.place,
                requireList: that.data.requireList,
                people: that.data.people,
                assureList: that.data.assureList,
                detailList: that.data.detailList,
                requireList: that.data.requireList,
                responseList: that.data.responseList,
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