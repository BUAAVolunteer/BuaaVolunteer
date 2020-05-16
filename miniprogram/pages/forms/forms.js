// pages/forms/forms.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
let watcher = null; //监听事件
let getname, getphone, getpersonnum, getqqnum, getcampus; //person集合获取的信息
let uplist = [], //总上传数据
    listitem = []; //一个人的信息
let qqnum;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        stime: "",
        formList: {},
        loading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //console.log(options.title, options.stime)
        qqnum = options.qqnum
        //console.log(qqnum)
        wx.showLoading({
            title: '加载中',
        })
        this.setData({
            stime: options.stime
        })
        let that = this;
        let ti = options.title;
        db.collection('person').where({
            _openid: app.globalData.openid
        }).get({
            success: function (res) {
                //console.log(res);
                getname = res.data[0].name;
                getphone = res.data[0].phone;
                getpersonnum = res.data[0].personnum;
                getqqnum = res.data[0].qqnum;
                getcampus = res.data[0].campus;
                //console.log(getname, getphone, getpersonnum, getqqnum, getcampus);

                db.collection('form')
                    .where({
                        title: ti
                    })
                    .get({
                        success: function (res) {
                            //console.log(res.data)
                            wx.hideLoading();
                            res.data[0].formInfo = res.data[0].formInfo.map(function(n){
                                n.choose = [];
                                n.input_text = [];
                                return n;
                            })
                            that.setData({
                                formList: res.data[0]
                            })
                            that.watch(); //调用监听方法
                        },
                        fail: function () {
                            wx.hideLoading();
                            wx.showModal({
                                title: '错误',
                                content: '获取记录失败,请检查网络或反馈给管理员',
                                showCancel: false,
                            })
                        }
                    })
            },
            fail: function () {
                wx.hideLoading();
                wx.showModal({
                    title: '错误',
                    content: '获取记录失败,请检查网络或反馈给管理员',
                    showCancel: false,
                })
            }
        })
    },
    watch: function () {
        //watcher是一个页面监听事件
        //目的是实时修改页面中选项的“剩余数量”
        let that = this;
        watcher = db.collection('form')
            .where({
                title: that.data.formList.title
            })
            .watch({
                onChange: function (snapshot) {
                    let download = snapshot.docs[0];
                    //修改页面中
                    let itemi = download.formInfo;
                    let di = itemi.length;
                    for (let j = 0; j < di; j++) {
                        let itemj = itemi[j];
                        if (itemj.limit) {
                            let itemk = itemj.data;
                            let kl = itemk.length;
                            for (let k = 0; k < kl; k++) {
                                let limit = itemk[k].limit;
                                let target = `formList.formInfo[` + j + `].data[` + k + `].limit`;
                                that.setData({
                                    [target]: limit
                                })
                            }

                        }
                    }

                },
                onError: function (err) {
                    wx.showModal({
                        title: '错误',
                        content: '获取记录失败,请检查网络或反馈给管理员',
                        showCancel: false,
                    })
                }
            })
    },
    formValidate: function (item) {
        if (item.force) {
            //console.log(item, item.force, item.label);
            //获取验证类型和验证方式
            let {
                type,
                value
            } = item.role;
            //console.log('value', value);
            if (type === 'reg') {
                //正则表达式
                value = util.vbind(value)
                return false;
                if (value.test(item.input_text)) {
                    return true;
                } else {
                    let {
                        msg
                    } = item.role;
                    if (!msg) {
                        msg = item.label + '不合法';
                    }
                    console.log(msg);
                    wx.showToast({
                        title: msg,
                        icon: 'none'
                    })
                    return false;
                }
            }
            //目前只会判断非空，此时input_text格外有用
            if (type === 'notnull') {
                if (item.input_text.length == 0) {
                    let {
                        msg
                    } = item.role;
                    if (!msg) {
                        msg = item.label + '不为空';
                    }
                    wx.showToast({
                        title: msg,
                        icon: 'none'
                    })
                    return false;
                } else
                    return true;
            }
        }
        return true;
    },
    childChange: function (e) {
        console.log(e)
        let type = e.detail.type;
        let input_text = e.detail.input_text;
        let ID = e.detail.ID;
        let addList = 'formList.formInfo[' + ID + '].'
        if (type == 'checkbox' || type == 'radio') {
            let choose = e.detail.choose;
            let addl = addList + 'choose';
            this.setData({
                [addl]: choose
            })
        }
        let addl = addList + 'input_text';
        this.setData({
            [addl]: input_text
        })
    },
    getInputValue: function () {
        if (watcher)
            watcher.close();
        this.setData({
            loading: true
        })
        listitem.push(getname);
        listitem.push(getphone);
        listitem.push(getpersonnum);
        listitem.push(getqqnum);
        listitem.push(getcampus);

        let that = this;
        let duration = 0;
        let detail = "";

        let limit = [
            [],
            [],
            []
        ];
        for (let key in that.data.formList.formInfo) {
            let v = that.data.formList.formInfo[key];
            // console.log('v', v);
            // console.log(v.choose);
            if (v.limit && (v.type === 'radio' || v.type === 'checkbox')) //有限制的进行筛选
                v.choose = v.choose.filter(function (n) {
                    let k = n.value;
                    return v.data[k].limit > 0;
                });
            //判断是否必填项为空
            if (that.formValidate(v)) {
                //合法情况
                //console.log(v.choose)
                let input = v.input_text;
                if (v.type === 'div' || v.type === 'describe')
                    continue;
                else if (v.type === 'radio' || v.type === 'checkbox') {
                    if (v.limit) {
                        limit[0] = v.choose.reduce(function (preValue, n) {
                            preValue.push(n.id);
                            return preValue;
                        }, [])
                        limit[1] = v.choose.reduce(function (preValue, n) {
                            preValue.push(n.value);
                            return preValue;
                        }, [])
                        limit[2] = v.choose.reduce(function (preValue, n) {
                            preValue.push(n.duration);
                            return preValue;
                        }, [])
                    }
                    //转化拼接多选
                    if (v.choose && (v.type === 'checkbox' || v.type === 'radio')) {
                        let instr = v.choose.reduce(function (preValue, n) {
                            return preValue + n.input_text + ';';
                        }, "");
                        listitem.push(instr)
                    }
                } else //对于input组件
                    listitem.push(input)


                //计算时长，添加时间备注
                if (v.duration)
                    duration = v.choose.reduce(function (preVlaue, n) {
                        return preVlaue + n.duration;
                    }, 0);


                if (v.detail)
                    for (let i = 0; i < v.choose.length; i++) {
                        let m = v.choose[i].value;
                        detail = detail + v.data[m].detail + ";"
                    }

            } else {
                //不合法情况
                //页面初始化
                that.setData({
                    loading: false
                })
                listitem = [];
                return 0;
            }
        }
        //合法性检验完毕
        //本地防线，如果没有时长则不允许提交
        if (duration == 0) {
            that.setData({
                loading: false
            })
            wx.showModal({
                title: '错误',
                content: '您所选择的部分选项已满，请重新选择！',
                showCancel: false,
            })
            listitem = [];
            that.watch();
            return;
        }
        listitem.push(app.globalData.openid)
        listitem.push(duration)
        listitem.push(detail)
        // console.log(limit)
        //console.log(listitem)
        uplist.push(listitem)
        listitem = [];
        //console.log(uplist);
        wx.cloud.callFunction({
            name: "uploadData",
            data: {
                title: that.data.title,
                stime: that.data.stime,
                list: uplist,
                limit: limit
            },
            success: function (res) {
                //console.log(res)
                uplist = [];
                if (res.result === "error") {
                    wx.showModal({
                        title: '错误',
                        content: '您所选择的部分名额已满，请重新选择！！',
                        showCancel: false,
                        success: function (res) {
                            that.setData({
                                loading: false
                            })
                        }
                    })
                    that.watch();
                    return;
                } else {
                    //发送订阅消息
                    wx.cloud.callFunction({
                        name: 'Signup',
                        data: {
                            title: that.data.title,
                            openid: app.globalData.openid,
                            date: detail,
                            detail: 'QQ群' + qqnum
                        },
                        success: function (res) {
                            that.setData({
                                loading: false
                            })
                            //成功提示
                            wx.showModal({
                                title: '提交成功',
                                content: '请留意微信消息，并加入\nqq群:' + qqnum + '\n以便志愿开展',
                                showCancel: false,
                                success: function () {
                                    wx.redirectTo({
                                        url: '../history/history',
                                    })
                                },
                            })
                        }
                    })


                }
            },
            fail: function () {
                that.setData({
                    loading: false
                })
                wx.showModal({
                    title: '上传信息错误',
                    content: '请检查网络或重新提交',
                    showCancel: false
                })
                uplist = [];
                that.watch();
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