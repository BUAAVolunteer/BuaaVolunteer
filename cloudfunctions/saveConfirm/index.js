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
  var updatePath = 'historyList.' + event.ID + '.data'
  return db.collection('confirm').where({
    title: event.title
  })
  .update({
    data: {
      [updatePath]: event.list
    }
  })
  .catch(err => {
    return err
  })
}