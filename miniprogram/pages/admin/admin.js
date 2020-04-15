// pages/admin/admin.js
const db = wx.cloud.database();
const _ = db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.showToast({
            title: '欢迎来到小咕的秘密基地！',
            icon: 'none'
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

    download: function(e) {
        console.log(e);
        var that = this;
        let userdata = [{}];
        let formaldata = [{}];
        let i = 1;
        wx.cloud.callFunction({
            name: 'GetPerson',
            complete: res => {
                console.log(res)
                let pl = res.result.length;
                let pp = [{}]
                for (let i = 1; i < pl; i++) {
                    let pn = res.result[i].data.length
                    for (let j = 0; j < pn; j++) {
                        pp.push(res.result[i].data[j])
                    }
                }
                pp.splice(0, 1);
                console.log(pp)
                that.savaExcel(pp);
            }
        })
    },

    //把数据保存到excel里，并把excel保存到云存储
    savaExcel(userdata) {
        let that = this
        wx.cloud.callFunction({
            name: "Excel",
            data: {
                userdata: userdata
            },
            success(res) {
                console.log("保存成功", res)
                that.getFileUrl(res.result.fileID)
            },
            fail(res) {
                console.log("保存失败", res)
            }
        })
    },

    //获取云存储文件下载地址，这个地址有效期一天
    getFileUrl(fileID) {
        let that = this;
        wx.cloud.getTempFileURL({
            fileList: [fileID],
            success: res => {
                // get temp file URL
                console.log("文件下载链接", res.fileList[0].tempFileURL)
                that.setData({
                    fileUrl: res.fileList[0].tempFileURL
                })
            },
            fail: err => {
                // handle error
                console.log(err)
            }
        })
    },


    //复制excel文件下载链接
    copyFileUrl() {
        let that = this
        wx.setClipboardData({
            data: that.data.fileUrl,
            success(res) {
                wx.getClipboardData({
                    success(res) {
                        console.log("复制成功", res.data) // data
                    }
                })
            }
        })
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