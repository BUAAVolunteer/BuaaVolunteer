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
    return await db.collection('project').where({
			title: event.title
		}).update({
			data:{
				innerList: _.push(event.openid)
			}
		})
  } catch (e) {
    console.error(e)
  }
}