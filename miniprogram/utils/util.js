/**
 * 工具类 util.js
 */
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
        //??Export???????Excel???
        wx.cloud.callFunction({
            name: 'Export',
            data: {
                title : exportInfo.title,
                fileName : exportInfo.fileName,
                exportList : exportInfo.downloadList
            }
        }).then(res => {
            //??Excel
            wx.cloud.downloadFile({
                fileID: res.result.fileID
            })
        }).then(res => {
            //??Excel
            wx.saveFile({
                tempFilePath: res.tempFilePath
            })
        }).then(res => {
            //??Excel
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
    }
};


module.exports = Util;