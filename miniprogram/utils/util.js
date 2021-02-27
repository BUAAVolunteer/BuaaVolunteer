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
        return wx.cloud.callFunction({
            name: 'exportData',
            data: {
                title : exportInfo.title,
                fileName : exportInfo.fileName,
                exportList : exportInfo.downloadList
            }
        }).then(res => {
            console.log(res)
            //下载Excel
            return wx.cloud.downloadFile({
                fileID: res.result.fileID
            })
        }).then(res => {
            //console.log(res.tempFilePath)
            //保存Excel
            return wx.saveFile({
                tempFilePath: res.tempFilePath,
                filePath: wx.env.USER_DATA_PATH + '/' + exportInfo.fileName + ".xlsx"
            })
        }).then(res => {
            //console.log(res.savedFilePath)
            //自动打开Excel
            return wx.openDocument({
                filePath: res.savedFilePath,
                fileType: "xlsx",
                showMenu: true
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
        // 将数组转换为链表
        var linkedList = new LinkedList();
        for (let i = 0; i < list.length; i++) {
            linkedList.append(list[i])
        }
        return linkedList
    };

    static limitedText (text, limit) {
        // 将长文本截取到限制长度内并加上省略号
        var patternChinese = new RegExp("[\u4E00-\u9FA5]+"); 
        var patternEnglish = new RegExp("[A-Za-z]+");
        var patternNumber = new RegExp("[0-9]+");
        console.log(text.length)
        if (text.length <= limit) {
            return text
        } else if (patternEnglish.test(text[limit - 2])) {
            console.log("Eng")
            var newPosition = this.firstNoAlphabat(text, limit - 2, patternEnglish)
            return text.substring(0, newPosition) + "..."
        } else if (patternNumber.test(text[limit - 2])) {
            console.log("Num")
            var newPosition = this.firstNoAlphabat(text, limit - 2, patternNumber)
            return text.substring(0, newPosition) + "..."
        } else {
            return text.substring(0, limit - 2) + "..."
        }
    }

    static firstNoAlphabat (text, position, set) {
        var newPosition = position
        while (set.test(text[newPosition])) {
            newPosition--
        }
        newPosition++
        return newPosition
    }
};


export default Util;