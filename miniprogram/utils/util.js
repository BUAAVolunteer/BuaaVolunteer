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
};


module.exports = Util;