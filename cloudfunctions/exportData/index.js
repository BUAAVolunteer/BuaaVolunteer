// 云函数入口文件
import { init, getWXContext, database, uploadFile } from 'wx-server-sdk';

init({
  env:'buaalx-w5aor',
  traceUser:true
})

// 云函数入口函数
export async function main(event, context) {
  const wxContext = getWXContext()
  const xlsx = require('node-xlsx');
  const db = database();
  const _ = db.command;
	try {
    //这个云函数只负责数据的导出
    //将数据添加到excel里
    //1,定义excel表格名
    let dataCVS = event.fileName + '.xlsx'
    //2，把数据保存到excel里
    var buffer = xlsx.build([{
      name: event.title,
      data: event.exportList
    }]);
    //4，把excel文件保存到云存储里
    return await uploadFile({
      cloudPath: dataCVS,
      fileContent: buffer, //excel二进制文件
    })
  } catch (e) {
    console.error(e)
    return e
  }
}