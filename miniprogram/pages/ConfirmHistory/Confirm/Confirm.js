const db = wx.cloud.database();
import Util from "../../../utils/util";
var LinkedList, initList;
Component({
    /**
     * 页面的传参
     */
    properties: {
        confirmList: {
            type: String,
            value: "",
        },
        title: {
            type: String,
            value: "",
        },
        listID: {
            type: Number,
            value: 0,
        },
    },

    /**
     * 页面的初始数据
     */
    data: {
        volunteerList: [],
        title: "志愿标题",
        ID: 0,
        isDelete: false,
    },

    /**
     * 生命周期
     */
    lifetimes: {
        attached() {
            this.loading = this.selectComponent("#loading");
            this.loading.showLoading();
            var that = this;
            var confirmList = JSON.parse(that.properties.confirmList);
            console.log(confirmList);
            var volunteerList = [];
            for (let j = 1; j < confirmList.data.length; j++) {
                let v = {};
                let l = confirmList.data[j].length;
                v.name = confirmList.data[j][0];
                v.phone = confirmList.data[j][1];
                v.duration = confirmList.data[j][l - 2];
                v.note = confirmList.data[j][l - 1];
                v.isDisabled = true;
                volunteerList.push(v);
            }
            initList = volunteerList;
            LinkedList = Util.toLinkedList(volunteerList);
            volunteerList = LinkedList.toList();
            this.setData({
                volunteerList,
                title: this.properties.title,
            });
            this.loading.hideLoading();
        },
    },

    methods: {
        delete: function (e) {
            var ID = parseInt(e.currentTarget.dataset.id);
            LinkedList.removeAt(ID);
            this.setData({
                volunteerList: LinkedList.toList(),
            });
        },
        opendel: function () {
            this.setData({
                isDelete: !this.data.isDelete,
            });
        },
        input: function (e) {
            console.log(e);
            var type = e.currentTarget.dataset.type;
            console.log(e.currentTarget);
            var ID = parseInt(e.currentTarget.dataset.id);
            var volunteer = LinkedList.get(ID);
            volunteer[type] = e.detail.value;
            if (type === "phone") {
                volunteer.name = "";
            }
            LinkedList.update(ID, volunteer);
            this.setData({
                volunteerList: LinkedList.toList(),
            });
        },
        search: function (e) {
            console.log(e);
            this.loading._showLoading();
            var that = this;
            var ID = e.currentTarget.dataset.id;
            var phone = this.data.volunteerList[ID].phone;
            if (phone.length != 11) {
                wx.showModal({
                    title: "格式错误",
                    content: "请输入正确位数的手机号",
                    showCancel: false,
                });
                this.loading.hideLoading();
                return;
            }
            db.collection("person")
                .where({
                    phone,
                })
                .field({
                    name: true,
                    phone: true,
                })
                .get()
                .then((res) => {
                    that.loading.hideLoading();
                    if (res.data.length == 0) {
                        wx.showModal({
                            title: "查找",
                            content: "数据库中未找到志愿者，\r\n请确认手机号是否填写正确，\r\n或者补全姓名以添加志愿者",
                            showCancel: false,
                        });
                        let volunteer = LinkedList.get(ID);
                        volunteer.isDisabled = false;
                        LinkedList.update(ID, volunteer);
                        this.setData({
                            volunteerList: LinkedList.toList(),
                        });
                    } else {
                        let volunteer = LinkedList.get(ID);
                        volunteer.name = res.data[0].name;
                        volunteer.isDisabled = true;
                        LinkedList.update(ID, volunteer);
                        this.setData({
                            volunteerList: LinkedList.toList(),
                        });
                    }
                });
        },

        add: function (e) {
            console.log(e);
            let v = {
                isDisable: true,
            };
            LinkedList.append(v);
            this.setData({
                volunteerList: LinkedList.toList(),
            });
        },

        save() {
            this.loading._showLoading()
            var that = this
            var volunteer = this.data.volunteerList
            var v = [["姓名","联系方式（电话号码）","志愿时长","志愿备注"],]
            for (let i = 0; i < volunteer.length; i++) {
                let input = []
                input.push(volunteer[i].name);
                input.push(volunteer[i].phone);
                input.push(parseInt(volunteer[i].duration));
                input.push(volunteer[i].note);
                v.push(input);
            }
            wx.cloud.callFunction({
                name: "saveConfirm",
                data: {
                    list: v,
                    title: that.data.title,
                    ID: that.properties.listID,
                }
            })
            .then(() => {
                that.loading.hideLoading()
                wx.showToast({
                    title: '数据已保存',
                    icon: 'none',
                    duration: 1000,
                    mask: false,
                });
            })
            .catch(err => {
                that.loading.hideLoading()
                console.log(err)
                wx.showModal({
                    title: "错误",
                    content: "保存数据出现错误，请重试",
                    showCancel: false
                })
            })
        },

        download: function (e) {
            this.loading._showLoading();
            var that = this;
            var volunteer = this.data.volunteerList;
            var v = [
                [],
                ["序号", "姓名", "联系方式（电话号码）", "志愿时长", "志愿备注"],
            ];
            v[0].push(that.data.title);
            for (let i = 0; i < volunteer.length; i++) {
                let input = [];
                input.push(i + 1);
                if (
                    volunteer[i].name === "" ||
                    volunteer[i].phone === "" ||
                    volunteer[i].duration === "" ||
                    volunteer[i].note === ""
                ) {
                    this.loading.hideLoading();
                    wx.showModal({
                        title: "缺少信息",
                        content: "志愿确认中有信息未填入",
                        showCancel: false,
                    });
                    return;
                }
                input.push(volunteer[i].name);
                input.push(volunteer[i].phone);
                input.push(parseInt(volunteer[i].duration));
                input.push(volunteer[i].note);
                v.push(input);
            }
            console.log(v);
            var formInfo = {};
            formInfo.title = that.data.title;
            formInfo.fileName = that.data.title + "志愿时长表";
            formInfo.downloadList = v;
            return new Promise ((resolve, reject) => {
                resolve()
            })
            .then(() => {
                if (that.properties.confirmList.isCheck) {
                    wx.showToast({
                        title: '由于时长已经确认，此次仅导出时长表',
                        icon: 'none',
                        duration: 1000,
                        mask: false,
                    });
                    var res = {}
                    res.result = "success"
                    return res
                } else {
                    return wx.cloud.callFunction({
                        name: "DownloadConfirm",
                        data: {
                            title: that.data.title,
                            list: v,
                            initList: initList,
                            time: that.data.confirmList.time,
                            ID: that.properties.listID,
                        },
                    })
                }
            })
            .then((res) => {
                console.log("DownloadRes", res);
                if (res.result === "success") {
                    return Util.exportToExcel(formInfo);
                } else {
                    console.log(res);
                    return "data-trans fail";
                }
            })
            .then((res) => {
                console.log(res);
                if (res === "data-trans fail") {
                    this.loading.hideLoading();
                    wx.showModal({
                        title: "数据转移失败",
                        content: "数据转移失败，请联系管理员",
                        showCancel: false,
                    });
                } else if (res.success) {
                    console.log(res);
                    this.loading.hideLoading();
                    wx.showModal({
                        title: "导出成功",
                        content: "已成功导出,请在自动打开后尽快另存",
                        showCancel: false,
                        success: function () {
                            wx.redirectTo({
                                url: "../../Manage/Manage",
                            });
                        },
                    });
                } else {
                    console.log(res);
                    this.loading.hideLoading();
                    wx.showModal({
                        title: "导出失败",
                        content: "导出失败，请联系管理员",
                        showCancel: false,
                    });
                }
            });
        },
    },
});