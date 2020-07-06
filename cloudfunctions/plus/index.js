const cloud = require('wx-server-sdk')
//环境变量 ID
cloud.init({
  env:'buaalx-w5aor',
  traceUser:true
})

const db = cloud.database()
const _ = db.command
// 云函数入口函数
//传递的参数可通过event.xxx得到
exports.main = async (event, context) => {
  try {
    return await db.collection('person').doc(event.openid).update({
      // data 传入需要局部更新的数据
      data: {
        score: event.basic + event.p + '0'
      }
    })
  } catch (e) {
    console.error(e)
  }
}
