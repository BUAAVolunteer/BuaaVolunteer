/**
 * 工具类 util.js
 */

import LinkedList from 'LinkedList'

class Util {
    static formatTime(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();


        return [year, month, day].map(this.formatNumber).join('-');
        //+ ' ' + [hour, minute,second].map(this.formatNumber).join(':');
    };
    static formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    };

    static formatTime1(date) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let hour = date.getHours();
        let minute = date.getMinutes();
        let second = date.getSeconds();


        return [hour, minute].map(this.formatNumber).join(':');
    };
    static formatNumber(n) {
        n = n.toString();
        return n[1] ? n : '0' + n;
    };

    static exportToExcel (exportInfo) {
        //将数组信息导出为excel
        wx.cloud.callFunction({
            name: 'Export',
            data: {
                title : exportInfo.title,
                fileName : exportInfo.fileName,
                exportList : exportInfo.downloadList
            }
        }).then(res => {
            //下载Excel
            wx.cloud.downloadFile({
                fileID: res.result.fileID
            })
        }).then(res => {
            //保存Excel
            wx.saveFile({
                tempFilePath: res.tempFilePath
            })
        }).then(res => {
            //自动打开Excel
            wx.openDocument({
                filePath: res.savedFilePath
            })
        }).then(res => {
            let returnData = {};
            returnData.success = true;
            returnData.res = res;
            return returnData;
        }).catch(err => {
            let returnData = {};
            returnData.success = false;
            returnData.res = err;
            return returnData;
        })
    };

    static toLinkedList (list) {
        var linkedList = new LinkedList();
        for (let i = 0; i < list.length; i++) {
            linkedList.append(list[i])
        }
        return linkedList
    }
};


export default Util;