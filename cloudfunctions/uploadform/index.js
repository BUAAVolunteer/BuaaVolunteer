// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
	traceUser:true,
	env:"buaalx-w5aor"
})

const db = cloud.database();
const _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
	try {
		db.collection('project').where({
			title: event.title
		}).update({
			data:{
				check: 1
			}
		})
		return await db.collection('form').where({
				title: event.title
		}).update({
				data:{
					formInfo: event.formInfo,
					fieldName: event.fieldName,
					over: 1
				}
		})
  } catch(e) {
		console.error(e)
		return e;
  }
}