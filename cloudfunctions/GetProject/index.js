// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
const db = cloud.database()
const MAX_LIMIT = 100
exports.main = async (event, context) => {
	return await db.collection('project').limit(100).get()
}