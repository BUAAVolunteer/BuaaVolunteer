const cloud = require('wx-server-sdk')
cloud.init({
	traceUser:true,
	env:"buaalx-w5aor"
})
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