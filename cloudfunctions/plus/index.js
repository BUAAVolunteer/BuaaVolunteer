const cloud = require('wx-server-sdk')
//环境变量 ID
cloud.init({
  env: 'volunteer-platform-1v92i',
  // env: 'buaalx-w5aor',
  traceUser: true,
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async (event, context) => {
  try {
    addHis = {}
    addHis.title = event.title
    addHis.score = event.score
    addHis.duration = 0
    addHis.type = event.type
    addHis.note = event.date
    return new Promise((resolve,reject) => {
      resolve()
    })
    .then(() => {
      if (event.isNeedName) {
        return db.collection('person').add({
          data: {
            totalScore: event.score,
            history: [addHis],
            name: event.name,
            phone: event.phone,
            totalDuration: 0,
            qualification: []
          }
        })
      } else {
        return db.collection('person').where({
          phone: event.phone
        }).update({
          data: {
            totalScore: _.inc(event.score),
            history: _.push(addHis)
          }
        })
      }
    })
    .then(() => {
      return db.collection('list').add({
        data: {
          title: event.title,
          score: event.score,
          duration: 0,
          note: event.date,
          name: event.name,
          phone: event.phone
        }
      })
    })
    .then(() => {
      if (event.isBlackList) {
        return db.collection('blacklist').add({
          data: {
            title: event.title,
            score: event.score,
            time: event.date,
            name: event.name,
            phone: event.phone
          }
        })
      }
    })
  } catch (e) {
    console.error(e)
  }
  
}
