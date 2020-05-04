const db = wx.cloud.database();
var max, iv;
var limlist = [{}];
var date = "";
var qqnum = "";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "",
        SignUpList: [],
        FormList: [],
        id: -1,
        open: false,
        hide1: "openid",
        hide2: "志愿时长",
        hide3: "备注"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var title = options.title;
        date = options.date;
        qqnum = options.qqnum;
        console.log(options)
            //var title = options.title;
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        var SignUp = [];
        this.setData({
            //title: options.title
            title
        })
        wx.cloud.callFunction({
            name: 'GetSignUp',
            data: {
                //title: options.title
                title
            },
            success: function(res) {
                max = res.result.data[0].list.length;

                for (let i = 1; i < max; i++) {
                    //let signlist = res.result.data[0].list[i].slice(1);
                    let signlist = res.result.data[0].list[i];
                    let signupitem = {
                        name: res.result.data[0].list[i][0],
                        list: signlist,
                        checked: false,
                        id: i - 1
                    }
                    SignUp.push(signupitem);
                }
                //let form = res.result.data[0].list[0].slice(1);
                let form = res.result.data[0].list[0];
                that.setData({
                    SignUpList: SignUp,
                    FormList: form,
                })
                wx.hideLoading();
            },
            fail: function(res) {
                console.log(res)
            }
        })
        var interval = setInterval(function() {
            db.collection('form').where({
                title: title
            }).field({
                formInfo: true,
                over: true
            }).get({
                success: function(res) {
                    //console.log(res)
                    limlist = res.data[0].formInfo;
                    let over = 0;
                    let len = 0;
                    if (res.data[0].over == 1) {
                        for (let i = 0;
                            (i < limlist.length) && (over == 0); i++) {
                            if (limlist[i].limit == true) {
                                for (let j = 0; j < limlist[i].data.length; j++) {
                                    if (limlist[i].data[j] > 0) {
                                        over = 1;
                                        break;
                                    }
                                }
                            } else {
                                len++;
                            }
                        }
                        if ((over == 0) && (len < limlist.length)) {
                            wx.cloud.callFunction({
                                name: "overForm",
                                data: {
                                    title: title
                                },
                                success: function(res) {
                                    console.log(res)
                                }
                            })
                        }
                    }
                }
            })
        }, 1000);
        iv = interval;

    },
    delete: function(e) {
        console.log(e)
        var that = this;
        let formInfo = that.data.SignUpList;
        var ID = parseInt(e.currentTarget.dataset.id);
        for (var i = ID + 1; i < max; i++)
            formInfo[i].id = formInfo[i].id - 1;
        formInfo.splice(ID, 1);
        that.setData({
            SignUpList: formInfo
        })
        max = max - 1
    },
    next: function(e) {
        var id = this.data.id + 1;
        this.setData({
            id
        })
    },
    before: function(e) {
        var id = this.data.id - 1 > 0 ? this.data.id : 0;
        this.setData({
            id
        })
    },
    offcanvas: function(e) {
        this.setData({
            open: false
        })
    },
    openbutton: function(e) {
        //console.log(this.data.SignUpList[e.target.id].checked)
        for (var i = 0; i < max - 1; i++) {
            let change = 'SignUpList[' + i + '].checked'
            if (i == e.target.id) {
                this.setData({
                    [change]: !this.data.SignUpList[e.target.id].checked,
                    open: true,
                    id: e.target.id
                })
            } else {
                this.setData({
                    [change]: false
                })
            }
        }


    },
    download: function(e) {
        var that = this;
        var DownloadList = []
        let slist = that.data.SignUpList;
        let flist = that.data.FormList;
        DownloadList.push(flist)
        for (let i = 0; i < slist.length; i++) {
            DownloadList.push(slist[i].list);
        }
        //console.log(DownloadList)
        db.collection('project').where({
            title: that.data.title
        }).field({
            check: true
        }).get({
            success: function(res) {
                if (res.data[0].check != -1) {
                    wx.showModal({
                        title: "报名未完成",
                        content: "报名尚未完成，请等待完成后再导出",
                        showCancel: false
                    })
                    return;
                } else {
                    //下载导出数据
                    wx.cloud.callFunction({
                        name: 'DownloadSignUp',
                        data: {
                            title: that.data.title,
                            time: date,
                            list: DownloadList
                        },
                        success: function(res) {
                            //console.log(res)
                            wx.cloud.downloadFile({
                                fileID: res.result.fileID,
                                success: function(res) {
                                    //console.log(res)
                                    wx.saveFile({
                                        tempFilePath: res.tempFilePath,
                                        success: function(res) {
                                            wx.openDocument({
                                                filePath: res.savedFilePath,
                                                success: function() {
                                                    wx.showModal({
                                                        title: "导出成功",
                                                        content: "已成功导出,请在自动打开后尽快另存",
                                                        showCancel: false,
                                                        success: function() {
                                                            wx.redirectTo({
                                                                url: '../list/list',
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                },
                                fail: function(res) {
                                    console.log(res)
                                    wx.showModal({
                                        title: "导出失败",
                                        content: "导出失败，请联系管理员",
                                        showCancel: false
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })


    },
    sift: function() {
        clearInterval(iv);
        var that = this;
        let slist = that.data.SignUpList
        console.log(slist)
        for (let i = 0; i < limlist.length; i++) {
            if (limlist[i].limit == true) {
                console.log(i)
                for (let j = 0; j < limlist[i].data.length; j++) {
                    if (limlist[i].data[j].limit < 0) {
                        console.log(j)
                        for (let k = slist.length - 1;
                            (k >= 0) && (limlist[i].data[j].limit < 0); k--) {
                            if (slist[k].list[i + 4].indexOf(limlist[i].data[j].name) >= 0) {
                                console.log(k)
                                let rp = limlist[i].data[j].name + ";"
                                console.log(rp)
                                slist[k].list[i + 4] = slist[k].list[i + 4].replace(rp, "");
                                limlist[i].data[j].limit++;
                            }
                        }
                    }
                }
            }
        }

        for (let i = slist.length - 1; i >= 0; i--) {
            console.log(slist.length)
            console.log(i)
            for (let j = 0; j < limlist.length; j++) {
                if ((limlist[j].force == true) && (slist[i].list[j + 4] === "")) {
                    slist.splice(i, 1);
                    break;
                }
            }
        }
        console.log(limlist)
        console.log(slist)
        this.setData({
            SignUpList: slist
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
        clearInterval(iv);

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        clearInterval(iv);
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