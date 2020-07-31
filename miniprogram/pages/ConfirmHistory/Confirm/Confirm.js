const db = wx.cloud.database();
var volunHistory = [];
var title;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        volunteer_list: [],
        title: "志愿标题",
        id: 0,
        delete: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //options.title = 
        var that = this
        db.collection('history').where({
            title: options.title
                //title: "北航一日游"
        }).get({
            success: function(res) {
                if (res.data.length == 0) {
                    wx.showModal({
                        title: '获取信息错误',
                        content: '不存在本志愿的记录',
                        showCancel: false
                    })
                } else {
                    volunHistory = res.data[0].list
                    console.log(volunHistory)
                    wx.showToast({
                        title: '获取记录成功',
                    })
                    let vl = [];
                    let id = 0;
                    for (let i = 0; i < volunHistory.length; i++) {
                        for (let j = 1; j < volunHistory[i].data.length; j++) {
                            let v = {};
                            let l = volunHistory[i].data[j].length;
                            v.name = volunHistory[i].data[j][0]
                            v.phone = volunHistory[i].data[j][1]
                            v.duration = volunHistory[i].data[j][l - 2]
                            v.note = volunHistory[i].data[j][l - 1]
                            v.d = true
                            console.log(v)
                            v.id = id;
                            id++;
                            vl.push(v);
                        }
                    }
                    console.log(vl)
                    that.setData({
                        volunteer_list: vl,
                        id: id,
                        title: options.title
                    })
                }
                console.log(that.data.volunteer_list)
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },
    delete: function(e) {
        var that = this;
        let formInfo = that.data.volunteer_list;
        var ID = parseInt(e.currentTarget.dataset.id);
        var cnt = that.data.id
        for (var i = ID + 1; i < cnt; i++)
            formInfo[i].id = formInfo[i].id - 1;
        formInfo.splice(ID, 1);
        that.setData({
            volunteer_list: formInfo,
            id: that.data.id - 1
        })
    },
    opendel: function() {
        this.setData({
            delete: 1 - this.data.delete
        })
    },
    input: function(e) {
        console.log(e)
        var type = e.currentTarget.dataset.type;
        var id = parseInt(e.currentTarget.dataset.id);
        var add = 'volunteer_list[' + id + '].' + type;
        var name = 'volunteer_list[' + id + '].name';
        if (type === "phone"){
            this.setData({
                [add]: e.detail.value,
                [name]: ""
            })
        }else{
            this.setData({
                [add]: e.detail.value
            })
        }
        
    },
    search: function(e) {
        console.log(e)
        wx.showLoading()
        var that = this;
        var id = e.currentTarget.dataset.id;
        var phone = this.data.volunteer_list[id].phone;
        if (phone.length != 11) {
            wx.showModal({
                title: '格式错误',
                content: '请输入正确位数的手机号',
                showCancel: false
            })
            wx.hideLoading()
            return;
        }
        db.collection('person').where({
            phone
        }).field({
            name: true,
            phone: true
        }).get({
            success: function(res) {
                let n = 'volunteer_list[' + id + '].name';
                let ab = 'volunteer_list[' + id + '].d'
                if (res.data.length == 0) {
                    wx.showModal({
                        title: '查找',
                        content: '数据库中未找到志愿者，\r\n请确认手机号是否填写正确，\r\n或者补全姓名以添加志愿者',
                        showCancel: false
                    })
                    that.setData({
                        [n]: "",
                        [ab]: false
                    })
                } else {
                    that.setData({
                        [n]: res.data[0].name
                    })
                }
                wx.hideLoading()

            }
        })
    },
    add: function(e) {
        console.log(e)
        let v = this.data.volunteer_list;
        let id = this.data.id
        v.push({
            id: id
        });
        console.log(v)
        this.setData({
            volunteer_list: v,
            id: id + 1
        })
    },
    download: function(e) {
        wx.showLoading({
            title: '请稍等',
        })
        var that = this;
        var volunteer = this.data.volunteer_list;
        var v = [
            [],
            ["序号", "姓名", "联系方式（电话号码）", "志愿时长", "志愿备注"]
        ];
        v[0].push(that.data.title);
        for (let i = 0; i < volunteer.length; i++) {
            let input = []
            input.push(i + 1)
            if ((volunteer[i].name === "") || (volunteer[i].phone === "") || (volunteer[i].duration === "") || (volunteer[i].note === "")){
                wx.showModal({
                  title: "缺少信息",
                  content: "志愿确认中有信息未填入",
                  showCancel: false
                })
                wx.hideLoading();
                return;
            }
            input.push(volunteer[i].name)
            input.push(volunteer[i].phone)
            input.push(parseInt(volunteer[i].duration))
            input.push(volunteer[i].note)
            v.push(input);
        }
        console.log(v)
        wx.cloud.callFunction({
            name: 'DownloadConfirm',
            data: {
                title: that.data.title,
                list: v,
                inlist: volunHistory
            },
            success: function(res) {
                console.log(res)
                wx.cloud.downloadFile({
                    fileID: res.result.fileID,
                    success: function(res) {
                        console.log(res)
                        wx.saveFile({
                            tempFilePath: res.tempFilePath,
                            success: function(res) {
                                wx.openDocument({
                                    filePath: res.savedFilePath,
                                    success: function() {
                                        wx.hideLoading();
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
    onUnload: function() {},

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