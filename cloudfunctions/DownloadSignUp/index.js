// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  traceUser: true,
  env: "buaalx-w5aor"
})

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const xlsx = require('node-xlsx');
  const db = cloud.database();
  const _ = db.command;
	try {
    //删除signup报名数据，转入history待确认数据
    let his = {};
    his.time = event.time;
    his.data = event.list;
    let uphis = db.collection('history').where({
      title: event.title
    }).update({
      data:{
        list: _.push(his)
      }
    })
    if((await uphis).stats.updated == 0){
      db.collection('history').add({
        data:{
          title: event.title,
          list: [his]
        }
      })
    }
    await db.collection('signUp').where({
      title: event.title
    }).update({
      data:{
        list: [event.list[0]]
      }
    })

    //给用户添加已报名信息，如果不存在词条则添加
    for (let i = 1; i < event.list.length; i++){
      let inf = {};
      inf.t = "待定";
      inf.v = event.title;
      inf.a = "待定";
      inf.s = "待定";
      inf.st = event.time
      console.log(inf)
      let h =db.collection('person').where({
        phone: event.list[i][1]
      }).update({
        data:{
          history: _.push(inf)
        }
      })
    }

    //将数据添加到excel里
    //1,定义excel表格名
    let dataCVS = event.title + '.xlsx'
    //2，把数据保存到excel里
    var buffer = await xlsx.build([{
      name: "SignUpDetail",
      data: event.list
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