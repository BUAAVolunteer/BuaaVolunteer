// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	env: 'volunteer-platform-1v92i',
  // env: 'buaalx-w5aor',
  traceUser: true,
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const xlsx = require('node-xlsx');
  const db = cloud.database();
  const _ = db.command;
	try {
    //这个云函数只负责数据的导出
    //将数据添加到excel里
    //1,定义excel表格名
    let dataCVS = 'SignUpData/' + event.fileName + '.xlsx'
    console.log(event)
    //2，把数据保存到excel里
    return new Promise (function (resolve,reject) {
      resolve()
    })
    .then(() => {
      return xlsx.build([{
        name: event.title,
        data: event.exportList
      }])
    })
    .then(res => {
      //4，把excel文件保存到云存储里
      return cloud.uploadFile({
        cloudPath: dataCVS,
        fileContent: res, //excel二进制文件
      })
    })
    .catch(err => {
      console.log(err)
      return err
    })
  } catch (e) {
    console.error(e)
    return e
  }
}