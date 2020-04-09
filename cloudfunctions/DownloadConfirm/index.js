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
    //在已报名人员中删除记录
    console.log(event.inlist)
    for (let i = 0; i < event.inlist.length; i++){
      for (let j = 0; j < event.inlist[i].data.length; j++){
        db.collection('person').where({
          phone: event.inlist[i].data[j][1]
        }).update({
          data:{
            history: _.pull({
              st: event.inlist[i].time,
              v: event.title
            })
          }
        })
      }
    }

    //给用户添加记录信息，如果不存在词条则添加
    for (let i = 2; i < event.list.length; i++){
      let inf = {};
      let detail = event.list[i][4].split(";");
      inf.v = event.title;
      let duration = event.list[i][3];
      inf.a = duration.toFixed(0);
      let score = event.list[i][3] * 0.2;
      inf.s = score.toFixed(1);
      for (let j = 0; j < detail.length; j++){
        if(detail[j] === ""){
          continue;
        }else{
          inf.t = detail[j]
          let h =db.collection('person').where({
            phone: event.list[i][2]
          }).update({
            data:{
              duration: _.inc(duration),
              history: _.push(inf),
              score: _.inc(score)
            }
          })
          if ((await h).stats.updated == 0){
            db.collection('person').add({
              data:{
                name: event.list[i][1],
                phone: event.list[i][2],
                history: [inf],
                duration: inf.a,
                score: inf.s
              }
            })
          }
        }
      }
      
    }
    
    //删除history中的记录
    await db.collection('history').where({
      title: event.title
    }).update({
      data:{
        list: []
      }
    })

    //将数据添加到excel里
    //1,定义excel表格名
    let dataCVS = event.title + '时长表.xlsx'
    //2，把数据保存到excel里，并合并首个单元格
    const range0 = {s: {c: 0, r:0 },e: {c:4, r:0}};
    const options = {'!merges': [range0]};
    var buffer = await xlsx.build([{
      name: "SignUpDetail",
      data: event.list
    }],options);
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