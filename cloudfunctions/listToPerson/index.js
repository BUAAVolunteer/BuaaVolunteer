// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'volunteer-platform-1v92i',
  // env: 'buaalx-w5aor',
  traceUser: true,
})

const db = cloud.database({})
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  return db.collection('list').where({
    isNew: true
  }).get()
  .then(res => {
    var promiseList = []
    for (let i = 0; i < res.data.length; i++) {
      var his = res.data[i]
      var id = his.id
      delete his._id
      delete his.name
      delete his.phone
      var phone = res.data[i].phone
      var name = res.data[i].name
      var p = db.collection('person').where({
        phone,
      }).update({
        historyList: _.push(his),
        totalScore: _.inc(his.score),
        totalDuration: _.inc(his.duration)
      })
      .then(res => {
        if (res.stats.updated == 0) {
          return db.collection('person').add({
            data: {
              _openid: "",
              name: name,
              phone: phone,
              personNum: "",
              text: "",
              qqNum: "",
              campus: "",
              totalScore: his.score,
              totalDuration: his.duration,
              history: [his],
              avatar: "",
              qualification: []
            }
          })
        }
      })
      .then(() => {
        return db.collection('list').doc(id).update({
          data: {
            isNew: false
          }
        })
      })
      promiseList.push(p)
    }
    return Promise.all(promiseList)
  })
}