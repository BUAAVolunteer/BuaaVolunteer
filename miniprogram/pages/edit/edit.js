// pages/edit/edit.js
const db = wx.cloud.database();
const _ = db.command;
const app = getApp();
var formConfig;
var cnt = 0; //index plus with item grow
var ID, IDitem; //index of change item
var tavalue; //textarea value
Page({

    /**
     * 页面的初始数据
     */
    data: {
        formList: {},
        title: "",
        infotitle: "立水桥",
        checked: false,
        type: "",
        label: "",
        text: "",
        texta: "",
        textl: "",
        textd: "",
        force: false,
        detail: false,
        dat: "",
        page: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        this.setData({
            title: options.title
        })
        db.collection('form')
            .where(_.or([{
                    title: options.title
                },
                {
                    title: "发布一个新志愿"
                }
            ]))
            .get({
                success: function(res) {
                    let download = {};
                    if (res.data.length == 1) {
                        download = res.data[0];
                        db.collection('form').add({
                            data: {
                                formInfo: [],
                                title: options.title,
                                fieldName: options.title
                            },
                            success: function(res) {
                                db.collection('signUp').add({
                                    data: {
                                        title: options.title,
                                        list: []
                                    },
                                    success: function(res) {
                                        wx.hideLoading();
                                        let addList = `formList.fieldName`;
                                        that.setData({
                                            [addList]: options.title
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].title === options.title) {
                                download = res.data[i];
                                break;
                            }
                        }
                        db.collection('signUp').where({
                            title: options.title
                        }).get({
                            success: function(res) {
                                wx.hideLoading()
                                if (res.data.length == 0) {
                                    db.collection('signUp').add({
                                        data: {
                                            title: options.title,
                                            list: []
                                        },

                                    })
                                }
                            }
                        })


                    }
                    cnt = download.formInfo.length;
                    let fi = download;
                    for (let i = 0; i < cnt; i++) {
                        fi.formInfo[i].id = fi.formInfo[i].id.slice(1)
                    }
                    //console.log(fi)
                    that.setData({
                        formList: fi
                    })
                }
            })
    },

    //左侧导航的开关函数
    offCanvas: function(e) {
        //console.log(e.currentTarget.id);
        if (e.currentTarget.id == -1) {
            ID = parseInt(e.currentTarget.id);
            this.setData({
                type: "title",
                label: this.data.formList.fieldName,
                open: true
            })
            return;
        }
        var type, label, text, limit, duration, detail, textarea = "",
            textd = "",
            force,
            flag_d = 0;
        if (this.data.open) {
            this.setData({
                open: false,
                type: ""
            });
        } else {
            this.setData({
                open: true
            });
            //console.log(this.data.formList.formInfo)
            ID = parseInt(e.currentTarget.id);
            this.setData({
                ID
            })
            type = this.data.formList.formInfo[ID].type;
            label = this.data.formList.formInfo[ID].label;
            text = this.data.formList.formInfo[ID].text;
            force = this.data.formList.formInfo[ID].force;
            limit = this.data.formList.formInfo[ID].limit;
            duration = this.data.formList.formInfo[ID].duration;
            detail = this.data.formList.formInfo[ID].detail;
            this.setData({
                type: type,
                label,
                text,
                force,
                detail,
                page: 0
            })
            textd = ""
            if (type == 'radio' || type == 'checkbox') {
                let ta = this.data.formList.formInfo[ID].data;
                let lta = ta.length;
                for (var i = 0; i < lta; i++) {
                    let tai = ta[i].name;
                    let tal = parseInt(ta[i].limit) ? parseInt(ta[i].limit) : 0;
                    let tad = parseInt(ta[i].duration) ? parseInt(ta[i].duration) : 0;
                    //console.log(ta[i])
                    let det = ta[i].detail ? ta[i].detail : "备注";
                    textd = textd ? textd : "";
                    //console.log(textd)
                    //console.log(det)
                    if (limit && duration && tai)
                        textarea = textarea + tai + ' ' + tal + ' ' + tad + '\n';
                    else if (limit && tai)
                        textarea = textarea + tai + ' ' + tal + '\n';
                    else
                        textarea = textarea + tai + '\n';
                    if (detail) {
                        textd = textd + det + '\n';
                        flag_d = 1
                    }

                }
                lta = textarea.length;
                textarea = textarea.substr(0, lta - 1);
                lta = textd.length;
                textd = textd.substr(0, lta - 1);
                this.setData({
                    texta: textarea
                })
                if (flag_d)
                    this.setData({
                        textd: textd
                    })
            }
        }
        //console.log(type, ID)
        //console.log(this.data.formList.formInfo[ID].detail)
    },
    enter: function(e) {
        var type = e.currentTarget.id;
        var addList = 'formList.formInfo[' + ID + ']'
        if (type == "title") {
            //组件标题的修改
            addList = (ID == -1 ? 'formList.fieldName' : 'formList.formInfo[' + ID + '].label')
        } else if (type == "text") {
            //组件提示的修改
            addList = addList + '.text';
        } else if (type == "force") {
            //必填项的添加
            //title是为了构造合法性检验时的提示
            var title = this.data.formList.formInfo[ID].label;
            var l = e.detail.value.length;
            var role = {
                "msg": "",
                "type": "",
                "value": ""
            }
            var addl = addList + '.force'
            if (l == 1) {
                this.setData({
                    [addl]: true
                });
                //构造合法性检验的提示
                role.type = "notnull";
                if (title.length > 10)
                    role.msg = "必填项不能为空"
                else
                    role.msg = title + "不能为空"
                addl = addList + '.role'
                this.setData({
                    [addl]: role
                })
            } else {
                this.setData({
                    [addl]: false
                });
                role.type = "";
                addl = addList + '.role'
                this.setData({
                    [addl]: role
                })
            }
        } else if (type == "detailopen") {
            //备注项的开关
            addl = addList + ".detail";
            if (this.data.formList.formInfo[ID].detail) {
                this.setData({
                    [addl]: false,
                    detail: false
                });
            } else {
                this.setData({
                    [addl]: true,
                    detail: true
                });
            }
        }
        //对于title，text
        if (type == "title" || type == "text")
            this.setData({
                [addList]: e.detail.value
            });
    },
    entertd: function(e) {
        var that = this
        tavalue = e.detail.value;
        var a = tavalue.split('\n');
        var la = a.length;
        if (la > that.data.la) {
            wx.showModal({
                title: '错误提示',
                content: '请确保备注个数不要大于选项个数相同，换行即为分隔',
                showCancel: false, //是否显示取消按钮
                //cancelText: "否", //默认是“取消”
                //cancelColor: 'skyblue', //取消文字的颜色
                confirmText: "我知道了", //默认是“确定”
                //confirmColor: 'skyblue', //确定文字的颜色{
            })
            return
        }
        var addList = 'formList.formInfo[' + ID + '].data'
        for (var i = 0; i < la; i++) {
            var addl = addList + '[' + i + '].detail'
            that.setData({
                [addl]: a[i]
            })
        }
    },
    enterta: function(e) {
        //console.log(e.detail.value)
        tavalue = e.detail.value;
        var a = tavalue.split('\n');
        var la = a.length;
        this.setData({
            la: la
        })
        var data = [],
            flagl = 0,
            flagd = 0;
        for (var i = 0; i < la; i++) {
            let dataitem = {
                id: i,
                checked: false,
                limit: 0,
                name: "",
                duration: 0,
                detail: "",
                bookingNum: 0
            }
            let ai = a[i].split(' ')
            if (ai.length === 1) {
                dataitem.name = ai[0];
            } else if (ai.length === 2) {
                dataitem.name = ai[0];
                dataitem.limit = parseInt(ai[1]);
                flagl = 1;
            } else if (ai.length === 3) {
                dataitem.name = ai[0];
                dataitem.limit = parseInt(ai[1]);
                dataitem.duration = parseInt(ai[2]);
                flagl = 1;
                flagd = 1;
            } else {
                wx.showModal({
                    title: '错误提示',
                    content: '请确保选项内容与限额间，限额与时长间都只有一个空格',
                    showCancel: false, //是否显示取消按钮
                    //cancelText: "否", //默认是“取消”
                    //cancelColor: 'skyblue', //取消文字的颜色
                    confirmText: "我知道了", //默认是“确定”
                    //confirmColor: 'skyblue', //确定文字的颜色{
                })
            }
            //console.log(dataitem)
            data.push(dataitem);
        }
        var addList = 'formList.formInfo[' + ID + '].';
        let addl = addList + 'data';
        this.setData({
            [addl]: data
        })
        addl = addList + 'limit';
        if (flagl)
            this.setData({
                [addl]: true
            })
        else
            this.setData({
                [addl]: false
            })
        addl = addList + 'duration';
        if (flagd)
            this.setData({
                [addl]: true
            })
        else
            this.setData({
                [addl]: false
            })
    },
    change: function(e) {
        var that = this
        var ID = that.data.ID
        var type, label, text, limit, duration, detail, textarea = "",
            textd = "",
            force,
            flag_d = 0;
        type = this.data.formList.formInfo[ID].type;
        label = this.data.formList.formInfo[ID].label;
        text = this.data.formList.formInfo[ID].text;
        force = this.data.formList.formInfo[ID].force;
        limit = this.data.formList.formInfo[ID].limit;
        duration = this.data.formList.formInfo[ID].duration;
        detail = this.data.formList.formInfo[ID].detail;
        that.setData({
            type: type,
            label,
            text,
            force,
            detail
        })
        if (type == 'radio' || type == 'checkbox') {
            let ta = that.data.formList.formInfo[ID].data;
            let lta = ta.length;
            flag_d = 0;
            for (var i = 0; i < lta; i++) {

                let tai = ta[i].name;
                let tal = parseInt(ta[i].limit) ? parseInt(ta[i].limit) : 0;
                let tad = parseInt(ta[i].duration) ? parseInt(ta[i].duration) : 0;
                let det = ta[i].detail ? ta[i].detail : "备注";
                //console.log(textd, det)
                if (limit && duration && tai)
                    textarea = textarea + tai + ' ' + tal + ' ' + tad + '\n';
                else if (limit && tai)
                    textarea = textarea + tai + ' ' + tal + '\n';
                else
                    textarea = textarea + tai + '\n';
                if (detail) {
                    textd = textd + det + '\n';
                    flag_d = 1
                }
            }
            lta = textarea.length;
            textarea = textarea.substr(0, lta - 1);
            lta = textd.length;
            textd = textd.substr(0, lta - 1);
            that.setData({
                texta: textarea
            })
            if (flag_d)
                that.setData({
                    textd: textd
                })
        }
        //console.log(that.data.page)
        that.setData({
            page: 1 - that.data.page
        })
    },
    delete: function(e) {
        var that = this;
        let formInfo = that.data.formList.formInfo;
        //console.log('ID', ID, 'cnt', cnt)
        for (var i = ID + 1; i < cnt; i++)
            formInfo[i].id = formInfo[i].id - 1;
        formInfo.splice(ID, 1);
        var addList = 'formList.formInfo';
        //console.log(formInfo);
        this.setData({
            [addList]: formInfo,
            checked: false,
            open: false,
            type: ""
        })
        cnt = cnt - 1;
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
    addAll: function(e) {
        //console.log(e.currentTarget.id);
        var additem = {
            "label": "",
            "type": "",
            "id": "",
            "text": "",
            "placeholder": "",
            "data": [],
            "role": {
                "type": "",
                "value": "",
                "msg": ""
            },
            "force": false,
            "limit": false,
            "duration": false,
            "detail": false
        };
        //添加种类
        additem.type = e.currentTarget.id;
        //记录顺位
        additem.id = cnt.toString();
        cnt = cnt + 1;
        //个性添加
        if (additem.type == "text") {
            additem.label = "输入组件";

        } else if (additem.type == "radio" || additem.type == "checkbox") {
            var data = [{
                id: 0,
                checked: false,
                limit: 0,
                duration: 0,
                detail: "",
                bookingNum: 0,
                name: "选项一"
            }, {
                id: 1,
                checked: false,
                limit: 0,
                duration: 0,
                detail: "",
                bookingNum: 0,
                name: "选项二"
            }]
            additem.data = data;
            additem.label = (additem.type == "radio" ? "单选组件" : "多选组件");
        } else if (additem.type == "describe") {
            additem.text = "这是一段文本描述"
        }
        //加入现有队列，concat为拼接方法
        let list = [];
        list.push(additem);
        let formInfo = this.data.formList.formInfo;
        var addList = 'formList.formInfo';
        this.setData({
            [addList]: formInfo.concat(list),
            checked: false
        })
    },
    /**
     * 生命周期函数--监听页面隐藏
     */

    onHide: function() {

    },
    add: function() {
        this.setData({
            checked: !this.data.checked
        })
    },
    submit: function() {

        var that = this;
        wx.showModal({
            title: '提交表单',
            content: '确定要提交表单吗？',
            showCancel: true, //是否显示取消按钮
            cancelText: "否", //默认是“取消”
            //cancelColor: 'skyblue', //取消文字的颜色
            confirmText: "是", //默认是“确定”
            //confirmColor: 'skyblue', //确定文字的颜色
            success: function(res) {
                if (res.cancel) {
                    //点击取消,默认隐藏弹框
                } else {

                    //点击确定
                    wx.showLoading({
                        title: '加载中',
                    })
                    let inf = that.data.formList.formInfo
                    for (let i = 0; i < cnt; i++) {
                        inf[i].id = "t" + inf[i].id
                    }
                    var inlist = [
                        ["姓名", "手机号", "学号", "QQ号", "校区"]
                    ];
                    for (let i = 0; i < cnt; i++) {
                        if (inf[i].type === "text" || inf[i].type === "radio" || inf[i].type === "checkbox") {
                            inlist[0].push(inf[i].label);
                        }
                    }
                    inlist[0].push("openid")
                    inlist[0].push("志愿时长")
                    inlist[0].push("备注")
                        //console.log(inlist)
                    wx.cloud.callFunction({
                        name: "uploadform",
                        data: {
                            formInfo: inf,
                            title: that.data.title,
                            fieldName: that.data.formList.fieldName
                        },
                        success: function(res) {
                            //console.log(res)
                            wx.cloud.callFunction({
                                name: "InitSignUp",
                                data: {
                                    title: that.data.title,
                                    list: inlist,
                                },
                                success: function(res) {
                                    wx.hideLoading();
                                    wx.showModal({
                                        title: "发布成功",
                                        content: "成功发布表单",
                                        showCancel: false,
                                        success: function(res) {
                                            wx.redirectTo({
                                                url: '../list/list',
                                            })
                                        }
                                    })
                                },
                                fail: function(res) {
                                    wx.hideLoading();
                                    wx.showModal({
                                        title: "发布失败",
                                        content: "数据库初始化失败",
                                        showCancel: false,
                                    })
                                }
                            })
                        }
                    })
                }
            },
            fail: function(res) {}, //接口调用失败的回调函数
            complete: function(res) {}, //接口调用结束的回调函数（调用成功、失败都会执行）
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