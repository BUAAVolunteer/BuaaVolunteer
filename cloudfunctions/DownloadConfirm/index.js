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
    //在已报名人员中删除记录
    console.log(event.initList)
    return new Promise((resolve, reject) => {
      resolve()
    })
    .then(() => {
      deleteSignUp(event, 0)
    })
    .then(() => {

    })

    //给用户添加记录信息，如果不存在词条则添加
    for (let i = 2; i < event.list.length; i++){
      
    }
    
    //更新history中的记录
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

function deleteSignUp(event, i) {
  if (i == event.initList.length) {
    return true
  } else {
    return db.collection('person').where({
      phone: event.initList[i].phone
    }).update({
      data:{
        history: _.pull({
          signUpTime: event.initList[i].time,
          title: event.title
        })
      }
    })
    .then(() => {
      console.log("complete")
      return deleteSignUp(event, i-1)
    })
  }
}

function addRecord(event, i) {
  if (i == event.list.length) {
    return true
  } else {
    let inf = {};
    let detail = event.list[i][4].split(";");
    inf.title = event.title;
    let duration = event.list[i][3];
    inf.duration = duration.toFixed(0);
    let score = event.list[i][3] * 0.2;
    inf.score = score.toFixed(1);
    for (let j = 0; j < detail.length; j++){
      if(detail[j] === ""){
        continue;
      }else{
        inf.note = detail[j]
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
}