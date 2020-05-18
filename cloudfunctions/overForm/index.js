const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('form').where({
      title: event.title
    })
    .update({
      data: {
        over: 0
      }
    })
  } catch(e) {
    console.error(e)
  }
}