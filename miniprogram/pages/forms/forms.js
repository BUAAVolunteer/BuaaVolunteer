// pages/forms/forms.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
var formConfig = [];
var watcher; //监听事件
var getname, getphone, getpersonnum, getqqnum, getcampus; //person集合获取的信息
var uplist = [], //总上传数据
    listitem = []; //一个人的信息
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
    onLoad: function(options) {
        //console.log(options.title, options.stime)
        wx.showLoading({
            title: '加载中',
        })
        this.setData({
            title: options.title,
            stime: options.stime
        })
        var that = this;
        var ti = options.title;
        db.collection('person').where({
                _openid: app.globalData.openid
            })
            .get({
                success: function(res) {
                    //console.log(res);
                    getname = res.data[0].name;
                    getphone = res.data[0].phone;
                    getpersonnum = res.data[0].personnum;
                    getqqnum = res.data[0].qqnum;
                    getcampus = res.data[0].campus;
                    console.log(getname, getphone, getpersonnum, getqqnum, getcampus);

                    //这里到时候加上合法性的判断
                    //合法性判断已转移至volunteer

                    db.collection('form')
                        .where({
                            title: ti
                        })
                        .get({
                            success: function(res) {
                                wx.hideLoading();
                                formConfig.push(res.data[0]);
                                that.setData({
                                    formList: res.data[0]
                                })
                            },
                            fail: function() {
                                wx.hideLoading();
                                wx.showModal({
                                    title: '错误',
                                    content: '获取记录失败,请检查网络或反馈给管理员',
                                    showCancel: false,
                                })
                            }
                        })

                    //watcher是一个页面监听事件
                    //目的是实时修改页面中选项的“剩余数量”

                    watcher = db.collection('form')
                        // 按 progress 降序
                        //.orderBy('progress', 'desc')
                        // 取按 orderBy 排序之后的前 10 个
                        //.limit(10)
                        .where({
                            title: ti
                        })
                        .watch({
                            onChange: function(snapshot) {
                                //console.log('docs\'s changed events', snapshot.docChanges)
                                //console.log('query result snapshot after the event', snapshot.docs)
                                //console.log('is init data', snapshot.type === 'init')
                                var download = snapshot.docs[0];
                                //console.log('dl', dl)
                                //修改页面中
                                var itemi = download.formInfo;
                                var di = itemi.length;
                                for (var j = 0; j < di; j++) {
                                    var itemj = itemi[j];
                                    if (itemj.limit) {
                                        var itemk = itemj.data;
                                        var kl = itemk.length;
                                        for (var k = 0; k < kl; k++) {
                                            var limit = itemk[k].limit;
                                            let target = `formList.formInfo[` + j + `].data[` + k + `].limit`;
                                            //console.log([target])
                                            that.setData({
                                                [target]: limit
                                            })
                                        }

                                    }
                                }

                            },
                            onError: function(err) {
                                console.error('the watch closed because of error', err)
                            }
                        })
                },
                fail: function() {
                    wx.hideLoading();
                    wx.showModal({
                        title: '错误',
                        content: '获取记录失败,请检查网络或反馈给管理员',
                        showCancel: false,
                    })
                }
            })


    },
    text: function(e) {
        let result = [];
        formConfig.forEach((item, i) => {
            result.push(item.formInfo)
        })
        var forms = result.reduce((a, b) => {
                return a.concat(b)
            })
            //console.log('forms', forms);
        var limit = [
            [],
            [],
            [],
            []
        ];
        for (var key in forms) {

            var items = forms[key];
            var v = that.selectComponent('#' + items.id);
            v.show();
        }
    },
    formValidate: function(item) {
        if (item.force) {
            //console.log(item, item.force, item.label);
            //获取验证类型和验证方式
            let {
                type,
                value
            } = item.role;
            //console.log('value', value);
            //console.log('123')
            if (type === 'reg') {
                //正则表达式
                value = util.vbind(value)
                    //console.log('value:::', value);
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
            if (type === 'notnull') {
                //console.log('item.input_text', item.input_text)
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
                } else {
                    return true;
                }
            }
        }
        return true;
    },
    getInputValue: function() {
        this.setData({
            loading: true
        })
        listitem.push(getname);
        listitem.push(getphone);
        listitem.push(getpersonnum);
        listitem.push(getqqnum);
        listitem.push(getcampus);

        let that = this;
        let result = [];
        let duration = 0;
        let detail = "";
        let den = 0;
        formConfig.forEach((item, i) => {
                result.push(item.formInfo)
            })
            //console.log('result', result);

        let temp = [];
        temp.push(result[0]);
        //console.log('temp', temp);
        let forms = temp.reduce((a, b) => {
                return a.concat(b)
            })
            //console.log('temp', temp);
        let limit = [
            [],
            [],
            [],
            []
        ];
        for (let key in forms) {

            let items = forms[key];
            let v = that.selectComponent('#' + items.id);
            //console.log(v, items.id)
            let l = v.choose[0].length;
            if (v.limit && (v.type === 'radio' || v.type === 'checkbox')) //有限制的进行筛选
                for (var i = 0; i < l; i++) {
                var j = v.choose[0][i];
                var k = v.choose[1][i]
                if (that.data.formList.formInfo[j].data[k].limit <= 0) {
                    v.choose[0].splice(i, 1);
                    v.choose[1].splice(i, 1);
                    v.choose[2].splice(i, 1);
                    v.input_text.splice(i, 1);
                }
            }
            l = v.choose[0].length;

            //判断是否必填项为空
            if (that.formValidate(v)) {
                //合法情况
                //console.log(v.choose)
                let input = v.input_text;
                if (v.type === 'div' || v.type === 'describe')
                    continue;
                else if (v.type === 'radio' || v.type === 'checkbox') {
                    if (v.limit) {
                        limit[0] = limit[0].concat(v.choose[0]);
                        limit[1] = limit[1].concat(v.choose[1]);
                        limit[2] = limit[2].concat(v.choose[2]);
                    }
                    if (v.detail) {
                        for (let i = 0; i < l; i++) {
                            limit[3] = limit[3].concat(den);
                            den++;
                        }
                    } else {
                        limit[3] = limit[3].concat(0);
                    }
                    //转化拼接多选
                    if (v.type === 'checkbox') {
                        let instr = "";
                        for (let i = 0; i < input.length; i++) {
                            instr = instr + input[i] + ";";
                        }
                        listitem.push(instr)
                    } else
                        listitem.push(input)

                } else //对于input组件
                    listitem.push(input)


                //计算时长，添加时间备注
                if (v.duration) {
                    for (let i = 0; i < v.choose[2].length; i++) {
                        duration += v.choose[2][i];
                    }
                }

                if (v.detail) {
                    for (let i = 0; i < v.choose[1].length; i++) {
                        let m = v.choose[1][i];
                        detail = detail + v.data[m].detail + ";"
                    }
                }


            } else {
                //不合法情况
                //页面初始化
                that.setData({
                    loading: false
                })
                forms = [];
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
            forms = [];
            return;
        }
        listitem.push(app.globalData.openid)
        listitem.push(duration)
        listitem.push(detail)
            //console.log(limit)
            //console.log(listitem)

        //uplist = { inf: listitem }
        uplist.push(listitem)
        listitem = [];
        forms = [];
        //console.log(uplist);
        wx.cloud.callFunction({
            name: "uploadData",
            data: {
                title: that.data.title,
                stime: that.data.stime,
                list: uplist,
                limit: limit
            },
            success: function(res) {
                //console.log(res)

                that.setData({
                    loading: false
                })
                uplist = [];
                if (res.result === "error") {
                    wx.showModal({
                        title: '错误',
                        content: '您所选择的部分名额已满，请重新选择！',
                        showCancel: false,
                    })
                    return;
                } else {
                    wx.showModal({
                        title: '提交成功',
                        content: '请留意微信消息，并加入对应的qq群以便志愿开展',
                        showCancel: false,
                        success: function() {
                            wx.redirectTo({
                                url: '../history/history',
                            })
                        },
                    })
                }
            },
            fail: function() {
                that.setData({
                    loading: false
                })
                wx.showModal({
                    title: '上传信息错误',
                    content: '请检查网络或重新提交',
                    showCancel: false
                })
                uplist = [];
                forms = [];
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