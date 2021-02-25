// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'volunteer-platform-1v92i',
  // env: 'buaalx-w5aor',
  traceUser: true,
})
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const xlsx = require('node-xlsx');
	try {
    console.log(event)
    return new Promise((resolve, reject) => {
    })
    .then(() => {
      //在已报名人员中删除记录
      return deleteSignUp(event, 0)
    })
    .then(() => {
      //在确认名单中加入记录
      return addRecord(event, 2)
    })
    .then(() => {
      //修改confirm数据库中的记录
      return confirmUpdate(event)
    })
    .catch(err => {
      console.log(err)
      return false
    })
  } catch (e) {
    console.error(e)
    resolve(e)
  }
}

function deleteSignUp(event, i) {
  if (i == event.initList.length) {
    return true
  } else {
    return new Promise((resolve, reject)=>{
      db.collection('person').where({
        phone: event.initList[i].phone
    }).update({
      data:{
        history: _.pull({
          signUpTime: event.time,
          title: event.title
        })
      }
    })
    .then(() => {
      console.log("complete" + i)
      resolve(deleteSignUp(event, i + 1)) 
    })
    })
  }
}
      

 

function addRecord(event) {
  var promiseList = []
  for (let i = 2; i < event.list.length; i++) {
    let p = new Promise((resolve, reject) => {
    resolve()
    })
    .then(() => {
      console.log(i)
      let inf = {};
      let detail = event.list[i][4].split(";");
      inf.title = event.title;
      let duration = event.list[i][3];
      inf.duration = duration.toFixed(0);
      let score = event.list[i][3] * 0.2;
      inf.score = score.toFixed(1);
      console.log("recordAdd" + i)
      resolve(addDetail(event, inf, detail, duration, score, i, 0))
    })
    promiseList.push(p)
  }
  return Promise.all(promiseList)
}

function addDetail(event, inf, detail, duration, score, i, j) {
  var pList = []
  for (let j = 0; j < detail.length; j++) {
    var p = new Promise ((resolve, reject) => {
      resolve()
    })
    .then(() => {
      if(detail[j] === ""){
        return true
      }else{
        inf.note = detail[j]
        return db.collection('person').where({
          phone: event.list[i][2]
        }).update({
          data:{
            totalDuration: _.inc(duration),
            history: _.push(inf),
            totalScore: _.inc(score)
          }
        })
        .then(res => {
          if (res.stats.updated == 0){
            return db.collection('person').add({
              data:{
                name: event.list[i][1],
                phone: event.list[i][2],
                history: [inf],
                totalDuration: duration,
                totalScore: score
              }
            })
          }
        })
        .then(() => {
          return db.collection('list').add({
            data: {
              name: event.list[i][1],
              phone: event.list[i][2],
              score: score,
              duration: duration,
              note: inf.note,
              title: event.title
            }
          })
        })
        .then(() => {
          resolve(console.log("detailAdd" + j))
        })
      }
    })
    pList.push(p)
  }
  return Promise.all(pList)
}

function confirmUpdate(event) {
  return new Promise((resolve, reject)=>{
    db.collection('confirm').where({
      title: event.title
    }).get()
    .then(res=>{
      var historyList = res.data[0].historyList
      var updateList = []
      for (let i = 1; i < event.list.length; i++) {
        var update = event.list[i]
        update.shift()
       updateList.push(update)
     }
      console.log("event.time=" + event.time)
      historyList[event.ID].isCheck = true
      historyList[event.ID].data = updateList
      console.log(historyList)
      return historyList 
    })
    .then(res => {
      return db.collection('confirm').where({
        title: event.title
      }).update({
        data: {
          historyList: res
        }
      })
    })
    .then(() => {
      console.log("success")
      resolve("success") 
    })    
  })
  
}