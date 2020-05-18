// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
    // 云函数入口函数
exports.main = async(event, context) => {
    const wxContext = cloud.getWXContext()
    const xlsx = require('node-xlsx');
    try {
        let { userdata } = event

        //1,定义excel表格名
        let dataCVS = 'Person.xlsx'
            //2，定义存储数据的
        let alldata = [];
        let row = ['id', 'openid', 'name', 'personnum', 'phone', 'text']; //表属性
        alldata.push(row);

        for (let key in userdata) {
            let arr = [];
            arr.push(userdata[key]._id);
            arr.push(userdata[key]._openid);
            arr.push(userdata[key].name);
            arr.push(userdata[key].personnum);
            arr.push(userdata[key].phone);
            arr.push(userdata[key].text);
            alldata.push(arr)
        }
        //3，把数据保存到excel里
        var buffer = await xlsx.build([{
            name: "PersonnalDetail",
            data: alldata
        }]);
        //4，把excel文件保存到云存储里
        return await cloud.uploadFile({
            cloudPath: dataCVS,
            fileContent: buffer, //excel二进制文件
        })

    } catch (e) {
        console.error(e)
        return e
    }
}