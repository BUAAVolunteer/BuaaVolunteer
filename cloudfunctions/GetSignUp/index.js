// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser:true,
	env:"buaalx-w5aor",
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	return await db.collection('signUp').where({
		title: event.title
	}).get();
}